import { MyAlgo } from "./myalgo";
import { MyAlgoState } from "./myalgo/types";
import { WalletConnect } from "./walletconnect";
import { WalletConnectState } from "./walletconnect/types";

type AlgorandState = {
  myAlgo?: MyAlgoState;
  walletConnect?: WalletConnectState;
};

class Algorand {
  public myAlgo: MyAlgo;
  public walletConnect: WalletConnect;

  constructor(data?: AlgorandState) {
    this.myAlgo = new MyAlgo(data?.myAlgo);
    this.walletConnect = new WalletConnect(data?.walletConnect);
  }
}

export { Algorand, AlgorandState };
