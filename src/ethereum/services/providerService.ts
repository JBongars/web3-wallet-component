import { ethers } from 'ethers';
import { useWindow } from '../../containers';
import { NotImplementedError } from '../../errors';
import { getChainConfig } from '../chains';
import { EthereumChainConfig, EthereumObject, Provider } from './types';

abstract class ProviderService {
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
        return useWindow(async (window: any) =>
            window.ethereum?.request({
                method: 'wallet_addEthereumChain',
                params: [chainConfig]
            })
        );
    }

    public static async switchChainFromWallet(ethereum: EthereumObject, chain: number) {
        if (!ethereum.request) {
            throw new Error('EthereumProvider.request method is not available');
        }
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${chain}` }]
            });
        } catch (err) {
            if (err && (err as { code: number }).code === 4902) {
                const chainConfig = getChainConfig(chain);
                await this.addChainToWallet(chainConfig as EthereumChainConfig);
            } else {
                throw err;
            }
        }
    }
}

export { ProviderService };
