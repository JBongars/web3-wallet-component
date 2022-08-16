import {
  SignedTx,
  AlgorandTxn,
  EncodedTransaction,
  Accounts,
} from "@randlabs/myalgo-connect";
import { WalletInterface, ChainID } from "./../../types";
import { MyAlgoAsset, MyAlgoSigner, MyAlgoState } from "./types";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { NotImplementedError, WalletNotConnectedError } from "~/src/errors";
import { CHAINS } from "~/src/config/constants";
import HookRouter from "~/src/utils/HookRouter/HookRouter";
import {
  HookEvent,
  WALLET_HOOK,
  WALLET_STATUS,
} from "~/src/utils/HookRouter/types";

type MyAlgoConfig = {
  shouldSelectOneAccount?: boolean;
};

const initialState: Readonly<MyAlgoState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class MyAlgo implements WalletInterface<MyAlgoState> {
  private hookRouter: HookRouter = new HookRouter([
    WALLET_HOOK.ACCOUNT_ON_CHANGE,
    WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
    WALLET_HOOK.CHAIN_ON_CHANGE,
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

  public async signIn(options: MyAlgoConfig = {}): Promise<WALLET_STATUS> {
    const shouldSelectOneAccount = options.shouldSelectOneAccount || true;
    const myAlgoConnect = this.getProvider();

    // forces user to only choose one account.
    // This prevents a lot of edge cases.
    this.state.accounts = await myAlgoConnect.connect({
      shouldSelectOneAccount,
    });
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

  public getIsWalletInstalled(): boolean {
    return true; // wallet is web only so is always installed
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

  public async fetchCurrentChainID(): Promise<string> {
    return "0x1";
  }

  public onAccountChange(cb: (accounts: Accounts) => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_CHANGE,
      () => {
        return cb(this.getPrimaryAccount());
      }
    );
  }

  public onChainChange(cb: (chain: string) => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.CHAIN_ON_CHANGE,
      async () => {
        const currentChainId = await this.fetchCurrentChainID();
        return cb(currentChainId);
      }
    );
  }

  public onBlockAdded(
    cb: (newBlock: unknown) => void | Promise<void>
  ): HookEvent {
    throw new NotImplementedError();
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
export { MyAlgoConfig };
