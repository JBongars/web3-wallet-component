import { ethers } from 'ethers';
import HookRouter from '~/src/utils/HookRouter/HookRouter';
import { WALLET_HOOK, WALLET_ID, WALLET_STATUS } from '~/src/utils/HookRouter/types';
import WalletStateStorage from '~/src/WalletStateStorage';
import { EthereumWalletType } from '..';
import { CHAIN_TYPE, WALLET_TYPE } from '../../config/wallets';
import { useWindow } from '../../containers';
import { WalletHookHandlerInterface, WalletInterface } from '../../types';
import { EthereumBaseWallet } from '../base';
import { EthereumObject, ProviderService } from '../services';
import { MetamaskState } from './types';

const initialState: Readonly<MetamaskState> = Object.freeze({
    accounts: [],
    isConnected: false
});

class Metamask extends EthereumBaseWallet implements WalletInterface<MetamaskState>, WalletHookHandlerInterface {
    protected hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.CHAIN_ON_CHANGE,
        WALLET_HOOK.CHAIN_ON_DISCONNECT,
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.NEW_BLOCK
    ]);
    protected _walletStorage: WalletStateStorage = new WalletStateStorage(
        CHAIN_TYPE.ETHEREUM,
        WALLET_ID.ETHEREUM_METAMASK
    );
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

    protected _getEthereumProvider(): EthereumObject {
        return ProviderService.getNamedWindowEthereumObject('MetaMask', (ethereumObject: EthereumObject) =>
            Boolean(ethereumObject.isMetaMask)
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
        return Boolean(ethereumGlobal.providerMap.get('MetaMask'));
    }
}

export { Metamask };
