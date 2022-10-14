import { ethers } from 'ethers';
import { NotImplementedError, WalletNotConnectedError, WalletNotInstalledError } from '~/src/errors';
import HookRouter from '~/src/utils/HookRouter/HookRouter';
import { WALLET_HOOK, WALLET_ID, WALLET_STATUS } from '~/src/utils/HookRouter/types';
import WalletStateStorage from '~/src/WalletStateStorage';
import { CHAIN_ETHEREUM, EthereumWalletType } from '..';
import { WALLET_TYPE } from '../../config/wallets';
import { useWindow } from '../../containers';
import { WalletHookHandlerInterface, WalletInterface } from '../../types';
import { EthereumWallet } from '../base';
import { getChainConfig } from '../chains';
import { EthereumChainConfig, ProviderService } from '../services';
import { MetamaskAsset, MetamaskChainConfig, MetamaskState } from './types';

const initialState: Readonly<MetamaskState> = Object.freeze({
    accounts: [],
    isConnected: false
});

class Metamask extends EthereumWallet implements WalletInterface<MetamaskState>, WalletHookHandlerInterface {
    protected hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.CHAIN_ON_CHANGE,
        WALLET_HOOK.CHAIN_ON_DISCONNECT,
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.NEW_BLOCK
    ]);
    protected _walletStorage: WalletStateStorage = new WalletStateStorage(CHAIN_ETHEREUM, WALLET_ID.ETHEREUM_METAMASK);
    protected _state: MetamaskState;
    public provider?: ethers.providers.Web3Provider;
    public name = 'METAMASK';
    public type: EthereumWalletType = WALLET_TYPE.ETHEREUM_METAMASK;

    constructor(state?: MetamaskState) {
        super();

        if (state) {
            this._state = { ...state };
        } else {
            this._state = { ...initialState };
        }

        this._setupInitialState();
    }

    protected async _getProvider(): Promise<ethers.providers.Web3Provider> {
        const ethereum = (await useWindow(async (windowObject) => (windowObject as any).ethereum)) as any;

        if (!ethereum) {
            throw new WalletNotInstalledError();
        }

        return new ethers.providers.Web3Provider(ethereum);
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
        const ethereum = useWindow((windowObject) => (windowObject as { ethereum?: unknown }).ethereum) as any;

        return Boolean(ethereum);
    }
}

export { Metamask };
