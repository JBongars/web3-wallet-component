import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import MyAlgoConnect, { Accounts as _Accounts3, SignedTx, AlgorandTxn, EncodedTransaction } from "@randlabs/myalgo-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import WalletConnectClient from "@walletconnect/client";
export class NotImplementedError extends Error {
    constructor(message?: string);
}
export class WalletNotInstalledError extends Error {
    constructor(message?: string);
}
export class WalletNotConnectedError extends Error {
    constructor(message?: string);
}
export class HookNotAvailableError extends Error {
    constructor(message?: string);
}
enum WALLET_STATUS {
    OK = 0,
    LOGIN_ERROR = 1,
    WALLET_ERROR = 2,
    EXTENSION_NOT_FOUND = 3,
    ACCOUNT_NOT_FOUND = 4
}
type HookEvent = {
    destroy: () => void;
    id: Symbol;
};
export const useWindow: <T>(cb: (windowObject: unknown) => T) => T | null;
export enum WALLET_TYPE {
    ETHEREUM_METAMASK = 0,
    ETHEREUM_WALLETCONNECT = 1,
    ALGORAND_MYALGO = 2,
    ALGORAND_WALLETCONNECT = 3,
    ALGORAND_PERAWALLET = 4
}
type MetamaskState = {
    accounts: string[];
    isConnected: boolean;
};
type MetamaskSigner = ethers.providers.JsonRpcSigner;
type MetamaskAsset = {};
type MetamaskChainConfig = {
    chainName: string;
    chainId: string;
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};
export class Metamask implements WalletInterface<MetamaskState> {
    state: MetamaskState;
    provider?: ethers.providers.Web3Provider;
    name: string;
    type: EthereumWalletType;
    constructor(state?: MetamaskState);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<ethers.providers.JsonRpcSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<MetamaskAsset[]>;
    getIsConnected(): boolean;
    getIsWalletInstalled(): boolean;
    getPrimaryAccount(): string;
    getAccounts(): string[];
    fetchCurrentChainID(): Promise<string>;
    addChainToWallet(chainConfig: MetamaskChainConfig): Promise<void>;
    switchChainFromWallet(chain: number): Promise<void>;
    forceCurrentChainID(chain: number): Promise<void>;
    onAccountChange: (cb: (accounts: string[]) => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onChainChange: (cb: (chain: string) => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onAccountDisconnect: (cb: () => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onChainDisconnect: (cb: () => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onBlockAdded: (cb: (newBlock: number) => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    toJSON(): MetamaskState;
    mountEventListeners(): Promise<void>;
    unmountEventListeners(): Promise<void>;
    getProvider(): Promise<ethers.providers.Web3Provider>;
}
type WalletConnectState = {
    accounts: string[];
    isConnected: boolean;
};
type WalletConnectAsset = {};
type WalletConnectChainConfig = {
    chainName: string;
    chainId: string;
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};
export class EthWalletConnect implements WalletInterface<WalletConnectState> {
    state: WalletConnectState;
    provider?: ethers.providers.Web3Provider;
    type: EthereumWalletType;
    name: string;
    constructor(state?: WalletConnectState);
    getWCProvider(): Promise<WalletConnectProvider>;
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<ethers.providers.JsonRpcSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<WalletConnectAsset[]>;
    getIsConnected(): boolean;
    getIsWalletInstalled(): boolean;
    getPrimaryAccount(): string;
    getAccounts(): string[];
    fetchCurrentChainID(): Promise<string>;
    addChainToWallet(chainConfig: WalletConnectChainConfig): Promise<void>;
    switchChainFromWallet(chain: number): Promise<void>;
    forceCurrentChainID(chain: number): Promise<void>;
    onAccountChange: (cb: (accounts: string[]) => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onChainChange: (cb: (chain: string) => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onAccountDisconnect: (cb: () => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onChainDisconnect: (cb: () => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onBlockAdded: (cb: (newBlock: number) => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    toJSON(): WalletConnectState;
    mountEventListeners(): Promise<void>;
    unmountEventListeners(): Promise<void>;
    getProvider(): Promise<ethers.providers.Web3Provider>;
}
export type EthereumWallet = Metamask | EthWalletConnect;
export type EthereumWalletType = WALLET_TYPE.ETHEREUM_METAMASK | WALLET_TYPE.ETHEREUM_WALLETCONNECT;
export type EthereumSigner = MetamaskSigner;
export type EthereumState = {
    metaMask?: MetamaskState;
    walletConnect?: WalletConnectState;
    activeWallets: EthereumWalletType[];
};
export class Ethereum implements WalletInterface<unknown>, ChainWalletInterface<EthereumWallet, EthereumWalletType> {
    constructor(data?: EthereumState, defaultWallet?: EthereumWalletType);
    init(): Promise<WALLET_STATUS>;
    getWallet(type: EthereumWalletType): EthereumWallet;
    getActiveWallet(): EthereumWallet;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<unknown>;
    getBalance(): Promise<string>;
    getAssets(): Promise<unknown[]>;
    getIsConnected(): boolean;
    getIsWalletInstalled(): boolean;
    getPrimaryAccount(): string;
    getAccounts(): string[];
    fetchCurrentChainID(): Promise<string>;
    mountEventListeners(): Promise<void>;
    onAccountDisconnect: (cb: () => void | Promise<void>) => HookEvent;
    onAccountChange: (cb: (accounts: unknown) => void | Promise<void>) => HookEvent;
    onChainChange: (cb: (chainId: string) => void | Promise<void>) => HookEvent;
    onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => HookEvent;
    toJSON(): unknown;
}
export const CHAIN_ETHEREUM = "ETHEREUM";
type MyAlgoState = {
    accounts: _Accounts3[];
    isConnected: boolean;
};
type MyAlgoSigner = Signer<AlgorandSignerTxn, SignedTx>;
type MyAlgoAsset = {
    chainId: String;
    name: String;
    unit_name: String;
    id: String;
    sourceDecimals: Number;
};
type Accounts = {
    address: string;
    name: string;
};
type PeraWalletState = {
    accounts: Accounts[];
    isConnected: boolean;
};
type PeraWalletSigner = Signer<AlgorandSignerTxn, SignedTx>;
type PeraWalletAsset = {
    chainId: String;
    name: String;
    unit_name: String;
    id: String;
    sourceDecimals: Number;
};
type _Accounts1 = {
    address: string;
    name: string;
};
export type PeraWalletTransaction = Uint8Array[];
export class PeraWallet implements WalletInterface<PeraWalletState> {
    state: PeraWalletState;
    type: AlgorandWalletType;
    name: string;
    constructor(state?: PeraWalletState);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<PeraWalletSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<PeraWalletAsset[]>;
    getIsWalletInstalled(): boolean;
    getIsConnected(): boolean;
    getPrimaryAccount(): _Accounts1;
    getAccounts(): _Accounts1[];
    fetchCurrentChainID(): Promise<string>;
    mountEventListeners(): Promise<void>;
    onAccountChange: (cb: (accounts: _Accounts1[]) => void | Promise<void>) => HookEvent;
    onAccountDisconnect: (cb: () => void | Promise<void>) => HookEvent;
    onChainChange: (cb: (chain: string) => void | Promise<void>) => HookEvent;
    onBlockAdded: (cb: (newBlock: unknown) => void | Promise<void>) => HookEvent;
    toJSON(): PeraWalletState;
    getProvider(): PeraWalletConnect;
}
type _WalletConnectState1 = {
    accounts: string[];
    isConnected: boolean;
};
type WalletConnectSigner = Signer<AlgorandSignerTxn, SignedTx>;
type _WalletConnectAsset1 = {
    chainId: String;
    name: String;
    unit_name: String;
    id: String;
    sourceDecimals: Number;
};
type _Accounts2 = {
    address: string;
    name: string;
};
export type WalletConnectTransaction = Uint8Array[];
export class WalletConnect implements WalletInterface<_WalletConnectState1> {
    state: _WalletConnectState1;
    type: AlgorandWalletType;
    name: string;
    constructor(state?: _WalletConnectState1);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<WalletConnectSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<_WalletConnectAsset1[]>;
    getIsWalletInstalled(): boolean;
    getIsConnected(): boolean;
    getPrimaryAccount(): _Accounts2;
    getAccounts(): _Accounts2[];
    fetchCurrentChainID(): Promise<string>;
    mountEventListeners(): Promise<void>;
    onAccountChange: (cb: (accounts: _Accounts2[]) => void | Promise<void>) => HookEvent;
    onAccountDisconnect: (cb: () => void | Promise<void>) => HookEvent;
    onChainChange: (cb: (chain: string) => void | Promise<void>) => HookEvent;
    onBlockAdded: (cb: (newBlock: unknown) => void | Promise<void>) => HookEvent;
    toJSON(): _WalletConnectState1;
    getProvider(): WalletConnectClient;
}
export type AlgorandWallet = MyAlgo | WalletConnect | PeraWallet;
export type AlgorandWalletType = WALLET_TYPE.ALGORAND_MYALGO | WALLET_TYPE.ALGORAND_PERAWALLET | WALLET_TYPE.ALGORAND_WALLETCONNECT;
export type AlgorandSignerTxn = MyAlgoTransaction | WalletConnectTransaction | PeraWalletTransaction;
export type AlgorandSigner = MyAlgoSigner | WalletConnectSigner | PeraWalletSigner;
export type AlgorandState = {
    myAlgo?: MyAlgoState;
    walletConnect?: _WalletConnectState1;
    peraWallet?: PeraWalletState;
};
export class Algorand implements WalletInterface<unknown>, ChainWalletInterface<AlgorandWallet, AlgorandWalletType> {
    _myAlgo: MyAlgo;
    _walletConnect: WalletConnect;
    _peraWallet: PeraWallet;
    constructor(data?: AlgorandState, defaultWallet?: AlgorandWalletType);
    init(): Promise<WALLET_STATUS>;
    getWallet(type: AlgorandWalletType): AlgorandWallet;
    getActiveWallet(): AlgorandWallet;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<unknown>;
    getBalance(): Promise<string>;
    getAssets(): Promise<unknown[]>;
    getIsConnected(): boolean;
    getIsWalletInstalled(): boolean;
    getPrimaryAccount(): _Accounts3;
    getAccounts(): _Accounts3[];
    fetchCurrentChainID(): Promise<string>;
    mountEventListeners(): Promise<void>;
    onAccountChange(cb: (accounts: unknown) => void | Promise<void>): HookEvent;
    onChainChange(cb: (chainId: string) => void | Promise<void>): HookEvent;
    onAccountDisconnect: (cb: () => void | Promise<void>) => HookEvent;
    onBlockAdded(cb: (block: unknown) => void | Promise<void>): HookEvent;
    toJSON(): unknown;
}
export type MyAlgoConfig = {
    shouldSelectOneAccount?: boolean;
};
export type MyAlgoTransaction = AlgorandTxn[] | EncodedTransaction[];
export class MyAlgo implements WalletInterface<MyAlgoState> {
    state: MyAlgoState;
    currentActiveAccountAddress: string;
    type: AlgorandWalletType;
    name: string;
    constructor(state?: MyAlgoState);
    init(): Promise<WALLET_STATUS>;
    getProvider(): MyAlgoConnect;
    switchAccount(address: string): void;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<MyAlgoSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<MyAlgoAsset[]>;
    getIsWalletInstalled(): boolean;
    getIsConnected(): boolean;
    getPrimaryAccount(): _Accounts3;
    getAccounts(): _Accounts3[];
    fetchCurrentChainID(): Promise<string>;
    mountEventListeners(): Promise<void>;
    onAccountChange: (cb: (accounts: _Accounts3[]) => void | Promise<void>) => HookEvent;
    onAccountDisconnect: (cb: () => void | Promise<void>) => HookEvent;
    onChainChange: (cb: (chain: string) => void | Promise<void>) => HookEvent;
    onBlockAdded: (cb: (newBlock: unknown) => void | Promise<void>) => HookEvent;
    toJSON(): MyAlgoState;
}
export const CHAIN_ALGORAND = "ALGORAND";
export type WALLET = AlgorandWallet | EthereumWallet;
export interface useWallets {
    use(walletName: "MYALGO"): MyAlgo;
    use(walletName: "METAMASK"): Metamask;
    use(walletName: "WALLETCONNECT"): WalletConnect;
}
export type Signer<T, S> = (transactions: T) => Promise<S[]>;
export interface WalletInterface<T> {
    init: () => Promise<WALLET_STATUS>;
    signIn: () => Promise<WALLET_STATUS>;
    signOut: () => Promise<WALLET_STATUS>;
    getSigner: () => Promise<unknown>;
    getBalance: () => Promise<string>;
    getAssets: () => Promise<unknown[]>;
    getIsConnected: () => boolean;
    getIsWalletInstalled: () => boolean;
    getPrimaryAccount: () => unknown;
    getAccounts: () => unknown[];
    fetchCurrentChainID: () => Promise<string>;
    mountEventListeners: () => Promise<void>;
    onAccountChange: (cb: (accounts: unknown) => void | Promise<void>) => HookEvent;
    onAccountDisconnect: (cb: () => void | Promise<void>) => HookEvent;
    onChainChange: (cb: (chainId: string) => void | Promise<void>) => HookEvent;
    onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => HookEvent;
    toJSON: () => T;
}
export interface ChainWalletInterface<Wallet, WalletType> {
    init: () => Promise<WALLET_STATUS>;
    getWallet: (type: WalletType) => Wallet;
    getActiveWallet: () => Wallet;
}

//# sourceMappingURL=types.d.ts.map
