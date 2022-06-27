type State = {
    data1: string;
    data2: string;
};
type Asset = {};
export type MetaMaskState = State;
export class MetaMask implements WalletInterface<State> {
    state: State;
    constructor(state?: State);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<Signer>;
    getBallance(): Promise<number>;
    getAssets(): Promise<Asset[]>;
    toJSON(): State;
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
    EXTENSION_NOT_FOUND = 3
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
export type Signer = (transactions: unknown[]) => Promise<{
    signedTransaction: unknown[];
    status: WALLET_STATUS;
}>;
export interface WalletInterface<T> {
    init: () => Promise<WALLET_STATUS>;
    signIn: () => Promise<WALLET_STATUS>;
    signOut: () => Promise<WALLET_STATUS>;
    getSigner: () => Promise<Signer>;
    getBallance: () => Promise<number>;
    getAssets: () => Promise<unknown[]>;
    toJSON: () => T;
}
type _State1 = {
    data1: string;
    data2: string;
    counter: number;
};
type _Asset1 = {};
export type MyAlgoState = _State1;
export class MyAlgo implements WalletInterface<_State1> {
    state: _State1;
    constructor(state?: _State1);
    test(): string;
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<Signer>;
    getBallance(): Promise<number>;
    getAssets(): Promise<_Asset1[]>;
    toJSON(): _State1;
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
    test(): string;
    use(walletName: WalletID): any;
    toJSON(): WalletState[];
}
export const useWindow: (cb: (windows: Window) => Promise<unknown>) => Promise<unknown>;

//# sourceMappingURL=types.d.ts.map
