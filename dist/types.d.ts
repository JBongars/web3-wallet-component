import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import MyAlgoConnect, { Accounts as _Accounts1, SignedTx, AlgorandTxn, EncodedTransaction } from "@randlabs/myalgo-connect";
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
    onAccountChange(cb: (accounts: string[]) => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
    onChainChange(cb: (chain: string) => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
    onAccountDisconnect(cb: () => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
    onChainDisconnect(cb: () => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
    onBlockAdded(cb: (newBlock: number) => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
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
    onAccountChange(cb: (accounts: string[]) => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
    onChainChange(cb: (chain: string) => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
    onAccountDisconnect(cb: () => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
    onChainDisconnect(cb: () => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
    onBlockAdded(cb: (newBlock: number) => void | Promise<void>): import("~/src/utils/HookRouter/types").HookEvent;
    toJSON(): WalletConnectState;
    mountEventListeners(): Promise<void>;
    unmountEventListeners(): Promise<void>;
    getProvider(): Promise<ethers.providers.Web3Provider>;
}
export type EthereumWallet = Metamask | EthWalletConnect;
export type EthereumSigner = MetamaskSigner;
export type EthereumState = {
    metaMask?: MetamaskState;
    walletConnect?: WalletConnectState;
};
export class Ethereum {
    metaMask: Metamask;
    walletConnect: EthWalletConnect;
    constructor(data?: EthereumState);
}
export const CHAIN_ETHEREUM = "ETHEREUM";
type MyAlgoState = {
    accounts: _Accounts1[];
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
type Accounts = {
    address: string;
    name: string;
};
export type WalletConnectTransaction = Uint8Array[];
export class WalletConnect implements WalletInterface<_WalletConnectState1> {
    state: _WalletConnectState1;
    constructor(state?: _WalletConnectState1);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<WalletConnectSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<_WalletConnectAsset1[]>;
    getIsWalletInstalled(): boolean;
    getIsConnected(): boolean;
    getPrimaryAccount(): Accounts;
    getAccounts(): Accounts[];
    fetchCurrentChainID(): Promise<string>;
    onAccountChange(cb: (accounts: Accounts) => void | Promise<void>): HookEvent;
    onChainChange(cb: (chain: string) => void | Promise<void>): HookEvent;
    onBlockAdded(cb: (newBlock: unknown) => void | Promise<void>): HookEvent;
    toJSON(): _WalletConnectState1;
    getProvider(): WalletConnectClient;
}
export type AlgorandWallet = MyAlgo | WalletConnect;
export type AlgorandSignerTxn = MyAlgoTransaction | WalletConnectTransaction;
export type AlgorandSigner = MyAlgoSigner | WalletConnectSigner;
export type AlgorandState = {
    myAlgo?: MyAlgoState;
    walletConnect?: _WalletConnectState1;
};
export class Algorand {
    myAlgo: MyAlgo;
    walletConnect: WalletConnect;
    constructor(data?: AlgorandState);
}
export type MyAlgoConfig = {
    shouldSelectOneAccount?: boolean;
};
export type MyAlgoTransaction = AlgorandTxn[] | EncodedTransaction[];
export class MyAlgo implements WalletInterface<MyAlgoState> {
    state: MyAlgoState;
    constructor(state?: MyAlgoState);
    init(): Promise<WALLET_STATUS>;
    signIn(options?: MyAlgoConfig): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<MyAlgoSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<MyAlgoAsset[]>;
    getIsWalletInstalled(): boolean;
    getIsConnected(): boolean;
    getPrimaryAccount(): _Accounts1;
    getAccounts(): _Accounts1[];
    fetchCurrentChainID(): Promise<string>;
    onAccountChange(cb: (accounts: _Accounts1) => void | Promise<void>): HookEvent;
    onChainChange(cb: (chain: string) => void | Promise<void>): HookEvent;
    onBlockAdded(cb: (newBlock: unknown) => void | Promise<void>): HookEvent;
    toJSON(): MyAlgoState;
    getProvider(): MyAlgoConnect;
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
    onAccountChange: (cb: (accounts: unknown) => void | Promise<void>) => HookEvent;
    onChainChange: (cb: (chainId: string) => void | Promise<void>) => HookEvent;
    onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => HookEvent;
    toJSON: () => T;
}

//# sourceMappingURL=types.d.ts.map
