import React, { FunctionComponent, useEffect, useState } from 'react';
import { CHAIN_TYPE, Wallet, WALLET_TYPE } from '../../src';
import { makeTransaction } from './services';
import styled from '@emotion/styled';
import react from 'react';

type WalletChainDemoProps = {
    wallet: Wallet | any;
};

const Wrapper = styled.div`
    display: grid;
    flex-direction: column;
    gap: 20px;
`;

const StatePre = styled.pre`
    background-color: #222;
    color: #eee;
`;

const FormGroup = styled.div`
    display: grid;
    gap: 20px;
`;

const ButtonGroup = styled.div`
    max-width: 800px;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
`;

const getWallet = (wallet: any, input: number): any => {
    try {
        return wallet.getWallet(input);
    } catch (err) {
        return wallet.getActiveWallet();
    }
};

const getWalletChainType = (wallet: Wallet): number => {
    console.log({ t: wallet.type, WALLET_TYPE });
    if (
        wallet.type === WALLET_TYPE.ALGORAND_MYALGO ||
        wallet.type === WALLET_TYPE.ALGORAND_PERAWALLET ||
        wallet.type === WALLET_TYPE.ALGORAND_WALLETCONNECT
    ) {
        return CHAIN_TYPE.ALGORAND;
    }
    return CHAIN_TYPE.ETHEREUM;
};

const getWalletName = (wallet: any, input: number): string => {
    try {
        return wallet.getWallet(input).name;
    } catch (err) {
        return 'active';
    }
};

function tryStringifyJSON(json: unknown): string {
    try {
        return JSON.stringify(json, undefined, 4);
    } catch (e) {
        return json as string;
    }
}

const WalletChainDemo: FunctionComponent<WalletChainDemoProps> = ({ wallet }) => {
    const [walletState, setWalletState] = useState<any>(wallet.toJSON());
    const [walletSelection, setWalletSelection] = useState<number>(NaN);
    const [output, setOutput] = useState<unknown>({});
    const [forceUpdate, setForceUpdate] = useState<{}>({});

    useEffect(() => {
        wallet.onAccountChange((accounts: string[]) => {
            console.log('onAccountChange', accounts);
            console.log(wallet.toJSON());
            setWalletState(wallet.toJSON());
        });
        wallet.onAccountDisconnect(() => {
            console.log('onAccountDisconnect');
            console.log(wallet.toJSON());
            setWalletState(wallet.toJSON());
        });
        wallet.onChainChange((chain: string) => {
            console.log('onChainChange', chain);
            console.log(wallet.toJSON());
            setWalletState(wallet.toJSON());
        });
        if (wallet.type === CHAIN_TYPE.ETHEREUM) {
            wallet.onBlockAdded((newBlock: number) => {
                console.log('onBlockAdded', newBlock);
            });
        }
    }, []);

    const handleRequest = async (request: () => Promise<any>) => {
        try {
            const result = await request();
            setOutput(result);
            console.info(result);
        } catch (err) {
            setOutput(err);
            console.info(err);
        }
    };

    const genAction = (action: string) => (
        <button onClick={() => handleRequest(() => wallet[action]())}>{action}</button>
    );

    return (
        <Wrapper>
            <h1>Wallet Demo</h1>
            <hr />
            <h2>State</h2>
            <StatePre>{JSON.stringify(walletState, undefined, 4)}</StatePre>
            <hr />
            <h2>Actions</h2>
            <FormGroup>
                <label>Wallet ID</label>
                <pre>{`
0 = ETHEREUM_METAMASK,
1 = ETHEREUM_WALLETCONNECT,
2 = ALGORAND_MYALGO,
3 = ALGORAND_WALLETCONNECT,
4 = ALGORAND_PERAWALLET
                `}</pre>
                <input onChange={(e) => setWalletSelection(parseInt(e.currentTarget.value))} type="number" />
                <div>{`Selected: ${getWalletName(wallet, walletSelection)}`}</div>
                <div>{`ActiveWallet: ${wallet.getActiveWallet().name}`}</div>
                <ButtonGroup>
                    <button onClick={() => getWallet(wallet, walletSelection).signIn()}>Sign In</button>
                    <button onClick={() => getWallet(wallet, walletSelection).signOut()}>Sign Out</button>
                    {getWalletName(wallet, walletSelection) !== 'active' && (
                        <button onClick={() => wallet.updateActiveWallet(walletSelection) && setForceUpdate({})}>
                            Update Active
                        </button>
                    )}
                </ButtonGroup>
            </FormGroup>
            <FormGroup>
                <label>Connection:</label>
                <ButtonGroup>
                    <button onClick={() => wallet.signIn()}>Sign In</button>
                    <button onClick={() => wallet.signOut()}>Sign Out</button>
                </ButtonGroup>
            </FormGroup>
            <FormGroup>
                <label>Actions:</label>
                <ButtonGroup>
                    {genAction('getAvailableWallets')}
                    {genAction('getConnectedWallets')}
                    {genAction('getActiveWallet')}
                    {genAction('signOut')}
                    {genAction('getSigner')}
                    {genAction('getBalance')}
                    {genAction('getProvider')}
                    {genAction('getIsConnected')}
                    {genAction('getIsWalletInstalled')}
                    {genAction('getPrimaryAccount')}
                    {genAction('getAccounts')}
                    {genAction('fetchCurrentChainID')}
                    <button onClick={() => handleRequest(() => makeTransaction(getWalletChainType(wallet), wallet))}>
                        Make Transaction
                    </button>
                    <button onClick={() => console.log(wallet)}>Print THIS</button>
                </ButtonGroup>
            </FormGroup>
            <FormGroup>
                <label>OUTPUT:</label>
                <pre>{tryStringifyJSON(output)}</pre>
            </FormGroup>
        </Wrapper>
    );
};

export default WalletChainDemo;
