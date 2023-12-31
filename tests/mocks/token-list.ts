import {
  parseResponseSupportedTokenList,
  parseResponseTokenList,
} from '@/utils/canister';

export const mockTokenList = () =>
  parseResponseTokenList(
    parseResponseSupportedTokenList([
      {
        id: 'onuey-xaaaa-aaaah-qcf7a-cai',
        fee: BigInt('100000'),
        decimals: 8,
        name: 'USDT Test',
        totalSupply: BigInt('100000000000000'),
        symbol: 'USDT',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'oexpe-biaaa-aaaah-qcf6q-cai',
        fee: BigInt('100000'),
        decimals: 8,
        name: 'USDC Test',
        totalSupply: BigInt('201000000000000'),
        symbol: 'USDC',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'a7saq-3aaaa-aaaai-qbcdq-cai',
        fee: BigInt('0'),
        decimals: 8,
        name: 'TEST TOKEN',
        totalSupply: BigInt('2156879855'),
        symbol: 'TEST_TOKEN',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'kftk5-4qaaa-aaaah-aa5lq-cai',
        fee: BigInt('0'),
        decimals: 8,
        name: 'test token',
        totalSupply: BigInt('0'),
        symbol: 'TEST',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'li5ot-tyaaa-aaaah-aa5ma-cai',
        fee: BigInt('0'),
        decimals: 8,
        name: 'wicp',
        totalSupply: BigInt('0'),
        symbol: 'WICP',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'gagfc-iqaaa-aaaah-qcdvq-cai',
        fee: BigInt('100000'),
        decimals: 8,
        name: 'WICP Test',
        totalSupply: BigInt('110012000000000'),
        symbol: 'WICP',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'wjsrf-myaaa-aaaam-qaayq-cai',
        fee: BigInt('0'),
        decimals: 8,
        name: 'wicp',
        totalSupply: BigInt('126500000'),
        symbol: 'WICP',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'u2nsf-eaaaa-aaaam-qaawa-cai',
        fee: BigInt('0'),
        decimals: 8,
        name: 'wicp',
        totalSupply: BigInt('0'),
        symbol: 'WICP',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'gvbup-jyaaa-aaaah-qcdwa-cai',
        fee: BigInt('100000'),
        decimals: 8,
        name: 'XTC Test',
        totalSupply: BigInt('110115300000000'),
        symbol: 'XTC',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'xe4vl-dqaaa-aaaam-qaa7a-cai',
        fee: BigInt('0'),
        decimals: 8,
        name: 'WICP',
        totalSupply: BigInt('0'),
        symbol: 'WICP',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
      {
        id: 'cfoim-fqaaa-aaaai-qbcmq-cai',
        fee: BigInt('0'),
        decimals: 8,
        name: 'Beta Token',
        totalSupply: BigInt('8911419172'),
        symbol: 'BTKN',
        blockStatus:'none',
        tokenType:'ICRC1'
      },
    ])
  );
