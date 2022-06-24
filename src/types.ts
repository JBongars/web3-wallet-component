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

interface WalletInterface<T> {
  init: () => Promise<WALLET_STATUS>;
  signIn: () => Promise<WALLET_STATUS>;
  signOut: () => Promise<WALLET_STATUS>;
  getSigner: () => Promise<Signer>;
  getBallance: () => Promise<number>;
  getAssets: () => Promise<unknown[]>;
  toJSON: () => T;
}

export { NotImplementedError, WalletInterface };
export type { WALLET_STATUS, Signer };
