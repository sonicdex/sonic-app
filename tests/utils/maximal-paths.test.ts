import { getTokenPaths } from '@/utils/maximal-paths';

import { mockAllPairs } from '../mocks/all-pairs';
import { mockTokenList } from '../mocks/token-list';

describe('getTokenPaths', () => {
  const allPairs = mockAllPairs();
  const tokenList = mockTokenList();

  test('should return the correct path 0', () => {
    const paths = getTokenPaths({
      pairList: allPairs,
      tokenList,
      tokenId: Object.keys(tokenList)[0],
    });
    expect(paths).toEqual({
      'oexpe-biaaa-aaaah-qcf6q-cai': {
        path: ['onuey-xaaaa-aaaah-qcf7a-cai', 'oexpe-biaaa-aaaah-qcf6q-cai'],
        amountOut: 0.99698012,
      },
      'gagfc-iqaaa-aaaah-qcdvq-cai': {
        path: ['onuey-xaaaa-aaaah-qcf7a-cai', 'gagfc-iqaaa-aaaah-qcdvq-cai'],
        amountOut: 0.99699006,
      },
      'gvbup-jyaaa-aaaah-qcdwa-cai': {
        path: [
          'onuey-xaaaa-aaaah-qcf7a-cai',
          'gagfc-iqaaa-aaaah-qcdvq-cai',
          'gvbup-jyaaa-aaaah-qcdwa-cai',
        ],
        amountOut: 1.01444847,
      },
    });
  });

  test('should return the correct path 1', () => {
    const paths = getTokenPaths({
      pairList: allPairs,
      tokenList,
      tokenId: Object.keys(tokenList)[1],
    });
    expect(paths).toEqual({
      'onuey-xaaaa-aaaah-qcf7a-cai': {
        path: ['oexpe-biaaa-aaaah-qcf6q-cai', 'onuey-xaaaa-aaaah-qcf7a-cai'],
        amountOut: 0.99698012,
      },
      'gagfc-iqaaa-aaaah-qcdvq-cai': {
        path: ['oexpe-biaaa-aaaah-qcf6q-cai', 'gagfc-iqaaa-aaaah-qcdvq-cai'],
        amountOut: 0.99698012,
      },
      'gvbup-jyaaa-aaaah-qcdwa-cai': {
        path: [
          'oexpe-biaaa-aaaah-qcf6q-cai',
          'gagfc-iqaaa-aaaah-qcdvq-cai',
          'gvbup-jyaaa-aaaah-qcdwa-cai',
        ],
        amountOut: 1.01443836,
      },
    });
  });

  test('should return the correct path 2', () => {
    const paths = getTokenPaths({
      pairList: allPairs,
      tokenList,
      tokenId: Object.keys(tokenList)[2],
    });

    expect(paths).toEqual({
      'wjsrf-myaaa-aaaam-qaayq-cai': {
        path: ['a7saq-3aaaa-aaaai-qbcdq-cai', 'wjsrf-myaaa-aaaam-qaayq-cai'],
        amountOut: 0.42662752,
      },
      'cfoim-fqaaa-aaaai-qbcmq-cai': {
        path: ['a7saq-3aaaa-aaaai-qbcdq-cai', 'cfoim-fqaaa-aaaai-qbcmq-cai'],
        amountOut: 1.50360676,
      },
    });
  });

  test('should return the correct path 3', () => {
    const paths = getTokenPaths({
      pairList: allPairs,
      tokenList,
      tokenId: Object.keys(tokenList)[3],
    });
    expect(paths).toEqual({});
  });
});
