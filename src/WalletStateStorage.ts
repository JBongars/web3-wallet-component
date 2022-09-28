import { isValidAddress } from "algosdk";
import { isAddress } from "ethers/lib/utils";
import { CHAIN_ALGORAND } from "./algorand";
import { useWindow } from "./containers";
import { CHAIN_ETHEREUM } from "./ethereum";
import { WALLET_ID } from "./utils/HookRouter/types";

type StorageValue = {
  isConnected: boolean;
  connectedAccount: string;
  chain: string;
  walletId: WALLET_ID;
  accounts: string[];
};

const STORAGE_KEY = "wallet-state-storage";

class WalletStateStorage {
  private chain: string;
  private storage: Storage | null;
  private walletId: WALLET_ID;

  constructor(chain: string, walletId: WALLET_ID) {
    this.chain = chain;
    this.walletId = walletId;
    this.storage = this._storage();
  }

  public getValue(): StorageValue | null {
    const value =
      this.values().find(
        (state) => state.chain === this.chain && this.walletId == state.walletId
      ) || null;

    if (value && !this.isValidAddress(value.connectedAccount)) {
      return {
        isConnected: false,
        connectedAccount: "",
        chain: this.chain,
        walletId: this.walletId,
        accounts: value.accounts,
      };
    }

    return value;
  }

  public updateValue(
    isConnected: boolean,
    connectedAccount: string,
    accounts: string[]
  ): void {
    const exisitingValues = this.getValue();
    let values = this.values();

    if (exisitingValues) {
      values = values.map((value) => {
        if (value.chain === this.chain && value.walletId === this.walletId) {
          return {
            chain: this.chain,
            isConnected,
            connectedAccount,
            walletId: this.walletId,
            accounts,
          };
        }
        return value;
      });
    } else {
      values = values.concat({
        chain: this.chain,
        isConnected,
        connectedAccount,
        walletId: this.walletId,
        accounts,
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
