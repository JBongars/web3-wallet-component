import { ethers } from 'ethers';
import { CHAIN_TYPE, WALLET_TYPE } from '../config/wallets';
import { NotImplementedError } from '../errors';
import { ChainHookHandlerInterface, ChainWalletInterface, WalletInterface } from '../types';
import HookRouter from '../utils/HookRouter';
import { WALLET_HOOK, WALLET_STATUS } from '../utils/HookRouter/types';
import { Coinbase } from './coinbase';
import { Metamask } from './metamask';
import { EthereumConfig, EthereumWallet, EthereumState, EthereumSigner, EthereumWalletType } from './types';
import { EthWalletConnect } from './walletconnect';

/**
 * Available Ethereum Wallets
 */
const walletTypes: EthereumWalletType[] = [
    WALLET_TYPE.ETHEREUM_METAMASK,
    WALLET_TYPE.ETHEREUM_WALLETCONNECT,
    WALLET_TYPE.ETHEREUM_COINBASE
];

/**
 * Default config
 */
const defaultEthereumConfig: EthereumConfig = {
    hookType: 'active',
    defaultWallet: WALLET_TYPE.ETHEREUM_METAMASK
};

/***
 * Ethereum Chain Wallet used to manage ethereum wallets and invoke ethereum transactions
 */
