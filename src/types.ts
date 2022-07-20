import { MyAlgo } from "./algorand";
import { Metamask } from "./ethereum";

type ChainID = 2 | 8;

enum WALLET_STATUS {
  OK,
  LOGIN_ERROR,
  WALLET_ERROR,
  EXTENSION_NOT_FOUND,
  ACCOUNT_NOT_FOUND,
}

enum WALLET_HOOK {
  ACCOUNT_ON_CHANGE,
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
  getPrimaryAccount: () => unknown;
  getAccounts: () => unknown[];
  fetchCurrentChainID: () => Promise<number>;
  onAccountChange: (cb: (accountId: unknown) => void | Promise<void>) => void;
  toJSON: () => T;
}

export { WALLETS, WalletInterface, WALLET_STATUS, WALLET_HOOK };
export type { ChainID, Signer, useWallets };
