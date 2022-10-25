import WalletConnectProvider from '@walletconnect/web3-provider';
import axios from 'axios';
import { ethers, providers } from 'ethers';
import { NotImplementedError, WalletNotConnectedError } from '~/src/errors';
import HookRouter from '~/src/utils/HookRouter/HookRouter';
import { WALLET_HOOK, WALLET_ID, WALLET_STATUS } from '~/src/utils/HookRouter/types';
import WalletStateStorage from '~/src/WalletStateStorage';
import { CHAIN_ETHEREUM, EthereumWalletType } from '..';
import { WALLET_TYPE } from '../../config/wallets';
import { EVMBasedChain, WalletHookHandlerInterface, WalletInterface } from '../../types';
import { getChainConfig } from '../chains';
import { EthereumWalletConnectAsset, EthereumWalletConnectChainConfig, EthereumWalletConnectState } from './types';

const initialState: Readonly<EthereumWalletConnectState> = Object.freeze({
    accounts: [],
    isConnected: false
});

class EthWalletConnect implements WalletInterface<EthereumWalletConnectState>, WalletHookHandlerInterface {
    private hookRouter: HookRouter = new HookRouter([
        WALLET_HOOK.CHAIN_ON_CHANGE,
        WALLET_HOOK.CHAIN_ON_DISCONNECT,
        WALLET_HOOK.ACCOUNT_ON_CHANGE,
        WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
        WALLET_HOOK.NEW_BLOCK
    ]);
    private chain: string | null = null;
    private _state: EthereumWalletConnectState;
    public provider?: ethers.providers.Web3Provider;
    private walletStorage = new WalletStateStorage(CHAIN_ETHEREUM, WALLET_ID.ETHEREUM_WALLETCONNECT);
    public type: EthereumWalletType = WALLET_TYPE.ETHEREUM_WALLETCONNECT;
    public name = 'ETHEREUM_WALLETCONNECT';

    constructor(state?: EthereumWalletConnectState) {
        if (state) {
            this._state = { ...state };
        } else {
            this._state = { ...initialState };
        }
        this._setupInitialState();
    }

    private _setupInitialState() {
        const storageValue = this.walletStorage.getValue();

        if (storageValue) {
            this._state = {
                isConnected: storageValue.isConnected,
                accounts: storageValue.accounts
            };
        }
    }

    private _updateWalletStorageValue() {
        if (this._state.isConnected && this._state.accounts.length > 0) {
            this.walletStorage.updateValue(true, this._state.accounts[0], this._state.accounts);
        } else {
            this.walletStorage.updateValue(false, '', []);
        }
    }

    private async _getProvider(qrcode = false): Promise<ethers.providers.Web3Provider> {
        const provider = await this.getWCProvider(qrcode);
        return new providers.Web3Provider(provider);
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

    public async getWCProvider(qrcode = false): Promise<WalletConnectProvider> {
        const { data: chains }: { data: EVMBasedChain[] } = await axios.get('https://chainid.network/chains.json');
        const ignoredChainIds = [1, 3, 4, 5, 42, 11155111];
        const filteredChains = chains.filter((chain: EVMBasedChain) => {
            return !ignoredChainIds.includes(chain.networkId);
        });

        const rpc: { [key: string]: string } = {
            1: 'https://rpc.ankr.com/eth',
            3: 'https://rpc.ankr.com/eth_ropsten',
            4: 'https://rpc.ankr.com/eth_rinkeby',
            5: 'https://rpc.ankr.com/eth_goerli',
            42: 'https://kovan.etherscan.io',
            11155111: 'https://sepolia.etherscan.io'
        };

        if (filteredChains && filteredChains.length) {
            filteredChains.forEach((chain: EVMBasedChain) => {
                const filtered = chain.rpc.filter(
                    (item) => !item.includes('${INFURA_API_KEY}') && !item.includes('${ALCHEMY_API_KEY}')
                );

                rpc[chain.networkId] = filtered[0];
            });
        }

        const provider = new WalletConnectProvider({
            rpc,
            qrcode,
            pollingInterval: 12000
        });

        await provider.enable();

        provider.on('accountsChanged', async (accounts: string[]) => {
            this._state.accounts = accounts;

            if (accounts.length === 0) {
                await this.signOut();
                this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
            } else {
                this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, accounts);
            }
            this._updateWalletStorageValue();
        });

        provider.on('chainChanged', async (chainId: number) => {
            const id = ethers.utils.hexValue(chainId);
            this.hookRouter.applyHookWithArgs(WALLET_HOOK.CHAIN_ON_CHANGE, id);
        });

        provider.on('disconnect', async (_code: number, _reason: string) => {
            this._state.accounts = [];
            this._state.isConnected = false;
            this.provider = undefined;
            this._updateWalletStorageValue();
            this.hookRouter.applyHooks([WALLET_HOOK.CHAIN_ON_DISCONNECT]);
            this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
        });

        return provider;
    }

    public async init(): Promise<WALLET_STATUS> {
        return WALLET_STATUS.OK;
    }

    public async signIn(): Promise<WALLET_STATUS> {
        const provider = await this._getProvider(true);
        this._state.accounts = await provider.listAccounts();
        this._state.isConnected = this._state.accounts.length > 0;
        this._updateWalletStorageValue();
        this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, this._state.accounts);
        return WALLET_STATUS.OK;
    }

    public async signOut(): Promise<WALLET_STATUS> {
        this._enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;
        this.provider = undefined;
        this._updateWalletStorageValue();
        (await this.getWCProvider()).disconnect();

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

        const provider = await this._getProvider();
        const balance = await provider.getBalance(this._state.accounts[0]);
        return balance.toString();
    }

    public async getAssets(): Promise<EthereumWalletConnectAsset[]> {
        throw new NotImplementedError();
    }

    public getIsConnected(): boolean {
        return this._state.isConnected;
    }

    public getIsWalletInstalled(): boolean {
        return true;
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

    public async addChainToWallet(chainConfig: EthereumWalletConnectChainConfig): Promise<void> {
        const provider: WalletConnectProvider = await this.getWCProvider();
        await provider.request({
            method: 'wallet_addEthereumChain',
            params: [chainConfig]
        });
    }

    public async switchChainFromWallet(chain: number) {
        const provider: WalletConnectProvider = await this.getWCProvider();
        const defaultChains = [1, 3, 4, 5, 42];

        if (defaultChains.includes(chain)) {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chain.toString(16)}` }]
            });
        } else {
            const chainConfig = await getChainConfig(chain);
            await this.addChainToWallet(chainConfig as EthereumWalletConnectChainConfig);
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

    public toJSON(): EthereumWalletConnectState {
        return this._state;
    }

    public async mountEventListeners() {
        return;
    }

    public async unmountEventListeners() {
        return;
    }

    public async getProvider(): Promise<ethers.providers.Web3Provider> {
        await this._enforceChain();
        return await this._getProvider();
    }
}

export { EthWalletConnect };
