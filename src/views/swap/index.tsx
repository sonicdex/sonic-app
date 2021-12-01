import { useEffect, useState } from 'react';

import { useAppSelector, selectPlugState } from '@/store';
import { HomeStep, ReviewStep } from './steps';
import { useUserBalances } from '@/hooks/use-user-balances';
import { useSwapActor } from '@/integrations/actor/use-swap-actor';
import { SwapIDL } from '@/did';
import { Balances, SupportedToken, SupportedTokenList } from '@/models';

// Mocked
// const tokenOptions = {
//   XMPL: {
//     img: '/assets/info.svg',
//     name: 'XMPL',
//   },
//   XMP2: {
//     img: '/assets/info.svg',
//     name: 'XMP2',
//   },
//   XMP3: {
//     img: '/assets/info.svg',
//     name: 'XMP3',
//   },
// };

const parseResponseTokenList = (
  response: SwapIDL.TokenInfoExt[]
): SupportedTokenList => {
  return response.reduce((list, token) => {
    list[token.id] = {
      ...token,
      img: '/assets/info.svg',
    };
    return list;
  }, {} as SupportedTokenList);
};

const STEPS = [HomeStep, ReviewStep];

export const Swap = () => {
  const [step, setStep] = useState(0);

  const [tokenList, setTokenList] = useState<SupportedTokenList>({});
  const { isConnected } = useAppSelector(selectPlugState);
  const [keepInSonic, setKeepInSonic] = useState(false);
  const [fromValue, setFromValue] = useState('0.00');
  const [fromToken, setFromToken] = useState<SupportedToken>();
  const [toValue, setToValue] = useState('0.00');
  const [toToken, setToToken] = useState<SupportedToken>();
  const [modalOpen, setModalOpen] = useState(true);

  const swapActor = useSwapActor();
  const { totalBalances } = useUserBalances();

  useEffect(() => {
    if (!swapActor) return;
    swapActor.getSupportedTokenList().then((response) => {
      const parsedTokenList = parseResponseTokenList(response);
      setTokenList(parsedTokenList);
      setFromToken(Object.values(parsedTokenList)[0]);
      setToToken(Object.values(parsedTokenList)[1]);
    });
  }, [swapActor]);

  const handleTokenSelect = (tokenName: string, setter) => {
    setter(tokenList[tokenName]);
  };

  const handleNextStep = () => {
    if (step + 1 < STEPS.length) {
      setStep(step + 1);
    } else {
      setStep(0);
    }
  };

  const handlePrevStep = () => {
    if (step - 1 >= 0) {
      setStep(step - 1);
    }
  };

  switch (step) {
    case 0:
      return (
        <HomeStep
          handleTokenSelect={handleTokenSelect}
          fromValue={fromValue}
          fromToken={fromToken}
          toValue={toValue}
          toToken={toToken}
          setFromValue={setFromValue}
          setFromToken={setFromToken}
          setToValue={setToValue}
          setToToken={setToToken}
          tokenOptions={tokenList}
          nextStep={handleNextStep}
          balances={totalBalances}
        />
      );
      break;
    case 1:
      return (
        <ReviewStep
          keepInSonic={keepInSonic}
          setKeepInSonic={setKeepInSonic}
          fromValue={fromValue}
          toValue={toValue}
          fromToken={fromToken}
          toToken={toToken}
          nextStep={handleNextStep}
          prevStep={handlePrevStep}
          tokenOptions={tokenList}
        />
      );
      break;
  }
};
