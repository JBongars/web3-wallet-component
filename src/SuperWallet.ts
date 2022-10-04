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

type SuperWalletType = AlgorandWalletType | EthereumWalletType;
type SuperWalletSigner = AlgorandSigner | EthereumSigner;

type SuperWalletState = {
    algorand: AlgorandState;
    ethereum: EthereumState;
};

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

type SuperWalletConfig = {
    defaultChain: CHAIN_TYPE;
    chains: ChainConfig[];
};

/**
 * Super Class
 *
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

    private _registerActiveChain = (type: CHAIN_TYPE): void => {
        this._activeChain.unshift(type);
    };

    private _deregisterActiveChain = (type: CHAIN_TYPE): void => {
        this._activeChain = this._activeChain.filter((elem) => elem !== type);
    };

    private _mountInternalHooks = (chain: ChainWallet) => {
        const hook =
            (hookType: WALLET_HOOK) =>
            (...args: any) => {
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

    private _initSuperWallet = async (chain: ChainWallet): Promise<void> => {
        await chain.init();
        await this._mountInternalHooks(chain);
    };

    private _applyAllChains = <T>(method: (chainType: CHAIN_TYPE) => T[]): T[] => {
        const CHAIN_TYPES: CHAIN_TYPE[] = [CHAIN_TYPE.ALGORAND, CHAIN_TYPE.ETHEREUM];

        let result: T[] = [];

        CHAIN_TYPES.forEach((chainType) => {
            result = [...result, ...method(chainType)];
        });

        return result;
    };

    public async init(): Promise<WALLET_STATUS> {
        if (this._initialized) {
            return WALLET_STATUS.OK;
        }

        this._initialized = true;
        await Promise.all([this._algorand, this._ethereum].map(this._initSuperWallet));

        return WALLET_STATUS.OK;
    }

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

    public getWallet(chainType: CHAIN_TYPE, walletType: WALLET_TYPE): Wallet {
        const chain = this.getChain(chainType);

        if (chain instanceof Algorand) {
            return chain.getWallet(walletType as AlgorandWalletType);
        }
        return chain.getWallet(walletType as EthereumWalletType);
    }

    public getAvailableWalletsOnChain(chainType: CHAIN_TYPE): SuperWalletType[] {
        if (chainType === CHAIN_TYPE.ALGORAND) {
            return this._algorand.getAvailableWallets();
        }
        return this._ethereum.getAvailableWallets();
    }

    public getAvailableWallets(): SuperWalletType[] {
        return this._applyAllChains(this.getAvailableWalletsOnChain);
    }

    public getConnectedWalletsOnChain(chainType: CHAIN_TYPE): SuperWalletType[] {
        if (chainType === CHAIN_TYPE.ALGORAND) {
            return this._algorand.getConnectedWallets();
        }
        return this._ethereum.getConnectedWallets();
    }

    public getConnectedWallets(): SuperWalletType[] {
        return this._applyAllChains(this.getConnectedWalletsOnChain);
    }

    public getActiveChain(): ChainWallet {
        if (this._activeChain.length === 0) {
            return this.getChain(this._config.defaultChain); // Get default wallet
        }
        return this.getChain(this._activeChain[0]);
    }

    public getActiveWalletOnChain(chainType: CHAIN_TYPE): Wallet {
        if (chainType === CHAIN_TYPE.ALGORAND) {
            return this._algorand.getActiveWallet();
        }
        return this._ethereum.getActiveWallet();
    }

    public getActiveWallet(): Wallet {
        const chain = this.getActiveChain();
        return chain.getActiveWallet();
    }

    public updateActiveChain(chainType: CHAIN_TYPE): ChainWallet {
        this._registerActiveChain(chainType);
        return this.getChain(chainType);
    }

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

    public onBlockAdded = (cb: (chainType: CHAIN_TYPE, newBlock: number) => void | Promise<void>) => {
        throw new NotImplementedError();
    };

    public toJSON(): unknown {
        throw new NotImplementedError();
    }
}

export { SuperWallet, CHAIN_TYPE, SuperWalletType, SuperWalletState, SuperWalletConfig, ChainConfig };
export type { SuperWalletSigner };
