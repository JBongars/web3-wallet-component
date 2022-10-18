import { Web3Provider } from '@ethersproject/providers';
import { beforeEach, describe, expect, test } from '@jest/globals';
import { assert } from 'console';
import { EthereumObject, ProviderService } from '../../services';
import { BaseEthereumState } from '../types';
import { MockEthereumWallet } from './MockWallet.spec';

describe('# EthereumBaseWallet', () => {
    let providerServiceMock: Record<string, jest.SpyInstance>;
    let providerMock: Web3Provider;
    let stateMock: BaseEthereumState;
    let wallet: MockEthereumWallet;

    beforeEach(() => {
        stateMock = { isConnected: true, accounts: ['test-account'] };
        providerServiceMock = {
            fetchCurrentChainID: jest.spyOn(ProviderService, 'fetchCurrentChainID').mockResolvedValue('0x1'),
            addChainToWallet: jest.spyOn(ProviderService, 'addChainToWallet'),
            switchChainFromWallet: jest.spyOn(ProviderService, 'switchChainFromWallet')
        };
        providerMock = {
            send: jest.fn((method: string, params?: any[]) => Promise.resolve()),
            request: jest.fn((method: string, params?: any[]) => Promise.resolve())
        } as any;
    });

    describe('## getSigner', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account'] };
            providerServiceMock = {
                ...providerServiceMock,
                getSigner: jest.spyOn(ProviderService, 'getSigner').mockReturnValue('test-signer' as any)
            };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the signer object', async () => {
            const signerSpy = jest.spyOn(ProviderService, 'getSigner').mockReturnValue('test-signer' as any);
            const result = await wallet.getSigner();
            expect(result).toEqual('test-signer');
            expect(signerSpy).toBeCalledWith(providerMock);
        });

        test('should not get the signer object if wallet is not connected', async () => {
            const signerSpy = jest.spyOn(ProviderService, 'getSigner').mockReturnValue('test-signer' as any);
            wallet._setState({ ...stateMock, isConnected: false });
            try {
                await wallet.getSigner();
            } catch (err: any) {
                expect(err.name).toEqual('WalletNotConnectedError');
            }
            assert(1);
        });

        test('should not get the signer object if current chain is not enforced', async () => {
            providerServiceMock.fetchCurrentChainID.mockReturnValue('0x1');
            wallet._setState({ ...stateMock, isConnected: true });
            wallet._setChain('0x2');
            try {
                await wallet.getSigner();
            } catch (err: any) {
                console.error(err);
                expect(err.message).toEqual('Chain has changed to 0x2 when it should be 0x1');
            }
            assert(1);
        });
    });
});
