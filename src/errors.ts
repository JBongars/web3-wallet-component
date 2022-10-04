/**
 * Method or function is not implemented
 */
class NotImplementedError extends Error {
    constructor(message = 'NotImplementedError') {
        super(message);
        this.name = 'NotImplementedError';
    }
}

/**
 * Wallet method was invoked although wallet was not installed
 */
class WalletNotInstalledError extends Error {
    constructor(message = 'WalletNotInstalledError') {
        super(message);
        this.name = 'WalletNotInstalledError';
    }
}

/**
 * Wallet method was invoked although wallet was not connected
 */
class WalletNotConnectedError extends Error {
    constructor(message = 'WalletNotConnectedError') {
        super(message);
        this.name = 'WalletNotConnectedError';
    }
}

/**
 * Hook was registered with an event that is not supported
 */
class HookNotAvailableError extends Error {
    constructor(message = 'HookNotAvailableError') {
        super(message);
        this.name = 'HookNotAvailableError';
    }
}

export { NotImplementedError, WalletNotInstalledError, WalletNotConnectedError, HookNotAvailableError };
