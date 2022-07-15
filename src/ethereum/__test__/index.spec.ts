import { useWindow } from '../../containers/window';
import { MetaMask } from '../metamask';
import {BigNumber, ethers} from "ethers";
import {NotImplementedError, WALLET_STATUS} from "./../../types";
import {EventEmitter} from "events";
import Web3 from "web3";

const WALLET_ADDRESS = 'test-address';

const WINDOW_ETHEREUM = {
  isMetaMask: true,
  request: async (request: { method: string, params?: Array<unknown> }) => {
    // console.log(request.method); to see the different requests made by ethers
    if (['eth_accounts', 'eth_requestAccounts'].includes(request.method)) {
      return [WALLET_ADDRESS]
    }

    throw Error(`Unknown request: ${request.method}`);
  },
}

jest.mock('../../containers/window', () => {
    return {
        useWindow: () => WINDOW_ETHEREUM
    };
});

describe('#Metamask Class', () => {
  test('can get provider', async () => {
    const metamask = new MetaMask();

    const provider = await metamask.getProvider();

    expect(provider).toBeInstanceOf(ethers.providers.Web3Provider)
  });

  test('can sign in', async() => {
    const metamask = new MetaMask();

    await metamask.signIn()

    expect(metamask.state.isConnected).toBeTruthy()
    expect(metamask.state.accounts[0]).toEqual('test-address')
  })

  test('can sign out', async() => {
    const metamask = new MetaMask({
      accounts: [WALLET_ADDRESS],
      isConnected: true
    });

    await metamask.signOut()

    expect(metamask.state.isConnected).toBeFalsy()
    expect(metamask.state.accounts).toHaveLength(0)
  })

  test("get asset should throw NotImplementedError", async () => {
    const metamask = new MetaMask;

    await expect(async () => await metamask.getAssets()).rejects.toThrowError(NotImplementedError);
  });

  test("can get the account balance", async () => {
    const getBalanceSpy =  jest
      .spyOn(ethers.providers.Web3Provider.prototype, "getBalance")
      .mockImplementation( async (): Promise<BigNumber> => {
        return BigNumber.from(99);
      });

    const metamask = new MetaMask({
      accounts: [WALLET_ADDRESS],
      isConnected: true
    });

    const balance = await metamask.getBalance()

    expect(getBalanceSpy).toHaveBeenCalledTimes(1)
    expect(balance).toEqual('99')
  })

  test('can getSigner', async() => {
    const sendTransactionSpy = jest
      .spyOn(ethers.providers.JsonRpcSigner.prototype, "sendTransaction")
        .mockImplementation();

     const metamask = new MetaMask({
        accounts: [WALLET_ADDRESS],
        isConnected: true
      });

    const signer = await metamask.getSigner()

    const {signedTransaction, status}  = await signer(['transactions'])

    expect(sendTransactionSpy).toHaveBeenCalledTimes(1)

    expect(status).toEqual(WALLET_STATUS.OK)
    expect(signedTransaction).toHaveLength(1)
  })

  test('mount event listener', async() => {


    const metamask = new MetaMask();
    await metamask.init()
    await metamask.mountEventListeners()

    expect(metamask.provider?.listenerCount()).toEqual(2)
  })

  test('unmount event listener', async() => {
    const metamask = new MetaMask();
    await metamask.init()
    await metamask.unmountEventListeners()

    expect(metamask.provider?.listenerCount()).toEqual(1)
  })

  test('cannot get balance if not connected', async() => {
    const getBalanceSpy =  jest
      .spyOn(ethers.providers.Web3Provider.prototype, "getBalance")
      .mockImplementation( async (): Promise<BigNumber> => {
        return BigNumber.from(99);
      });
     const metamask = new MetaMask({
      accounts: [],
      isConnected: false
    });

    const balance = await metamask.getBalance()

    expect(getBalanceSpy).toHaveBeenCalledTimes(0)
  })
});
