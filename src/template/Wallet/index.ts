import { Signer, WalletInterface } from "~/src/types";
import { NotImplementedError } from "../../errors";
import { HookEvent, WALLET_STATUS } from "../../utils/HookRouter/types";
import { Asset } from "./types";

type State = {};

const initialState: Readonly<State> = Object.freeze({});

class Wallet implements WalletInterface<State> {
  public state: State;

  constructor(state?: State) {
    if (state) {
      this.state = { ...state };
    } else {
      this.state = { ...initialState };
    }
  }

  public async init(): Promise<WALLET_STATUS> {
    throw new NotImplementedError();
  }

  public async signIn(): Promise<WALLET_STATUS> {
    throw new NotImplementedError();
  }

  public async signOut(): Promise<WALLET_STATUS> {
    throw new NotImplementedError();
  }

  public async getSigner(): Promise<Signer<unknown, unknown>> {
    throw new NotImplementedError();
  }

  public async getBallance(): Promise<number> {
    throw new NotImplementedError();
  }

  public async getAssets(): Promise<Asset[]> {
    throw new NotImplementedError();
  }

  public getBalance(): Promise<string> {
    throw new NotImplementedError();
  }

  public getIsConnected(): boolean {
    throw new NotImplementedError();
  }

  public getIsWalletInstalled(): boolean {
    throw new NotImplementedError();
  }

  public getPrimaryAccount(): unknown {
    throw new NotImplementedError();
  }

  public getAccounts(): unknown[] {
    throw new NotImplementedError();
  }

  public fetchCurrentChainID(): Promise<string> {
    throw new NotImplementedError();
  }

  public async mountEventListeners(): Promise<void> {}

  public onAccountDisconnect = (cb: () => void | Promise<void>): HookEvent => {
    throw new NotImplementedError();
  };

  public onAccountChange = (
    cb: (accounts: unknown) => void | Promise<void>
  ): HookEvent => {
    throw new NotImplementedError();
  };

  public onChainChange = (
    cb: (chainId: string) => void | Promise<void>
  ): HookEvent => {
    throw new NotImplementedError();
  };

  public onBlockAdded = (
    cb: (block: unknown) => void | Promise<void>
  ): HookEvent => {
    throw new NotImplementedError();
  };

  public toJSON(): State {
    return this.state;
  }
}

export { Wallet };
export type { State as WalletState };
