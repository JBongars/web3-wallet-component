import {
  SignedTx,
  AlgorandTxn,
  EncodedTransaction,
} from "@randlabs/myalgo-connect";
import { Signer, WALLET_STATUS, WalletInterface } from "./../../types";
import { MyAlgoAsset, MyAlgoSigner, MyAlgoState } from "./types";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { NotImplementedError } from "~/src/errors";
import { CHAINS } from "~/src/config/constants";

const initialState: Readonly<MyAlgoState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class MyAlgo implements WalletInterface<MyAlgoState> {
  public state: MyAlgoState;
  private provider: MyAlgoConnect | undefined;

  constructor(state?: MyAlgoState) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
  }

  public async init(): Promise<WALLET_STATUS> {
    return WALLET_STATUS.OK;
  }

  public async signIn(): Promise<WALLET_STATUS> {
    const myAlgoConnect = this.getProvider();

    this.state.accounts = await myAlgoConnect.connect();
    this.state.isConnected = this.state.accounts.length > 0;

    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.state.accounts = [];
    this.state.isConnected = false;

    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<MyAlgoSigner> {
    return async (transactions: AlgorandTxn[]): Promise<SignedTx[]> => {
      const myAlgoConnect = this.getProvider();
      const signedTx = await myAlgoConnect.signTransaction(
        transactions as (AlgorandTxn | EncodedTransaction)[]
      );

      return signedTx;
    };
  }

  public async getBalance(): Promise<string> {
    throw new NotImplementedError();
  }

  public async getAssets(): Promise<MyAlgoAsset[]> {
    throw new NotImplementedError();
  }

  public getIsConnected(): boolean {
    return this.state.isConnected;
  }

  public getPrimaryAccount(): string {
    throw new NotImplementedError();
  }

  public getAccounts(): unknown[] {
    throw new NotImplementedError();
  }

  public async fetchCurrentChainID(): Promise<number> {
    return CHAINS.CHAIN_ID_ALGORAND;
  }

  public toJSON(): MyAlgoState {
    return this.state;
  }

  public getProvider(): MyAlgoConnect {
    if (this.provider instanceof MyAlgoConnect) {
      return this.provider;
    }

    this.provider = new MyAlgoConnect();
    return this.provider;
  }
}

export { MyAlgo };
