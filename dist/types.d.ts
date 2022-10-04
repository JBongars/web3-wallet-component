import { ethers } from "ethers";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import MyAlgoConnect, { SignedTx, Accounts as _Accounts3, AlgorandTxn, EncodedTransaction } from "@randlabs/myalgo-connect";
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
/**
 * Wallet statuses
 */
enum WALLET_STATUS {
    /**
     * Wallet is OK
     */
    OK = 0,
    /**
     * There was a problem logging in
     * @remarks user may have cancelled the transaction
     */
    LOGIN_ERROR = 1,
    /**
     * There was a problem initializing the wallet
     */
    WALLET_ERROR = 2,
    /**
     * There was a problem initializing the  wallet because the extension was not found
     */
    EXTENSION_NOT_FOUND = 3,
    /**
     * The Wallet account was not found
     */
    ACCOUNT_NOT_FOUND = 4
}
/**
 * Identifier for Wallet
 * @remarks example Metamask, WalletConnect, etc...
 */
enum WALLET_ID {
    ETHEREUM_METAMASK = 1,
    ALGORAND_MYALGO = 2,
    ALGORAND_WALLETCONNECT = 3,
    ETHEREUM_WALLETCONNECT = 4,
    ALGORAND_PERAWALLET = 5
}
type HookEvent = {
    destroy: () => void;
    id: symbol;
};
export const useWindow: <T>(cb: (windowObject: unknown) => T) => T | null;
export enum WALLET_TYPE {
    ETHEREUM_METAMASK = 0,
    ETHEREUM_WALLETCONNECT = 1,
    ALGORAND_MYALGO = 2,
    ALGORAND_WALLETCONNECT = 3,
    ALGORAND_PERAWALLET = 4
}
export enum CHAIN_TYPE {
    ALGORAND = 0,
    ETHEREUM = 1
}
/**
 * State for Metamask Wallet
 */
export type MetamaskState = {
    accounts: string[];
    isConnected: boolean;
};
/**
 * Signer for Metamask Wallet
 */
export type MetamaskSigner = ethers.providers.JsonRpcSigner;
/**
 * Metamask Assets
 */
export type MetamaskAsset = {};
/**
 * Config for Metamask initialization
 */
export type MetamaskChainConfig = {
    chainName: string;
    chainId: string;
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};
export class Metamask implements WalletInterface<MetamaskState>, WalletHookHandlerInterface {
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
    /**
     * Mounts ethereum based event hooks to the hook router
     * @see https://eips.ethereum.org/EIPS/eip-1193#references for list of ethereum hooks
     */
    mountEventListeners(): Promise<void>;
    unmountEventListeners(): Promise<void>;
    getProvider(): Promise<ethers.providers.Web3Provider>;
}
/**
 * State for EthereumWalletConnect Wallet
 */
export type EthereumWalletConnectState = {
    accounts: string[];
    isConnected: boolean;
};
/**
 * Signer for EthereumWalletConnect Wallet
 */
export type EthereumWalletConnectSigner = Signer<TransactionRequest, TransactionResponse>;
/**
 * EthereumWalletConnect Assets
 */
export type EthereumWalletConnectAsset = {};
/**
 * Config for EthereumWalletConnect initialization
 */
