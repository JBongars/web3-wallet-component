# Wallet-Component

Component for managing state for different wallets in a single page such as for multi chain applications. Can be extended in the future to support other more chains and wallets as well as become more polished with time.

## Supported Chains and Wallets

### Ethereum
- Metamask

### Algorand
- MyAlgo

## Design

### Simple Wallet Store
![Simple Wallet Store](docs/images/simple_wallet_store_diagram.svg?raw=true "Simple Wallet Store")
#### Steps
1. Store composes of one or many chains saved as ```Store.chain1```, ```Store.chain2```, etc...
2. Chains are composed of one or many wallets saved as ```Chain.wallet1```, ```Chain.wallet2```, etc...
3. The wallet class will implement some common interface and be stand alone and will contain all the logic to use the wallet.
4. The client will then use the wallet directly as intended. The wallet may or may not have a state but this is not managed outside of the wallet.

#### Considerations
This design is the simplest and most straightforward to implement however it may become impossible to enforce stricter wallet standards. This also forces the user to manage multiple wallet states instead of having some centralized place to store the wallet thus this approach may increase in complexity as we add additional chains and wallets although at this stage it offers the most flexibility.
### Proxy Wallet Store
![Proxy Wallet Store](docs/images/proxy_wallet_store_diagram.svg?raw=true "Proxy Wallet Store")

#### Steps
1. The client will make a request to the ```Store.use('WALLET')``` method which will return a proxy that looks like the wallet class.
2. The Proxy will pull the state cache from the store and construct a new classs instance of the wallet. If the state is empty, it will generate a new state.
3. If the client attempts to use some method in the ```Wallet``` class, instead of the method, some asynchronous callback function will be returned. Think of this as a wrapped method.
4. When the callback function is called, the new state will be pulled from the wallet using the ```toJSON``` method.
5. This will be synced with the global state cache from step 2
6. The result will be returned to the client. From the client's eyes, it will look like the ```Store.use``` method simply returns the Wallet Object and they can use it directly. However, the state is cached automatically and the Wallet object will self destruct once it is no longer used.

#### Code example
1. Backend
```js
const use = () => new Proxy({}, {
  // proxy listens for prop
  get(_target, prop){

    // return wallet prop if not function
    if(typeof Wallet[prop] !== 'function'){

      // create the wallet
      const target = new Wallet(this.globalState)

      // return value
      return target[prop]
    }

    // return async callback
    return async (...args) => {
      
      // create the wallet
      // ensures that the wallet state is in sync with the global state
      const target = new Wallet(this.globalState)
      
      // interact with the wallet
      const result = await target[prop](...args);

      // save the state to the global state
      setGlobalState(target.getState())

      // return the result
      return result;
    }
  }
})
```
2. Client
```js
// Create the Store
const store = new Store();

// Get the Wallet
const wallet = store.use("MYALGO");

// Use the Wallet directly
await wallet.signIn();
const result = wallet.getBallance(); // no error
```
3. Using the Wallet in a persistent way
```ts
// use the store
const store = new Store();
const wallet = store.use("MYALGO");
await wallet.signIn();
const result = wallet.getBallance(); // no error

// save the state
window.storage.sync.set(
  ['wallet-component', store.getState()], 
  () => console.log("storage state updated")
);

// refresh the page...

// retrieve the state
const state = window.storage.sync.get('wallet-component')
const store = new Store({ state });
const wallet = store.use("MYALGO");

const result = wallet.getBallance(); // no error
```

#### Considerations
There is a significantly higher amount of complexity and overhead for this store to work meaning that this method might be more prone to bugs and polishing before this can be safe to use. The up side is since we are managing state in one place and all wallets are both stateless and virtual, this solution could become more scalable as we integrate more wallets. One consideration we might have is making sure that for each context and for each call to the callback, we have to make sure that the global state is in sync otherwise we could end up in a situation where two or more wallets drift out of sync with each other. Just from the complexity, this solution may also become more difficult to maintain over time.

## API

### WalletInterface

| key | args | Returns | description |
| -- | -- | -- | -- |
| signIn | none | Promise(status) | Prompt the user to log into their wallet |
| signOut | none | Promise(status) | Prompt the user to log out of their wallet (does nothing if this feature is not implement for the current wallet) |
| getSigner | none | Promise(Signer) | Returns a Signer to sign transactions. Can be called once or as many times as required |
| getBallance | none | Promise(number) | Return the current supply of native coin |
| getAssets | none | Promise(Assets) | Returns a list of assets from the wallet which can include the native coin. Pull the Asset type directly from the class |

### WalletAttributes

| key | type | description |
| -- | -- | -- |
| state | State | the local state of the wallet. Pul the Wallet State type directly from the Wallet class |

### Types

#### Signer
Signer function that can take a list of transactions and convert it to a list of signed transactions

```ts
type Signer = (
    transactions: unknown[]
) => Promise<{ signedTransaction: unknown[]; status: WALLET_STATUS }>;
```
 
### Errors

| name | definition |
| -- | -- |
| NotImplementedError | Method was not implemented |

### Constants/ Enums

#### WALLET_STATUS
| name | description |
| -- | -- |
| OK | Operation was successful with no apparent errors |
| LOGIN_ERROR | User login failed either because the user rejected the request or because the method failed |
| WALLET_ERROR | Wallet failure or returned an unexpected code. Error was logged |
| EXTENSION_NOT_FOUND | Wallet Extension was not found on the browser |

## Road Map
- Chains
  - Ethereum
    - [ ] Metamask
      - [ ] signIn
      - [ ] signOut
      - [ ] getSigner
      - [ ] getBallance
      - [ ] getAssets
  - Algorand
    - [ ] MyAlgo
      - [ ] signIn
      - [ ] signOut
      - [ ] getSigner
      - [ ] getBallance
      - [ ] getAssets
- Features
  - [ ] ReactContext component
  - [ ] Wallet Widget (see Example below)

### Wallet Widget (WIP)
example: https://app.nf.domains/

![Wallet Widget](docs/images/wallet_widget.png?raw=true "Wallet Widget")