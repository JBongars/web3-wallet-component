import { ethers } from 'ethers';
import { useWindow } from '../../containers';
import { NotImplementedError, WalletNotInstalledError } from '../../errors';
import { getChainConfig } from '../chains';
import { EthereumChainConfig, EthereumObject, Provider, WindowEthereumMappedKey } from './types';

class ProviderService {
    public static getWindowEthereumObject(): EthereumObject {
        return useWindow((windowObject: Window) => windowObject.ethereum) as EthereumObject;
    }

    public static getNamedWindowEthereumObject(
        key: WindowEthereumMappedKey,
        validator: (globalEthereum: EthereumObject) => boolean
    ): EthereumObject {
        const ethereumGlobal = ProviderService.getWindowEthereumObject();
        if (!ethereumGlobal) {
            throw new WalletNotInstalledError();
        }

        if (!ethereumGlobal.providerMap) {
            if (!validator(ethereumGlobal)) {
                throw new WalletNotInstalledError();
            }
            return ethereumGlobal;
        }

        const ethereum = ethereumGlobal.providerMap.get(key);
        if (!ethereum || !validator(ethereum)) {
            throw new WalletNotInstalledError();
        }
        return ethereum;
    }
    public static getSigner(provider: Provider): ethers.providers.JsonRpcSigner {
        return provider.getSigner();
    }

    public static async getBalance(provider: Provider, accountId: string): Promise<string> {
        const balance = await provider.getBalance(accountId);
        return balance.toString();
    }

    public static async getAssets(): Promise<unknown[]> {
        throw new NotImplementedError();
    }

    public static getIsWalletInstalled(ethereum: unknown): boolean {
        return Boolean(ethereum);
    }

    public static async fetchCurrentChainID(provider: Provider): Promise<string> {
        return provider.send('eth_chainId', []);
    }

    public static async addChainToWallet(chainConfig: EthereumChainConfig): Promise<void> {
        useWindow(async (window: Window): Promise<void> => {
            const ethereum = window.ethereum as EthereumObject;
            if (ethereum && ethereum.request) {
                ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [chainConfig]
                });
            }
        });
    }

    public static async switchChainFromWallet(ethereum: EthereumObject, chainId: string) {
        if (!ethereum.request) {
            throw new Error('EthereumProvider.request method is not available');
        }
        try {
            return ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }]
            });
        } catch (err) {
            if (err && (err as { code: number }).code === 4902) {
                const chainConfig = getChainConfig(chainId);
                return await this.addChainToWallet(chainConfig as EthereumChainConfig);
            } else {
                throw err;
            }
        }
    }
}

export { ProviderService };
