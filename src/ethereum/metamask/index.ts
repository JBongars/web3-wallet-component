import {
  Signer,
  WalletInterface,
  WALLET_STATUS,
} from "~/src/types";
import { Asset, State } from "./types";
import { ethers } from "ethers";
import Web3 from "web3";
import axios from 'axios'
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";

/**
 * Temporary (will move this to somewhere and change ethereum data type)
 */
declare global {
  interface Window {
    ethereum: any
  }
}
const { ethereum } = window


type MetaMaskState = State;

const initialState: Readonly<State> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class MetaMask implements WalletInterface<State> {
  public state: State;

  constructor(state?: State) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
  }

  public async init(): Promise<WALLET_STATUS> {
    /**
     * @TODO check metamask extension.
     */

    ethereum.on('accountsChanged', (accounts: string[]) => {
      this.state.accounts = accounts
    });

    throw WALLET_STATUS.OK;
  }

  public async signIn(): Promise<WALLET_STATUS> {
    this.state.accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    this.state.isConnected = ethereum.isConnected();

    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.state.accounts = [];
    this.state.isConnected = false

    return WALLET_STATUS.OK
  }

  public getSigner: Signer = async (transaction: TransactionRequest)
    : Promise<{ signedTransaction: TransactionResponse; status: WALLET_STATUS }> => {
    const provider = new ethers.providers.Web3Provider(ethereum);

    const transactionResponse = await provider.getSigner().sendTransaction(transaction)

    return {
      signedTransaction: transactionResponse,
      status: WALLET_STATUS.OK
    }
  };

  public async getBalance(): Promise<number> {
    if (!this.state.isConnected) {
      return WALLET_STATUS.ACCOUNT_NOT_FOUND;
    }

    const web3 = new Web3(window.ethereum)

    const balance = await web3.eth.getBalance(this.state.accounts[0])

    return Number(balance);
  }

  public async getAssets(): Promise<Asset[]> {
    const { data } = await axios.get<Asset[]>("https://bridge.messina.devucc.name/api/transactions/assets");

    return data;
  }

  public toJSON(): State {
    return this.state;
  }
}

export { MetaMask };
export type { MetaMaskState };
