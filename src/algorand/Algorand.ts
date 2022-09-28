import { MyAlgo, MyAlgoTransaction } from "./myalgo";
import { MyAlgoSigner, MyAlgoState } from "./myalgo/types";
import { WalletConnect, WalletConnectTransaction } from "./walletconnect";
import { WalletConnectSigner, WalletConnectState } from "./walletconnect/types";
import { PeraWallet, PeraWalletTransaction } from "./perawallet";
import { PeraWalletSigner, PeraWalletState } from "./perawallet/types";

type AlgorandWallet = MyAlgo | WalletConnect | PeraWallet;

type AlgorandSignerTxn = MyAlgoTransaction | WalletConnectTransaction | PeraWalletTransaction;
type AlgorandSigner = MyAlgoSigner | WalletConnectSigner | PeraWalletSigner;

type AlgorandState = {
  myAlgo?: MyAlgoState;
  walletConnect?: WalletConnectState;
  peraWallet?: PeraWalletState
};

class Algorand {
  public myAlgo: MyAlgo;
  public walletConnect: WalletConnect;
  public peraWallet: PeraWallet;

  constructor(data?: AlgorandState) {
    this.myAlgo = new MyAlgo(data?.myAlgo);
    this.walletConnect = new WalletConnect(data?.walletConnect);
    this.peraWallet = new PeraWallet(data?.peraWallet)
  }
}

export { AlgorandWallet, AlgorandSignerTxn, AlgorandSigner, Algorand, AlgorandState };
