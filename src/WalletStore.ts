import { MyAlgo } from "./algorand";
import { MyAlgoState } from "./algorand/myalgo/types";
import { NotImplementedError } from "./errors";
import { Metamask } from "./ethereum";
import { MetamaskState } from "./ethereum/metamask/types";
import { useWallets, WalletInterface, WALLETS } from "./types";
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

class WalletStore implements useWallets {
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

  public use(walletName: WalletID): any {
    return useProxy((prop: string | Symbol) => {
      if (prop === "state") {
        return iffyClone(
          this.walletStates.find((elem) => elem.id === walletName)?.state
        );
      }

      // there may be an issue where if the client preserves multiple
      // proxies, the wallet state could fall out of sync...
      let target: WalletInterface<{ [key: string]: unknown }>;
      const previousState: unknown = this.walletStates.find(
        (elem) => elem.id === walletName
      )?.state;

      switch (walletName) {
        case WALLETS.METAMASK:
          target = new Metamask(previousState as MetamaskState);
          break;
        case WALLETS.MYALGO:
          target = new MyAlgo(previousState as MyAlgoState);
          break;
        default:
          throw new NotImplementedError();
      }

      if (
        typeof target[
          prop as keyof WalletInterface<{ [key: string]: unknown }>
        ] !== "function"
      ) {
        return target[
          prop as keyof WalletInterface<{ [key: string]: unknown }>
        ];
      }

      return async (...args: any[]) => {
        const result = await target[
          prop as keyof WalletInterface<{ [key: string]: unknown }>
        ](...(args as []));

        this.updateState(walletName, target.toJSON());

        return result;
      };
    });
  }

  public toJSON() {
    return this.walletStates.map((elem) => clone(elem)) as WalletState[];
  }
}

export { WalletStore };
export type { WalletID, WalletState, WalletStoreConfig };
