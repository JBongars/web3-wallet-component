import { beforeEach, describe, expect, test } from '@jest/globals';
import { ProviderService } from '../../services';

import * as containers from '../../../containers/window';

describe('# ProviderService', () => {
    let useWindowSpy: jest.SpyInstance;
    let windowMock: any;
    let ethereumMock: any;
    let providerMock: any;
    let containerSpies: Record<string, jest.Mock>;

    beforeEach(() => {
        providerMock = { name: 'provider' };
        ethereumMock = { name: 'window' };
        windowMock = { ethereum: ethereumMock };
        containerSpies = jest.mock('../../../containers/window', () => ({
            useWindow: jest.fn()
        }));

        useWindowSpy = jest
            .spyOn(containers, 'useWindow')
            .mockImplementation((cb: (windowObject: any) => any) => cb(windowMock));

        jest.resetAllMocks();
    });

    describe('## getWindowEthereumObject', () => {
        test('should return the window ethereum object', () => {
            const result = ProviderService.getWindowEthereumObject();
            expect(useWindowSpy).toBeCalled();
            expect(result).toEqual(ethereumMock);
        });
    });

    // describe('## getNamedWindowEthereumObject', () => {});

    // describe('## getSigner', () => {});

    // describe('## getBalance', () => {});

    // describe('## getAssets', () => {});

    // describe('## getIsWalletInstalled', () => {});

    // describe('## fetchCurrentChainID', () => {});

    // describe('## addChainToWallet', () => {});

    // describe('## switchChainFromWallet', () => {});
});
