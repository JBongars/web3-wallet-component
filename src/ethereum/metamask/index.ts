import { Signer, WALLET_STATUS, WalletInterface } from "../../types";
import { MetamaskAsset, MetamaskSigner, MetamaskState } from "./types";
import { ethers } from "ethers";
import {
  TransactionRequest,
  TransactionResponse,
} from "@ethersproject/abstract-provider";
import { useWindow } from "../../containers";
import {
  NotImplementedError,
  WalletNotConnectedError,
  WalletNotInstalledError,
} from "~/src/errors";

const initialState: Readonly<MetamaskState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class Metamask implements WalletInterface<MetamaskState> {
  public state: MetamaskState;
  public provider?: ethers.providers.Web3Provider;

  constructor(state?: MetamaskState) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
  }

  private enforceIsConnected(): void {
    if (!this.getIsConnected()) {
      throw new WalletNotConnectedError();
    }
  }

  public async init(): Promise<WALLET_STATUS> {
    this.provider = await this.getProvider();

    return WALLET_STATUS.OK;
  }

  public async signIn(): Promise<WALLET_STATUS> {
    const provider = await this.getProvider();
    this.state.accounts = await provider.send("eth_requestAccounts", []);
    this.state.isConnected = this.state.accounts.length > 0;

    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.enforceIsConnected();
    this.state.accounts = [];
    this.state.isConnected = false;

    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<MetamaskSigner> {
    return async (
      transactions: TransactionRequest[]
    ): Promise<TransactionResponse[]> => {
      this.enforceIsConnected();

      const provider = this.provider || (await this.getProvider());
      const transactionResponse = await provider
        .getSigner()
        .sendTransaction(transactions[0]);

      return [transactionResponse];
    };
  }

  public async getBalance(): Promise<string> {
    this.enforceIsConnected();

    const provider = this.provider || (await this.getProvider());
    const balance = await provider.getBalance(this.state.accounts[0]);
    return balance.toString();
  }

  public async getAssets(): Promise<MetamaskAsset[]> {
    throw new NotImplementedError();
  }

  public getIsConnected(): boolean {
    return this.state.isConnected;
  }

  public getPrimaryAccount(): string {
    this.enforceIsConnected();

    return this.state.accounts[0];
  }

  public getAccounts(): string[] {
    this.enforceIsConnected();

    return this.state.accounts;
  }

  public async fetchCurrentChainID(): Promise<number> {
    this.enforceIsConnected();

    const provider: ethers.providers.Web3Provider = await this.getProvider();
    const chainId: number = await provider.send("eth_chainId", []);

    return chainId;
  }

  public toJSON(): MetamaskState {
    return this.state;
  }

  public async mountEventListeners(
    callback?: (accounts: string[]) => Promise<unknown>
  ) {
    const provider = await this.getProvider();

    provider.on("accountsChanged", async (accounts: string[]) => {
      this.state.accounts = accounts;

      if (callback) {
        return callback(accounts);
      }
    });
  }

  public async unmountEventListeners(callback?: () => Promise<unknown>) {
    const provider = await this.getProvider();

    provider.removeListener("accountsChanged", async () => {
      if (callback) {
        return callback();
      }
    });
  }

  public async getProvider(): Promise<ethers.providers.Web3Provider> {
    const ethereum = (await useWindow(
      async (windowObject) => (windowObject as any).ethereum
    )) as any;

    if (!ethereum) {
      throw new WalletNotInstalledError();
    }

    return new ethers.providers.Web3Provider(ethereum);
  }
}

export { Metamask };
