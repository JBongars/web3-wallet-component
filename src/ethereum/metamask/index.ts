import { Signer, WalletInterface, WALLET_STATUS, NotImplementedError} from "~/src/types";
import { Asset, MetaMaskState } from "./types";
import { ethers } from "ethers";
import Web3 from "web3";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import { useWindow } from "~/src/containers";

const initialState: Readonly<MetaMaskState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class MetaMask implements WalletInterface<MetaMaskState> {
  public state: MetaMaskState;

  constructor(state?: MetaMaskState) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
  }

  public async init(): Promise<WALLET_STATUS> {
    await this.getProvider()
    await this.mountEventListeners()
    
    throw WALLET_STATUS.OK;
  }

  public async signIn(): Promise<WALLET_STATUS> {
    const provider = await this.getProvider();
    this.state.accounts = await provider.request({ method: 'eth_requestAccounts' });
    this.state.isConnected = provider.isConnected();

    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.state.accounts = [];
    this.state.isConnected = false

    return WALLET_STATUS.OK
  }

  public async getSigner(): Promise<Signer> { 
    return async (transactions:  unknown[]) : Promise<{ signedTransaction: TransactionResponse[]; status: WALLET_STATUS }> => {
      const provider = new ethers.providers.Web3Provider(this.getProvider());
      const transactionResponse = await provider.getSigner().sendTransaction(transactions as TransactionRequest)

      return {
        signedTransaction: [transactionResponse],
        status: WALLET_STATUS.OK
      }
    }
  }

  public async getBalance(): Promise<number> {
    if (!this.state.isConnected) {
      return WALLET_STATUS.ACCOUNT_NOT_FOUND;
    }

    const web3 = new Web3(this.getProvider())

    const balance = await web3.eth.getBalance(this.state.accounts[0])

    return Number(balance);
  }

  public async getAssets(): Promise<Asset[]> {
     throw new NotImplementedError('getAssets not implemented.')
  }

  public toJSON(): MetaMaskState {
    return this.state;
  }

  public async mountEventListeners() {
    const provider = await this.getProvider()

    provider.on('accountsChanged', (accounts: string[]) => {
      this.state.accounts = accounts
    })
  }

  public async unmountEventListeners() {
    const provider = await this.getProvider()

    provider.removeListener('accountsChanged')
  }

   public async getProvider(): Promise<unknown> {
    const ethereum = await useWindow(async (w) => w.ethereum);

    if (!ethereum) {
      throw new Error('Error opening window.');
    }

    return ethereum;
  }
}

export { MetaMask };
export type { MetaMaskState };
