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
    private _walletConnectProvider: WalletConnectProvider | null = null;
    private _rpc: { [key: string]: string } | null = null

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

    private async _getProvider(): Promise<ethers.providers.Web3Provider> {
        const provider = await this.getWCProvider();
        this.provider = new providers.Web3Provider(provider);

        return this.provider;
    }

    private _enforceIsConnected(): void {
        if (!this.getIsConnected()) {
            throw new WalletNotConnectedError();
        }
    }

    private async _enforceChain(): Promise<void> {
        if (this.chain === null) return;

        const provider = await this.getWCProvider();
        const currentChain: string = await provider.send('eth_chainId', []);

        if (currentChain !== this.chain) {
            throw new Error(`Chain has changed to ${currentChain} when it should be ${this.chain}`);
        }
    }

    public async getWCProvider(): Promise<WalletConnectProvider> {
        const rpc = await this._getRpc()
        if(this._walletConnectProvider) {
            return this._walletConnectProvider;
        }
        
        this._walletConnectProvider = new WalletConnectProvider({
            rpc,
            qrcode: true,
            qrcodeModalOptions: {
                desktopLinks: []
            },
            pollingInterval: 12000,
            storageId: `walletconnect-${WALLET_ID.ETHEREUM_WALLETCONNECT}`
        });

        return this._walletConnectProvider;
    }

    public async init(): Promise<WALLET_STATUS> {
        console.log("init")

        const wcProvider = await this.getWCProvider()
        const wc = wcProvider.connector;
        if (wc.connected && !wcProvider.connected) {
            wcProvider.connected = true;
            wcProvider.updateState(wc.session);
        }

        if(wcProvider.connected) {
            wcProvider.start()
        }

        await this._registerListeners()
        return WALLET_STATUS.OK;
    }

    // public async foo() {
    //     const provider = await this.getWCProvider();

    //     const wc = provider.connector;
    //     wc.on('connect', (error, payload) => {
    //         if (error) {
    //             console.log('connect error');
    //         }
    //         if (provider.isConnecting) {
    //             provider.isConnecting = false
    //         }

    //         //disconect the wallet connect if chain id is invalid.
    //         if (!rpc[payload.params[0].chainId]) {
    //             console.log('invalid chain', { payload });
    //             wc.killSession();
    //         } else {
    //             provider.connected = true;
    //             if (payload) {
    //                 provider.updateState(payload.params[0]).then(() => {
    //                     this._state.accounts = provider.accounts;
    //                     this._state.isConnected = this._state.accounts.length > 0;
    //                     this._updateWalletStorageValue();
    //                     this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, this._state.accounts);
    //                 });
    //                 provider.stop()
    //                 provider.start()
    //             }
    //             provider.emit('connect');
    //             provider.triggerConnect(wc);
    //         }
    //     });
    //     wc.on('disconnect', (error) => {
    //         console.log('disconnect', { error });
    //         if (error) {
    //             provider.emit('error', error);
    //             return;
    //         }
    //         provider.onDisconnect().then(() => {
    //             provider.stop()
    //             console.log({ provider })
    //         });

    //     });
    //     wc.on('session_update', (error, payload) => {
    //         if (error) {
    //             provider.emit('error', error);
    //             return;
    //         }
    //         if (payload) {
    //             provider.updateState(payload.params[0]);
    //         }
    //     });
    //     if (!wc.connected) {

    //         wc.on("modal_closed", () => { })
    //         try {
    //             provider.isConnecting = true
    //             await wc.createSession({ chainId: provider.chainId });
    //         } catch (err) {
    //             provider.isConnecting = false
    //             console.log({ err })
    //         }
    //     } else {
    //         if (!provider.connected) {
    //             provider.connected = true;
    //         }
    //         provider.updateState(wc.session);
    //         // provider.stop()
    //         // provider.start()
    //     }

    //     provider.on('accountsChanged', async (accounts: string[]) => {
    //         this._state.accounts = accounts;

    //         if (accounts.length === 0) {
    //             await this.signOut();
    //             this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
    //         } else {
    //             this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, accounts);
    //         }
    //         this._updateWalletStorageValue();
    //     });

    //     provider.on('chainChanged', async (chainId: number) => {
    //         const id = ethers.utils.hexValue(chainId);
    //         this.hookRouter.applyHookWithArgs(WALLET_HOOK.CHAIN_ON_CHANGE, id);
    //     });
    // }
    public async signIn(): Promise<WALLET_STATUS> {
        if(!this._walletConnectProvider) {
            this._walletConnectProvider = await this.getWCProvider()
        }
        const wc = this._walletConnectProvider.connector

        try {
            this._walletConnectProvider.isConnecting = true
            await wc.createSession({ chainId: this._walletConnectProvider.chainId });
        } catch (err) {
            this._walletConnectProvider.isConnecting = false
            console.log({ err })
        }

        return WALLET_STATUS.OK;
    }

    public async signOut(): Promise<WALLET_STATUS> {
        this._enforceIsConnected();
        this._state.accounts = [];
        this._state.isConnected = false;
        this._updateWalletStorageValue();
        this._walletConnectProvider?.disconnect();

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
        const provider = await this.getWCProvider();
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
        provider.enable();
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
        if (!this.provider) {
            return this._getProvider();
        }
        return this.provider;
    }

    private async  _getRpc() {
        if(this._rpc) {
            return this._rpc;
        }

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
                const filtered = chain.rpc.filter((item) => !item.includes('API_KEY'));
                rpc[chain.networkId] = filtered[0];
            });
        }

        this._rpc = rpc

        return rpc;
    }

    private async _registerListeners()
    {
       if(!this._walletConnectProvider) {
        this._walletConnectProvider = await this.getWCProvider()
       }

        const rpc = await this._getRpc()
        const wc = this._walletConnectProvider.connector
        wc.on("modal_closed", () => { })
        wc.on('connect', (error, payload) => {
            console.log("connect")
            if (error) {
                console.log('connect error');
            }
            if (this._walletConnectProvider?.isConnecting) {
                this._walletConnectProvider.isConnecting = false
            }

            //disconect the wallet connect if chain id is invalid.
            if (!rpc[payload.params[0].chainId]) {
                console.log('invalid chain', { payload });
                wc.killSession();
            } else {
              if(this._walletConnectProvider) {
                  this._walletConnectProvider.connected = true;
              }
              
                if (payload) {
                    this._walletConnectProvider?.updateState(payload.params[0]).then(() => {
                        console.log(this._walletConnectProvider?.accounts)
                        this._state.accounts = this._walletConnectProvider?.accounts || [];
                        this._state.isConnected = this._state.accounts.length > 0;
                        this._updateWalletStorageValue();
                        this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, this._state.accounts);
                    });
                    this._walletConnectProvider?.stop()
                    this._walletConnectProvider?.start()
                }
                this._walletConnectProvider?.emit('connect');
                this._walletConnectProvider?.triggerConnect(wc);
            }
        });
        wc.on('disconnect', (error) => {
            console.log('disconnect', { error });
            if (error) {
                this._walletConnectProvider?.emit('error', error);
                return;
            }
            this._walletConnectProvider?.onDisconnect();
        });

        wc.on('session_update', (error, payload) => {
            if (error) {
                this._walletConnectProvider?.emit('error', error);
                return;
            }
            if (payload) {
                this._walletConnectProvider?.updateState(payload.params[0]);
            }
        });

        this._walletConnectProvider.on('accountsChanged', async (accounts: string[]) => {
            this._state.accounts = accounts;
            if (accounts.length === 0) {
                await this.signOut();
                this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
            } else {
                this.hookRouter.applyHookWithArgs(WALLET_HOOK.ACCOUNT_ON_CHANGE, accounts);
            }
            this._updateWalletStorageValue();
        });

        this._walletConnectProvider.on('chainChanged', async (chainId: number) => {
            const id = ethers.utils.hexValue(chainId);
            this.hookRouter.applyHookWithArgs(WALLET_HOOK.CHAIN_ON_CHANGE, id);
        });
    }
}

export { EthWalletConnect };
