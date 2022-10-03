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
