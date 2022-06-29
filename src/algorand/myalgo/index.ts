import { SignedTx, AlgorandTxn, EncodedTransaction } from "@randlabs/myalgo-connect";
import { Signer, WALLET_STATUS, WalletInterface } from "~/src/types";
import { Asset, State } from "./types";
import MyAlgoConnect from '@randlabs/myalgo-connect'
import axios from 'axios'

type AccountInformation = {
  address: string,
  amount: number,
}

type MyAlgoState = State

const initialState: Readonly<State> = Object.freeze({
  accounts: [],
  isConnected: false,
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

  public async init(): Promise<WALLET_STATUS> {
    return WALLET_STATUS.OK
  }

  public async signIn(): Promise<WALLET_STATUS> {
    try {
      const myAlgoConnect = new MyAlgoConnect()

      this.state.accounts = await myAlgoConnect.connect()
      this.state.isConnected = this.state.accounts.length > 0;

      return WALLET_STATUS.OK
    } catch (e) {
      console.log(e)
      return WALLET_STATUS.LOGIN_ERROR
    }
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.state.accounts = []

    return WALLET_STATUS.OK
  }

  public async getBalance(): Promise<number> {
    if (!this.state.isConnected) {
      return WALLET_STATUS.ACCOUNT_NOT_FOUND
    }

    const { data } = await axios.get<AccountInformation>('https://bridge.messina.devucc.name/api/transactions/accountInformation', {
      params: { address: this.state.accounts[0].address },
    })

    return data.amount
  }

  public async getAssets(): Promise<Asset[]> {
    const { data } = await axios.get<Asset[]>("https://bridge.messina.devucc.name/api/transactions/assets");

    return data;
  }

  public toJSON(): State {
    return this.state;
  }

  public getSigner: Signer = async (transactions: (AlgorandTxn | EncodedTransaction)[])
    : Promise<{ signedTransaction: SignedTx[]; status: WALLET_STATUS }> => {
    const myAlgoConnect = new MyAlgoConnect;

    const signedTx = await myAlgoConnect.signTransaction(transactions)

    return {
      signedTransaction: signedTx,
      status: WALLET_STATUS.OK
    };
  }
}

export { MyAlgo };
export type { MyAlgoState };
