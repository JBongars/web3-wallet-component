import { MyAlgo } from "./algorand";
import { MetaMask } from "./ethereum";

enum WALLET_STATUS {
  OK,
  LOGIN_ERROR,
  WALLET_ERROR,
  EXTENSION_NOT_FOUND,
  ACCOUNT_NOT_FOUND
}

const WALLETS = {
  MYALGO: "MYALGO",
  METAMASK: "METAMASK",
} as const;

interface useWallets {
  use(walletName: "MYALGO"): MyAlgo;
  use(walletName: "METAMASK"): MetaMask;
}

class NotImplementedError extends Error { }

type Signer = (
  transactions: any
) => Promise<{ signedTransaction: any; status: WALLET_STATUS }>;


interface WalletInterface<T> {
  init: () => Promise<WALLET_STATUS>;
  signIn: () => Promise<WALLET_STATUS>;
  signOut: () => Promise<WALLET_STATUS>;
  getSigner: Signer;
  getBalance: () => Promise<number>;
  getAssets: () => Promise<unknown[]>;
  toJSON: () => T;
}

export { WALLETS, NotImplementedError, WalletInterface, WALLET_STATUS };
export type { Signer, useWallets };
