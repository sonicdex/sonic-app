import React, { useMemo } from 'react';
import { Button, useColorMode } from '@chakra-ui/react';
import { useAppDispatch , walletActions , walletState } from '@/store';

export const WalletConnectBtn: React.FC = ({ }) => {
    const { colorMode } = useColorMode();
    const dispatch = useAppDispatch();
   
    const { color, background } = useMemo(() => {
        if (colorMode == 'dark') {
            return {
                color: '#fff',
                background: '#3F51B5'
            }
        } else {
            return {
                color: '#fff',
                background: '#3F51B5'
            }
        }
    }, [colorMode])
    const handleClick = (): void => {
        dispatch(walletActions.setOnwalletList(walletState.OpenWalletList));
    }
    return (
        <Button borderRadius={100} style={{ color: color, backgroundColor: background }} onClick={handleClick}>
            Connect Wallet
        </Button>
    );
}