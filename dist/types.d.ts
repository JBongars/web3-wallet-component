import { ethers } from "ethers";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import MyAlgoConnect, { SignedTx, Accounts as _Accounts3, AlgorandTxn, EncodedTransaction } from "@randlabs/myalgo-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import WalletConnectClient from "@walletconnect/client";
/**
 * Method or function is not implemented
 */
export class NotImplementedError extends Error {
    constructor(message?: string);
}
/**
 * Wallet method was invoked although wallet was not installed
 */
export class WalletNotInstalledError extends Error {
    constructor(message?: string);
}
/**
 * Wallet method was invoked although wallet was not connected
 */
export class WalletNotConnectedError extends Error {
    constructor(message?: string);
}
/**
 * Hook was registered with an event that is not supported
 */
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
    ALGORAND_PERAWALLET = 5,
    ETHEREUM_COINBASE = 6
}
type HookEvent = {
    destroy: () => void;
    id: symbol;
};
export const useWindow: <T>(cb: (windowObject: unknown) => T) => T | null;
/**
 * Wallet types representing low level wallets
 */
export enum WALLET_TYPE {
    ETHEREUM_METAMASK = 0,
    ETHEREUM_WALLETCONNECT = 1,
    ETHEREUM_COINBASE = 2,
    ALGORAND_MYALGO = 3,
    ALGORAND_WALLETCONNECT = 4,
    ALGORAND_PERAWALLET = 5
}
/**
 * Chain types representing blockchains above @see WALLET_TYPE are associated to
 */
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
export type MetamaskAsset = unknown;
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
export type EthereumWalletConnectAsset = unknown;
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
/**
 * Generic interface for low level wallets
 */
export type EthereumWallet = Metamask | EthWalletConnect;
/**
 * wallet enum to be used as identifier
 */
export type EthereumWalletType = WALLET_TYPE.ETHEREUM_METAMASK | WALLET_TYPE.ETHEREUM_WALLETCONNECT | WALLET_TYPE.ETHEREUM_COINBASE;
/**
 * Signer object passed
 */
export type EthereumSigner = MetamaskSigner;
/**
 * Internal state of the wallet to be passed using the @see toJSON
 */
export type EthereumState = {
    metaMask?: MetamaskState;
    walletConnect?: EthereumWalletConnectState;
    activeWallets: EthereumWalletType[];
};
/**
 * Config used to initialize chain wallet
 */
export type EthereumConfig = {
    hookType: 'all' | 'active' | 'disable';
    defaultWallet: EthereumWalletType;
};
/**
 * Default config
 */
export const defaultEthereumConfig: EthereumConfig;
/***
 * Ethereum Chain Wallet used to manage ethereum wallets and invoke ethereum transactions
 */
export class Ethereum implements WalletInterface<unknown>, ChainHookHandlerInterface<EthereumWalletType>, ChainWalletInterface<EthereumWallet, EthereumWalletType> {
    type: CHAIN_TYPE;
    name: string;
    /**
     * Constructor for Ethereum
     * @param config - Partial Ethereum Config to be overwritten with defaults
     * @param data - Ethereum Data to initialize with
     */
    constructor(config: Partial<EthereumConfig>, data?: EthereumState);
    /**
     * Initializes the chain wallet
     * @returns wallet status
     * @remarks Should be called separately from constructor
     */
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
    onBlockAdded: (_cb: (newBlock: unknown) => void | Promise<void>) => HookEvent;
    toJSON(): PeraWalletState;
    /**
     * DANGER - REFRAIN from using in production as can have some unintended side effect. NOT FULLY SUPPORTED!
     * @param data - New State for wallet
     */
    _dangerouslyUpdateInternalState(data: PeraWalletState): void;
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
    onBlockAdded: (_cb: (newBlock: unknown) => void | Promise<void>) => HookEvent;
    toJSON(): AlgorandWalletConnectState;
    /**
     * DANGER - REFRAIN from using in production as can have some unintended side effect. NOT FULLY SUPPORTED!
     * @param data - New State for wallet
     */
    _dangerouslyUpdateInternalState(data: AlgorandWalletConnectState): void;
    getProvider(): WalletConnectClient;
}
/**
 * Generic interface for low level wallets
 */
export type AlgorandWallet = MyAlgo | WalletConnect | PeraWallet;
/**
 * wallet enum to be used as identifier
 */
export type AlgorandWalletType = WALLET_TYPE.ALGORAND_MYALGO | WALLET_TYPE.ALGORAND_PERAWALLET | WALLET_TYPE.ALGORAND_WALLETCONNECT;
export type AlgorandSignerTxn = MyAlgoTransaction | AlgorandWalletConnectTransaction | PeraWalletTransaction;
/**
 * Signer object passed
 */
export type AlgorandSigner = MyAlgoSigner | AlgorandWalletConnectSigner | PeraWalletSigner;
/**
 * Internal state of the wallet to be passed using the @see toJSON
 */
