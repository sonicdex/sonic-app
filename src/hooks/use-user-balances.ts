import { useSwapActor } from '@/integrations/actor/use-swap-actor';
import { usePlugStore } from '@/store';
import { Principal } from '@dfinity/principal';
import { useEffect, useState } from 'react';
import { plug } from '../integrations/plug';

type Balances = {
  [canisterId: string]: number;
};

const parsePlugResponse = (response: any): Balances => {
  const parsed = (response as any as PlugTokenBalance[]).reduce((acc, cur) => {
    return {
      ...acc,
      [cur.canisterId]: Number(cur.amount),
    };
  }, {} as Balances);
  return parsed;
};

const parseSwapResponse = (response: [string, bigint][]): Balances => {
  const parsed = response.reduce((acc, cur) => {
    return {
      ...acc,
      [cur[0]]: Number(cur[1]),
    };
  }, {} as Balances);
  return parsed;
};

const sumBalances = (...balances: Balances[]): Balances => {
  return balances.reduce((acc, cur) => {
    const balance = Object.entries(cur);
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
