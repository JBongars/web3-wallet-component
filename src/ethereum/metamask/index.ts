import {NotImplementedError, Signer, WALLET_STATUS, WalletInterface, WalletNotInstalled,} from "../../types";
import {Asset, MetaMaskState} from "./types";
import {ethers} from "ethers";
import {TransactionRequest, TransactionResponse,} from "@ethersproject/abstract-provider";
import {useWindow} from "../../containers";

const initialState: Readonly<MetaMaskState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class MetaMask implements WalletInterface<MetaMaskState> {
  public state: MetaMaskState;
  public provider?: ethers.providers.Web3Provider

   constructor(state?: MetaMaskState) {
    if (state) {
      this.state = {...state};
    } else {
      this.state = {...initialState};
    }
  }

  public async init(): Promise<WALLET_STATUS> {
   this.provider = await this.getProvider();
   await this.mountEventListeners();

    return WALLET_STATUS.OK
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
      const provider = this.provider || await this.getProvider();
      const transactionResponse = await provider
        .getSigner()
        .sendTransaction(transactions as TransactionRequest);

      return {
        signedTransaction: [transactionResponse],
        status: WALLET_STATUS.OK,
      };
    };
  }

  public async getBalance(): Promise<string> {
    if (!this.state.isConnected) {
      return WALLET_STATUS.ACCOUNT_NOT_FOUND as unknown as string;
    }

    const provider = this.provider || await this.getProvider();

    const balance = await provider.getBalance(this.state.accounts[0]);

    return balance.toString();
  }

  public async getAssets(): Promise<Asset[]> {
    throw new NotImplementedError();
  }

  public toJSON(): MetaMaskState {
    return this.state;
  }

  public async mountEventListeners(
    callback?: (accounts: string[]) => Promise<unknown>
  ) {
    const provider = this.provider || await this.getProvider();

    provider.on("accountsChanged", async (accounts: string[]) => {
      this.state.accounts = accounts;

      if (callback) {
        return callback(accounts);
      }
    });
  }


  public async unmountEventListeners(callback?: () => Promise<unknown>) {

   const provider = this.provider || await this.getProvider()

    provider.removeListener("accountsChanged", async () => {
      if (callback) {
        return callback();
      }
    });
  }

  public async getProvider(): Promise<ethers.providers.Web3Provider> {
    const ethereum = (await useWindow(async (w) => (w as any).ethereum)) as any;

    if (!ethereum) {
      throw new WalletNotInstalled();
    }

    return new ethers.providers.Web3Provider(ethereum);
  }
}

export { MetaMask };
export type { MetaMaskState };
