import { MyAlgo, MyAlgoTransaction } from "./myalgo";
import { MyAlgoSigner, MyAlgoState } from "./myalgo/types";
import { WalletConnect, WalletConnectTransaction } from "./walletconnect";
import { WalletConnectSigner, WalletConnectState } from "./walletconnect/types";

type AlgorandWallet = MyAlgo | WalletConnect;

type AlgorandSignerTxn = MyAlgoTransaction | WalletConnectTransaction;
type AlgorandSigner = MyAlgoSigner | WalletConnectSigner;

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

export { AlgorandWallet, AlgorandSignerTxn, AlgorandSigner, Algorand, AlgorandState };
