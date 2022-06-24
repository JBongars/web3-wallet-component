import { Algorand, AlgorandState, MyAlgo } from "./algorand";
import { Ethereum, EthereumState, MetaMask } from "./ethereum";
import { WalletInterface } from "./types";

type WalletStoreState = {
  algorand?: AlgorandState;
  ethereum?: EthereumState;
};

class WalletStore {
  private wallets: WalletInterface<unknown>[];

  constructor() {
    this.wallets = [new MyAlgo(), new MetaMask()];
  }

  toJSON() {
    const states = this.wallets.reduce(
      (a, elem) => ({
        ...a,
        [elem.constructor.name]: elem.toJSON(),
      }),
      {}
    );
    return { ...states }; // here I make a POJO's copy of the class instance
  }
}

export { WalletStore, WalletStoreState };
