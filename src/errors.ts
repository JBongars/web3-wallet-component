class NotImplementedError extends Error {
  constructor(message: string = "NotImplementedError") {
    super(message);
    this.name = "NotImplementedError";
  }
}

class WalletNotInstalledError extends Error {
  constructor(message: string = "WalletNotInstalledError") {
    super(message);
    this.name = "WalletNotInstalledError";
  }
}

class WalletNotConnectedError extends Error {
  constructor(message: string = "WalletNotConnectedError") {
    super(message);
    this.name = "WalletNotConnectedError";
  }
}

class HookNotAvailableError extends Error {
  constructor(message: string = "HookNotAvailableError") {
    super(message);
    this.name = "HookNotAvailableError";
  }
}

export {
  NotImplementedError,
  WalletNotInstalledError,
  WalletNotConnectedError,
  HookNotAvailableError,
};
