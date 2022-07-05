import {
  SignedTx,
  AlgorandTxn,
  EncodedTransaction,
} from '@randlabs/myalgo-connect';
import {
  Signer,
  WALLET_STATUS,
  WalletInterface,
  NotImplementedError,
} from './../../types';
import { Asset, MyAlgoState } from './types';
import MyAlgoConnect from '@randlabs/myalgo-connect';

const initialState: Readonly<MyAlgoState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class MyAlgo implements WalletInterface<MyAlgoState> {
  public state: MyAlgoState;

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
    const myAlgoConnect = new MyAlgoConnect();

    this.state.accounts = await myAlgoConnect.connect();
    this.state.isConnected = this.state.accounts.length > 0;

    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.state.accounts = [];
    this.state.isConnected = false;

    return WALLET_STATUS.OK;
  }

  public async getBalance(): Promise<number> {
    throw new NotImplementedError('getBalance not implemented.');
  }

  public async getAssets(): Promise<Asset[]> {
    throw new NotImplementedError('getAssets not implemented.');
  }

  public toJSON(): MyAlgoState {
    return this.state;
  }

  public async getSigner(): Promise<Signer> {
    return async (
      transactions: unknown[]
    ): Promise<{ signedTransaction: SignedTx[]; status: WALLET_STATUS }> => {
      const myAlgoConnect = new MyAlgoConnect();
      const signedTx = await myAlgoConnect.signTransaction(
        transactions as (AlgorandTxn | EncodedTransaction)[]
      );

      return {
        signedTransaction: signedTx,
        status: WALLET_STATUS.OK,
      };
    };
  }
}

export { MyAlgo };
export type { MyAlgoState };
