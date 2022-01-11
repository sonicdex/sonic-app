import { AppTokenMetadataListObject } from '@/models';
import { dijkstra, GraphNodeList, WeightList } from '@/utils/minimal-paths';

const tokenListMock: AppTokenMetadataListObject = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
].reduce(
  (list, symbol) => ({
    ...list,
    [`token${symbol}`]: {
      id: `token${symbol}`,
      decimals: 8,
      fee: BigInt(0),
      logo: '',
      name: `Token ${symbol}`,
      symbol: `T${symbol}`,
      totalSupply: BigInt(1000000),
    },
  }),
  {}
);

describe('dijkstra', () => {
  const case0 = [
    0,
    {
      tokenA: {
        tokenB: 10,
      },
      tokenB: {
        tokenA: 10,
      },
    },
    {
      tokenA: { id: 'tokenA', visited: true, distance: 0, previous: null },
      tokenB: { id: 'tokenB', visited: true, distance: 10, previous: 'tokenA' },
      tokenC: {
        id: 'tokenC',
        visited: false,
        distance: Infinity,
        previous: null,
      },
      tokenD: {
        id: 'tokenD',
        visited: false,
        distance: Infinity,
        previous: null,
      },
      tokenE: {
        id: 'tokenE',
        visited: false,
        distance: Infinity,
        previous: null,
      },
      tokenF: {
        id: 'tokenF',
        visited: false,
        distance: Infinity,
        previous: null,
      },
      tokenG: {
        id: 'tokenG',
        visited: false,
        distance: Infinity,
        previous: null,
      },
    },
  ] as [number, WeightList, GraphNodeList];

  const case1 = [
    1,
    {
      tokenA: {
        tokenB: 10,
        tokenC: 15,
      },
      tokenB: {
        tokenA: 10,
        tokenD: 20,
        tokenE: 45,
      },
      tokenC: {
        tokenA: 15,
        tokenE: 60,
      },
      tokenD: {
        tokenB: 20,
        tokenE: 10,
      },
      tokenE: {
        tokenB: 45,
        tokenC: 60,
        tokenD: 10,
      },
      tokenF: {
        tokenG: 10,
      },
      tokenG: {
        tokenF: 10,
      },
    },
    {
      tokenA: { id: 'tokenA', visited: true, distance: 0, previous: null },
      tokenB: { id: 'tokenB', visited: true, distance: 10, previous: 'tokenA' },
      tokenC: { id: 'tokenC', visited: true, distance: 15, previous: 'tokenA' },
      tokenD: { id: 'tokenD', visited: true, distance: 30, previous: 'tokenB' },
      tokenE: { id: 'tokenE', visited: true, distance: 40, previous: 'tokenD' },
      tokenF: {
        id: 'tokenF',
        visited: false,
        distance: Infinity,
        previous: null,
      },
      tokenG: {
        id: 'tokenG',
        visited: false,
        distance: Infinity,
        previous: null,
      },
    },
  ] as [number, WeightList, GraphNodeList];

  test.each([case0, case1] as [number, WeightList, GraphNodeList][])(
    'should return the correct path case%i',
    (index, weights, expected) => {
      const paths = dijkstra(tokenListMock, weights, 'tokenA');
      console.log(paths);
      expect(paths).toEqual(expected);
    }
  );
});
