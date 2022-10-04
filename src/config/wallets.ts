/**
 * Wallet types representing low level wallets
 */
enum WALLET_TYPE {
    ETHEREUM_METAMASK,
    ETHEREUM_WALLETCONNECT,
    ALGORAND_MYALGO,
    ALGORAND_WALLETCONNECT,
    ALGORAND_PERAWALLET
}

/**
 * Chain types representing blockchains above @see WALLET_TYPE are associated to
 */
enum CHAIN_TYPE {
    ALGORAND,
    ETHEREUM
}

export { WALLET_TYPE, CHAIN_TYPE };
