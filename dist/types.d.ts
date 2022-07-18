import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { ethers } from "ethers";
import MyAlgoConnect, { Accounts, AlgorandTxn, SignedTx } from "@randlabs/myalgo-connect";
type MetamaskState = {
    accounts: string[];
    isConnected: boolean;
};
type MetamaskSigner = Signer<TransactionRequest, TransactionResponse>;
type MetamaskAsset = {};
export const useWindow: (cb: (windows: unknown) => Promise<void>) => Promise<void>;
export class NotImplementedError extends Error {
    constructor(message?: string);
}
export class WalletNotInstalledError extends Error {
    constructor(message?: string);
}
export class WalletNotConnectedError extends Error {
    constructor(message?: string);
}
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
    getPrimaryAccount(): string;
    getAccounts(): string[];
    fetchCurrentChainID(): Promise<number>;
    toJSON(): MetamaskState;
    mountEventListeners(callback?: (accounts: string[]) => Promise<unknown>): Promise<void>;
    unmountEventListeners(callback?: () => Promise<unknown>): Promise<void>;
    getProvider(): Promise<ethers.providers.Web3Provider>;
}
export type EthereumState = {
    metaMask?: MetamaskState;
};
export class Ethereum {
    metaMask: Metamask;
    constructor(data?: EthereumState);
}
export type ChainID = 2 | 8;
export enum WALLET_STATUS {
    OK = 0,
    LOGIN_ERROR = 1,
    WALLET_ERROR = 2,
    EXTENSION_NOT_FOUND = 3,
    ACCOUNT_NOT_FOUND = 4
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
    getPrimaryAccount: () => unknown;
    getAccounts: () => unknown[];
    fetchCurrentChainID: () => Promise<number>;
    toJSON: () => T;
}
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
export class MyAlgo implements WalletInterface<MyAlgoState> {
    state: MyAlgoState;
    constructor(state?: MyAlgoState);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<MyAlgoSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<MyAlgoAsset[]>;
    getIsConnected(): boolean;
    getPrimaryAccount(): string;
    getAccounts(): unknown[];
    fetchCurrentChainID(): Promise<number>;
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
export type WalletID = keyof typeof WALLETS;
export type WalletState = {
    id: WalletID;
    state: {
        [key: string]: unknown;
    };
    previousStates: {
        [key: string]: unknown;
    }[];
};
export type WalletStoreConfig = {
    previousWalletState?: WalletState[];
};
export class WalletStore implements useWallets {
    constructor(config: WalletStoreConfig);
    use(walletName: WalletID): any;
    toJSON(): WalletState[];
}

//# sourceMappingURL=types.d.ts.map
