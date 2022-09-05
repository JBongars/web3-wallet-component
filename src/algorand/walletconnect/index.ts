import { SignedTx } from "@randlabs/myalgo-connect";
import WalletConnectClient from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { NotImplementedError, WalletNotConnectedError } from "~/src/errors";
import HookRouter from "~/src/utils/HookRouter/HookRouter";
import {
  HookEvent,
  WALLET_HOOK,
  WALLET_STATUS
} from "~/src/utils/HookRouter/types";
import { WalletInterface } from "../../types";
import { WalletConnectAsset, WalletConnectSigner, WalletConnectState } from "./types";

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
  private provider: WalletConnectClient | undefined;

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

  public async signIn(): Promise<WALLET_STATUS> {
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
      transactions: any
    ): Promise<SignedTx[]> => {
      this.enforceIsConnected();
      const walletConnect = this.getProvider();
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

  public getProvider(): WalletConnectClient {
    if (this.provider instanceof WalletConnectClient) {
      return this.provider;
    }

    this.provider = new WalletConnectClient({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
    return this.provider;
  }
}

export { WalletConnect };
