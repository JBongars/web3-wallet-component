import { ethers } from 'ethers';
import { NotImplementedError, WalletNotConnectedError } from '~/src/errors';
import HookRouter from '~/src/utils/HookRouter/HookRouter';
import { WALLET_HOOK, WALLET_ID, WALLET_STATUS } from '~/src/utils/HookRouter/types';
import WalletStateStorage from '~/src/WalletStateStorage';
import { CHAIN_TYPE } from '../../config';
import { WalletHookHandlerInterface } from '../../types';
import { EthereumChainConfig, EthereumObject, Provider, ProviderService } from '../services';
import { BaseEthereumAsset, BaseEthereumChainConfig, BaseEthereumState } from './types';

abstract class EthereumBaseWallet implements WalletHookHandlerInterface {
    protected hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.CHAIN_ON_CHANGE,
        WALLET_HOOK.CHAIN_ON_DISCONNECT,
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.NEW_BLOCK
    ]);
    protected _walletStorage: WalletStateStorage = new WalletStateStorage(
        CHAIN_TYPE.ETHEREUM,
        WALLET_ID.ETHEREUM_NOWALLET
    );
    protected chain: string | null = null;
    protected _state: BaseEthereumState;

    constructor() {
        this._state = {
            accounts: [],
            isConnected: false
        };
    }

    protected _getEthereumProvider(): EthereumObject {
        throw new NotImplementedError();
    }

    protected _getProvider(
        ethereum: ethers.providers.ExternalProvider = this._getEthereumProvider()
    ): ethers.providers.Web3Provider {
        return new ethers.providers.Web3Provider(ethereum);
    }

    protected _enforceIsConnected(): void {
        if (!this.getIsConnected()) {
            throw new WalletNotConnectedError();
        }
    }

    protected async _enforceChain(): Promise<void> {
        if (this.chain === null) return;

        const provider = await this._getProvider();
        const currentChain: string = await ProviderService.fetchCurrentChainID(provider);

        if (currentChain !== this.chain) {
            throw new Error(`Chain has changed to ${currentChain} when it should be ${this.chain}`);
        }
    }

    protected _setupInitialState() {
        const storageValue = this._walletStorage.getValue();

        if (storageValue) {
            this._state = {
                isConnected: storageValue.isConnected,
                accounts: storageValue.accounts
            };
        }
    }

    protected _updateWalletStorageValue() {
        if (this._state.isConnected && this._state.accounts.length > 0) {
            this._walletStorage.updateValue(true, this.getPrimaryAccount(), this._state.accounts);
        } else {
            this._walletStorage.updateValue(false, '', []);
        }
    }

    public async getSigner(): Promise<ethers.providers.JsonRpcSigner> {
        this._enforceChain();
        this._enforceIsConnected();

        const provider = this._getProvider();
        return ProviderService.getSigner(provider);
    }

    public async getBalance(): Promise<string> {
        this._enforceChain();
        this._enforceIsConnected();

        const provider = this._getProvider();
        return await ProviderService.getBalance(provider, this._state.accounts[0]);
    }

    public async signOut(): Promise<WALLET_STATUS> {
        throw new NotImplementedError();
    }

    public async getAssets(): Promise<BaseEthereumAsset[]> {
        return await ProviderService.getAssets();
    }

    public getIsConnected(): boolean {
        return this._state.isConnected;
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
        return ProviderService.fetchCurrentChainID(provider);
    }

    public async addChainToWallet(chainConfig: BaseEthereumChainConfig): Promise<void> {
        return ProviderService.addChainToWallet(chainConfig as EthereumChainConfig);
    }

    public async switchChainFromWallet(chain: string, updateChain = false) {
        const ethereum = this._getEthereumProvider();
        if ((ethereum as EthereumObject).networkVersion !== String(chain)) {
            await ProviderService.switchChainFromWallet(ethereum, chain);

            if (updateChain) {
                this.chain = chain;
            }
        }
    }

    public async forceCurrentChainID(chain: string): Promise<void> {
        if (this.chain !== null && this.chain !== chain) {
            throw new Error(`Cannot force chain to be 0x${chain} because it is already forced to be 0x${this.chain}`);
        }

        this.chain = chain;
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

    public getIsWalletInstalled(): boolean {
        throw new NotImplementedError();
    }

    public toJSON(): BaseEthereumState {
        return this._state;
    }

    /**
     * Mounts ethereum based event hooks to the hook router
     * @see https://eips.ethereum.org/EIPS/eip-1193#references for list of ethereum hooks
     */
    public async mountEventListeners(): Promise<void> {
        if (!this.getIsWalletInstalled()) {
            return;
        }
        const ethereum = this._getEthereumProvider() as EthereumObject;
        const provider = this._getProvider() as Provider;

        if (!ethereum.on) {
            return;
        }

        ethereum.on('accountsChanged', async (accounts: string[]) => {
            console.log({ accounts });
            this._state.accounts = accounts;

            if (accounts.length === 0) {
                await this.signOut();
                this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
            } else {
                this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, accounts);
            }
            this._updateWalletStorageValue();
        });

        ethereum.on('chainChanged', async (chainId: string) => {
            this.hookRouter.applyHookWithArgs(WALLET_HOOK.CHAIN_ON_CHANGE, chainId);
        });

        ethereum.on('disconnect', async (err: Error) => {
            console.warn(`BaseEthereum Disconnected. Error:`);
            console.warn(err);
            this.hookRouter.applyHooks([WALLET_HOOK.CHAIN_ON_DISCONNECT]);
        });

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

export { EthereumBaseWallet };
