import { Principal } from '@dfinity/principal';

import { TokenInfo } from '@/typings/global';
import { parseAmount } from '@/utils/format';
import { useActorStore } from '@/store/features/actor';
import { usePlugStore } from '@/store';
import { useToken } from './use-token';

export const useAssetsView = () => {
  const { actors } = useActorStore();
  const { principalId } = usePlugStore();
  const { swap: swapActor } = actors;
  const { getTokenInfo } = useToken();

  async function getTokens() {
    try {
      let res = await swapActor.getSupportedTokenList();
      return res;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async function getUserInfoByNamePageAbove(
    _owner: Principal
  ): Promise<TokenInfo[]> {
    try {
      const result = await swapActor.getUserInfoByNamePageAbove(
        _owner,
        BigInt(0),
        '', // token name
        BigInt(0), // token start at
        BigInt(0), // token limit
        BigInt(0), // above 0
        '', // lp name or symbol
        BigInt(0),
        BigInt(10)
      );
      const res = (result as { lpBalances: [[string, BigInt][], BigInt] })
        .lpBalances[0];
      if (!res.length) {
        return [];
      }
      const info = await Promise.all(
        res.map((_i) => getTokenInfo(String(_i[0])))
      );
      return info.map((i, index) => {
        i = { ...i.metadata, ...i };
        delete i.metadata;
        return { ...i, bal: res[index][1], id: res[index][0] };
      });
      // CommonApi
    } catch (e) {
      console.log(e, 'getUserInfoByNamePageAbove');
      return e;
    }
  }

  async function deposit(
    tokenCanisterId: string,
    value: string | number,
    decimals: number
  ) {
    try {
      const amount = parseAmount(value.toString(), decimals);
      return await swapActor.deposit(
        Principal.fromText(tokenCanisterId),
        amount
      );
    } catch (e) {
      console.log(e, 'deposit');
    }
  }

  async function withdraw(
    tokenCanisterId: string,
    value: string | number,
    decimals: number
  ) {
    try {
      const amount = parseAmount(value.toString(), decimals);

      return await swapActor.withdraw(
        Principal.fromText(tokenCanisterId),
        amount
      );
    } catch (e) {
      console.error('withdraw', e);
      return e;
    }
  }

  async function getBalance(tokenCanisterId: string) {
    try {
      const owner = principalId;
      return await swapActor.balanceOf(
        tokenCanisterId,
        Principal.fromText(owner)
      );
    } catch (error) {
      console.error('balanceOf', error);
      return error;
    }
  }

  return {
    getTokens,
    getUserInfoByNamePageAbove,
    getBalance,
    deposit,
    withdraw,
  };
};
