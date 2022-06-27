import { MyAlgo } from "./algorand";
import { MetaMask } from "./ethereum";
import { NotImplementedError, WalletInterface, WALLETS } from "./types";
import { clone, iffyClone, useProxy } from "./utils";

type WalletID = keyof typeof WALLETS;

type WalletState = {
  id: WalletID;
  state: {
    [key: string]: unknown;
  };
  previousStates: {
    [key: string]: unknown;
  }[];
};

type WalletStoreConfig = {
  previousWalletState?: WalletState[];
};

class WalletStore {
  private walletStates: WalletState[];

  constructor(config: WalletStoreConfig) {
    this.walletStates = config.previousWalletState || [];
  }

  private updateState(key: WalletID, newState: { [key: string]: unknown }) {
    const wallet: WalletState | null | undefined = this.walletStates.find(
      (elem) => elem.id === key
    );

    if (!wallet || wallet === null) {
      const newWalletState = {
        id: key,
        state: newState,
        previousStates: [],
      };
      this.walletStates.push(newWalletState);
      return newWalletState;
    }

    wallet.previousStates.push(wallet.state);
    wallet.state = newState;

    return wallet;
  }

  public use(walletName: WalletID): ProxyHandler<{ [key: string]: unknown }> {
    return useProxy(async (prop: string | Symbol) => {
      if (prop === "state") {
        return iffyClone(
          this.walletStates.find((elem) => elem.id === walletName)?.state
        );
      }

      let target: WalletInterface<{ [key: string]: unknown }>;

      switch (walletName) {
        case WALLETS.METAMASK:
          target = new MetaMask();
          break;
        case WALLETS.MYALGO:
          target = new MyAlgo();
          break;
        default:
          throw new NotImplementedError();
      }

      const result =
        target[prop as keyof WalletInterface<{ [key: string]: unknown }>];
      await this.updateState(walletName, target.toJSON());

      return result;
    });
  }

  public toJSON() {
    return this.walletStates.map((elem) => clone(elem)) as WalletState[];
  }
}

export { WalletStore };
export type { WalletID, WalletState, WalletStoreConfig };
