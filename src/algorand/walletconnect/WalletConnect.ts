import { formatJsonRpcRequest } from '@json-rpc-tools/utils';
import { SignedTx } from '@randlabs/myalgo-connect';
import WalletConnectClient from '@walletconnect/client';
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import { NotImplementedError, WalletNotConnectedError } from '~/src/errors';
import HookRouter from '~/src/utils/HookRouter/HookRouter';
import { HookEvent, WALLET_HOOK, WALLET_ID, WALLET_STATUS } from '~/src/utils/HookRouter/types';
import WalletStateStorage from '~/src/WalletStateStorage';
import { AlgorandSignerTxn, AlgorandWalletType, CHAIN_ALGORAND } from '..';
import { WALLET_TYPE } from '../../config/wallets';
import { WalletHookHandlerInterface, WalletInterface } from '../../types';
import {
    AlgorandWalletConnectAsset,
    AlgorandWalletConnectSigner,
    AlgorandWalletConnectState,
    AlgorandWalletConnectTransaction
} from './types';

type Accounts = {
    address: string;
    name: string;
};

const initialState: Readonly<AlgorandWalletConnectState> = Object.freeze({
    accounts: [],
    isConnected: false
});

class WalletConnect implements WalletInterface<AlgorandWalletConnectState>, WalletHookHandlerInterface {
    private hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.CHAIN_ON_CHANGE
    ]);
    public state: AlgorandWalletConnectState;
    private provider: WalletConnectClient | undefined;
    private walletStorage = new WalletStateStorage(CHAIN_ALGORAND, WALLET_ID.ALGORAND_WALLETCONNECT);

    public type: AlgorandWalletType = WALLET_TYPE.ALGORAND_WALLETCONNECT;
    public name = 'ALGORAND_WALLETCONNECT';

    constructor(state?: AlgorandWalletConnectState) {
        if (state) {
            this.state = { ...state };
        } else {
            this.state = { ...initialState };
        }

        this._setupInitialState();
    }

    private _enforceIsConnected(): void {
        if (!this.getIsConnected()) {
            throw new WalletNotConnectedError();
        }
    }

    private _setupInitialState() {
        const storageValue = this.walletStorage.getValue();

        if (storageValue) {
            this.state = {
                isConnected: this.getIsConnected(),
                accounts: storageValue.accounts
            };
        }
    }

    private _updateWalletStorageValue() {
        if (this.state.isConnected && this.state.accounts.length > 0) {
            const accounts = this.getAccounts().map((acc) => acc.address);
            const connectedAccount = this.getPrimaryAccount().address;
            this.walletStorage.updateValue(true, connectedAccount, accounts);
        } else {
            this.walletStorage.updateValue(false, '', []);
        }
    }

    public async init(): Promise<WALLET_STATUS> {
        return WALLET_STATUS.OK;
    }

    public async signIn(): Promise<WALLET_STATUS> {
        this.provider = new WalletConnectClient({
            bridge: 'https://bridge.walletconnect.org', // Required
            qrcodeModal: QRCodeModal
        });

        if (!this.provider.connected) {
            // create new session
            await this.provider.createSession();
        } else {
            const { accounts } = this.provider;

            this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
            this.state.accounts = accounts;
            this._updateWalletStorageValue();
            this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
        }

        this.provider.on('connect', (error, payload) => {
            if (error) {
                throw error;
            }

            // Get provided accounts
            const { accounts } = payload.params[0];
            this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
            this.state.accounts = accounts;
            this._updateWalletStorageValue();
            this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
        });

        this.provider.on('disconnect', (error, payload) => {
            if (error) {
                throw error;
            }
            this.signOut();
        });

        return WALLET_STATUS.OK;
    }

    public async signOut(): Promise<WALLET_STATUS> {
        this.state.accounts = [];
        this.state.isConnected = false;

        if (!this.provider) {
            this.getProvider();
        }

        try {
            await this.provider?.killSession();
        } catch (e) {
            console.error('Failed to kill session...');
        }
        this.provider = undefined;
        this._updateWalletStorageValue();
        this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
        return WALLET_STATUS.OK;
    }

    public async getSigner(): Promise<AlgorandWalletConnectSigner> {
        return async (transactions: AlgorandSignerTxn): Promise<SignedTx[]> => {
            this._enforceIsConnected();
            const walletConnect = this.getProvider();
            const txnsToSign = (transactions as AlgorandWalletConnectTransaction).map((txn) => ({
                txn: Buffer.from(txn).toString('base64')
            }));
            const jsonRpcRequest = formatJsonRpcRequest('algo_signTxn', [txnsToSign]);
            const signedTxns = await walletConnect.sendCustomRequest(jsonRpcRequest);
            const signedTxns2: any = [];
            for (let i = 0; i < signedTxns.length; i++) {
                if (signedTxns[i] !== null) {
                    signedTxns2.push({
                        txID: '',
                        blob: new Uint8Array(Buffer.from(signedTxns[i], 'base64'))
                    });
                } else {
                    signedTxns2.push({
                        txId: '',
                        blob: null
                    });
                }
            }

            return signedTxns2;
        };
    }

    public async getBalance(): Promise<string> {
        throw new NotImplementedError();
    }

    public async getAssets(): Promise<AlgorandWalletConnectAsset[]> {
        throw new NotImplementedError();
    }

    public getIsWalletInstalled(): boolean {
        return true; // wallet is web only so is always installed
    }

    public getIsConnected(): boolean {
        const provider = this.getProvider();

        return provider.connected;
    }

    public getPrimaryAccount(): Accounts {
        return {
            address: this.state.accounts[0],
            name: ''
        };
    }

    public getAccounts(): Accounts[] {
        return this.state.accounts.map((ob) => ({ address: ob, name: '' }));
    }

    public async fetchCurrentChainID(): Promise<string> {
        return '0x1';
    }

    public async mountEventListeners(): Promise<void> {}

    public onAccountChange = (cb: (accounts: Accounts[]) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, () => {
            return cb(this.getAccounts());
        });
    };

    public onAccountDisconnect = (cb: () => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, () => {
            return cb();
        });
    };

    public onChainChange = (cb: (chain: string) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.CHAIN_ON_CHANGE, async () => {
            const currentChainId = await this.fetchCurrentChainID();
            return cb(currentChainId);
        });
    };

    public onBlockAdded = (cb: (newBlock: unknown) => void | Promise<void>): HookEvent => {
        throw new NotImplementedError();
    };

    public toJSON(): AlgorandWalletConnectState {
        return this.state;
    }

    public getProvider(): WalletConnectClient {
        if (this.provider instanceof WalletConnectClient) {
            return this.provider;
        }

        this.provider = new WalletConnectClient({
            bridge: 'https://bridge.walletconnect.org', // Required
            qrcodeModal: QRCodeModal
        });
        return this.provider;
    }
}

export { WalletConnect };