export type AlgorandState = {
    myAlgo?: MyAlgoState;
    walletConnect?: AlgorandWalletConnectState;
    peraWallet?: PeraWalletState;
};
/**
 * Config used to initialize chain wallet
 */
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
    onBlockAdded: (_cb: (newBlock: unknown) => void | Promise<void>) => HookEvent;
    toJSON(): MyAlgoState;
    /**
     * DANGER - REFRAIN from using in production as can have some unintended side effect. NOT FULLY SUPPORTED!
     * @param data - New State for wallet
     */
    _dangerouslyUpdateInternalState(data: MyAlgoState): void;
}
/**
 * Default config
 */
export const defaultAlgorandConfig: AlgorandConfig;
/***
 * Algorand Chain Wallet used to manage algorand wallets and invoke algorand transactions
 */
export class Algorand implements WalletInterface<unknown>, ChainWalletInterface<AlgorandWallet, AlgorandWalletType>, ChainHookHandlerInterface<AlgorandWalletType> {
    type: CHAIN_TYPE;
    name: string;
    /**
     * Constructor for Algorand
     * @param config - Partial Algorand Config to be overwritten with defaults
     * @param data - Algorand Data to initialize with
     */
    constructor(config: Partial<AlgorandConfig>, data?: AlgorandState);
    /**
     * Initializes the chain wallet
     * @returns wallet status
     * @remarks Should be called separately from constructor
     */
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
    onBlockAdded: (_cb: (newBlock: number) => void | Promise<void>) => never;
    toJSON(): unknown;
}
export const CHAIN_ALGORAND = "ALGORAND";
export type Wallet = AlgorandWallet | EthereumWallet;
export type WALLET = Wallet;
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
/**
 * wallet enum to be used as identifier
 * @remarks superset of all wallet types
 */
export type SuperWalletType = AlgorandWalletType | EthereumWalletType;
/**
 * Signer object passed
 */
export type SuperWalletSigner = AlgorandSigner | EthereumSigner;
/**
 * Internal state of the wallet to be passed using the @see toJSON
 * Superset of all wallet states
 */
export type SuperWalletState = {
    algorand: AlgorandState;
    ethereum: EthereumState;
};
/**
 * Chain Config represents the config/data to initialize all wallets
 * @remarks Superset of all wallet states
 */
export type ChainConfig = {
    type: CHAIN_TYPE.ALGORAND;
    config?: Partial<AlgorandConfig>;
    data?: Partial<AlgorandState>;
} | {
    type: CHAIN_TYPE.ETHEREUM;
    config?: Partial<EthereumConfig>;
    data?: Partial<EthereumState>;
};
/**
 * Config to initialize Super Wallet. Contains list of @see ChainConfig to initialize all wallets
 */
export type SuperWalletConfig = {
    defaultChain: CHAIN_TYPE;
    chains: ChainConfig[];
};
/**
 * Super Wallet Class. One Wallet to rule them all
 * Manages Chain + Wallet and allows you to seamlessly switch between using one interface
 */
export class SuperWallet implements WalletInterface<unknown> {
    constructor(config: SuperWalletConfig, data?: SuperWalletState);
    /**
     * Initializes the chain wallet
     * @returns wallet status
     * @remarks Should be called separately from constructor
     */
    init(): Promise<WALLET_STATUS>;
    /**
     * Get Chain
     * @param type - chain type
     * @returns chain interface
     */
    getChain(type: CHAIN_TYPE): ChainWallet;
    /**
     * Get wallet from chain
     * @param chainType - chain type
     * @param walletType - wallet type
     * @returns specific wallet
     */
    getWallet(chainType: CHAIN_TYPE, walletType: WALLET_TYPE): Wallet;
    /**
     * Get all available wallet from chain
     * @param chainType - chain type
     * @returns all available wallets on chain
     */
    getAvailableWalletsOnChain(chainType: CHAIN_TYPE): SuperWalletType[];
    /**
     * Get all available wallet
     * @returns all available wallets on any chain
     */
    getAvailableWallets(): SuperWalletType[];
    /**
     * Get all connected wallet from chain
     * @param chainType - chain type
     * @returns all connected wallets on chain
     */
    getConnectedWalletsOnChain(chainType: CHAIN_TYPE): SuperWalletType[];
    /**
     * Get all available wallet
     * @returns all connected wallets on any chain
     */
    getConnectedWallets(): SuperWalletType[];
    /**
     * Get active wallet from chain
     * @param chainType - chain type
     * @returns active wallet on chain
     */
    getActiveChain(): ChainWallet;
    /**
     * Get all active wallets on any chain
     * @returns all active wallets on any chain
     */
    getActiveWalletOnChain(chainType: CHAIN_TYPE): Wallet;
    /**
     * Get the last used wallet on the last used chain
     * @returns the last used wallet on the last used chain
     */
    getActiveWallet(): Wallet;
    /**
     * Update the active chain with chain
     * @param chainType - chain to become active
     * @returns the chain wallet
     */
    updateActiveChain(chainType: CHAIN_TYPE): ChainWallet;
    /**
     * Update the active wallet on chain
     * @param chainType - chain to select wallet
     * @param walletType - wallet to become active on chain
     * @returns the active wallet
     */
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
    onBlockAdded: (_cb: (chainType: CHAIN_TYPE, newBlock: number) => void | Promise<void>) => never;
    toJSON(): unknown;
}

//# sourceMappingURL=types.d.ts.map
