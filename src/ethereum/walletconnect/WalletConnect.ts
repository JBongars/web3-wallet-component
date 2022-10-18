import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, providers } from 'ethers';
import { WalletNotConnectedError } from '~/src/errors';
import { WALLET_HOOK, WALLET_STATUS } from '~/src/utils/HookRouter/types';
import { EthereumWalletType } from '..';
import { WALLET_TYPE } from '../../config/wallets';
import { WalletHookHandlerInterface, WalletInterface } from '../../types';
import { EthereumBaseWallet } from '../base';
import { ProviderService } from '../services';
import { EthereumWalletConnectState } from './types';

const initialState: Readonly<EthereumWalletConnectState> = Object.freeze({
    accounts: [],
    isConnected: false
});

class EthWalletConnect
    extends EthereumBaseWallet
    implements WalletInterface<EthereumWalletConnectState>, WalletHookHandlerInterface
{
    private _walletConnectProvider: WalletConnectProvider | null = null;
    protected _state: EthereumWalletConnectState;
    public type: EthereumWalletType = WALLET_TYPE.ETHEREUM_WALLETCONNECT;
    public name = 'ETHEREUM_WALLETCONNECT';

    constructor(state?: EthereumWalletConnectState) {
        super();

        if (state) {
            this._state = { ...state };
        } else {
            this._state = { ...initialState };
        }
        this._setupInitialState();
    }

    private _fetchWCProvider(): WalletConnectProvider {
        const walletConnectProvider = new WalletConnectProvider({
            infuraId: 'f83857b162d64708b25a59585f969fbd', // Required
            qrcode: true
        });
        return walletConnectProvider;
    }

    private async _initProvider(): Promise<void> {
        this._walletConnectProvider = this._fetchWCProvider();
        await this._walletConnectProvider.enable();
    }

    private async _deinitProvider(): Promise<void> {
        if (this._walletConnectProvider !== null) {
            await this._walletConnectProvider.disconnect();
        }
        this._walletConnectProvider = null;
    }

    protected _getProvider(): ethers.providers.Web3Provider {
        const provider = this.getWCProvider();
        return new providers.Web3Provider(provider);
    }

    public getWCProvider(): WalletConnectProvider {
        if (this._walletConnectProvider === null) {
            throw new WalletNotConnectedError();
        }
        return this._walletConnectProvider;
    }

    public async init(): Promise<WALLET_STATUS> {
        return WALLET_STATUS.OK;
    }

    public async signIn(): Promise<WALLET_STATUS> {
        await this._initProvider();

        const provider = await this._getProvider();
        this._state.accounts = await provider.listAccounts();
        this._state.isConnected = this._state.accounts.length > 0;

        this._updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, this._state.accounts);

        return WALLET_STATUS.OK;
    }

    public async signOut(): Promise<WALLET_STATUS> {
        this._enforceIsConnected();

        await this._deinitProvider();

        this._state.accounts = [];
        this._state.isConnected = false;

        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);

        return WALLET_STATUS.OK;
    }

    public getIsWalletInstalled(): boolean {
        return true; // mobile wallet so wallet is always connected
    }

    public async mountEventListeners(): Promise<void> {
        return;
    }

    public async unmountEventListeners(): Promise<void> {
        return;
    }
}

export { EthWalletConnect };
