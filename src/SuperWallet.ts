import { Accounts } from '@randlabs/myalgo-connect';
import {
    Algorand,
    AlgorandConfig,
    AlgorandSigner,
    AlgorandState,
    AlgorandWalletType,
    defaultAlgorandConfig
} from './algorand';
import { CHAIN_TYPE, WALLET_TYPE } from './config';
import { NotImplementedError } from './errors';
import {
    defaultEthereumConfig,
    Ethereum,
    EthereumConfig,
    EthereumSigner,
    EthereumState,
    EthereumWalletType
} from './ethereum';
import { ChainWallet, Wallet, WalletInterface } from './types';
import HookRouter from './utils/HookRouter';
import { WALLET_HOOK, WALLET_STATUS } from './utils/HookRouter/types';

/**
 * wallet enum to be used as identifier
 * @remarks superset of all wallet types
 */
type SuperWalletType = AlgorandWalletType | EthereumWalletType;

/**
 * Signer object passed
 */
type SuperWalletSigner = AlgorandSigner | EthereumSigner;

/**
 * Internal state of the wallet to be passed using the @see toJSON
 * Superset of all wallet states
 */
type SuperWalletState = {
    algorand: AlgorandState;
    ethereum: EthereumState;
};

/**
 * Chain Config represents the config/data to initialize all wallets
 * @remarks Superset of all wallet states
 */
type ChainConfig =
    | {
          type: CHAIN_TYPE.ALGORAND;
          config: AlgorandConfig;
          data: Partial<AlgorandState>;
      }
    | {
          type: CHAIN_TYPE.ETHEREUM;
          config: EthereumConfig;
      };

/**
 * Config to initialize Super Wallet. Contains list of @see ChainConfig to initialize all wallets
 */
type SuperWalletConfig = {
    defaultChain: CHAIN_TYPE;
    chains: ChainConfig[];
};

/**
 * Super Wallet Class. One Wallet to rule them all
 * Manages Chain + Wallet and allows you to seamlessly switch between using one interface
 */
