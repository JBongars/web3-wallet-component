import { Metamask } from "./metamask";
import { MetamaskState, MetamaskSigner } from "./metamask/types";

type EthereumWallet = Metamask;

type EthereumSigner = MetamaskSigner;

type EthereumState = {
  metaMask?: MetamaskState;
};

class Ethereum {
  public metaMask: Metamask;

  constructor(data?: EthereumState) {
    this.metaMask = new Metamask(data?.metaMask);
  }
}

export type { EthereumWallet, EthereumSigner, Ethereum, EthereumState };
