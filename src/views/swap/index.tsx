import { useEffect, useState } from 'react';

import { HomeStep, ReviewStep } from './steps';
import { useUserBalances } from '@/hooks/use-user-balances';
import { useSwapActor } from '@/integrations/actor/use-swap-actor';
import { SwapIDL } from '@/did';
import { SupportedToken, SupportedTokenList } from '@/models';

const parseResponseTokenList = (
  response: SwapIDL.TokenInfoExt[]
): SupportedTokenList => {
  return response.reduce((list, token) => {
    list[token.id] = {
      ...token,
      logo: '/assets/info.svg',
    };
    return list;
  }, {} as SupportedTokenList);
};

enum SwapStep {
  Home,
  Review,
}

export const Swap = () => {
  const [step, setStep] = useState(SwapStep.Home);

  const [tokenList, setTokenList] = useState<SupportedTokenList>({});
  const [keepInSonic, setKeepInSonic] = useState(false);
  const [fromValue, setFromValue] = useState('0.00');
  const [fromToken, setFromToken] = useState<SupportedToken>();
  const [toValue, setToValue] = useState('0.00');
  const [toToken, setToToken] = useState<SupportedToken>();

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

  const handleTokenSelect = (
    tokenName: string,
    setter: (token: SupportedToken) => void
  ) => {
    setter(tokenList[tokenName]);
  };

  const handleNextStep = () => {
    if (step + 1 < Object.keys(SwapStep).length) {
      setStep(step + 1);
    } else {
      setStep(SwapStep.Home);
    }
  };

  const handlePrevStep = () => {
    if (step - 1 >= 0) {
      setStep(step - 1);
    }
  };

  const steps = {
    [SwapStep.Home]: (
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
    ),
    [SwapStep.Review]: (
      <ReviewStep
        keepInSonic={keepInSonic}
        setKeepInSonic={setKeepInSonic}
        setFromValue={setFromValue}
        fromValue={fromValue}
        toValue={toValue}
        fromToken={fromToken}
        toToken={toToken}
        nextStep={handleNextStep}
        prevStep={handlePrevStep}
        tokenOptions={tokenList}
      />
    ),
  };

  if (steps.hasOwnProperty(step)) {
    return steps[step];
  }

  return steps[SwapStep.Home];
};
