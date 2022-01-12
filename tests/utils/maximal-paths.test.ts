import {
  findMaximalPaths,
  getTokenPaths,
  GraphNodeList,
  WeightList,
} from '@/utils/maximal-paths';

import { mockAllPairs } from '../mocks/all-pairs';
import { mockTokenList } from '../mocks/token-list';

describe('findMaximalPaths', () => {
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
      tokenA: {
        id: 'tokenA',
        coefficient: 1,
        path: new Set(['tokenA']),
      },
      tokenB: {
        id: 'tokenB',
        coefficient: 10,
        path: new Set(['tokenA', 'tokenB']),
      },
    },
  ] as [number, WeightList, GraphNodeList];

  const case1 = [
    1,
    {
      tokenA: {
        tokenB: 1.2,
        tokenC: 0.5,
      },
      tokenB: {
        tokenA: 1.2,
        tokenD: 2,
        tokenE: 0.7,
        tokenC: 10,
      },
      tokenC: {
        tokenA: 0.5,
        tokenE: 5.4,
        tokenB: 10,
      },
      tokenD: {
        tokenB: 2,
        tokenE: 2,
      },
      tokenE: {
        tokenB: 0.7,
        tokenC: 5.4,
        tokenD: 2,
      },
      tokenF: {
        tokenG: 10,
      },
      tokenG: {
        tokenF: 10,
      },
    },
    {
      tokenA: {
        id: 'tokenA',
        coefficient: 1,
        path: new Set(['tokenA']),
      },
      tokenB: {
        id: 'tokenB',
        coefficient: 10.8,
        path: new Set(['tokenA', 'tokenC', 'tokenE', 'tokenD', 'tokenB']),
      },
      tokenC: {
        id: 'tokenC',
        coefficient: 25.92,
        path: new Set(['tokenA', 'tokenB', 'tokenD', 'tokenE', 'tokenC']),
      },
      tokenD: {
        id: 'tokenD',
        coefficient: 129.6,
        path: new Set(['tokenA', 'tokenB', 'tokenC', 'tokenE', 'tokenD']),
      },
      tokenE: {
        id: 'tokenE',
        coefficient: 64.8,
        path: new Set(['tokenA', 'tokenB', 'tokenC', 'tokenE']),
      },
      tokenF: {
        id: 'tokenF',
        coefficient: 0,
        path: new Set(),
      },
      tokenG: {
        id: 'tokenG',
        coefficient: 0,
        path: new Set(),
      },
    },
  ] as [number, WeightList, GraphNodeList];

  const case3 = [
    3,
    {
      tokenA: {
        tokenB: 1.5,
        tokenC: 0.5,
      },
      tokenB: {
        tokenA: 1.5,
      },
      tokenC: {
        tokenA: 0.5,
        tokenD: 1.5,
        tokenE: 2,
      },
      tokenD: {
        tokenC: 1.5,
        tokenF: 4,
      },
      tokenE: {
        tokenC: 2,
        tokenF: 0.5,
      },
      tokenF: {
        tokenE: 0.5,
        tokenD: 4,
      },
    },
    {
      tokenA: {
        id: 'tokenA',
        coefficient: 1,
        path: new Set(['tokenA']),
      },
      tokenB: {
        id: 'tokenB',
        coefficient: 1.5,
        path: new Set(['tokenA', 'tokenB']),
      },
      tokenC: {
        id: 'tokenC',
        coefficient: 0.5,
        path: new Set(['tokenA', 'tokenC']),
      },
      tokenD: {
        id: 'tokenD',
        coefficient: 2,
        path: new Set(['tokenA', 'tokenC', 'tokenE', 'tokenF', 'tokenD']),
      },
      tokenE: {
        id: 'tokenE',
        coefficient: 1.5,
        path: new Set(['tokenA', 'tokenC', 'tokenD', 'tokenF', 'tokenE']),
      },
      tokenF: {
        id: 'tokenF',
        coefficient: 3,
        path: new Set(['tokenA', 'tokenC', 'tokenD', 'tokenF']),
      },
    },
  ];

  test.each([case0, case1, case3] as [number, WeightList, GraphNodeList][])(
    'should return the correct path case%i',
    (index, weights, expected) => {
      const paths = findMaximalPaths(weights, 'tokenA');

      Object.values(paths).forEach((path) => {
        const expectedItem = expected[path.id];
        expect(path.id).toEqual(expectedItem.id);
        expect(path.coefficient).toBeCloseTo(expectedItem.coefficient);
        expect(path.path).toEqual(expectedItem.path);
      });
    }
  );
});

describe('getTokenPaths', () => {
  const allPairs = mockAllPairs();
  const tokenList = mockTokenList();

  test('should return the correct path', () => {
    const paths = getTokenPaths(allPairs, tokenList, Object.keys(tokenList)[0]);
    expect(paths).toEqual({
      'oexpe-biaaa-aaaah-qcf6q-cai': {
        path: ['onuey-xaaaa-aaaah-qcf7a-cai', 'oexpe-biaaa-aaaah-qcf6q-cai'],
        coefficient: 0.99698012,
      },
      'gagfc-iqaaa-aaaah-qcdvq-cai': {
        path: ['onuey-xaaaa-aaaah-qcf7a-cai', 'gagfc-iqaaa-aaaah-qcdvq-cai'],
        coefficient: 0.99699006,
      },
      'gvbup-jyaaa-aaaah-qcdwa-cai': {
        path: [
          'onuey-xaaaa-aaaah-qcf7a-cai',
          'gagfc-iqaaa-aaaah-qcdvq-cai',
          'gvbup-jyaaa-aaaah-qcdwa-cai',
        ],
        coefficient: 1.0144484127600635,
      },
    });
  });
});
