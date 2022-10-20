import { stringLiteral } from '@babel/types';
import { Web3Provider } from '@ethersproject/providers';
import { beforeEach, describe, expect, test } from '@jest/globals';
import { EthereumObject, ProviderService } from '../../services';
import { EthereumEvent } from '../../services/ethereumEvents';
import { BaseEthereumChainConfig, BaseEthereumState } from '../types';
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
            name: 'providerMock',
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

        test('should not get the signer object if provider service is not available', async () => {
            const signerSpy = jest.spyOn(ProviderService, 'getSigner').mockImplementation(() => {
                throw new Error('mock-error');
            });
            wallet._setState({ ...stateMock, isConnected: true });
            try {
                await wallet.getSigner();
            } catch (err: any) {
                expect(err.message).toEqual('mock-error');
                expect(signerSpy).toBeCalledWith(providerMock);
            }
            expect.assertions(2);
        });
    });

    describe('## getBalance', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account'] };
            providerServiceMock = {
                ...providerServiceMock,
                getSigner: jest.spyOn(ProviderService, 'getBalance').mockReturnValue('test-balance' as any)
            };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the balance', async () => {
            const balanceSpy = jest.spyOn(ProviderService, 'getBalance').mockReturnValue('test-balance' as any);
            const result = await wallet.getBalance();
            expect(result).toEqual('test-balance');
            expect(balanceSpy).toBeCalledWith(providerMock, 'test-account');
        });

        test('should not get the balance if wallet is not connected', async () => {
            const balanceSpy = jest.spyOn(ProviderService, 'getSigner').mockReturnValue('test-balance' as any);
            wallet._setState({ ...stateMock, isConnected: false });
            try {
                await wallet.getBalance();
            } catch (err: any) {
                expect(err.name).toEqual('WalletNotConnectedError');
                expect(balanceSpy).not.toBeCalled();
            }
            expect.assertions(2);
        });

        test('should not get the balance if provider service is not available', async () => {
            const balanceSpy = jest.spyOn(ProviderService, 'getBalance').mockImplementation(() => {
                throw new Error('mock-error');
            });
            wallet._setState({ ...stateMock, isConnected: true });
            try {
                await wallet.getBalance();
            } catch (err: any) {
                expect(err.message).toEqual('mock-error');
                expect(balanceSpy).toBeCalledWith(providerMock, 'test-account');
            }
            expect.assertions(2);
        });
    });

    describe('## getAssets', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account'] };
            providerServiceMock = {
                ...providerServiceMock,
                getAssets: jest.spyOn(ProviderService, 'getAssets').mockReturnValue('test-asset' as any)
            };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the list of assets', async () => {
            const getAssetsSpy = jest.spyOn(ProviderService, 'getAssets').mockReturnValue('test-asset' as any);
            const result = await wallet.getAssets();
            expect(result).toEqual('test-asset');
            expect(getAssetsSpy).toBeCalledWith();
        });

        test('should not get the list of assets if provider service is not available', async () => {
            const getAssetsSpy = jest.spyOn(ProviderService, 'getBalance').mockImplementation(() => {
                throw new Error('mock-error');
            });
            wallet._setState({ ...stateMock, isConnected: true });
            try {
                await wallet.getBalance();
            } catch (err: any) {
                expect(err.message).toEqual('mock-error');
                expect(getAssetsSpy).toBeCalledWith(providerMock, 'test-account');
            }
            expect.assertions(2);
        });
    });

    describe('## getIsConnected', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should return true when connected', () => {
            stateMock.isConnected = true;
            expect(wallet.getIsConnected()).toBeTruthy();
        });

        test('should return false when not connected', () => {
            stateMock.isConnected = false;
            expect(wallet.getIsConnected()).toBeFalsy();
        });
    });

    describe('## getPrimaryAccount', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the primary account', async () => {
            const result = await wallet.getPrimaryAccount();
            expect(result).toEqual('test-account-1');
        });

        test('should throw error if wallet is connected but no primary account could be found', async () => {
            stateMock.accounts = [];
            try {
                await wallet.getPrimaryAccount();
            } catch (err: any) {
                expect(err.message).toEqual('wallet is marked as connected but could not find primary account');
            }
            expect.assertions(1);
        });

        test('should get the primary account for only one account', async () => {
            stateMock.accounts = ['test-account-1'];
            const result = await wallet.getPrimaryAccount();
            expect(result).toEqual('test-account-1');
        });

        test('should not get the primary account if wallet is not connected', async () => {
            wallet._setState({ ...stateMock, isConnected: false });
            try {
                await wallet.getPrimaryAccount();
            } catch (err: any) {
                expect(err.name).toEqual('WalletNotConnectedError');
            }
            expect.assertions(1);
        });
    });

    describe('## getAccounts', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should get the list of account', async () => {
            const result = wallet.getAccounts();
            expect(result).toEqual(['test-account-1', 'test-account-2']);
        });

        test('should get the list of account for only one account', async () => {
            stateMock.accounts = ['test-account-1'];
            const result = wallet.getAccounts();
            expect(result).toEqual(['test-account-1']);
        });

        test('should not throw an error if wallet is connected but no accounts are connected', async () => {
            stateMock.accounts = [];
            const consoleMock = jest.spyOn(console, 'warn');
            const result = wallet.getAccounts();
            expect(result).toEqual([]);
            expect(consoleMock).toBeCalledWith('wallet is marked as connected but the state.account length is 0');
        });

        test('should not get the balance if wallet is not connected', async () => {
            wallet._setState({ ...stateMock, isConnected: false });
            try {
                wallet.getAccounts();
            } catch (err: any) {
                expect(err.name).toEqual('WalletNotConnectedError');
            }
            expect.assertions(1);
        });
    });

    describe('## fetchCurrentChainID', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should return the current chain id when called', async () => {
            providerServiceMock.fetchCurrentChainID.mockResolvedValue('0x1');
            const result = await wallet.fetchCurrentChainID();
            expect(result).toEqual('0x1');
            expect(providerServiceMock.fetchCurrentChainID).toBeCalledWith(providerMock);
        });
    });

    describe('## addChainToWallet', () => {
        beforeEach(() => {
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            jest.resetAllMocks();
        });

        test('should return the current chain id when called', async () => {
            const mockChainConfig: BaseEthereumChainConfig = {
                chainName: 'test-chain',
                chainId: '0x1',
                nativeCurrency: {
                    name: 'test-token',
                    decimals: 18,
                    symbol: 'TT'
                },
                rpcUrls: ['some-url']
            };
            providerServiceMock.addChainToWallet.mockImplementation(() => Promise.resolve());
            const result = await wallet.addChainToWallet(mockChainConfig);
            expect(result).toBeUndefined();
            expect(providerServiceMock.addChainToWallet).toBeCalledWith(mockChainConfig);
        });
    });

    describe('## switchChainFromWallet', () => {
        let ethereumProviderMock: EthereumObject;
        beforeEach(() => {
            ethereumProviderMock = {
                networkVersion: '0x1',
                on: jest.fn(() => {}) as EthereumEvent
            };
            stateMock = { isConnected: true, accounts: ['test-account-1', 'test-account-2'] };
            wallet = new MockEthereumWallet();
            wallet._setState(stateMock);
            wallet._setProvider(providerMock);
            wallet._setEthereumProvider(ethereumProviderMock);
            jest.resetAllMocks();
        });

        test('should switch chains to the chain being called', async () => {
            const nextChain = '0x2';
            providerServiceMock.switchChainFromWallet.mockImplementation(() => Promise.resolve());
            const result = await wallet.switchChainFromWallet(nextChain);

            expect(result).toBeUndefined();
            expect(providerServiceMock.switchChainFromWallet).toBeCalledWith(ethereumProviderMock, nextChain);
            // expect(wallet.chain).not.toEqual(nextChain);
        });

        test('should switch chains to the chain being called and trigger chain change', async () => {
            const nextChain = '0x2';
            providerServiceMock.switchChainFromWallet.mockImplementation(() => Promise.resolve());
            const result = await wallet.switchChainFromWallet(nextChain, true);

            expect(result).toBeUndefined();
            expect(providerServiceMock.switchChainFromWallet).toBeCalledWith(ethereumProviderMock, nextChain);
            // expect(wallet.chain).toEqual(nextChain);
        });
    });
});
