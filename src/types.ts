// import { MyAlgo, WalletConnect } from "./algorand";
// import { Metamask, EthWalletConnect } from "./ethereum";
import { AlgorandWallet, MyAlgo, WalletConnect } from "./algorand";
import { EthereumWallet, Metamask } from "./ethereum";
import { HookEvent, WALLET_STATUS } from "./utils/HookRouter/types";

type WALLET = AlgorandWallet | EthereumWallet;

interface useWallets {
  use(walletName: "MYALGO"): MyAlgo;
  use(walletName: "METAMASK"): Metamask;
  use(walletName: "WALLETCONNECT"): WalletConnect;
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
  onAccountChange: (
    cb: (accounts: unknown) => void | Promise<void>
  ) => HookEvent;
  onChainChange: (cb: (chainId: string) => void | Promise<void>) => HookEvent;
  onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => HookEvent;
  toJSON: () => T;
}

interface ChainWalletInterface<Wallet, WalletType> {
  init: () => Promise<WALLET_STATUS>;
  getWallet: (type: WalletType) => Wallet;
  getActiveWallet: () => Wallet;
}

export { WALLET, WalletInterface, ChainWalletInterface };
export type { Signer, useWallets };
