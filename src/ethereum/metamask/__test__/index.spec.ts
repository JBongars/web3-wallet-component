import { BigNumber, ethers } from 'ethers';
import { Metamask } from '..';
import { NotImplementedError, WalletNotConnectedError } from '../../../errors';

const WALLET_ADDRESS = 'test-address';

const WINDOW_ETHEREUM = {
    isMetamask: true,
    request: async (request: { method: string; params?: Array<unknown> }) => {
        // console.log(request.method); to see the different requests made by ethers
        if (['eth_accounts', 'eth_requestAccounts'].includes(request.method)) {
            return [WALLET_ADDRESS];
        }

        throw Error(`Unknown request: ${request.method}`);
    }
};

jest.mock('~/src/containers/window', () => {
    return {
        useWindow: () => WINDOW_ETHEREUM
    };
});

describe.skip('#Metamask Class', () => {
    test('can get provider', async () => {
        const metamask = new Metamask();

        const provider = await metamask.getProvider();

        expect(provider).toBeInstanceOf(ethers.providers.Web3Provider);
    });

    test('can sign in', async () => {
        const metamask = new Metamask();

        await metamask.signIn();

        expect(metamask.toJSON().isConnected).toBeTruthy();
        expect(metamask.toJSON().accounts[0]).toEqual('test-address');
    });

    test('can sign out', async () => {
        const metamask = new Metamask({
            accounts: [WALLET_ADDRESS],
            isConnected: true
        });

        await metamask.signOut();

        expect(metamask.toJSON().isConnected).toBeFalsy();
        expect(metamask.toJSON().accounts).toHaveLength(0);
    });

    test('get asset should throw NotImplementedError', async () => {
        const metamask = new Metamask();

        await expect(async () => await metamask.getAssets()).rejects.toThrowError(NotImplementedError);
    });

    test('can get the account balance', async () => {
        const getBalanceSpy = jest
            .spyOn(ethers.providers.Web3Provider.prototype, 'getBalance')
            .mockImplementation(async (): Promise<BigNumber> => {
                return BigNumber.from(99);
            });

        const metamask = new Metamask({
            accounts: [WALLET_ADDRESS],
            isConnected: true
        });

        const balance = await metamask.getBalance();

        expect(getBalanceSpy).toHaveBeenCalledTimes(1);
        expect(balance).toEqual('99');
    });

    // test("can getSigner", async () => {
    //   const sendTransactionSpy = jest
    //     .spyOn(ethers.providers.JsonRpcSigner.prototype, "sendTransaction")
    //     .mockImplementation();

    //   const metamask = new Metamask({
    //     accounts: [WALLET_ADDRESS],
    //     isConnected: true,
    //   });

    //   const signer = await metamask.getSigner();

    //   const signedTransaction = await signer([
    //     "transactions" as TransactionRequest,
    //   ]);

    //   expect(sendTransactionSpy).toHaveBeenCalledTimes(1);
    //   expect(signedTransaction).toHaveLength(1);
    // });

    test('mount event listener', async () => {
        const metamask = new Metamask();
        const providerMock: ethers.providers.Web3Provider = {
            on: jest.fn()
        } as any;
        const providerSpy = jest.spyOn(metamask, 'getProvider').mockResolvedValue(providerMock);
        await metamask.init();
        await metamask.mountEventListeners();

        expect(providerSpy).toBeCalled();
        expect(providerMock.on).toBeCalledTimes(1);
    });

    test('unmount event listener', async () => {
        const metamask = new Metamask();
        const providerMock: ethers.providers.Web3Provider = {
            on: jest.fn(),
            removeListener: jest.fn()
        } as any;
        jest.spyOn(metamask, 'getProvider').mockResolvedValue(providerMock);

        await metamask.init();
        await metamask.mountEventListeners();
        await metamask.unmountEventListeners();

        expect(providerMock.on).toBeCalledWith('accountsChanged', expect.anything());

        expect(providerMock.removeListener).toBeCalledWith('accountsChanged', expect.anything());
    });

    test('cannot get balance if not connected', async () => {
        const metamask = new Metamask({
            accounts: [],
            isConnected: false
        });

        try {
            await metamask.getBalance();
        } catch (err) {
            expect(err).toBeInstanceOf(WalletNotConnectedError);
        }

        expect.assertions(1);
    });
});
