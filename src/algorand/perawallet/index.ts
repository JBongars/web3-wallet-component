import { NotImplementedError, WalletNotConnectedError } from "~/src/errors";
import { WalletInterface } from "~/src/types";
import HookRouter from "~/src/utils/HookRouter/HookRouter";
import { HookEvent, WALLET_HOOK, WALLET_ID, WALLET_STATUS } from "~/src/utils/HookRouter/types";
import { PeraWalletAsset, PeraWalletSigner, PeraWalletState } from "./types";
import { PeraWalletConnect } from "@perawallet/connect";
import WalletStateStorage from "~/src/WalletStateStorage";
import { AlgorandSignerTxn, CHAIN_ALGORAND } from "..";
import { SignedTx } from "@randlabs/myalgo-connect";

type Accounts = {
  address: string;
  name: string;
}

type PeraWalletTransaction = Uint8Array[];

const initialState: Readonly<PeraWalletState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class PeraWallet implements WalletInterface<PeraWalletState> {
  private hookRouter: HookRouter = new HookRouter([
    WALLET_HOOK.ACCOUNT_ON_CHANGE,
    WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
    WALLET_HOOK.CHAIN_ON_CHANGE,
  ]);
  public state: PeraWalletState;
  private provider: PeraWalletConnect | undefined;
  private walletStorage = new WalletStateStorage(CHAIN_ALGORAND, WALLET_ID.ALGORAND_PERAWALLET);

  constructor(state?: PeraWalletState) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }

    this.setupInitialState()
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
    this.provider = this.getProvider();
    const accounts = await this.provider.connect();
    // console.log({accounts});
    this.state.accounts = accounts;
    this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
    this.updateWalletStorageValue()
    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);

    // if (!this.provider.connected) {
    //   // create new session
    //   await this.provider.createSession();
    // } else {
    //   const { accounts } = this.provider;

    //   this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
    //   this.state.accounts = accounts;
    //   this.updateWalletStorageValue()
    //   this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    // }

    // this.provider.on("connect", ((error, payload) => {
    //   if (error) {
    //     throw error;
    //   }

    //   // Get provided accounts
    //   const { accounts } = payload.params[0];
    //   this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
    //   this.state.accounts = accounts;
    //   this.updateWalletStorageValue()
    //   this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    // }));

    this.provider?.connector?.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      console.log("disconnect here");
      this.signOut();
    });

    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.state.accounts = [];
    this.state.isConnected = false;

    if (!this.provider) {
      this.provider = this.getProvider()
    }

    try {
      await this.provider?.disconnect();
    } catch (e) { }

    this.provider = undefined;
    this.updateWalletStorageValue()
    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<PeraWalletSigner> {
    return async (
      transactions: AlgorandSignerTxn,
    ): Promise<SignedTx[]> => {
      this.enforceIsConnected();
      const walletConnect = this.getProvider();
      // const txnsToSign = (transactions as WalletConnectTransaction).map(txn => ({
      //   txn: Buffer.from(txn).toString("base64")
      // }));
      // const jsonRpcRequest = formatJsonRpcRequest("algo_signTxn", [txnsToSign]);
      // let signedTxns = await walletConnect.sendCustomRequest(jsonRpcRequest);
      // let signedTxns2: any = [];
      // for (let i = 0; i < signedTxns.length; i++) {
      //   if (signedTxns[i] !== null) {
      //     signedTxns2.push({
      //       txID: "",
      //       blob: new Uint8Array(Buffer.from(signedTxns[i], "base64"))
      //     })
      //   } else {
      //     signedTxns2.push({
      //       txId: "",
      //       blob: null
      //     })
      //   }
      // }

      // return signedTxns2;
      return []
    };
  }

  public async getBalance(): Promise<string> {
    throw new NotImplementedError();
  }

  public async getAssets(): Promise<PeraWalletAsset[]> {
    throw new NotImplementedError();
  }

  public getIsWalletInstalled(): boolean {
    return true; // wallet is web only so is always installed
  }

  public getIsConnected(): boolean {
    return Boolean(this.getAccounts().length)
  }

  public getPrimaryAccount(): Accounts {
    return {
      address: this.state.accounts[0],
      name: ""
    };
  }

  public getAccounts(): Accounts[] {
    return this.state.accounts.map(ob => ({ address: ob, name: "" }));
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

  public toJSON(): PeraWalletState {
    return this.state;
  }

  public getProvider(): PeraWalletConnect {
    if (this.provider instanceof PeraWalletConnect) {
      return this.provider;
    }

    this.provider = new PeraWalletConnect();
    return this.provider;
  }

  private setupInitialState() {
    const storageValue = this.walletStorage.getValue();

    if (storageValue) {
      this.state = {
        isConnected: this.getIsConnected(),
        accounts: [storageValue.account],
      };
    }
  }

  private updateWalletStorageValue() {
    if (this.state.isConnected && this.state.accounts.length > 0) {
      this.walletStorage.updateValue(true, this.state.accounts[0]);
    } else {
      this.walletStorage.updateValue(false, "");
    }
  }
}


export { PeraWallet, PeraWalletTransaction };