enum WALLET_STATUS {
  OK,
  LOGIN_ERROR,
  WALLET_ERROR,
  EXTENSION_NOT_FOUND,
}

class NotImplementedError extends Error {}

type Signer = (
  transactions: unknown[]
) => Promise<{ signedTransaction: unknown[]; status: WALLET_STATUS }>;

interface WalletInterface {
  init: () => Promise<WALLET_STATUS>;
  signIn: () => Promise<WALLET_STATUS>;
  signOut: () => Promise<WALLET_STATUS>;
  getSigner: () => Signer;
  getBallance: () => number | Promise<number>;
  getAssets: () => unknown | Promise<unknown>;
}

export { NotImplementedError, WalletInterface };
export type { WALLET_STATUS, Signer };
