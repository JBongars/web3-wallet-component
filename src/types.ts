import { MyAlgo } from "./algorand";
import { Metamask } from "./ethereum";
import { HookEvent, WALLET_STATUS } from "./utils/HookRouter/types";

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
  fetchCurrentChainID: () => Promise<string>;
  onAccountChange: (
    cb: (accounts: unknown) => void | Promise<void>
  ) => HookEvent;
  onChainChange: (cb: (chainId: string) => void | Promise<void>) => HookEvent;
  onBlockAdded: (cb: (block: unknown) => void | Promise<void>) => HookEvent;
  toJSON: () => T;
}

export { WALLETS, WalletInterface };
export type { ChainID, Signer, useWallets };
