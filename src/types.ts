// import { MyAlgo, WalletConnect } from "./algorand";
// import { Metamask, EthWalletConnect } from "./ethereum";
import { Algorand, AlgorandWallet, MyAlgo, WalletConnect } from './algorand';
import { Ethereum, EthereumWallet, Metamask } from './ethereum';
import { HookEvent, WALLET_STATUS } from './utils/HookRouter/types';

type Wallet = AlgorandWallet | EthereumWallet;
type ChainWallet = Algorand | Ethereum;

interface useWallets {
    use(walletName: 'MYALGO'): MyAlgo;
    use(walletName: 'METAMASK'): Metamask;
    use(walletName: 'WALLETCONNECT'): WalletConnect;
}

type Signer<T, S> = (transactions: T) => Promise<S[]>;

interface WalletInterface<T> {
    /**
     * initializes the wallet
     * @remarks this requires the wallet to be installed in the browser
     * @remarks wallet init script to be added at a later date
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
     * @remarks custom signers may be available directly from the wallet provider depending on the blockchain
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

interface WalletHookHandlerInterface {
    onAccountChange: (cb: (accounts: unknown) => void | Promise<void>) => HookEvent;
    onAccountDisconnect: (cb: () => void | Promise<void>) => HookEvent;
    onChainChange: (cb: (chainId: string) => void | Promise<void>) => HookEvent;
    onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => HookEvent;
}

interface ChainHookHandlerInterface<WalletType> {
    onAccountChange: (cb: (walletType: WalletType, accounts: unknown) => void | Promise<void>) => HookEvent;
    onAccountDisconnect: (cb: (walletType: WalletType) => void | Promise<void>) => HookEvent;
    onChainChange: (cb: (walletType: WalletType, chainId: string) => void | Promise<void>) => HookEvent;

    // onBlockAdded is a chain and not a wallet specific event
    // so wallet type is not required
    onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => HookEvent;
}

interface ChainWalletInterface<Wallet, WalletType> {
    init: () => Promise<WALLET_STATUS>;
    getAvailableWallets: () => WalletType[];
    getConnectedWallets: () => WalletType[];
    getWallet: (type: WalletType) => Wallet;
    getActiveWallet: () => Wallet;
    updateActiveWallet: (type: WalletType) => Wallet;
}

export { WalletInterface, ChainWalletInterface, WalletHookHandlerInterface, ChainHookHandlerInterface };
export type { Signer, useWallets, Wallet, ChainWallet };
