import { WalletInterface } from "../../types";
import { WalletConnectAsset, WalletConnectSigner, WalletConnectState } from "./types";
import { NotImplementedError, WalletNotConnectedError } from "~/src/errors";
import { CHAINS } from "~/src/config/constants";
import HookRouter from "~/src/utils/HookRouter/HookRouter";
import {
  HookEvent,
  WALLET_HOOK,
  WALLET_STATUS,
} from "~/src/utils/HookRouter/types";
import WalletConnectClient from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";

type WalletConnectConfig = {};

const initialState: Readonly<WalletConnectState> = Object.freeze({
  accounts: [],
  isConnected: false,
});

class WalletConnect implements WalletInterface<WalletConnectState> {
  private hookRouter: HookRouter = new HookRouter([
    WALLET_HOOK.ACCOUNT_ON_CHANGE,
    WALLET_HOOK.ACCOUNT_ON_DISCONNECT,
    WALLET_HOOK.CHAIN_ON_CHANGE,
  ]);
  public state: WalletConnectState;
  private provider: WalletConnect | undefined;

  constructor(state?: WalletConnectState) {
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

  public async signIn(options: WalletConnectConfig = {}): Promise<WALLET_STATUS> {
    const connector = new WalletConnectClient({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
    
    if (!connector.connected) {
      // create new session
      await connector.createSession();
    } else {
      const { accounts } = connector;
      
      this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
      this.state.accounts = accounts;
      this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    }

    connector.on("connect", ((error, payload) => {
      if (error) {
        throw error;
      }
      
      // Get provided accounts
      const { accounts } = payload.params[0];
      this.state.isConnected = Array.isArray(accounts) && accounts.length > 0;
      this.state.accounts = accounts;
      this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    }));

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      this.signOut();
    });

    return WALLET_STATUS.OK;
  }

  public async signOut(): Promise<WALLET_STATUS> {
    this.enforceIsConnected();
    this.state.accounts = [];
    this.state.isConnected = false;

    this.hookRouter.applyHooks([WALLET_HOOK.ACCOUNT_ON_CHANGE]);
    return WALLET_STATUS.OK;
  }

  public async getSigner(): Promise<WalletConnectSigner> {
    return async (
      // @ts-ignore
      transactions: AlgorandTxn[] | EncodedTransaction[]
      // @ts-ignore
    ): Promise<SignedTx[]> => {
      this.enforceIsConnected();
      const walletConnect = this.getProvider();
      // @ts-ignore
      const signedTx = await walletConnect.signTransaction(transactions);

      return signedTx;
    };
  }

  public async getBalance(): Promise<string> {
    throw new NotImplementedError();
  }

  public async getAssets(): Promise<WalletConnectAsset[]> {
    throw new NotImplementedError();
  }

  public getIsWalletInstalled(): boolean {
    return true; // wallet is web only so is always installed
  }

  public getIsConnected(): boolean {
    return this.state.isConnected;
  }

  public getPrimaryAccount(): string {
    return this.state.accounts[0];
  }

  public getAccounts(): string[] {
    return this.state.accounts;
  }

  public async fetchCurrentChainID(): Promise<string> {
    return "0x1";
  }

  public onAccountChange(cb: (accounts: string) => void | Promise<void>) {
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

  public toJSON(): WalletConnectState {
    return this.state;
  }

  public getProvider(): WalletConnect {
    if (this.provider instanceof WalletConnect) {
      return this.provider;
    }

    this.provider = new WalletConnect();
    return this.provider;
  }
}

export { WalletConnect };
export { WalletConnectConfig };
