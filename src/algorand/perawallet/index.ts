import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import { PeraWalletConnect } from "@perawallet/connect";
import { SignedTx } from "@randlabs/myalgo-connect";
import { NotImplementedError, WalletNotConnectedError } from "~/src/errors";
import { WalletInterface } from "~/src/types";
import HookRouter from "~/src/utils/HookRouter/HookRouter";
import {
  HookEvent,
  WALLET_HOOK,
  WALLET_ID,
  WALLET_STATUS,
} from "~/src/utils/HookRouter/types";
import WalletStateStorage from "~/src/WalletStateStorage";
import { AlgorandSignerTxn, AlgorandWalletType, CHAIN_ALGORAND } from "..";
import { WALLET_TYPE } from "../../config/wallets";
import { PeraWalletAsset, PeraWalletSigner, PeraWalletState } from "./types";

type Accounts = {
  address: string;
  name: string;
};

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
  private walletStorage = new WalletStateStorage(
    CHAIN_ALGORAND,
    WALLET_ID.ALGORAND_PERAWALLET
  );

  public type: AlgorandWalletType = WALLET_TYPE.ALGORAND_PERAWALLET;
  public name: string = "ALGORAND_PERAWALLET";

  constructor(state?: PeraWalletState) {
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

  public async signIn(): Promise<WALLET_STATUS> {
    this.provider = this.getProvider();
    const accounts = await this.provider.connect();

    this.state.accounts = accounts.map((account) => ({
      name: "",
      address: account,
    }));
    this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
    this.updateWalletStorageValue();
    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);

    this.provider?.connector?.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }

      this.signOut();
    });

    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.state.accounts = [];
    this.state.isConnected = false;

    if (!this.provider) {
      this.provider = this.getProvider();
    }

    if (!this.provider.connector) {
      await this.provider.reconnectSession();
    }

    try {
      await this.provider?.disconnect();
    } catch (e) {}

    this.provider = undefined;
    this.updateWalletStorageValue();
    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_DISCONNECT]);
    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<PeraWalletSigner> {
    return async (transactions: AlgorandSignerTxn): Promise<SignedTx[]> => {
      this.enforceIsConnected();
      const peraWallet = this.getProvider();

      if (!peraWallet.connector) {
        await peraWallet.reconnectSession();
      }

      const txnsToSign = (transactions as PeraWalletTransaction).map((txn) => ({
        txn: Buffer.from(txn).toString("base64"),
      }));
      const jsonRpcRequest = formatJsonRpcRequest("algo_signTxn", [txnsToSign]);
      let signedTxns = await peraWallet?.connector?.sendCustomRequest(
        jsonRpcRequest
      );
      console.log({ signedTxns });

      let signedTxns2: any = [];
      for (let i = 0; i < signedTxns.length; i++) {
        if (signedTxns[i] !== null) {
          signedTxns2.push({
            txID: "",
            blob: new Uint8Array(Buffer.from(signedTxns[i], "base64")),
          });
        } else {
          signedTxns2.push({
            txId: "",
            blob: null,
          });
        }
      }

      return signedTxns2;
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
    return Boolean(this.getAccounts().length);
  }

  public getPrimaryAccount(): Accounts {
    return this.state.accounts[0];
  }

  public getAccounts(): Accounts[] {
    return Array.isArray(this.state.accounts) ? this.state.accounts : [];
  }

  public async fetchCurrentChainID(): Promise<string> {
    return "0x1";
  }

  public async mountEventListeners(): Promise<void> {}

  public onAccountChange = (
    cb: (accounts: Accounts[]) => void | Promise<void>
  ) => {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_CHANGE,
      () => {
        return cb(this.getAccounts());
      }
    );
  };

  public onAccountDisconnect = (cb: () => void | Promise<void>) => {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
      () => {
        return cb();
      }
    );
  };

  public onChainChange = (cb: (chain: string) => void | Promise<void>) => {
    return this.hookRouter.registerCallback(
      WALLET_HOOK.CHAIN_ON_CHANGE,
      async () => {
        const currentChainId = await this.fetchCurrentChainID();
        return cb(currentChainId);
      }
    );
  };

  public onBlockAdded = (
    cb: (newBlock: unknown) => void | Promise<void>
  ): HookEvent => {
    throw new NotImplementedError();
  };

  public toJSON(): PeraWalletState {
    return this.state;
  }

  public getProvider(): PeraWalletConnect {
    this.enforceIsConnected();

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
        accounts: storageValue.accounts.map((account) => ({
          name: "",
          address: account,
        })),
      };
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
}

export { PeraWallet, PeraWalletTransaction };
