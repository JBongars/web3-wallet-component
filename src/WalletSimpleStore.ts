import { Algorand, AlgorandState } from "./algorand";
import { Ethereum, EthereumState } from "./ethereum";

type WalletSimpleStoreState = {
  algorand?: AlgorandState;
  ethereum?: EthereumState;
};

class WalletSimpleStore {
  public algorand: Algorand;
  public ethereum: Ethereum;

  constructor(data?: WalletSimpleStoreState) {
    this.algorand = new Algorand(data?.algorand);
    this.ethereum = new Ethereum(data?.ethereum);
  }

  // This is to prevent non-POJO warnings on Nuxt server instance
  // investigate alternative in the future
  toJSON() {
    return { ...this }; // here I make a POJO's copy of the class instance
  }
}

export { WalletSimpleStore, WalletSimpleStoreState };
