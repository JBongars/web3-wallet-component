import { template } from '@babel/core';
import { stringLiteral } from '@babel/types';
import { Web3Provider } from '@ethersproject/providers';
import { beforeEach, describe, expect, test } from '@jest/globals';
import HookRouter from '../../../utils/HookRouter';
import { WALLET_HOOK } from '../../../utils/HookRouter/types';
import WalletStateStorage from '../../../WalletStateStorage';
import { EthereumObject, ProviderService } from '../../services';
import { EthereumEvent } from '../../services/ethereumEvents';

import * as containers from '../../../containers/window';

jest.mock('../../../containers/window', () => ({
    useWindow: jest.fn()
}));

describe.skip('# ProviderService', () => {
    let useWindowSpy: jest.SpyInstance;
    let ethereumMock: any;
    let providerMock: any;

    beforeEach(() => {
        providerMock = { name: 'provider' };
        ethereumMock = { name: 'window' };
        useWindowSpy = jest.spyOn(containers, 'useWindow').mockReturnValue(ethereumMock);

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
