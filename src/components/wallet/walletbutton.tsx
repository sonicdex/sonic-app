import React from 'react';
import { Button } from '@chakra-ui/react';
import { useAppDispatch , walletActions , walletState } from '@/store';

export const WalletConnectBtn: React.FC = ({ }) => {
 
    const dispatch = useAppDispatch();
    const handleClick = (): void => {
        dispatch(walletActions.setOnwalletList(walletState.OpenWalletList));
    }
    return (
        <Button size="lg" borderRadius={100} style={{ width:'100%' }} className='wallet-button' variant="gradient" colorScheme="green"  onClick={handleClick}>
           11 Connect Wallet
        </Button>
    );
}