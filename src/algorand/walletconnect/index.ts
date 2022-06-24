import {
  NotImplementedError,
  Signer,
  WalletInterface,
  WALLET_STATUS,
} from "~/src/types";
import { State } from "./types";

const initialState: Readonly<State> = Object.freeze({
  data1: "",
  data2: "",
});

class WalletConnect implements WalletInterface {
  public state: State;

  constructor(state?: State) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
  }

  public test: () => Promise<void> = async () => {
    console.log("hit test! waiting for timeout");
    await setTimeout(Promise.resolve, 2000);
    console.log("hit after timeout! Changing state....");

    this.state.data1 = "hello world!";
  };

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

  public getBallance: () => number | Promise<number> = () => {
    throw new NotImplementedError();
  };

  public getAssets: () => unknown | Promise<unknown> = async () => {};
}

export { WalletConnect };
export type { State as WalletConnectState };
