import {
  IconButton,
  FlexProps,
  TooltipProps,
  Heading,
  BoxProps,
  Text,
  SkeletonCircle,
  Box,
  Image,
  Flex,
  Tooltip,
  IconButtonProps,
} from '@chakra-ui/react';
import { createContext } from '@chakra-ui/react-utils';
import { questionMarkSrc } from '@/assets';

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
  return (
    <AssetProvider value={{ isLoading, type, imageSources }}>
      <Flex
        position="relative"
        direction="row"
        borderRadius="xl"
        alignItems="center"
        justifyContent="space-between"
        bg="#1E1E1E"
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
  subtitle: string;
};

export const AssetTitleBlock = ({
  title,
  subtitle,
  ...props
}: AssetTitleBlockProps) => {
  return (
    <Box ml={4} {...props}>
      <Heading as="h3" fontSize="lg" fontWeight={700} color="#F6FCFD">
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.400">
        {subtitle}
      </Text>
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
    swap: (
      <Box width={10} height={10} position="relative">
        <SkeletonCircle h={6} w={6} isLoaded={!isLoading}>
          <Image
            position="absolute"
            width={6}
            height={6}
            top={0}
            left={0}
            src={imageSources[0]}
          />
        </SkeletonCircle>
        <Text>&#x21AA;</Text>
        <SkeletonCircle h={6} w={6} isLoaded={!isLoading}>
          <Image
            position="absolute"
            width={6}
            height={6}
            bottom={0}
            right={0}
            src={imageSources[1]}
          />
        </SkeletonCircle>
      </Box>
    ),
    lp: (
      <Box width={9} height={9} position="relative">
        <SkeletonCircle h={6} w={6} isLoaded={!isLoading}>
          <Image
            position="absolute"
            width={6}
            height={6}
            top={0}
            left={0}
            src={imageSources[0]}
          />
        </SkeletonCircle>
        <SkeletonCircle h={6} w={6} isLoaded={!isLoading}>
          <Image
            position="absolute"
            width={6}
            height={6}
            bottom={0}
            right={0}
            src={imageSources[1]}
          />
        </SkeletonCircle>
      </Box>
    ),
    token: (
      <SkeletonCircle h={10} w={10} isLoaded={!isLoading}>
        <Image width={10} height={10} src={imageSources[0]} />
      </SkeletonCircle>
    ),
  };

  return views[type] ?? null;
};
