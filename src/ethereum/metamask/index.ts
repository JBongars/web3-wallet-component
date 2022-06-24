import { State } from "./types";

const initialState: Readonly<State> = Object.freeze({
  data1: "",
  data2: "",
});

class MetaMask implements WalletInterface {
  public state: State;

  constructor(state?: State) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
  }

  public init: () => Promise<WALLET_STATUS> = async () => {
    throw new NotImplementedError();
  };

  public signIn: () => Promise<WALLET_STATUS> = async () => {
    throw new NotImplementedError();
  };

  public signOut: () => Promise<WALLET_STATUS> = async () => {
    throw new NotImplementedError();
  };

  public getSigner: () => Signer = () => {
    throw new NotImplementedError();
  };

  public getAmount: () => number | Promise<number> = () => {
    throw new NotImplementedError();
  };

  public getAsset: () => unknown | Promise<unknown> = async () => {};
}

export { MetaMask };
export type { State as MetaMaskState };
