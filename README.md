# Wallet-Component

Component for managing state for different wallets in a single page such as for multi chain applications. Can be extended in the future to support other more chains and wallets as well as become more polished with time.

## Supported Chains and Wallets

### Ethereum

-   Metamask
-   WalletConnect

### Algorand

-   MyAlgo
-   WalletConnect
-   Pera Wallet

## Getting Started

### Install Packages

1. `yarn add wallet-component`
2. `npm i wallet-component`

### Configure and Initialize Wallets

```ts
// Super Wallet
const superWallet = new SuperWallet({
  defaultChain: CHAIN_TYPE.ETHEREUM,
  chains: [
    {
      type: CHAIN_TYPE.ETHEREUM
    },
    {
      type: CHAIN_TYPE.ALGORAND
    }
  ]
};

superWallet.init().then(() => {
  superWallet.signIn(); // WALLET_STATUS.OK
});

// Chain Wallet
const algorand = new Algorand({});

algorand.init().then(() => {
  algorand.signIn();
})

// Wallet
const myAlgo = new MyAlgo({});

myAlgo.init().then(() => {
  myAlgo.signIn();
})
```

### Configure Hooks

```ts
superWallet.onAccountChange((chain, wallet, accounts) => {
    console.log('Account has changed!');
    console.log(`chain: ${chain}`);
    console.log(`wallet: ${wallet}`);
    console.log(`accounts: ${accounts}`);
});
```

## Design

### Super Wallet

### Chain Wallet (Ethereum, Algorand, etc...)

### Wallet (Metamask, MyAlgo, etc...)

## Road Map

-   Features
    -   [ ] Mock Next Application for testing changes in isolation (In progress)
    -   [ ] React Context Component (To be confirmed)
    -   [ ] Wallet Widget

### Details

#### Mock Next Application for testing changes in isolation (In progress)

We are creating a mock react application to test the wallet-component in isolation. Once we have created a widget as well, this will be onboarded there instead.

#### React Context Component (To be confirmed)

Run the wallet-component as a react context then include the provider in the root of any project. The wallet state and methods should then be available on any component.

#### Wallet Widget

![Wallet Widget](docs/images/wallet_widget.png?raw=true 'Wallet Widget')

A wallet widget with a button that we can use on all our dapps moving forward. Should have the ability to connect to multiple wallets even on the same chain and manage transactions in a stateless way. Details and design for this to be confirmed in the future but we are using https://app.nf.domains/ as a reference.
