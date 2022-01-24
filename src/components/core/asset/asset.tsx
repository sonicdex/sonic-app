import {
  Box,
  BoxProps,
  Flex,
  FlexProps,
  Heading,
  IconButton,
  IconButtonProps,
  Skeleton,
  SkeletonCircle,
  Text,
  Tooltip,
  TooltipProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { createContext } from '@chakra-ui/react-utils';

import { questionMarkSrc } from '@/assets';

import { LPImageBlock, SwapImageBlock, TokenImageBlock } from '..';

export type AssetType = 'swap' | 'lp' | 'token';

export type AssetUniqueProps = {
  type?: AssetType;
  imageSources?: string[];
  isLoading?: boolean;
};

export type AssetProps = FlexProps & AssetUniqueProps;

const [AssetProvider, useAssetContext] = createContext<AssetUniqueProps>({
  name: 'CardContext',
  errorMessage:
    'useCardContext: `context` is undefined. Seems you forgot to wrap all card components within `<Card />`',
});

export const Asset = ({
  type,
  imageSources = [questionMarkSrc],
  isLoading = false,
  ...props
}: AssetProps) => {
  const bg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('base', 'none');

  return (
    <AssetProvider value={{ isLoading, type, imageSources }}>
      <Flex
        position="relative"
        direction="row"
        borderRadius="xl"
        alignItems="center"
        justifyContent="space-between"
        bg={bg}
        shadow={shadow}
        px={5}
        py={4}
        {...props}
      />
    </AssetProvider>
  );
};

type AssetIconButtonProps = IconButtonProps & {
  tooltipProps?: Partial<TooltipProps>;
};

export const AssetIconButton = ({
  'aria-label': ariaLabel,
  tooltipProps,
  ...props
}: AssetIconButtonProps) => {
  const { isLoading } = useAssetContext();

  return (
    <SkeletonCircle h={10} w={10} isLoaded={!isLoading}>
      <Tooltip label={ariaLabel} {...tooltipProps}>
        <IconButton
          isRound
          aria-label={ariaLabel}
          variant="outline"
          {...props}
        />
      </Tooltip>
    </SkeletonCircle>
  );
};

type AssetTitleBlockProps = BoxProps & {
  title: string;
  subtitle?: string;
};

export const AssetTitleBlock = ({
  title,
  subtitle,
  ...props
}: AssetTitleBlockProps) => {
  const { isLoading } = useAssetContext();
  const color = useColorModeValue('gray.800', 'gray.50');
  const subtitleColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box ml={4} {...props}>
      <Skeleton
        isLoaded={!isLoading}
        mb={isLoading ? 2 : 0}
        width={isLoading ? 60 : 'unset'}
      >
        <Heading as="h3" fontSize="lg" fontWeight={700} color={color}>
          {title}
        </Heading>
      </Skeleton>
      <Skeleton isLoaded={!isLoading} width={isLoading ? 40 : 'unset'}>
        <Text fontSize="sm" color={subtitleColor}>
          {subtitle}
        </Text>
      </Skeleton>
    </Box>
  );
};

export const AssetImageBlock = () => {
  const {
    type = 'token',
    imageSources = [questionMarkSrc, questionMarkSrc],
    isLoading,
  } = useAssetContext();

  const views = {
    swap: <SwapImageBlock imageSources={imageSources} isLoading={isLoading} />,
    lp: <LPImageBlock imageSources={imageSources} isLoading={isLoading} />,
    token: <TokenImageBlock src={imageSources[0]} isLoading={isLoading} />,
  };

  return views[type] ?? null;
};
