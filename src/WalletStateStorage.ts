import { isValidAddress } from 'algosdk';
import { isAddress } from 'ethers/lib/utils';
import { CHAIN_ALGORAND } from './algorand';
import { useWindow } from './containers';
import { CHAIN_ETHEREUM } from './ethereum';
import { WALLET_ID } from './utils/HookRouter/types';

/**
 * Schema for Storage
 */
type StorageValue = {
    isConnected: boolean;
    connectedAccount: string;
    chain: string;
    walletId: WALLET_ID;
    accounts: string[];
};

const STORAGE_KEY = 'wallet-state-storage';

/**
 *  Wallet Storage is used to make the wallet state persistent even after the user refreshes the page
 *  @remarks uses the Web Storage API and may not be compatible with older browsers
 *  Maybe be replaced with less coupled implementation in the future
 */
class WalletStateStorage {
    private chain: string;
    private storage: Storage | null;
    private walletId: WALLET_ID;

    /**
     * Constructor for storage
     * @param chain - The chain identifier to use as key
     * @param walletId - Current wallet ID
     */
    constructor(chain: string, walletId: WALLET_ID) {
        this.chain = chain;
        this.walletId = walletId;
        this.storage = this._storage();
    }

    /**
     * gets the content of the storage per walletid
     * @returns the storage value for chain
     */
    public getValue(): StorageValue | null {
        const value =
            this.values().find((state) => state.chain === this.chain && this.walletId == state.walletId) || null;

        if (value && !this.isValidAddress(value.connectedAccount)) {
            return {
                isConnected: false,
                connectedAccount: '',
                chain: this.chain,
                walletId: this.walletId,
                accounts: value.accounts
            };
        }

        return value;
    }

    /**
     * Updates the values saved in storage
     * @param isConnected - storage value to save
     * @param connectedAccount  - storage value to save
     * @param accounts  - storage value to save
     */
    public updateValue(isConnected: boolean, connectedAccount: string, accounts: string[]): void {
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
                        accounts
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
                accounts
            });
        }

        this.storage?.setItem(STORAGE_KEY, JSON.stringify(values));
    }

    /**
     * Validates the account string using respective chain methods
     * @param account - account string to check
     * @returns is account string valid
     */
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

    /**
     * parse raw value
     * @returns parsed values
     */
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
