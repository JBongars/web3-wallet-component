import {
  NotImplementedError,
  Signer,
  WalletInterface,
  WALLET_STATUS,
} from "~/src/types";
import { Asset, State } from "./types";

type MyAlgoState = State;

const initialState: Readonly<State> = Object.freeze({
  data1: "",
  data2: "",
  counter: 0,
});

class MyAlgo implements WalletInterface<State> {
  public state: State;

  constructor(state?: State) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
  }

  public test(): string {
    this.state.counter++;
    return "ok";
  }

  public async init(): Promise<WALLET_STATUS> {
    throw new NotImplementedError();
  }

  public async signIn(): Promise<WALLET_STATUS> {
    throw new NotImplementedError();
  }

  public async signOut(): Promise<WALLET_STATUS> {
    throw new NotImplementedError();
  }

  public async getSigner(): Promise<Signer> {
    throw new NotImplementedError();
  }

  public async getBallance(): Promise<number> {
    throw new NotImplementedError();
  }

  public async getAssets(): Promise<Asset[]> {
    throw new NotImplementedError();
  }

  public toJSON(): State {
    return this.state;
  }
}

export { MyAlgo };
export type { MyAlgoState };