export type EthereumWalletConnectChainConfig = {
    chainName: string;
    chainId: string;
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};
export class EthWalletConnect implements WalletInterface<EthereumWalletConnectState>, WalletHookHandlerInterface {
    state: EthereumWalletConnectState;
    provider?: ethers.providers.Web3Provider;
    type: EthereumWalletType;
    name: string;
    constructor(state?: EthereumWalletConnectState);
    getWCProvider(): Promise<WalletConnectProvider>;
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<ethers.providers.JsonRpcSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<EthereumWalletConnectAsset[]>;
    getIsConnected(): boolean;
    getIsWalletInstalled(): boolean;
    getPrimaryAccount(): string;
    getAccounts(): string[];
    fetchCurrentChainID(): Promise<string>;
    addChainToWallet(chainConfig: EthereumWalletConnectChainConfig): Promise<void>;
    switchChainFromWallet(chain: number): Promise<void>;
    forceCurrentChainID(chain: number): Promise<void>;
    onAccountChange: (cb: (accounts: string[]) => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onChainChange: (cb: (chain: string) => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onAccountDisconnect: (cb: () => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onChainDisconnect: (cb: () => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    onBlockAdded: (cb: (newBlock: number) => void | Promise<void>) => import("~/src/utils/HookRouter/types").HookEvent;
    toJSON(): EthereumWalletConnectState;
    mountEventListeners(): Promise<void>;
    unmountEventListeners(): Promise<void>;
    getProvider(): Promise<ethers.providers.Web3Provider>;
}
export type EthereumWallet = Metamask | EthWalletConnect;
export type EthereumWalletType = WALLET_TYPE.ETHEREUM_METAMASK | WALLET_TYPE.ETHEREUM_WALLETCONNECT;
export type EthereumSigner = MetamaskSigner;
export type EthereumState = {
    metaMask?: MetamaskState;
    walletConnect?: EthereumWalletConnectState;
    activeWallets: EthereumWalletType[];
};
export type EthereumConfig = {
    hookType: 'all' | 'active' | 'disable';
    defaultWallet: EthereumWalletType;
};
export const defaultEthereumConfig: EthereumConfig;
export class Ethereum implements WalletInterface<unknown>, ChainHookHandlerInterface<EthereumWalletType>, ChainWalletInterface<EthereumWallet, EthereumWalletType> {
    type: CHAIN_TYPE;
    name: string;
    constructor(config: Partial<EthereumConfig>, data?: EthereumState);
    init(): Promise<WALLET_STATUS>;
    getWallet(type: EthereumWalletType): EthereumWallet;
    getAvailableWallets(): EthereumWalletType[];
    getConnectedWallets(): EthereumWalletType[];
    getActiveWallet(): EthereumWallet;
    updateActiveWallet(type: EthereumWalletType): EthereumWallet;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<EthereumSigner>;
    getBalance(): Promise<string>;
    getProvider(): Promise<ethers.providers.Web3Provider>;
    getIsConnected(): boolean;
    getIsWalletInstalled(): boolean;
    getPrimaryAccount(): string;
    getAccounts(): string[];
    fetchCurrentChainID(): Promise<string>;
    mountEventListeners(): Promise<void>;
    onAccountChange: (cb: (walletType: EthereumWalletType, accounts: string[]) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    onChainChange: (cb: (walletType: EthereumWalletType, chain: string) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    onAccountDisconnect: (cb: (walletType: EthereumWalletType) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    onBlockAdded: (cb: (newBlock: number) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    toJSON(): unknown;
}
export const CHAIN_ETHEREUM = "ETHEREUM";
/**
 * Schema for Storage
 */
export type StorageValue = {
    isConnected: boolean;
    connectedAccount: string;
    chain: string;
    walletId: WALLET_ID;
    accounts: string[];
};
/**
 * Account information. This object is returned when fetching the primary account
 */
type Accounts = {
    address: string;
    name: string;
};
/**
 * State for Pera Wallet
 */
export type PeraWalletState = {
    accounts: Accounts[];
    isConnected: boolean;
};
/**
 * Signer for Pera Wallet
 */
export type PeraWalletSigner = Signer<AlgorandSignerTxn, SignedTx>;
/**
 * Pera Assets
 */
export type PeraWalletAsset = {
    chainId: string;
    name: string;
    unit_name: string;
    id: string;
    sourceDecimals: number;
};
type _Accounts1 = {
    address: string;
    name: string;
};
export type PeraWalletTransaction = Uint8Array[];
export class PeraWallet implements WalletInterface<PeraWalletState>, WalletHookHandlerInterface {
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
export type AlgorandWalletConnectState = {
    accounts: string[];
    isConnected: boolean;
};
export type AlgorandWalletConnectSigner = Signer<AlgorandSignerTxn, SignedTx>;
export type AlgorandWalletConnectTransaction = Uint8Array[];
export type AlgorandWalletConnectAsset = {
    chainId: string;
    name: string;
    unit_name: string;
    id: string;
    sourceDecimals: number;
};
type _Accounts2 = {
    address: string;
    name: string;
};
export class WalletConnect implements WalletInterface<AlgorandWalletConnectState>, WalletHookHandlerInterface {
    state: AlgorandWalletConnectState;
    type: AlgorandWalletType;
    name: string;
    constructor(state?: AlgorandWalletConnectState);
    init(): Promise<WALLET_STATUS>;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<AlgorandWalletConnectSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<AlgorandWalletConnectAsset[]>;
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
    toJSON(): AlgorandWalletConnectState;
    getProvider(): WalletConnectClient;
}
export type AlgorandWallet = MyAlgo | WalletConnect | PeraWallet;
export type AlgorandWalletType = WALLET_TYPE.ALGORAND_MYALGO | WALLET_TYPE.ALGORAND_PERAWALLET | WALLET_TYPE.ALGORAND_WALLETCONNECT;
export type AlgorandSignerTxn = MyAlgoTransaction | AlgorandWalletConnectTransaction | PeraWalletTransaction;
export type AlgorandSigner = MyAlgoSigner | WalletConnect | PeraWalletSigner;
export type AlgorandState = {
    myAlgo?: MyAlgoState;
    walletConnect?: AlgorandWalletConnectState;
    peraWallet?: PeraWalletState;
};
export type AlgorandConfig = {
    hookType: 'all' | 'active' | 'disable';
    defaultWallet: AlgorandWalletType;
};
/**
 * State for Myalgo Wallet
 */
export type MyAlgoState = {
    accounts: _Accounts3[];
    isConnected: boolean;
};
/**
 * Signer for Myalgo Wallet
 */
export type MyAlgoSigner = Signer<AlgorandSignerTxn, SignedTx>;
/**
 * Myalgo Assets
 */
export type MyAlgoAsset = {
    chainId: string;
    name: string;
    unit_name: string;
    id: string;
    sourceDecimals: number;
};
export type MyAlgoConfig = {
    shouldSelectOneAccount?: boolean;
};
export type MyAlgoTransaction = AlgorandTxn[] | EncodedTransaction[];
export class MyAlgo implements WalletInterface<MyAlgoState>, WalletHookHandlerInterface {
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
export const defaultAlgorandConfig: AlgorandConfig;
export class Algorand implements WalletInterface<unknown>, ChainWalletInterface<AlgorandWallet, AlgorandWalletType>, ChainHookHandlerInterface<AlgorandWalletType> {
    type: CHAIN_TYPE;
    name: string;
    constructor(config: Partial<AlgorandConfig>, data?: AlgorandState);
    init(): Promise<WALLET_STATUS>;
    getWallet(type: AlgorandWalletType): AlgorandWallet;
    getAvailableWallets(): AlgorandWalletType[];
    getConnectedWallets(): AlgorandWalletType[];
    getActiveWallet(): AlgorandWallet;
    updateActiveWallet(type: AlgorandWalletType): AlgorandWallet;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<AlgorandSigner>;
    getBalance(): Promise<string>;
    getProvider(): unknown;
    getIsConnected(): boolean;
    getIsWalletInstalled(): boolean;
    getPrimaryAccount(): _Accounts3;
    getAccounts(): _Accounts3[];
    fetchCurrentChainID(): Promise<string>;
    mountEventListeners(): Promise<void>;
    onAccountChange: (cb: (walletType: AlgorandWalletType, accounts: _Accounts3[]) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    onChainChange: (cb: (walletType: AlgorandWalletType, chain: string) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    onAccountDisconnect: (cb: (walletType: AlgorandWalletType) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    onBlockAdded: (cb: (newBlock: number) => void | Promise<void>) => never;
    toJSON(): unknown;
}
export const CHAIN_ALGORAND = "ALGORAND";
export type Wallet = AlgorandWallet | EthereumWallet;
export type ChainWallet = Algorand | Ethereum;
export type Signer<T, S> = (transactions: T) => Promise<S[]>;
export interface WalletInterface<T> {
    /**
     * initializes the wallet
     * @remarks this requires the wallet to be installed in the browser
     * wallet init script to be added at a later date
     * @returns wallet status
     */
    init: () => Promise<WALLET_STATUS>;
    /**
     * sign into the wallet and allow wallet-component to use below method
     * @remarks most wallets will prompt a modal when this event is called
     * @returns wallet status
     */
    signIn: () => Promise<WALLET_STATUS>;
    /**
     * sign out of all accounts in a wallet
     * @returns wallet status
     */
    signOut: () => Promise<WALLET_STATUS>;
    /**
     * get the current signer object for a wallet
     * @remarks the signer object is usually a function that will take an unsigned transaction and return a signed transaction
     * custom signers may be available directly from the wallet provider depending on the blockchain
     * @returns signer object
     */
    getSigner: () => Promise<unknown>;
    /**
     * get the current balance of the wallet
     * @returns wallet balance
     */
    getBalance: () => Promise<string>;
    /**
     * check whether the wallet is currently connected
     */
    getIsConnected: () => boolean;
    /**
     * check whether the wallet is currently installed/available in the browser
     */
    getIsWalletInstalled: () => boolean;
    /**
     * @returns the primary account objects/strings
     * @remarks If multiple accounts are connected, this is the last connected account
     */
    getPrimaryAccount: () => unknown;
    /**
     * @returns list of connected accounts objects/strings
     */
    getAccounts: () => unknown[];
    /**
     * @returns which chain id the wallet is currently connected to
     * @remarks for most blockchains this is usually "testnet" or "mainnet" however for some blockchains such as Ethereum, "chain" can refer to "Göerli" or "Rinkerby" as well as "mainnet"
     */
    fetchCurrentChainID: () => Promise<string>;
    /**
     * mount event listeners for the current wallet which enables the wallet component to pick up events such as if the user changes accounts or if a new block has been updated
     * @see WalletHookHandlerInterface
     * @see HookEvent
     * @see HookRouter
     */
    mountEventListeners: () => Promise<void>;
    /**
     * Converts the current internal state to a JSON object
     * @remarks Used to prevent POM error as well as making the state persistent
     * @example @see EthereumState
     */
    toJSON: () => T;
}
/**
 * Implement Wallet hooks for Wallets
 */
export interface WalletHookHandlerInterface {
    /**
     * call hook when account changes. Either an account was removed or an account was added.
     * will return a list accounts to compare the changes.
     * @remarks this hook is also called when the wallet is initialized for the first time
     */
    onAccountChange: (cb: (accounts: unknown) => void | Promise<void>) => HookEvent;
    /**
     * call hook when the user signs out of all accounts either by calling @see signOut or by manually disconnecting from all accounts in their wallet.
     * @remarks is not called when the user signs out of their account assuming there is another account available
     */
    onAccountDisconnect: (cb: () => void | Promise<void>) => HookEvent;
    /**
     * call hook when the user triggers a chain change event. Can use this hook to trigger a @see switchChainFromWallet to force the user to force the chain back to a
     * predefined hook. Also see @see forceCurrentChainID to throw an error if the user attempts to sign a transaction on the wrong chain
     * @remarks only available on certain chains/wallet. @see Metamask
     */
    onChainChange: (cb: (chainId: string) => void | Promise<void>) => HookEvent;
    /**
     * call hook whenever a new block is added to the blockchain
     * @remarks right now only available for @see Ethereum as relies on the ethereum.on events an is not being polled.
     */
    onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => HookEvent;
}
/**
 * Implement Wallet hooks for "Chain Wallets" or a higher level wallet that manages multiple wallets.
 * @remarks since this is a higher level component, the wallet id is pass into every callback that is wallet specific to allow more fine tuning
 */
export interface ChainHookHandlerInterface<WalletType> {
    /**
     * call hook when account changes. Either an account was removed or an account was added.
     * will return a list accounts to compare the changes.
     * @remarks this hook is also called when the wallet is initialized for the first time
     */
    onAccountChange: (cb: (walletType: WalletType, accounts: unknown) => void | Promise<void>) => HookEvent;
    /**
     * call hook when the user signs out of all accounts either by calling @see signOut or by manually disconnecting from all accounts in their wallet.
     * @remarks is not called when the user signs out of their account assuming there is another account available
     */
    onAccountDisconnect: (cb: (walletType: WalletType) => void | Promise<void>) => HookEvent;
    /**
     * call hook when the user triggers a chain change event. Can use this hook to trigger a @see switchChainFromWallet to force the user to force the chain back to a
     * predefined hook. Also see @see forceCurrentChainID to throw an error if the user attempts to sign a transaction on the wrong chain
     * @remarks only available on certain chains/wallet. @see Metamask
     */
    onChainChange: (cb: (walletType: WalletType, chainId: string) => void | Promise<void>) => HookEvent;
    /**
     * call hook whenever a new block is added to the blockchain
     * @remarks right now only available for @see Ethereum as relies on the ethereum.on events an is not being polled.
     * onBlockAdded is a chain and not a wallet specific event so wallet type is not required
     */
    onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => HookEvent;
}
/**
 * Additional methods for Chain Wallets
 * Chain Wallets allow high level control over many wallets
 * @remarks does not include SuperWallet. @see SuperWallet
 */
export interface ChainWalletInterface<Wallet, WalletType> {
    init: () => Promise<WALLET_STATUS>;
    getAvailableWallets: () => WalletType[];
    getConnectedWallets: () => WalletType[];
    getWallet: (type: WalletType) => Wallet;
    getActiveWallet: () => Wallet;
    updateActiveWallet: (type: WalletType) => Wallet;
}
export type SuperWalletType = AlgorandWalletType | EthereumWalletType;
export type SuperWalletSigner = AlgorandSigner | EthereumSigner;
export type SuperWalletState = {
    algorand: AlgorandState;
    ethereum: EthereumState;
};
export type ChainConfig = {
    type: CHAIN_TYPE.ALGORAND;
    config: AlgorandConfig;
    data: Partial<AlgorandState>;
} | {
    type: CHAIN_TYPE.ETHEREUM;
    config: EthereumConfig;
};
export type SuperWalletConfig = {
    defaultChain: CHAIN_TYPE;
    chains: ChainConfig[];
};
/**
 * Super Class
 *
 */
export class SuperWallet implements WalletInterface<unknown> {
    constructor(config: SuperWalletConfig, data?: SuperWalletState);
    init(): Promise<WALLET_STATUS>;
    getChain(type: CHAIN_TYPE): ChainWallet;
    getWallet(chainType: CHAIN_TYPE, walletType: WALLET_TYPE): Wallet;
    getAvailableWalletsOnChain(chainType: CHAIN_TYPE): SuperWalletType[];
    getAvailableWallets(): SuperWalletType[];
    getConnectedWalletsOnChain(chainType: CHAIN_TYPE): SuperWalletType[];
    getConnectedWallets(): SuperWalletType[];
    getActiveChain(): ChainWallet;
    getActiveWalletOnChain(chainType: CHAIN_TYPE): Wallet;
    getActiveWallet(): Wallet;
    updateActiveChain(chainType: CHAIN_TYPE): ChainWallet;
    updateActiveWalletOnChain(chainType: CHAIN_TYPE, walletType: WALLET_TYPE): Wallet;
    signIn(): Promise<WALLET_STATUS>;
    signOut(): Promise<WALLET_STATUS>;
    getSigner(): Promise<SuperWalletSigner>;
    getBalance(): Promise<string>;
    getAssets(): Promise<unknown[]>;
    getProvider(): unknown;
    getIsConnected(): boolean;
    getIsWalletInstalled(): boolean;
    getPrimaryAccount(): unknown;
    getAccounts(): unknown[];
    fetchCurrentChainID(): Promise<string>;
    mountEventListeners(): Promise<void>;
    onAccountChange: (cb: (chainType: CHAIN_TYPE, walletType: Wallet, accounts: _Accounts3[]) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    onChainChange: (cb: (chainType: CHAIN_TYPE, walletType: CHAIN_TYPE, chain: string) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    onAccountDisconnect: (cb: (chainType: CHAIN_TYPE, walletType: CHAIN_TYPE) => void | Promise<void>) => import("~/utils/HookRouter/types").HookEvent;
    onBlockAdded: (cb: (chainType: CHAIN_TYPE, newBlock: number) => void | Promise<void>) => never;
    toJSON(): unknown;
}

//# sourceMappingURL=types.d.ts.map
