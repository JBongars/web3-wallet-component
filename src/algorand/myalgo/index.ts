import {
  SignedTx,
  AlgorandTxn,
  EncodedTransaction,
  Accounts,
} from "@randlabs/myalgo-connect";
import {
  Signer,
  WALLET_STATUS,
  WalletInterface,
  WALLET_HOOK,
} from "./../../types";
import { MyAlgoAsset, MyAlgoSigner, MyAlgoState } from "./types";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { NotImplementedError, WalletNotConnectedError } from "~/src/errors";
import { CHAINS } from "~/src/config/constants";
import HookRouter from "~/src/utils/HookRouter";

const initialState: Readonly<MyAlgoState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class MyAlgo implements WalletInterface<MyAlgoState> {
  private hookRouter: HookRouter = new HookRouter([
    WALLET_HOOK.ACCOUNT_ON_CHANGE,
  ]);
  public state: MyAlgoState;
  private provider: MyAlgoConnect | undefined;

  constructor(state?: MyAlgoState) {
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
    return WALLET_STATUS.OK;
  }

  public async signIn(): Promise<WALLET_STATUS> {
    const myAlgoConnect = this.getProvider();

    this.state.accounts = await myAlgoConnect.connect();
    this.state.isConnected = this.state.accounts.length > 0;

    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.enforceIsConnected();
    this.state.accounts = [];
    this.state.isConnected = false;

    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<MyAlgoSigner> {
    return async (
      transactions: AlgorandTxn[] | EncodedTransaction[]
    ): Promise<SignedTx[]> => {
      this.enforceIsConnected();

      const myAlgoConnect = this.getProvider();
      const signedTx = await myAlgoConnect.signTransaction(transactions);

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

  public getPrimaryAccount(): Accounts {
    return this.state.accounts[0];
  }

  public getAccounts(): Accounts[] {
    return this.state.accounts;
  }

  public async fetchCurrentChainID(): Promise<number> {
    return CHAINS.CHAIN_ID_ALGORAND;
  }

  public onAccountChange(cb: (accountId: Accounts) => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_CHANGE,
      () => {
        return cb(this.getPrimaryAccount());
      }
    );
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
