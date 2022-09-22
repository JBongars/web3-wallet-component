import { isValidAddress } from "algosdk";
import { isAddress } from "ethers/lib/utils";
import { CHAIN_ALGORAND } from "./algorand";
import { useWindow } from "./containers";
import { CHAIN_ETHEREUM } from "./ethereum";
import { WALLET_ID } from "./utils/HookRouter/types";

type StorageValue = {
  isConnected: boolean;
  account: string;
  chain: string;
  walletid: WALLET_ID
};

const STORAGE_KEY = "wallet-state-storage";

class WalletStateStorage {
  private chain: string;
  private storage: Storage | null;
  private walletid: WALLET_ID

  constructor(chain: string, walletid: WALLET_ID) {
    this.chain = chain;
    this.walletid = walletid
    this.storage = this._storage();
  }

  public getValue(): StorageValue | null {
    const value = this.values().find((state) => state.chain === this.chain && this.walletid == state.walletid) || null;

    if (value && !this.isValidAddress(value.account)) {
      return {
        isConnected: false,
        account: "",
        chain: this.chain,
        walletid: this.walletid
      };
    }

    return value
  }

  public updateValue(isConnected: boolean, account: string): void {
    const exisitingValues = this.getValue();
    let values = this.values();

    if (exisitingValues) {
      values = values.map((value) => {
        if (value.chain === this.chain && value.walletid === this.walletid) {
          return {
            chain: this.chain,
            isConnected,
            account,
            walletid: this.walletid
          };
        }
        return value;
      });
    } else {
      values = values.concat({
        chain: this.chain,
        isConnected,
        account,
        walletid: this.walletid
      });
    }

    this.storage?.setItem(STORAGE_KEY, JSON.stringify(values));
  }

  private isValidAddress(account: string): boolean {
    switch (this.chain) {
      case CHAIN_ETHEREUM:
        return isAddress(account);
      case CHAIN_ALGORAND:
        return isValidAddress(account);
      default:
        return false;
    }
  }

  private values(): StorageValue[] {
    const values = this._storage()?.getItem(STORAGE_KEY);
    return values ? JSON.parse(values) : [];
  }

  private _storage(): Storage | null {
    return useWindow((windowObject) => (windowObject as any).localStorage);
  }
}

export default WalletStateStorage;

export type { StorageValue };
