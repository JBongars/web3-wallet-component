import MyAlgoConnect, { Accounts, AlgorandTxn, SignedTx } from "@randlabs/myalgo-connect";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
type MyAlgoState = {
    accounts: Accounts[];
    isConnected: boolean;
};
type MyAlgoSigner = Signer<AlgorandTxn, SignedTx>;
type MyAlgoAsset = {
    chainId: String;
    name: String;
    unit_name: String;
    id: String;
    sourceDecimals: Number;
};
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
export class MyAlgo implements WalletInterface<MyAlgoState> {
    state: MyAlgoState;
    constructor(state?: MyAlgoState);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<MyAlgoSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<MyAlgoAsset[]>;
    getIsWalletInstalled(): boolean;
    getIsConnected(): boolean;
    getPrimaryAccount(): Accounts;
    getAccounts(): Accounts[];
    fetchCurrentChainID(): Promise<number>;
    onAccountChange(cb: (accountId: Accounts) => void | Promise<void>): symbol;
    onChainChange(cb: (chain: ChainID) => void | Promise<void>): symbol;
    onBlockAdded(cb: (newBlock: unknown) => void | Promise<void>): void;
    toJSON(): MyAlgoState;
    getProvider(): MyAlgoConnect;
}
export type AlgorandState = {
    myAlgo?: MyAlgoState;
};
export class Algorand {
    myAlgo: MyAlgo;
    constructor(data?: AlgorandState);
}
type MetamaskState = {
    accounts: string[];
    isConnected: boolean;
};
type MetamaskSigner = Signer<TransactionRequest, TransactionResponse>;
type MetamaskAsset = {};
export const useWindow: <T>(cb: (windowObject: unknown) => T) => T | null;
export class Metamask implements WalletInterface<MetamaskState> {
    state: MetamaskState;
    provider?: ethers.providers.Web3Provider;
    constructor(state?: MetamaskState);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<MetamaskSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<MetamaskAsset[]>;
    getIsConnected(): boolean;
    getIsWalletInstalled(): boolean;
    getPrimaryAccount(): string;
    getAccounts(): string[];
    fetchCurrentChainID(): Promise<number>;
    onAccountChange(cb: (accountId: string) => void | Promise<void>): symbol;
    onChainChange(cb: (chain: ChainID) => void | Promise<void>): symbol;
    onBlockAdded(cb: (newBlock: number) => void | Promise<void>): symbol;
    toJSON(): MetamaskState;
    mountEventListeners(): Promise<void>;
    unmountEventListeners(): Promise<void>;
    getProvider(): Promise<ethers.providers.Web3Provider>;
}
export type EthereumState = {
    metaMask?: MetamaskState;
};
export class Ethereum {
    metaMask: Metamask;
    constructor(data?: EthereumState);
}
export type ChainID = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 10001;
export enum WALLET_STATUS {
    OK = 0,
    LOGIN_ERROR = 1,
    WALLET_ERROR = 2,
    EXTENSION_NOT_FOUND = 3,
    ACCOUNT_NOT_FOUND = 4
}
export enum WALLET_HOOK {
    ACCOUNT_ON_CHANGE = 0,
    CHAIN_ON_CHANGE = 1,
    DISCONNECT = 2,
    NEW_BLOCK = 3
}
export const WALLETS: {
    readonly MYALGO: "MYALGO";
    readonly METAMASK: "METAMASK";
};
export interface useWallets {
    use(walletName: "MYALGO"): MyAlgo;
    use(walletName: "METAMASK"): Metamask;
}
export type Signer<T, S> = (transactions: T[]) => Promise<S[]>;
export interface WalletInterface<T> {
    init: () => Promise<WALLET_STATUS>;
    signIn: () => Promise<WALLET_STATUS>;
    signOut: () => Promise<WALLET_STATUS>;
    getSigner: () => Promise<Signer<any, any>>;
    getBalance: () => Promise<string>;
    getAssets: () => Promise<unknown[]>;
    getIsConnected: () => boolean;
    getIsWalletInstalled: () => boolean;
    getPrimaryAccount: () => unknown;
    getAccounts: () => unknown[];
    fetchCurrentChainID: () => Promise<number>;
    onAccountChange: (cb: (accountId: unknown) => void | Promise<void>) => void;
    onChainChange: (cb: (chainId: ChainID) => void | Promise<void>) => void;
    onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => void;
    toJSON: () => T;
}

//# sourceMappingURL=types.d.ts.map
