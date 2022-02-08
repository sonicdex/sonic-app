import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowDown } from '@react-icons/all-files/fa/FaArrowDown';
import { FaCog } from '@react-icons/all-files/fa/FaCog';
import { FaInfoCircle } from '@react-icons/all-files/fa/FaInfoCircle';

import {
  PlugButton,
  SlippageSettings,
  Token,
  TokenContent,
  TokenData,
  TokenDataBalances,
  TokenDataPrice,
  TokenDetailsButton,
  TokenDetailsLogo,
  TokenDetailsSymbol,
  TokenInput,
  ViewHeader,
} from '@/components';
import { ENV } from '@/config';
import { useSwapView, useSwapViewStore } from '@/store';

import { SwapStep } from './';
import { ExchangeBox, KeepInSonicBox } from './components';
import { useSwapViewData } from './hooks';

export const SwapView = () => {
  useSwapView();
  const { fromTokenOptions, toTokenOptions, from, to, slippage } =
    useSwapViewStore();

  const {
    step,
    headerTitle,
    isAutoSlippage,
    isICPSelected,
    isLoading,
    isBalancesUpdating,
    isPriceUpdating,
    isSwapPlacementButtonDisabled,
    isExplanationTooltipVisible,
    isSelectTokenButtonDisabled,
    selectTokenButtonText,
    currentOperation,
    priceImpact,
    fromSources,
    toSources,
    canHeldInSonic,
    isConnected,
    isButtonDisabled,
    buttonMessage,
    setStep,
    setLastChangedInputDataKey,
    onButtonClick,
    onChangeValue,
    onSetIsAutoSlippage,
    onSetSlippage,
    onMenuClose,
    onMaxClick,
    onSelectToken,
    onSwitchTokens,
  } = useSwapViewData();

  const swapPlacementButtonBg = useColorModeValue('gray.50', 'gray.800');
  const menuListShadow = useColorModeValue('lg', 'none');
  const menuListBg = useColorModeValue('gray.50', 'custom.3');
  const linkColor = useColorModeValue('dark-blue.500', 'dark-blue.400');

  return (
    <Stack spacing={4}>
      <ViewHeader
        title={headerTitle}
        onArrowBack={
          step === SwapStep.Review ? () => setStep(SwapStep.Home) : undefined
        }
      >
        <Menu onClose={onMenuClose}>
          <Tooltip label="Adjust the slippage">
            <MenuButton
              as={IconButton}
              isRound
              size="sm"
              aria-label="Adjust the slippage"
              icon={<FaCog />}
              ml="auto"
              isDisabled={isICPSelected}
            />
          </Tooltip>
          <MenuList
            bg={menuListBg}
            shadow={menuListShadow}
            border="none"
            borderRadius={20}
            ml={-20}
            py={0}
          >
            <SlippageSettings
              slippage={slippage}
              isAutoSlippage={isAutoSlippage}
              setSlippage={onSetSlippage}
              setIsAutoSlippage={onSetIsAutoSlippage}
            />
          </MenuList>
        </Menu>
      </ViewHeader>
      <Flex direction="column" alignItems="center">
        <Box width="full">
          <Token
            value={from.value}
            setValue={(value) => onChangeValue(value, 'from')}
            tokenListMetadata={fromTokenOptions}
            tokenMetadata={from.metadata}
            isLoading={isLoading}
            sources={fromSources}
          >
            <TokenContent>
              <TokenDetailsButton onClick={() => onSelectToken('from')}>
                <TokenDetailsLogo />
                <TokenDetailsSymbol />
              </TokenDetailsButton>

              <TokenInput
                autoFocus
                onChange={() => setLastChangedInputDataKey('from')}
              />
            </TokenContent>
            <TokenData>
              <TokenDataBalances
                isUpdating={isBalancesUpdating}
                onMaxClick={() => onMaxClick('from')}
              />
              <TokenDataPrice isUpdating={isPriceUpdating} />
            </TokenData>
          </Token>
        </Box>

        <Flex direction="column-reverse" w="full">
          <Box width="full">
            <Token
              value={to.value}
              setValue={(value) => onChangeValue(value, 'to')}
              tokenListMetadata={toTokenOptions}
              tokenMetadata={to.metadata}
              isLoading={isLoading}
              sources={toSources}
              shouldGlow={step === SwapStep.Review}
            >
              <TokenContent>
                {to.metadata ? (
                  <TokenDetailsButton onClick={() => onSelectToken('to')}>
                    <TokenDetailsLogo />
                    <TokenDetailsSymbol />
                  </TokenDetailsButton>
                ) : (
                  <TokenDetailsButton
                    onClick={() => onSelectToken('to')}
                    isDisabled={isSelectTokenButtonDisabled}
                    variant={isLoading ? 'solid' : 'gradient'}
                    colorScheme={isLoading ? 'gray' : 'dark-blue'}
                  >
                    <Skeleton isLoaded={!isLoading}>
                      {selectTokenButtonText}
                    </Skeleton>
                  </TokenDetailsButton>
                )}

                <TokenInput onChange={() => setLastChangedInputDataKey('to')} />
              </TokenContent>
              <TokenData>
                <TokenDataBalances isUpdating={isBalancesUpdating} />
                <TokenDataPrice
                  isUpdating={isPriceUpdating}
                  priceImpact={priceImpact}
                >
                  {isExplanationTooltipVisible && (
                    <Popover trigger="hover">
                      <PopoverTrigger>
                        <Box tabIndex={0}>
                          <FaInfoCircle />
                        </Box>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverBody>
                          <Text>
                            This price & percentage shows the current difference
                            between minting and swapping to XTC from ICP. If
                            negative, it's better to mint; if positive, it's
                            better to swap.{' '}
                            <Link
                              color={linkColor}
                              rel="noopener noreferrer"
                              target="_blank"
                              href={`${ENV.URLs.sonicDocs}/developer-guides/front-end-integrations#icp-xtc`}
                            >
                              Learn More.
                            </Link>
                          </Text>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  )}
                </TokenDataPrice>
              </TokenData>
            </Token>
          </Box>
          <Tooltip label="Switch placement">
            <IconButton
              aria-label="Switch placement"
              icon={<Icon as={FaArrowDown} transition="transform 250ms" />}
              variant="outline"
              mt={-2}
              mb={-2}
              w="fit-content"
              mx="auto"
              bg={swapPlacementButtonBg}
              onClick={onSwitchTokens}
              isDisabled={isSwapPlacementButtonDisabled}
              pointerEvents={!to.metadata ? 'none' : 'all'}
              _hover={{
                '& > svg': {
                  transform: 'rotate(180deg)',
                },
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>

      <ExchangeBox priceImpact={priceImpact} />

      <KeepInSonicBox
        canHeldInSonic={canHeldInSonic}
        symbol={to.metadata?.symbol}
        operation={currentOperation}
      />

      {isConnected ? (
        <Button
          isFullWidth
          variant="gradient"
          colorScheme="dark-blue"
          size="lg"
          onClick={onButtonClick}
          isLoading={isLoading}
          isDisabled={isButtonDisabled}
        >
          {buttonMessage}
        </Button>
      ) : (
        <PlugButton variant="dark" />
      )}
    </Stack>
  );
};
