import { ethers } from 'ethers';
import web3 from 'web3';
import { provider } from 'web3-core';
import { useWindow } from '../../containers';
import { NotImplementedError } from '../../errors';
import { getChainConfig } from '../chains';
import { MetamaskChainConfig } from '../metamask';
import { EthereumChainConfig } from './types';

abstract class Web3Service {
    public getEthereum(): ethers.providers.ExternalProvider | ethers.providers.JsonRpcFetchFunc {
        return useWindow(async (windowObject) => (windowObject as any).ethereum) as any;
    }

    public getProvider(): web3 {
        const ethereum = this.getEthereum();
        return new web3(ethereum as provider);
    }

    public getSigner(provider: ethers.providers.Web3Provider): ethers.providers.JsonRpcSigner {
        return provider.getSigner();
    }

    public async getBalance(provider: ethers.providers.Web3Provider, accountId: string): Promise<string> {
        const balance = await provider.getBalance(accountId);
        return balance.toString();
    }

    public async getAssets(): Promise<unknown[]> {
        throw new NotImplementedError();
    }

    public getIsWalletInstalled(): boolean {
        const ethereum = this.getEthereum();
        return Boolean(ethereum);
    }

    public async fetchCurrentChainID(provider: ethers.providers.Web3Provider): Promise<string> {
        return provider.send('eth_chainId', []);
    }

    public async addChainToWallet(chainConfig: MetamaskChainConfig): Promise<void> {
        return useWindow(async (window: any) =>
            window.ethereum?.request({
                method: 'wallet_addEthereumChain',
                params: [chainConfig]
            })
        );
    }

    public async switchChainFromWallet(chain: number) {
        const ethereum = useWindow((window: any) => window.ethereum);
        if (ethereum.networkVersion !== chain) {
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
}

export { Web3Service };
