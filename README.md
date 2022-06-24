# Wallet-Component

Component for managing state for different wallets in a single page such as for multi chain applications. Can be extended in the future to support other more chains and wallets as well as become more polished with time.

## Supported Chains and Wallets

### Ethereum
- Metamask

### Algorand
- MyAlgo

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