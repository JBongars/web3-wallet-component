import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { ethers } from 'ethers';
import HookRouter from '~/src/utils/HookRouter/HookRouter';
import { WALLET_HOOK, WALLET_ID, WALLET_STATUS } from '~/src/utils/HookRouter/types';
import WalletStateStorage from '~/src/WalletStateStorage';
import { CHAIN_ETHEREUM, EthereumWalletType } from '..';
import { WALLET_TYPE } from '../../config/wallets';
import { useWindow } from '../../containers';
import { WalletHookHandlerInterface, WalletInterface } from '../../types';
import { EthereumBaseWallet } from '../base/EthereumBaseWallet';
import { EthereumObject, ProviderService } from '../services';
import { CoinbaseConfig, CoinbaseState } from './types';

const initialState: Readonly<CoinbaseState> = Object.freeze({
    accounts: [],
    isConnected: false
});

const defaultConfig: Readonly<CoinbaseConfig> = Object.freeze({
    coinbaseConfig: {
        appName: 'Dapp',
        appLogoUrl: '',
        darkMode: false
    },
    defaultEthJsonRPCUrl: '',
    defaultChainId: 1
});

class Coinbase extends EthereumBaseWallet implements WalletInterface<CoinbaseState>, WalletHookHandlerInterface {
    protected hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.CHAIN_ON_CHANGE,
        WALLET_HOOK.CHAIN_ON_DISCONNECT,
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.NEW_BLOCK
    ]);
    protected _walletStorage: WalletStateStorage = new WalletStateStorage(CHAIN_ETHEREUM, WALLET_ID.ETHEREUM_COINBASE);
    protected chain: string | null = null;
    protected _state: CoinbaseState;
    protected _config: CoinbaseConfig;
    protected _wallet: CoinbaseWalletSDK;
    public provider?: ethers.providers.Web3Provider;
    public name = 'COINBASE';
    public type: EthereumWalletType = WALLET_TYPE.ETHEREUM_COINBASE;

    constructor(state?: CoinbaseState, config: CoinbaseConfig = defaultConfig) {
        super();

        if (state) {
            this._state = { ...state };
        } else {
            this._state = { ...initialState };
        }
        this._config = config;
        this._wallet = new CoinbaseWalletSDK(config.coinbaseConfig);
        this._setupInitialState();
    }

    protected _getEthereumProvider(): EthereumObject {
        return ProviderService.getNamedWindowEthereumObject('CoinbaseWallet', (ethereum: EthereumObject) =>
            Boolean(ethereum.isCoinbaseWallet)
        );
    }

    public async init(): Promise<WALLET_STATUS> {
        this.provider = await this._getProvider();

        return WALLET_STATUS.OK;
    }

    public async signIn(): Promise<WALLET_STATUS> {
        const provider = await this._getProvider();
        this._state.accounts = await provider.send('eth_requestAccounts', []);
        this._state.isConnected = this._state.accounts.length > 0;

        this._updateWalletStorageValue();

        this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, this._state.accounts);
        return WALLET_STATUS.OK;
    }

    public async signOut(): Promise<WALLET_STATUS> {
        this._enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;

        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
        return WALLET_STATUS.OK;
    }

    public getIsWalletInstalled(): boolean {
        const ethereumGlobal = useWindow((windowObject) => (windowObject as Window).ethereum) as EthereumObject;
        if (!ethereumGlobal) {
            return false;
        }
        return Boolean(ethereumGlobal.providerMap.get('Coinbase'));
    }
}

export { Coinbase };
