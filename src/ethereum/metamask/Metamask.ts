import { ethers } from 'ethers';
import { NotImplementedError, WalletNotConnectedError, WalletNotInstalledError } from '~/src/errors';
import HookRouter from '~/src/utils/HookRouter/HookRouter';
import { WALLET_HOOK, WALLET_ID, WALLET_STATUS } from '~/src/utils/HookRouter/types';
import WalletStateStorage from '~/src/WalletStateStorage';
import { CHAIN_ETHEREUM, EthereumWalletType } from '..';
import { WALLET_TYPE } from '../../config/wallets';
import { useWindow } from '../../containers';
import { WalletHookHandlerInterface, WalletInterface } from '../../types';
import { getChainConfig } from '../chains';
import { MetamaskAsset, MetamaskChainConfig, MetamaskState } from './types';

const initialState: Readonly<MetamaskState> = Object.freeze({
    accounts: [],
    isConnected: false
});

class Metamask implements WalletInterface<MetamaskState>, WalletHookHandlerInterface {
    private hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.CHAIN_ON_CHANGE,
        WALLET_HOOK.CHAIN_ON_DISCONNECT,
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.NEW_BLOCK
    ]);
    private _walletStorage: WalletStateStorage = new WalletStateStorage(CHAIN_ETHEREUM, WALLET_ID.ETHEREUM_METAMASK);
    private chain: string | null = null;
    private _state: MetamaskState;
    private _ethereum: any;
    public provider?: ethers.providers.Web3Provider;
    public name = 'METAMASK';
    public type: EthereumWalletType = WALLET_TYPE.ETHEREUM_METAMASK;

    constructor(state?: MetamaskState) {
        if (state) {
            this._state = { ...state };
        } else {
            this._state = { ...initialState };
        }

        this._setupInitialState();
    }

    private async _getProvider(): Promise<ethers.providers.Web3Provider> {
        if (this.provider) return this.provider;

        if (!this._ethereum) {
            throw new WalletNotInstalledError();
        }

        return new ethers.providers.Web3Provider(this._ethereum, "any");
    }

    private _enforceIsConnected(): void {
        if (!this.getIsConnected()) {
            throw new WalletNotConnectedError();
        }
    }

    private async _enforceChain(): Promise<void> {
        if (this.chain === null) return;

        const provider = await this._getProvider();
        const currentChain: string = await provider.send('eth_chainId', []);

        if (currentChain !== this.chain) {
            throw new Error(`Chain has changed to ${currentChain} when it should be ${this.chain}`);
        }
    }

    private _setupInitialState() {
        const storageValue = this._walletStorage.getValue();

        if (storageValue) {
            this._state = {
                isConnected: storageValue.isConnected,
                accounts: storageValue.accounts
            };
        }
    }

    private _updateWalletStorageValue() {
        if (this._state.isConnected && this._state.accounts.length > 0) {
            this._walletStorage.updateValue(true, this.getPrimaryAccount(), this._state.accounts);
        } else {
            this._walletStorage.updateValue(false, '', []);
        }
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

    public async getSigner(): Promise<ethers.providers.JsonRpcSigner> {
        this._enforceChain();
        this._enforceIsConnected();

        const provider = this.provider || (await this._getProvider());

        return provider.getSigner();
    }

    public async getBalance(): Promise<string> {
        this._enforceChain();
        this._enforceIsConnected();

        const provider = this.provider || (await this._getProvider());
        const balance = await provider.getBalance(this._state.accounts[0]);
        return balance.toString();
    }

    public async getAssets(): Promise<MetamaskAsset[]> {
        throw new NotImplementedError();
    }

    public getIsConnected(): boolean {
        return this._state.isConnected;
    }

    public getIsWalletInstalled(): boolean {
        const ethereum = useWindow((windowObject) => (windowObject as { ethereum?: unknown }).ethereum) as any;

        if (!ethereum) return false;

        // Metamask and Coinbase/Other Wallet are both installed
        // Choose the correct injected wallet
        if ("providers" in ethereum && ethereum.providers?.length) {
            for (let p of ethereum.providers) {
                if (p.isMetaMask) {
                    this._ethereum = p;
                    return true;
                }
            }
        } else {
            if (ethereum.isMetaMask) {
                // Force [disable extension/disable overriding Metamask option] of Coin98 Wallet before Metamask can be used
                if ("isCoin98" in ethereum && ethereum.isCoin98) return false;
                this._ethereum = ethereum;
                return true;
            }
        }

        return false;
    }

    public getPrimaryAccount(): string {
        this._enforceChain();
        this._enforceIsConnected();

        return this._state.accounts[0];
    }

    public getAccounts(): string[] {
        this._enforceChain();
        this._enforceIsConnected();

        return this._state.accounts;
    }

    public async fetchCurrentChainID(): Promise<string> {
        const provider: ethers.providers.Web3Provider = await this._getProvider();
        const chainId = await provider.send('eth_chainId', []);

        return chainId;
    }

    public async addChainToWallet(chainConfig: MetamaskChainConfig): Promise<void> {
        return this._ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chainConfig]
        });
    }

    public async switchChainFromWallet(chain: number) {
        if (this._ethereum.networkVersion !== chain) {
            try {
                await this._ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: `0x${chain}` }]
                });
            } catch (err) {
                if (err && (err as { code: number }).code === 4902) {
                    const chainConfig = getChainConfig(chain);
                    await this.addChainToWallet(chainConfig as MetamaskChainConfig);
                } else {
                    throw err;
                }
            }
        }
    }

    public async forceCurrentChainID(chain: number): Promise<void> {
        if (this.chain !== null && this.chain !== `0x${chain}`) {
            throw new Error(`Cannot force chain to be 0x${chain} because it is already forced to be 0x${this.chain}`);
        }

        this.chain = `0x${chain}`;
        this.switchChainFromWallet(chain);
    }

    public onAccountChange = (cb: (accounts: string[]) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_CHANGE, cb);
    };

    public onChainChange = (cb: (chain: string) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.CHAIN_ON_CHANGE, cb);
    };

    public onAccountDisconnect = (cb: () => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.ACCOUNT_ON_DISCONNECT, cb);
    };

    public onChainDisconnect = (cb: () => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.CHAIN_ON_DISCONNECT, cb);
    };

    public onBlockAdded = (cb: (newBlock: number) => void | Promise<void>) => {
        return this.hookRouter.registerCallback(WALLET_HOOK.NEW_BLOCK, (block: number) => {
            return cb(block);
        });
    };

    public toJSON(): MetamaskState {
        return this._state;
    }

    /**
     * Mounts ethereum based event hooks to the hook router
     * @see https://eips.ethereum.org/EIPS/eip-1193#references for list of ethereum hooks
     */
    public async mountEventListeners(): Promise<void> {
        const provider = await this._getProvider();
        if (this._ethereum && this._ethereum.on) {
            this._ethereum.on('accountsChanged', async (accounts: string[]) => {
                this._state.accounts = accounts;

                if (accounts.length === 0) {
                    await this.signOut();
                    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
                } else {
                    this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, accounts);
                }
                this._updateWalletStorageValue();
            });

            this._ethereum.on('chainChanged', async (chainId: string) => {
                this.hookRouter.applyHookWithArgs(WALLET_HOOK.CHAIN_ON_CHANGE, chainId);
            });

            this._ethereum.on('disconnect', async (err: Error) => {
                console.warn(`Metamask Disconnected. Error:`);
                console.warn(err);
                this.hookRouter.applyHooks([WALLET_HOOK.CHAIN_ON_DISCONNECT]);
            });
        }

        provider.on('block', (block: number) => {
            this.hookRouter.applyHookWithArgs(WALLET_HOOK.NEW_BLOCK, block);
        });
    }

    public async unmountEventListeners() {
        const provider = await this._getProvider();
        provider.removeAllListeners();
    }

    public async getProvider(): Promise<ethers.providers.Web3Provider> {
        await this._enforceChain();

        return this._getProvider();
    }
}

export { Metamask };
