import { Algorand, AlgorandState } from "./algorand";
import { Ethereum, EthereumState } from "./ethereum";
import {
  NotImplementedError,
  Signer,
  WalletInterface,
  WALLET_STATUS,
} from "./types";

type WalletStoreState = {
  algorand?: AlgorandState;
  ethereum?: EthereumState;
};

class WalletStore {
  public algorand: Algorand;
  public ethereum: Ethereum;

  constructor(data?: WalletStoreState) {
    this.algorand = new Algorand(data?.algorand);
    this.ethereum = new Ethereum(data?.ethereum);
  }

  // This is to prevent non-POJO warnings on Nuxt server instance
  // investigate alternative in the future
  toJSON() {
    return { ...this }; // here I make a POJO's copy of the class instance
  }
}

export type { WALLET_STATUS, Signer };
export {
  WalletStore,
  WalletStoreState,
  NotImplementedError,
  WalletInterface as Wallet,
};
