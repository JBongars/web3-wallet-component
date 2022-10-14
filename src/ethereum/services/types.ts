/**
 * Config for Ethereum Chain
 */
type EthereumChainConfig = {
    chainName: string;
    chainId: string; // does not follow ChainID
    nativeCurrency: {
        name: string;
        decimals: 18;
        symbol: string;
    };
    rpcUrls: string[];
};

export type { EthereumChainConfig };
