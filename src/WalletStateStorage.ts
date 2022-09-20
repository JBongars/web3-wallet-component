import { isValidAddress } from "algosdk";
import { isAddress } from "ethers/lib/utils";
import { CHAIN_ID_ALGORAND } from "./algorand";
import { useWindow } from "./containers";
import { CHAIN_ID_ETH } from "./ethereum";

type StorageValue = {
  isConnected: boolean;
  account: string;
  chainId: number;
};

const STORAGE_KEY = "wallet-state-storage";

class WalletStateStorage {
  private chainId: number;
  private storage: Storage | null;

  constructor(chainId: number) {
    this.chainId = chainId;
    this.storage = this._storage();
  }

  public getValue(): StorageValue | null {
    const value = this.values().find((state) => state.chainId === this.chainId) || null;

    if (value && !this.isValidAddress(value.account)) {
      return {
        isConnected: false,
        account: "",
        chainId: this.chainId
      };
    } 

    return value
  }

  public updateValue(isConnected: boolean, account: string): void {
    const exisitingValues = this.getValue();
    let values = this.values();

    if (exisitingValues) {
      values = values.map((value) => {
        if (value.chainId === this.chainId) {
          return {
            chainId: this.chainId,
            isConnected,
            account,
          };
        }
        return value;
      });
    } else {
      values = values.concat({
        chainId: this.chainId,
        isConnected,
        account,
      });
    }

    this.storage?.setItem(STORAGE_KEY, JSON.stringify(values));
  }

  private isValidAddress(account: string): boolean {
    switch (this.chainId) {
      case CHAIN_ID_ETH:
        return isAddress(account);
      case CHAIN_ID_ALGORAND:
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