class SuperWallet implements WalletInterface<unknown> {
    private hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.CHAIN_ON_CHANGE,
        WALLET_HOOK.CHAIN_ON_DISCONNECT,
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.NEW_BLOCK
    ]);

    private _algorand: Algorand;
    private _ethereum: Ethereum;
    private _initialized = false;
    private _activeChain: CHAIN_TYPE[] = [];
    private _config: SuperWalletConfig;

    constructor(config: SuperWalletConfig, data?: SuperWalletState) {
        this._config = config;

        let algorandConfig: AlgorandConfig = defaultAlgorandConfig;
        let ethereumConfig: EthereumConfig = defaultEthereumConfig;

        const algorandState: AlgorandState | undefined = data?.algorand;
        const ethereumState: EthereumState | undefined = data?.ethereum;

        this._config.chains.map((chain) => {
            if (chain.type === CHAIN_TYPE.ALGORAND) {
                algorandConfig = { ...algorandConfig, ...chain.config };
            }

            if (chain.type === CHAIN_TYPE.ETHEREUM) {
                ethereumConfig = { ...ethereumConfig, ...chain.config };
            }
        });

        this._algorand = new Algorand(algorandConfig, algorandState);
        this._ethereum = new Ethereum(ethereumConfig, ethereumState);
    }

    /**
     * Register a wallet as active
     * @param type - Wallet type
     */
    private _registerActiveChain = (type: CHAIN_TYPE): void => {
        this._activeChain.unshift(type);
    };

    /**
     * Deregister a new wallet from active
     * @param type - Wallet type
     */
    private _deregisterActiveChain = (type: CHAIN_TYPE): void => {
        this._activeChain = this._activeChain.filter((elem) => elem !== type);
    };

    /**
     * Mount internal hooks that make managing active wallet possible
     * @param wallet - wallet type
     */
    private _mountInternalHooks = (chain: ChainWallet) => {
        const hook =
            (hookType: WALLET_HOOK) =>
            (...args: unknown[]) => {
                this.hookRouter.applyHookWithArgs(hookType, ...[chain, ...args]);
            };

        const onAccountChange = (accounts: unknown[]) => {
            if (accounts.length < 1) {
                this._deregisterActiveChain(chain.type);
            } else {
                this._registerActiveChain(chain.type);
            }
        };

        const onAccountDisconnect = () => {
            this._deregisterActiveChain(chain.type);
        };

        chain.onAccountChange(hook(WALLET_HOOK.ACCOUNT_ON_CHANGE));
        chain.onAccountDisconnect(hook(WALLET_HOOK.ACCOUNT_ON_DISCONNECT));
        chain.onChainChange(hook(WALLET_HOOK.CHAIN_ON_CHANGE));

        chain.onAccountChange((_wallet: unknown, accounts: unknown[]) => onAccountChange(accounts));
        chain.onAccountDisconnect((_wallet: unknown) => onAccountDisconnect());
    };

    /**
     * Initializes the chain wallet
     * @param chain - chain to initialize
     */
    private _initSuperWalletChain = async (chain: ChainWallet): Promise<void> => {
        await chain.init();
        await this._mountInternalHooks(chain);
    };

    /**
     * higher level function that wraps around functions
     * that take a chain as an argument and applies function to all chains
     * @param method - function to invoke
     * @returns function return value
     */
    private _applyAllChains = <T>(method: (chainType: CHAIN_TYPE) => T[]): T[] => {
        const CHAIN_TYPES: CHAIN_TYPE[] = [CHAIN_TYPE.ALGORAND, CHAIN_TYPE.ETHEREUM];

        let result: T[] = [];

        CHAIN_TYPES.forEach((chainType) => {
            result = [...result, ...method(chainType)];
        });

        return result;
    };

    /**
     * Initializes the chain wallet
     * @returns wallet status
     * @remarks Should be called separately from constructor
     */
    public async init(): Promise<WALLET_STATUS> {
        if (this._initialized) {
            return WALLET_STATUS.OK;
        }

        this._initialized = true;
        await Promise.all([this._algorand, this._ethereum].map(this._initSuperWalletChain));

        return WALLET_STATUS.OK;
    }

    /**
     * Get Chain
     * @param type - chain type
     * @returns chain interface
     */
    public getChain(type: CHAIN_TYPE): ChainWallet {
        switch (type) {
            case CHAIN_TYPE.ALGORAND:
                return this._algorand;
            case CHAIN_TYPE.ETHEREUM:
                return this._ethereum;
            default:
                throw new Error(`Chain type ${type} cannot be found`);
        }
    }

    /**
     * Get wallet from chain
     * @param chainType - chain type
     * @param walletType - wallet type
     * @returns specific wallet
     */
    public getWallet(chainType: CHAIN_TYPE, walletType: WALLET_TYPE): Wallet {
        const chain = this.getChain(chainType);

        if (chain instanceof Algorand) {
            return chain.getWallet(walletType as AlgorandWalletType);
        }
        return chain.getWallet(walletType as EthereumWalletType);
    }

    /**
     * Get all available wallet from chain
     * @param chainType - chain type
     * @returns all available wallets on chain
     */
    public getAvailableWalletsOnChain(chainType: CHAIN_TYPE): SuperWalletType[] {
        if (chainType === CHAIN_TYPE.ALGORAND) {
            return this._algorand.getAvailableWallets();
        }
        return this._ethereum.getAvailableWallets();
    }

    /**
     * Get all available wallet
     * @returns all available wallets on any chain
     */
    public getAvailableWallets(): SuperWalletType[] {
        return this._applyAllChains(this.getAvailableWalletsOnChain);
    }

    /**
     * Get all connected wallet from chain
     * @param chainType - chain type
     * @returns all connected wallets on chain
     */
    public getConnectedWalletsOnChain(chainType: CHAIN_TYPE): SuperWalletType[] {
        if (chainType === CHAIN_TYPE.ALGORAND) {
            return this._algorand.getConnectedWallets();
        }
        return this._ethereum.getConnectedWallets();
    }

    /**
     * Get all available wallet
     * @returns all connected wallets on any chain
     */
    public getConnectedWallets(): SuperWalletType[] {
        return this._applyAllChains(this.getConnectedWalletsOnChain);
    }

    /**
     * Get active wallet from chain
     * @param chainType - chain type
     * @returns active wallet on chain
     */
    public getActiveChain(): ChainWallet {
        if (this._activeChain.length === 0) {
            return this.getChain(this._config.defaultChain); // Get default wallet
        }
        return this.getChain(this._activeChain[0]);
    }

    /**
     * Get all active wallets on any chain
     * @returns all active wallets on any chain
     */
    public getActiveWalletOnChain(chainType: CHAIN_TYPE): Wallet {
        if (chainType === CHAIN_TYPE.ALGORAND) {
            return this._algorand.getActiveWallet();
        }
        return this._ethereum.getActiveWallet();
    }

    /**
     * Get the last used wallet on the last used chain
     * @returns the last used wallet on the last used chain
     */
    public getActiveWallet(): Wallet {
        const chain = this.getActiveChain();
        return chain.getActiveWallet();
    }

    /**
     * Update the active chain with chain
     * @param chainType - chain to become active
     * @returns the chain wallet
     */
    public updateActiveChain(chainType: CHAIN_TYPE): ChainWallet {
        this._registerActiveChain(chainType);
        return this.getChain(chainType);
    }

    /**
     * Update the active wallet on chain
     * @param chainType - chain to select wallet
     * @param walletType - wallet to become active on chain
     * @returns the active wallet
     */
    public updateActiveWalletOnChain(chainType: CHAIN_TYPE, walletType: WALLET_TYPE): Wallet {
        const chain = this.getChain(chainType);
        if (chain instanceof Algorand) {
            return chain.updateActiveWallet(walletType as AlgorandWalletType);
        }
        return chain.updateActiveWallet(walletType as EthereumWalletType);
    }

    public signIn(): Promise<WALLET_STATUS> {
        return this.getActiveWallet().signIn();
    }

    public signOut(): Promise<WALLET_STATUS> {
        return this.getActiveWallet().signOut();
    }

    public getSigner(): Promise<SuperWalletSigner> {
        return this.getActiveWallet().getSigner();
    }

    public getBalance(): Promise<string> {
        return this.getActiveWallet().getBalance();
    }

    public getAssets(): Promise<unknown[]> {
        return this.getActiveWallet().getAssets();
    }

    public getProvider(): unknown {
        return this.getActiveWallet().getProvider();
    }

    public getIsConnected(): boolean {
        return this.getActiveWallet().getIsConnected();
    }

    public getIsWalletInstalled(): boolean {
        return this.getActiveWallet().getIsWalletInstalled();
    }

    public getPrimaryAccount(): unknown {
        return this.getActiveWallet().getPrimaryAccount();
    }

    public getAccounts(): unknown[] {
        return this.getActiveWallet().getAccounts();
    }

    public fetchCurrentChainID(): Promise<string> {
        return this.getActiveWallet().fetchCurrentChainID();
    }

    public mountEventListeners(): Promise<void> {
        throw new NotImplementedError();
    }

    public onAccountChange = (
        cb: (chainType: CHAIN_TYPE, walletType: Wallet, accounts: Accounts[]) => void | Promise<void>
    ) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, cb);
    };

    public onChainChange = (
        cb: (chainType: CHAIN_TYPE, walletType: CHAIN_TYPE, chain: string) => void | Promise<void>
    ) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.CHAIN_ON_CHANGE, cb);
    };

    public onAccountDisconnect = (cb: (chainType: CHAIN_TYPE, walletType: CHAIN_TYPE) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, cb);
    };

    public onBlockAdded = (_cb: (chainType: CHAIN_TYPE, newBlock: number) => void | Promise<void>) => {
        throw new NotImplementedError();
    };

    public toJSON(): unknown {
        throw new NotImplementedError();
    }
}

export { SuperWallet, SuperWalletType, SuperWalletState, SuperWalletConfig, ChainConfig };
export type { SuperWalletSigner };
