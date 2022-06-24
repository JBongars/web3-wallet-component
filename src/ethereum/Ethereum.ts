import { MetaMask, MetaMaskState } from "./metamask";

type EthereumState = {
  metaMask?: MetaMaskState;
};

class Ethereum {
  public metaMask: MetaMask;

  constructor(data?: EthereumState) {
    this.metaMask = new MetaMask(data?.metaMask);
  }
}

export { Ethereum, EthereumState };
