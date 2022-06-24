import { WalletConnect, WalletConnectState } from "./walletconnect";
import { MyAlgo, MyAlgoState } from "./myalgo";

type AlgorandState = {
  walletConnect?: WalletConnectState;
  myAlgo?: MyAlgoState;
};

class Algorand {
  public walletConnect: WalletConnect;
  public myAlgo: MyAlgo;

  constructor(data?: AlgorandState) {
    this.walletConnect = new WalletConnect(data?.walletConnect);
    this.myAlgo = new MyAlgo(data?.myAlgo);
  }
}

export { Algorand, AlgorandState };
