import React, { FunctionComponent, useEffect, useState } from 'react';
import { CHAIN_TYPE, Wallet, WALLET_TYPE } from '../../src';
import styled from '@emotion/styled';
import { StringFormatOption } from '@sinclair/typebox';

type WalletDemoProps = {
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

function tryStringifyJSON(json: unknown): string {
    try {
        return JSON.stringify(json, undefined, 4);
    } catch (e) {
        return json as string;
    }
}

const WalletDemo: FunctionComponent<WalletDemoProps> = ({ wallet }) => {
    const [walletState, setWalletState] = useState<any>(wallet.toJSON());
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
        if (wallet.type === WALLET_TYPE.ETHEREUM_METAMASK || wallet.type === WALLET_TYPE.ETHEREUM_WALLETCONNECT || wallet.type === WALLET_TYPE.ETHEREUM_COINBASE) {
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
                <ButtonGroup>
                    {genAction('signIn')}
                    {genAction('signOut')}
                    {genAction('getBalance')}
                    {genAction('getIsConnected')}
                    {genAction('getIsWalletInstalled')}
                    {genAction('getPrimaryAccount')}
                    {genAction('getAccounts')}
                    {genAction('fetchCurrentChainID')}
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

export default WalletDemo;
