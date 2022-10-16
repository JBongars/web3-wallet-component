type ConnectInfo = {
    chainId: string;
};

type ProviderRpcError = Error & {
    message: string;
    code: number;
    data?: unknown;
};

type EthereumEventAccountsChanged = (accounts: string[]) => Promise<void>;
type EthereumEventChainChanged = (chainId: string) => Promise<void>;
type EthereumEventConnect = (connectInfo: ConnectInfo) => Promise<void>;
type EthereumEventDisconnect = (error: ProviderRpcError) => Promise<void>;
type EthereumEventMessage = (message: unknown) => Promise<void>;

type EthereumEvent = ((key: 'accountsChanged', cb: EthereumEventAccountsChanged) => void) &
    ((key: 'chainChanged', cb: EthereumEventChainChanged) => void) &
    ((key: 'connect', cb: EthereumEventConnect) => void) &
    ((key: 'disconnect', cb: EthereumEventDisconnect) => void) &
    ((key: 'message', cb: EthereumEventMessage) => void);

export type {
    ConnectInfo,
    ProviderRpcError,
    EthereumEventAccountsChanged,
    EthereumEventChainChanged,
    EthereumEventConnect,
    EthereumEventDisconnect,
    EthereumEventMessage,
    EthereumEvent
};
