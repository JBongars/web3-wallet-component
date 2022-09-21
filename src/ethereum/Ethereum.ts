import { Metamask } from "./metamask";
// import { MetamaskState } from "./metamask/types";
import { EthWalletConnect } from "./walletconnect";
import { WalletConnectState } from "./walletconnect/types";
import { MetamaskState, MetamaskSigner } from "./metamask/types";

type EthereumWallet = Metamask | EthWalletConnect;

type EthereumSigner = MetamaskSigner;

type EthereumState = {
  metaMask?: MetamaskState;
  walletConnect?: WalletConnectState;
};

class Ethereum {
  public metaMask: Metamask;
  public walletConnect: EthWalletConnect;

  constructor(data?: EthereumState) {
    this.metaMask = new Metamask(data?.metaMask);
    this.walletConnect = new EthWalletConnect();
  }
}

export type { EthereumWallet, EthereumSigner, Ethereum, EthereumState };
