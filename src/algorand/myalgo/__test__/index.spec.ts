import MyAlgoConnect, { AlgorandTxn } from '@randlabs/myalgo-connect';
import { MyAlgo } from '..';
import { NotImplementedError } from '../../../errors';

describe('#MyAlgo class', () => {
    test('can sign in', async () => {
        jest.spyOn(MyAlgoConnect.prototype, 'connect').mockImplementation(async () => {
            return [
                {
                    name: 'test-name',
                    address: 'test-address'
                }
            ];
        });

        const myAlgo = new MyAlgo();

        await myAlgo.signIn();

        expect(myAlgo.state.accounts).toHaveLength(1);
        expect(myAlgo.state.isConnected).toBeTruthy();
    });

    test('can sign out', async () => {
        const myAlgo = new MyAlgo({
            accounts: [{ address: 'test-address', name: 'test-account' }],
            isConnected: true
        });

        expect(myAlgo.state.accounts).toHaveLength(1);
        expect(myAlgo.state.isConnected).toBeTruthy();

        await myAlgo.signOut();

        expect(myAlgo.state.accounts).toHaveLength(0);
        expect(myAlgo.state.isConnected).toBeFalsy();
    });

    test('can get signer', async () => {
        jest.spyOn(MyAlgoConnect.prototype, 'signTransaction').mockImplementation(async () => {
            return [
                {
                    txID: 'test-txID',
                    blob: new Uint8Array()
                }
            ];
        });

        const myAlgo = new MyAlgo();

        const signer = await myAlgo.getSigner();

        const signedTransaction = await signer(['encodedTransaction' as unknown as AlgorandTxn]);

        expect(signedTransaction).toHaveLength(1);
    });

    test('get balance should throw NotImplementedError', async () => {
        const myAlgo = new MyAlgo();

        expect(() => myAlgo.getBalance()).rejects.toThrowError(NotImplementedError);
    });

    test('get assets should throw NotImplementedError', async () => {
        const myAlgo = new MyAlgo();

        expect(() => myAlgo.getAssets()).rejects.toThrowError(NotImplementedError);
    });
});
