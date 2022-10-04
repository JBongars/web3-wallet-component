type ChainConfig = {
    chainName: string;
    chainId: string;
    nativeCurrency: {
        name: string;
        decimals: number;
        symbol: string;
    };
    rpcUrls: string[];
};

const rinkebyEth: ChainConfig = {
    chainName: 'Rinkeby Test Network',
    chainId: '0x4',
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    rpcUrls: ['https://rinkeby.etherscan.io']
};

const mainnetEth: ChainConfig = {
    chainName: 'Rinkeby Test Network',
    chainId: '0x1',
    nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
    rpcUrls: ['https://rinkeby.etherscan.io']
};

const getChainConfig = (chainId: number): ChainConfig => {
    switch (chainId) {
        case 1:
            return mainnetEth;
        case 4:
            return rinkebyEth;
        default:
            throw new Error(`ChainId ${chainId} configuration not found`);
    }
};

export { rinkebyEth, mainnetEth, getChainConfig };