class Ethereum
    implements
        WalletInterface<unknown>,
        ChainHookHandlerInterface<EthereumWalletType>,
        ChainWalletInterface<EthereumWallet, EthereumWalletType>
{
    private hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.CHAIN_ON_CHANGE,
        WALLET_HOOK.CHAIN_ON_DISCONNECT,
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.NEW_BLOCK
    ]);

    private _metaMask: Metamask;
    private _walletConnect: EthWalletConnect;
    private _coinbase: Coinbase;
    private _initialized = false;
    private _activeWallets: EthereumWalletType[] = [];
    private _config: EthereumConfig;

    public type: CHAIN_TYPE = CHAIN_TYPE.ETHEREUM;
    public name = 'ETHEREUM';

    /**
     * Constructor for Ethereum
     * @param config - Partial Ethereum Config to be overwritten with defaults
     * @param data - Ethereum Data to initialize with
     */
    constructor(config: Partial<EthereumConfig>, data?: EthereumState) {
        this._metaMask = new Metamask(data?.metaMask);
        this._walletConnect = new EthWalletConnect(data?.walletConnect);
        this._coinbase = new Coinbase(data?.coinbase);
        this._config = { ...defaultEthereumConfig, ...config };
    }

    /**
     * Mount internal hooks that make managing active wallet possible
     * @param wallet - wallet type
     */
    private _mountInternalHooks = (wallet: EthereumWallet) => {
        const verifyWallet = (walletType: EthereumWalletType) => {
            switch (this._config.hookType) {
                case 'active':
                    return this._activeWallets[0] === walletType;
                case 'all':
                    return true;
                default:
                    return false;
            }
        };

        const hook =
            (hookType: WALLET_HOOK) =>
            (...args: unknown[]) => {
                if (!verifyWallet(wallet.type)) {
                    return;
                }

                this.hookRouter.applyHookWithArgs(hookType, ...[wallet.type, ...args]);
            };

        const onAccountChange = (accounts: string[]) => {
            if (accounts.length < 1) {
                this._deregisterActiveWallet(wallet.type);
            } else {
                this._registerActiveWallet(wallet.type);
            }
        };

        const onAccountDisconnect = () => {
            this._deregisterActiveWallet(wallet.type);
        };

        wallet.onAccountChange(hook(WALLET_HOOK.ACCOUNT_ON_CHANGE));
        wallet.onAccountDisconnect(hook(WALLET_HOOK.ACCOUNT_ON_DISCONNECT));
        wallet.onChainChange(hook(WALLET_HOOK.CHAIN_ON_CHANGE));
        wallet.onChainDisconnect(hook(WALLET_HOOK.CHAIN_ON_DISCONNECT));

        wallet.onAccountChange(onAccountChange);
        wallet.onAccountDisconnect(onAccountDisconnect);

        // onBlockAdded is a chain and not a wallet specific event
        // so wallet type is not required
        if (wallet.type === this._config.defaultWallet) {
            wallet.onBlockAdded((newBlock: number) => {
                this.hookRouter.applyHookWithArgs(WALLET_HOOK.NEW_BLOCK, [newBlock]);
            });
        }
    };

    /**
     * Register a wallet as active
     * @param type - Wallet type
     */
    private _registerActiveWallet = (type: EthereumWalletType) => {
        this._activeWallets.unshift(type);
    };

    /**
     * Deregister a new wallet from active
     * @param type - Wallet type
     */
    private _deregisterActiveWallet = (type: EthereumWalletType) => {
        const index = this._activeWallets.indexOf(type);
        this._activeWallets = this._activeWallets.splice(index, 1);
    };

    /**
     * Internally initialize wallet
     * @param algoWallet - wallet
     */
    private _initEthereumWallet = async (wallet: EthereumWallet) => {
        if (wallet.getIsWalletInstalled()) {
            await wallet.init();
            await wallet.mountEventListeners();
            await this._mountInternalHooks(wallet);
        } else {
            console.warn(`${wallet.name} is not currently installed...`);
        }
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

        await Promise.all([this._metaMask, this._walletConnect, this._coinbase].map(this._initEthereumWallet));

        this._initialized = true;
        return WALLET_STATUS.OK;
    }

    public getWallet(type: EthereumWalletType): EthereumWallet {
        switch (type) {
            case WALLET_TYPE.ETHEREUM_WALLETCONNECT:
                return this._walletConnect;
            case WALLET_TYPE.ETHEREUM_METAMASK:
                return this._metaMask;
            case WALLET_TYPE.ETHEREUM_COINBASE:
                return this._coinbase;
            default:
                throw new Error(`Wallet type ${type} cannot be found`);
        }
    }

    public getAvailableWallets(): EthereumWalletType[] {
        return walletTypes.filter((walletType) => this.getWallet(walletType).getIsWalletInstalled());
    }

    public getConnectedWallets(): EthereumWalletType[] {
        return walletTypes.filter((walletType) => this.getWallet(walletType).getIsConnected());
    }

    public getActiveWallet(): EthereumWallet {
        if (this._activeWallets.length === 0) {
            return this.getWallet(this._config.defaultWallet); // Get default wallet
        }
        return this.getWallet(this._activeWallets[0]);
    }

    public updateActiveWallet(type: EthereumWalletType): EthereumWallet {
        this._registerActiveWallet(type);
        return this.getWallet(type);
    }

    public signIn(): Promise<WALLET_STATUS> {
        return this.getActiveWallet().signIn();
    }

    public signOut(): Promise<WALLET_STATUS> {
        return this.getActiveWallet().signOut();
    }

    public getSigner(): Promise<EthereumSigner> {
        return this.getActiveWallet().getSigner();
    }

    public getBalance(): Promise<string> {
        return this.getActiveWallet().getBalance();
    }

    public getProvider(): Promise<ethers.providers.Web3Provider> {
        return this.getActiveWallet().getProvider();
    }

    public getIsConnected(): boolean {
        return this.getActiveWallet().getIsConnected();
    }

    public getIsWalletInstalled(): boolean {
        return this.getActiveWallet().getIsWalletInstalled();
    }

    public getPrimaryAccount(): string {
        return this.getActiveWallet().getPrimaryAccount();
    }

    public getAccounts(): string[] {
        return this.getActiveWallet().getAccounts();
    }

    public fetchCurrentChainID(): Promise<string> {
        return this.getActiveWallet().fetchCurrentChainID();
    }

    public mountEventListeners(): Promise<void> {
        throw new NotImplementedError();
    }

    public onAccountChange = (cb: (walletType: EthereumWalletType, accounts: string[]) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, cb);
    };

    public onChainChange = (cb: (walletType: EthereumWalletType, chain: string) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.CHAIN_ON_CHANGE, cb);
    };

    public onAccountDisconnect = (cb: (walletType: EthereumWalletType) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, cb);
    };

    public onBlockAdded = (cb: (newBlock: number) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.NEW_BLOCK, (block: number) => {
            return cb(block);
        });
    };

    public toJSON(): unknown {
        return [
            {
                type: this._metaMask.type,
                name: this._metaMask.name,
                state: this._metaMask.toJSON()
            },
            {
                type: this._walletConnect.type,
                name: this._walletConnect.name,
                state: this._walletConnect.toJSON()
            },
            {
                type: this._coinbase.type,
                name: this._coinbase.name,
                state: this._coinbase.toJSON()
            }
        ];
    }
}

export { Ethereum, defaultEthereumConfig };
