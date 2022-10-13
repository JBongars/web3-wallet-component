/**
 * Wallet statuses
 */
enum WALLET_STATUS {
    /**
     * Wallet is OK
     */
    OK,
    /**
     * There was a problem logging in
     * @remarks user may have cancelled the transaction
     */
    LOGIN_ERROR,
    /**
     * There was a problem initializing the wallet
     */
    WALLET_ERROR,
    /**
     * There was a problem initializing the  wallet because the extension was not found
     */
    EXTENSION_NOT_FOUND,
    /**
     * The Wallet account was not found
     */
    ACCOUNT_NOT_FOUND
}

/**
 * Identifier for Wallet
 * @remarks example Metamask, WalletConnect, etc...
 */
enum WALLET_ID {
    ETHEREUM_METAMASK = 0,
    ALGORAND_MYALGO = 1,
    ALGORAND_WALLETCONNECT = 2,
    ETHEREUM_WALLETCONNECT = 3,
    ALGORAND_PERAWALLET = 4
}

/**
 * Wallet Hook events
 * @remarks events are based on Metamask
 */
enum WALLET_HOOK {
    /**
     * User has prompted to change chains on the wallet
     */
    CHAIN_ON_CHANGE,
    CHAIN_ON_DISCONNECT,
    ACCOUNT_ON_CHANGE,
    ACCOUNT_ON_DISCONNECT,
    NEW_BLOCK,
    CONNECT
}

type HookEvent = {
    destroy: () => void;
    id: symbol;
};

export { WALLET_HOOK, WALLET_STATUS, WALLET_ID };
export type { HookEvent };
