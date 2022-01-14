import { Principal } from '@dfinity/principal';

import { parseResponseAllPairs } from '@/utils/canister';

export const mockAllPairs = () =>
  parseResponseAllPairs([
    {
      id: 'a7saq-3aaaa-aaaai-qbcdq-cai:wjsrf-myaaa-aaaam-qaayq-cai',
      price0CumulativeLast: BigInt(
        '103334672102411617944258660971823473471340'
      ),
      creator: Principal.fromText(
        'lkqmh-5vihe-t5x5j-smuot-vitei-tgfyx-losfh-bbud4-fp2rq-353dj-yqe'
      ),
      reserve0: BigInt('97396835'),
      reserve1: BigInt('84339953'),
      lptoken: 'a7saq-3aaaa-aaaai-qbcdq-cai:wjsrf-myaaa-aaaam-qaayq-cai',
      totalSupply: BigInt('90401944'),
      token0: 'a7saq-3aaaa-aaaai-qbcdq-cai',
      token1: 'wjsrf-myaaa-aaaam-qaayq-cai',
      price1CumulativeLast: BigInt(
        '137806291317899640340088878161901233279230'
      ),
      kLast: BigInt('8207934346650000'),
      blockTimestampLast: BigInt('1639001350592394056'),
    },
    {
      id: 'oexpe-biaaa-aaaah-qcf6q-cai:wjsrf-myaaa-aaaam-qaayq-cai',
      price0CumulativeLast: BigInt('0'),
      creator: Principal.fromText('2vxsx-fae'),
      reserve0: BigInt('0'),
      reserve1: BigInt('0'),
      lptoken: 'oexpe-biaaa-aaaah-qcf6q-cai:wjsrf-myaaa-aaaam-qaayq-cai',
      totalSupply: BigInt('0'),
      token0: 'oexpe-biaaa-aaaah-qcf6q-cai',
      token1: 'wjsrf-myaaa-aaaam-qaayq-cai',
      price1CumulativeLast: BigInt('0'),
      kLast: BigInt('0'),
      blockTimestampLast: BigInt('0'),
    },
    {
      id: 'cfoim-fqaaa-aaaai-qbcmq-cai:xe4vl-dqaaa-aaaam-qaa7a-cai',
      price0CumulativeLast: BigInt('0'),
      creator: Principal.fromText('2vxsx-fae'),
      reserve0: BigInt('0'),
      reserve1: BigInt('0'),
      lptoken: 'cfoim-fqaaa-aaaai-qbcmq-cai:xe4vl-dqaaa-aaaam-qaa7a-cai',
      totalSupply: BigInt('0'),
      token0: 'cfoim-fqaaa-aaaai-qbcmq-cai',
      token1: 'xe4vl-dqaaa-aaaam-qaa7a-cai',
      price1CumulativeLast: BigInt('0'),
      kLast: BigInt('0'),
      blockTimestampLast: BigInt('0'),
    },
    {
      id: 'a7saq-3aaaa-aaaai-qbcdq-cai:cfoim-fqaaa-aaaai-qbcmq-cai',
      price0CumulativeLast: BigInt(
        '55829381825894764350487484407522750263915544'
      ),
      creator: Principal.fromText(
        'tqjnl-eteua-vbnza-3yuzm-a3pnk-mk7zw-ehhwr-eert4-dhlhu-aycmo-zae'
      ),
      reserve0: BigInt('1351108753'),
      reserve1: BigInt('2188009872'),
      lptoken: 'a7saq-3aaaa-aaaai-qbcdq-cai:cfoim-fqaaa-aaaai-qbcmq-cai',
      totalSupply: BigInt('1700199266'),
      token0: 'a7saq-3aaaa-aaaai-qbcdq-cai',
      token1: 'cfoim-fqaaa-aaaai-qbcmq-cai',
      price1CumulativeLast: BigInt(
        '21288491078524716889706976605438884419345868'
      ),
      kLast: BigInt('2954492946802563695'),
      blockTimestampLast: BigInt('1639609398465893790'),
    },
    {
      id: 'oexpe-biaaa-aaaah-qcf6q-cai:onuey-xaaaa-aaaah-qcf7a-cai',
      price0CumulativeLast: BigInt('0'),
      creator: Principal.fromText(
        '4qehi-lqyo6-afz4c-hwqwo-lubfi-4evgk-5vrn5-rldx2-lheha-xs7a4-gae'
      ),
      reserve0: BigInt('5000000000000'),
      reserve1: BigInt('5000000000000'),
      lptoken: 'oexpe-biaaa-aaaah-qcf6q-cai:onuey-xaaaa-aaaah-qcf7a-cai',
      totalSupply: BigInt('4999999999000'),
      token0: 'oexpe-biaaa-aaaah-qcf6q-cai',
      token1: 'onuey-xaaaa-aaaah-qcf7a-cai',
      price1CumulativeLast: BigInt('0'),
      kLast: BigInt('25000000000000000000000000'),
      blockTimestampLast: BigInt('1636524536787902866'),
    },
    {
      id: 'gagfc-iqaaa-aaaah-qcdvq-cai:gvbup-jyaaa-aaaah-qcdwa-cai',
      price0CumulativeLast: BigInt(
        '75860386083320136473922812321869497466131066'
      ),
      creator: Principal.fromText(
        '4qehi-lqyo6-afz4c-hwqwo-lubfi-4evgk-5vrn5-rldx2-lheha-xs7a4-gae'
      ),
      reserve0: BigInt('4949571804783'),
      reserve1: BigInt('5051500000000'),
      lptoken: 'gagfc-iqaaa-aaaah-qcdvq-cai:gvbup-jyaaa-aaaah-qcdwa-cai',
      totalSupply: BigInt('5000199998998'),
      token0: 'gagfc-iqaaa-aaaah-qcdvq-cai',
      token1: 'gvbup-jyaaa-aaaah-qcdwa-cai',
      price1CumulativeLast: BigInt(
        '72829879624849960903550725329066824091591549'
      ),
      kLast: BigInt('25002000040000000000000000'),
      blockTimestampLast: BigInt('1636555135500526085'),
    },
    {
      id: 'gagfc-iqaaa-aaaah-qcdvq-cai:onuey-xaaaa-aaaah-qcf7a-cai',
      price0CumulativeLast: BigInt('4954335781000000000000000000000000000000'),
      creator: Principal.fromText(
        '4qehi-lqyo6-afz4c-hwqwo-lubfi-4evgk-5vrn5-rldx2-lheha-xs7a4-gae'
      ),
      reserve0: BigInt('10000000000000'),
      reserve1: BigInt('10000000000000'),
      lptoken: 'gagfc-iqaaa-aaaah-qcdvq-cai:onuey-xaaaa-aaaah-qcf7a-cai',
      totalSupply: BigInt('9999999998000'),
      token0: 'gagfc-iqaaa-aaaah-qcdvq-cai',
      token1: 'onuey-xaaaa-aaaah-qcf7a-cai',
      price1CumulativeLast: BigInt('4954335781000000000000000000000000000000'),
      kLast: BigInt('100000000000000000000000000'),
      blockTimestampLast: BigInt('1636524565869303906'),
    },
    {
      id: 'gagfc-iqaaa-aaaah-qcdvq-cai:oexpe-biaaa-aaaah-qcf6q-cai',
      price0CumulativeLast: BigInt('0'),
      creator: Principal.fromText(
        '4qehi-lqyo6-afz4c-hwqwo-lubfi-4evgk-5vrn5-rldx2-lheha-xs7a4-gae'
      ),
      reserve0: BigInt('5000000000000'),
      reserve1: BigInt('5000000000000'),
      lptoken: 'gagfc-iqaaa-aaaah-qcdvq-cai:oexpe-biaaa-aaaah-qcf6q-cai',
      totalSupply: BigInt('4999999999000'),
      token0: 'gagfc-iqaaa-aaaah-qcdvq-cai',
      token1: 'oexpe-biaaa-aaaah-qcf6q-cai',
      price1CumulativeLast: BigInt('0'),
      kLast: BigInt('25000000000000000000000000'),
      blockTimestampLast: BigInt('1636523989958558122'),
    },
  ]);
