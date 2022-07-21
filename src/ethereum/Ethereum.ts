import { Metamask } from "./metamask";
import { MetamaskState } from "./metamask/types";

type EthereumState = {
  metaMask?: MetamaskState;
};

class Ethereum {
  public metaMask: Metamask;

  constructor(data?: EthereumState) {
    this.metaMask = new Metamask(data?.metaMask);
  }
}

export type { Ethereum, EthereumState };
