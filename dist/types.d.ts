import { ethers } from "ethers";
import MyAlgoConnect, { Accounts } from "@randlabs/myalgo-connect";
type State = {
    accounts: string[];
    isConnected: Boolean;
};
type Asset = {};
export const useWindow: (cb: (windows: Window) => Promise<unknown>) => Promise<unknown>;
export class MetaMask implements WalletInterface<State> {
    state: State;
    provider?: ethers.providers.Web3Provider;
    constructor(state?: State);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<Signer>;
    getBalance(): Promise<string>;
    getAssets(): Promise<Asset[]>;
    toJSON(): State;
    mountEventListeners(callback?: (accounts: string[]) => Promise<unknown>): Promise<void>;
    unmountEventListeners(callback?: () => Promise<unknown>): Promise<void>;
    getProvider(): Promise<ethers.providers.Web3Provider>;
}
export type EthereumState = {
    metaMask?: MetaMaskState;
};
export class Ethereum {
    metaMask: MetaMask;
    constructor(data?: EthereumState);
}
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
    use(walletName: "METAMASK"): MetaMask;
}
export class NotImplementedError extends Error {
}
export class WalletNotInstalled extends Error {
}
export type Signer = (transactions: unknown[]) => Promise<{
    signedTransaction: unknown[];
    status: WALLET_STATUS;
}>;
export interface WalletInterface<T> {
    init: () => Promise<WALLET_STATUS>;
    signIn: () => Promise<WALLET_STATUS>;
    signOut: () => Promise<WALLET_STATUS>;
    getSigner: () => Promise<Signer>;
    getBalance: () => Promise<string>;
    getAssets: () => Promise<unknown[]>;
    toJSON: () => T;
}
type _State1 = {
    accounts: Accounts[];
    isConnected: Boolean;
};
type _Asset1 = {
    chainId: String;
    name: String;
    unit_name: String;
    id: String;
    sourceDecimals: Number;
};
export class MyAlgo implements WalletInterface<_State1> {
    state: _State1;
    constructor(state?: _State1);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getBalance(): Promise<string>;
    getAssets(): Promise<_Asset1[]>;
    toJSON(): _State1;
    getSigner(): Promise<Signer>;
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
