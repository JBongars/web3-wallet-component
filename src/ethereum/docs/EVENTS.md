# `window.on` Events

The Provider MUST implement the following event handling methods:

## link:

https://eips.ethereum.org/EIPS/eip-1193

## on

removeListener
These methods MUST be implemented per the Node.js EventEmitter API.

## link: https://eips.ethereum.org/EIPS/eip-1193

To satisfy these requirements, Provider implementers should consider simply extending the Node.js EventEmitter class and bundling it for the target environment.

## list

-   message
-   connect
-   disconnect
-   chainChanged
-   accountsChanged

### message

The message event is intended for arbitrary notifications not covered by other events.

When emitted, the message event MUST be emitted with an object argument of the following form:

```ts
interface ProviderMessage {
    readonly type: string;
    readonly data: unknown;
}
```

## Subscriptions

If the Provider supports Ethereum RPC subscriptions, e.g. eth_subscribe, the Provider MUST emit the message event when it receives a subscription notification.

If the Provider receives a subscription message from e.g. an eth_subscribe subscription, the Provider MUST emit a message event with a ProviderMessage object of the following form:

```ts
interface EthSubscription extends ProviderMessage {
    readonly type: 'eth_subscription';
    readonly data: {
        readonly subscription: string;
        readonly result: unknown;
    };
}
```

### connect

See the section Connectivity for the definition of “connected”.

If the Provider becomes connected, the Provider MUST emit the event named connect.

This includes when:

The Provider first connects to a chain after initialization.
The Provider connects to a chain after the disconnect event was emitted.
This event MUST be emitted with an object of the following form:

```ts
interface ProviderConnectInfo {
    readonly chainId: string;
}
```

chainId MUST specify the integer ID of the connected chain as a hexadecimal string, per the eth_chainId Ethereum RPC method.

### disconnect

See the section Connectivity for the definition of “disconnected”.

If the Provider becomes disconnected from all chains, the Provider MUST emit the event named disconnect with value error: ProviderRpcError, per the interfaced defined in the RPC Errors section. The value of the error’s code property MUST follow the status codes for CloseEvent.

### chainChanged

If the chain the Provider is connected to changes, the Provider MUST emit the event named chainChanged with value chainId: string, specifying the integer ID of the new chain as a hexadecimal string, per the eth_chainId Ethereum RPC method.

### accountsChanged

If the accounts available to the Provider change, the Provider MUST emit the event named accountsChanged with value accounts: string[], containing the account addresses per the eth_accounts Ethereum RPC method.

The “accounts available to the Provider” change when the return value of eth_accounts changes.
