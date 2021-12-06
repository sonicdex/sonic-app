import { useSwapActor } from '@/integrations/actor/use-swap-actor';
import { Balances } from '@/models';
import { usePlugStore } from '@/store';
import { Principal } from '@dfinity/principal';
import { useEffect, useState } from 'react';
import { plug } from '../integrations/plug';

const parsePlugResponse = (response: any): Balances => {
  const parsed = (response as PlugTokenBalance[]).reduce((acc, current) => {
    if (current.canisterId) {
      return {
        ...acc,
        [current.canisterId]: Number(current.amount),
      };
    }
    return acc;
  }, {} as Balances);
  return parsed;
};

const parseSwapResponse = (response: [string, bigint][]): Balances => {
  const parsed = response.reduce((acc, current) => {
    return {
      ...acc,
      [current[0]]: Number(current[1]),
    };
  }, {} as Balances);
  return parsed;
};

const sumBalances = (...balances: Balances[]): Balances => {
  return balances.reduce((acc, current) => {
    const balance = Object.entries(current);
    balance.forEach(([canisterId, amount]) => {
      if (acc[canisterId]) {
        acc[canisterId] += amount;
      } else {
        acc[canisterId] = amount;
      }
    });
    return acc;
  }, {} as Balances);
};

export const useUserBalances = () => {
  const { isConnected, principalId } = usePlugStore();

  const [plugBalances, setPlugBalances] = useState<Balances>();
  const [sonicBalances, setSonicBalances] = useState<Balances>();
  const [totalBalances, setTotalBalances] = useState<Balances>();
  const swapActor = useSwapActor();

  useEffect(() => {
    if (!plug || !isConnected) return;
    plug
      .requestBalance()
      .then((response) => setPlugBalances(parsePlugResponse(response)));
  }, [plug, isConnected]);

  useEffect(() => {
    if (!swapActor || !principalId) return;
    swapActor
      .getUserBalances(Principal.fromText(principalId))
      .then((response) => setSonicBalances(parseSwapResponse(response)));
  }, [swapActor, principalId]);

  useEffect(() => {
    if (plugBalances && sonicBalances) {
      setTotalBalances(sumBalances(plugBalances, sonicBalances));
    }
  }, [plugBalances, sonicBalances]);

  return {
    plugBalances,
    sonicBalances,
    totalBalances,
  };
};
