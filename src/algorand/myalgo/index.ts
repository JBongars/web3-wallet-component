import MyAlgoConnect, {
  Accounts,
  AlgorandTxn,
  EncodedTransaction,
  SignedTx,
} from "@randlabs/myalgo-connect";
import { NotImplementedError, WalletNotConnectedError } from "~/src/errors";
import HookRouter from "~/src/utils/HookRouter/HookRouter";
import {
  HookEvent,
  WALLET_HOOK,
  WALLET_ID,
  WALLET_STATUS,
} from "~/src/utils/HookRouter/types";
import WalletStateStorage from "~/src/WalletStateStorage";
import { CHAIN_ALGORAND } from "..";
import { AlgorandSignerTxn, AlgorandWalletType } from "../Algorand";
import { WalletInterface } from "./../../types";
import { MyAlgoAsset, MyAlgoSigner, MyAlgoState } from "./types";

type MyAlgoConfig = {
  shouldSelectOneAccount?: boolean;
};

type MyAlgoTransaction = AlgorandTxn[] | EncodedTransaction[];

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
  private walletStorage: WalletStateStorage = new WalletStateStorage(
    CHAIN_ALGORAND,
    WALLET_ID.ALGORAND_MYALGO
  );
  public currentActiveAccountAddress: string = "";

  public type: AlgorandWalletType = AlgorandWalletType.MY_ALGO;
  public name: string = "MY_ALGO";

  constructor(state?: MyAlgoState) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }

    this.setupInitialState();
  }

  private enforceIsConnected(): void {
    if (!this.getIsConnected()) {
      throw new WalletNotConnectedError();
    }
  }

  public async init(): Promise<WALLET_STATUS> {
    return WALLET_STATUS.OK;
  }

  public getProvider(): MyAlgoConnect {
    if (this.provider instanceof MyAlgoConnect) {
      return this.provider;
    }

    this.provider = new MyAlgoConnect();
    return this.provider;
  }

  public switchAccount(address: string) {
    const account = this.state.accounts.find((acc) => acc.address === address);

    if (account) {
      this.currentActiveAccountAddress = account.address;
    }

    this.updateWalletStorageValue();
  }

  private setupInitialState() {
    const storageValue = this.walletStorage.getValue();

    if (storageValue) {
      this.state = {
        isConnected: storageValue.isConnected,
        accounts: storageValue.accounts
          ? storageValue.accounts.map((address) => ({
              name: "",
              address,
            }))
          : [],
      };

      this.currentActiveAccountAddress = storageValue.connectedAccount;
    }
  }

  private updateWalletStorageValue() {
    if (this.state.isConnected && this.state.accounts.length > 0) {
      const accounts = this.getAccounts().map((acc) => acc.address);
      const connectedAccount = this.getPrimaryAccount().address;
      this.walletStorage.updateValue(true, connectedAccount, accounts);
    } else {
      this.walletStorage.updateValue(false, "", []);
    }
  }

  public async signIn(): Promise<WALLET_STATUS> {
    const myAlgoConnect = this.getProvider();

    // forces user to only choose one account.
    // This prevents a lot of edge cases.
    this.state.accounts = await myAlgoConnect.connect();

    this.state.isConnected = this.state.accounts.length > 0;

    this.updateWalletStorageValue();
    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.enforceIsConnected();
    this.state.accounts = [];
    this.state.isConnected = false;
    this.updateWalletStorageValue();
    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<MyAlgoSigner> {
    return async (transactions: AlgorandSignerTxn): Promise<SignedTx[]> => {
      this.enforceIsConnected();

      const myAlgoConnect = this.getProvider();
      const signedTx = await myAlgoConnect.signTransaction(
        transactions as MyAlgoTransaction
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

  public getIsWalletInstalled(): boolean {
    return true; // wallet is web only so is always installed
  }

  public getIsConnected(): boolean {
    return this.state.isConnected;
  }

  public getPrimaryAccount(): Accounts {
    if (!this.getIsConnected()) {
      return {
        name: "",
        address: "",
      };
    }

    const account = this.state.accounts.find(
      (acc) => acc.address === this.currentActiveAccountAddress
    );

    if (this.currentActiveAccountAddress && account) {
      return account;
    }

    return this.state.accounts[0];
  }

  public getAccounts(): Accounts[] {
    return this.state.accounts;
  }

  public async fetchCurrentChainID(): Promise<string> {
    return "0x1";
  }

  public async mountEventListeners(): Promise<void> {}

  public onAccountChange(cb: (accounts: Accounts[]) => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_CHANGE,
      () => {
        return cb(this.getAccounts());
      }
    );
  }

  public onAccountDisconnect(cb: () => void | Promise<void>) {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
      () => {
        return cb();
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
}

export { MyAlgo };
export type { MyAlgoConfig, MyAlgoTransaction };
