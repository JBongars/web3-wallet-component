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

export {
  NotImplementedError,
  WalletNotInstalledError,
  WalletNotConnectedError,
};
