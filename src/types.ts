import { MyAlgo } from "./algorand";
import { Metamask } from "./ethereum";

declare type ChainID =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 10001;

enum WALLET_STATUS {
  OK,
  LOGIN_ERROR,
  WALLET_ERROR,
  EXTENSION_NOT_FOUND,
  ACCOUNT_NOT_FOUND,
}

enum WALLET_HOOK {
  ACCOUNT_ON_CHANGE,
  CHAIN_ON_CHANGE,
  DISCONNECT,
  NEW_BLOCK,
}

const WALLETS = {
  MYALGO: "MYALGO",
  METAMASK: "METAMASK",
} as const;

interface useWallets {
  use(walletName: "MYALGO"): MyAlgo;
  use(walletName: "METAMASK"): Metamask;
}

type Signer<T, S> = (transactions: T[]) => Promise<S[]>;

interface WalletInterface<T> {
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

export { WALLETS, WalletInterface, WALLET_STATUS, WALLET_HOOK };
export type { ChainID, Signer, useWallets };
