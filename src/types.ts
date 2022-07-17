import { MyAlgo } from "./algorand";
import { MetaMask } from "./ethereum";

enum WALLET_STATUS {
  OK,
  LOGIN_ERROR,
  WALLET_ERROR,
  EXTENSION_NOT_FOUND,
  ACCOUNT_NOT_FOUND,
}

const WALLETS = {
  MYALGO: "MYALGO",
  METAMASK: "METAMASK",
} as const;

interface useWallets {
  use(walletName: "MYALGO"): MyAlgo;
  use(walletName: "METAMASK"): MetaMask;
}

class NotImplementedError extends Error {}
class WalletNotInstalled extends Error {}

type Signer = (
  transactions: unknown[]
) => Promise<{ signedTransaction: unknown[]; status: WALLET_STATUS }>;

interface WalletInterface<T> {
  init: () => Promise<WALLET_STATUS>;
  signIn: () => Promise<WALLET_STATUS>;
  signOut: () => Promise<WALLET_STATUS>;
  getSigner: () => Promise<Signer>;
  getBalance: () => Promise<string>;
  getAssets: () => Promise<unknown[]>;
  toJSON: () => T;
}

export {
  WALLETS,
  NotImplementedError,
  WalletInterface,
  WALLET_STATUS,
  WalletNotInstalled,
};
export type { Signer, useWallets };
