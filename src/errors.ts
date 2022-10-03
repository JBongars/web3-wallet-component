class NotImplementedError extends Error {
    constructor(message = 'NotImplementedError') {
        super(message);
        this.name = 'NotImplementedError';
    }
}

class WalletNotInstalledError extends Error {
    constructor(message = 'WalletNotInstalledError') {
        super(message);
        this.name = 'WalletNotInstalledError';
    }
}

class WalletNotConnectedError extends Error {
    constructor(message = 'WalletNotConnectedError') {
        super(message);
        this.name = 'WalletNotConnectedError';
    }
}

class HookNotAvailableError extends Error {
    constructor(message = 'HookNotAvailableError') {
        super(message);
        this.name = 'HookNotAvailableError';
    }
}

export { NotImplementedError, WalletNotInstalledError, WalletNotConnectedError, HookNotAvailableError };
