import {
  Signer,
  WalletInterface,
  WALLET_STATUS,
  NotImplementedError,
} from "~/src/types";
import { Asset, MetaMaskState } from "./types";
import { ethers } from "ethers";

import Web3 from "web3";

import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
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
    await this.getProvider();
    await this.mountEventListeners();

    throw WALLET_STATUS.OK;
  }

  public async signIn(): Promise<WALLET_STATUS> {
    const provider = await this.getProvider();
    this.state.accounts = await provider.send("eth_requestAccounts", []);
    this.state.isConnected = this.state.accounts.length > 0;

    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.state.accounts = [];
    this.state.isConnected = false;

    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<Signer> {
    return async (
      transactions: unknown[]
    ): Promise<{
      signedTransaction: TransactionResponse[];
      status: WALLET_STATUS;
    }> => {
      const provider = await this.getProvider();
      const transactionResponse = await provider
        .getSigner()
        .sendTransaction(transactions as TransactionRequest);

      return {
        signedTransaction: [transactionResponse],
        status: WALLET_STATUS.OK,
      };
    };
  }

  public async getBalance(): Promise<number> {
    if (!this.state.isConnected) {
      return WALLET_STATUS.ACCOUNT_NOT_FOUND;
    }

    const provider = await this.getProvider();
    const balance = await provider.getBalance(this.state.accounts[0]);

    // const web3 = new Web3();
    // const balance = await web3.eth.getBalance(this.state.accounts[0]);

    return Number(balance);
  }

  public async getAssets(): Promise<Asset[]> {
    throw new NotImplementedError("getAssets not implemented.");
  }

  public toJSON(): MetaMaskState {
    return this.state;
  }

  public async mountEventListeners(
    callback?: (accounts: string[]) => Promise<unknown>
  ) {
    const provider = await this.getProvider();

    provider.on("accountsChanged", async (accounts: string[]) => {
      this.state.accounts = accounts;

      if (callback) {
        await callback(accounts);
      }
    });
  }

  public async unmountEventListeners(callback: () => Promise<unknown>) {
    const provider = await this.getProvider();

    provider.removeListener("accountsChanged", async () => await callback());
  }

  public async getProvider(): Promise<ethers.providers.Web3Provider> {
    const ethereum = (await useWindow(async (w) => (w as any).ethereum)) as any;

    if (!ethereum) {
      throw new Error("Error opening window.");
    }

    const provider: ethers.providers.Web3Provider =
      new ethers.providers.Web3Provider(ethereum);

    return provider;
  }
}

export { MetaMask };
export type { MetaMaskState };
