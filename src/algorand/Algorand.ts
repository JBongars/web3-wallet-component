import { Accounts } from '@randlabs/myalgo-connect';
import { CHAIN_TYPE, WALLET_TYPE } from '../config/wallets';
import { NotImplementedError } from '../errors';
import { ChainHookHandlerInterface, ChainWalletInterface, WalletInterface } from '../types';
import HookRouter from '../utils/HookRouter';
import { WALLET_HOOK, WALLET_STATUS } from '../utils/HookRouter/types';
import { MyAlgo } from './myalgo';
import { PeraWallet } from './perawallet';
import { AlgorandConfig, AlgorandSigner, AlgorandState, AlgorandWallet, AlgorandWalletType } from './types';
import { WalletConnect } from './walletconnect';

const defaultAlgorandConfig: AlgorandConfig = {
    hookType: 'active',
    defaultWallet: WALLET_TYPE.ALGORAND_MYALGO
};

class Algorand
    implements
        WalletInterface<unknown>,
        ChainWalletInterface<AlgorandWallet, AlgorandWalletType>,
        ChainHookHandlerInterface<AlgorandWalletType>
{
    private hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.CHAIN_ON_CHANGE,
        WALLET_HOOK.CHAIN_ON_DISCONNECT,
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.NEW_BLOCK
    ]);

    private _myAlgo: MyAlgo;
    private _walletConnect: WalletConnect;
    private _peraWallet: PeraWallet;
    private _initialized = false;
    private _activeWallets: AlgorandWalletType[] = [];
    private _config: AlgorandConfig;

    public type: CHAIN_TYPE = CHAIN_TYPE.ALGORAND;
    public name = 'ALGORAND';

    constructor(config: Partial<AlgorandConfig>, data?: AlgorandState) {
        this._myAlgo = new MyAlgo(data?.myAlgo);
        this._walletConnect = new WalletConnect(data?.walletConnect);
        this._peraWallet = new PeraWallet(data?.peraWallet);
        this._config = { ...defaultAlgorandConfig, ...config };
    }

    private _registerActiveWallet = (type: AlgorandWalletType): void => {
        this._activeWallets.unshift(type);
    };

    private _deregisterActiveWallet = (type: AlgorandWalletType): void => {
        this._activeWallets = this._activeWallets.filter((elem) => elem !== type);
    };

    private _mountInternalHooks = (wallet: AlgorandWallet) => {
        const verifyWallet = (walletType: AlgorandWalletType) => {
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

        const onAccountChange = (accounts: Accounts[]) => {
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

        wallet.onAccountChange(onAccountChange);
        wallet.onAccountDisconnect(onAccountDisconnect);
    };

    private _initAlgorandWallet = async (algoWallet: AlgorandWallet): Promise<void> => {
        if (algoWallet.getIsWalletInstalled()) {
            await algoWallet.init();
            await this._mountInternalHooks(algoWallet);
        } else {
            console.warn('Selected algorand wallet is not currently installed...');
        }
    };

    public async init(): Promise<WALLET_STATUS> {
        if (this._initialized) {
            return WALLET_STATUS.OK;
        }

        this._initialized = true;
        await Promise.all([this._myAlgo, this._walletConnect, this._peraWallet].map(this._initAlgorandWallet));

        return WALLET_STATUS.OK;
    }

    public getWallet(type: AlgorandWalletType): AlgorandWallet {
        switch (type) {
            case WALLET_TYPE.ALGORAND_MYALGO:
                return this._myAlgo;
            case WALLET_TYPE.ALGORAND_WALLETCONNECT:
                return this._walletConnect;
            case WALLET_TYPE.ALGORAND_PERAWALLET:
                return this._peraWallet;
            default:
                throw new Error(`Wallet type ${type} cannot be found`);
        }
    }

    public getAvailableWallets(): AlgorandWalletType[] {
        const walletTypes: AlgorandWalletType[] = [
            WALLET_TYPE.ALGORAND_MYALGO,
            WALLET_TYPE.ALGORAND_PERAWALLET,
            WALLET_TYPE.ALGORAND_WALLETCONNECT
        ];

        return walletTypes.filter((walletType) => this.getWallet(walletType).getIsWalletInstalled());
    }

    public getConnectedWallets(): AlgorandWalletType[] {
        const walletTypes: AlgorandWalletType[] = [
            WALLET_TYPE.ALGORAND_MYALGO,
            WALLET_TYPE.ALGORAND_PERAWALLET,
            WALLET_TYPE.ALGORAND_WALLETCONNECT
        ];

        return walletTypes.filter((walletType) => this.getWallet(walletType).getIsConnected());
    }

    public getActiveWallet(): AlgorandWallet {
        if (this._activeWallets.length === 0) {
            return this.getWallet(this._config.defaultWallet); // Get default wallet
        }
        return this.getWallet(this._activeWallets[0]);
    }

    public updateActiveWallet(type: AlgorandWalletType): AlgorandWallet {
        this._registerActiveWallet(type);
        return this.getWallet(type);
    }

    public signIn(): Promise<WALLET_STATUS> {
        return this.getActiveWallet().signIn();
    }

    public signOut(): Promise<WALLET_STATUS> {
        return this.getActiveWallet().signOut();
    }

    public getSigner(): Promise<AlgorandSigner> {
        return this.getActiveWallet().getSigner();
    }

    public getBalance(): Promise<string> {
        return this.getActiveWallet().getBalance();
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

    public getPrimaryAccount(): Accounts {
        return this.getActiveWallet().getPrimaryAccount();
    }

    public getAccounts(): Accounts[] {
        return this.getActiveWallet().getAccounts();
    }

    public fetchCurrentChainID(): Promise<string> {
        return this.getActiveWallet().fetchCurrentChainID();
    }

    public mountEventListeners(): Promise<void> {
        throw new NotImplementedError();
    }

    public onAccountChange = (cb: (walletType: AlgorandWalletType, accounts: Accounts[]) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, cb);
    };

    public onChainChange = (cb: (walletType: AlgorandWalletType, chain: string) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.CHAIN_ON_CHANGE, cb);
    };

    public onAccountDisconnect = (cb: (walletType: AlgorandWalletType) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, cb);
    };

    public onBlockAdded = (cb: (newBlock: number) => void | Promise<void>) => {
        throw new NotImplementedError();
    };

    public toJSON(): unknown {
        throw new NotImplementedError();
    }
}

export { Algorand, defaultAlgorandConfig };
