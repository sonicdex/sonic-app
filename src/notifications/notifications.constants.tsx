import { Link, Text } from '@chakra-ui/react';

const SWAP_ERROR_LINK = '#';

const SwapError = () => (
  <Text color="custom.1">
    Since the swap failed, your assets are now deposited in Sonic, you can
    either retry the swap or{' '}
    <Link
      rel="noreferrer"
      target="_blank"
      href={SWAP_ERROR_LINK}
      textDecoration="underline"
    >
      withdraw the assets
    </Link>
    .
  </Text>
);

export enum ErrorNotificationType {
  Swap = 'SWAP',
}
export const ERRORS = {
  [ErrorNotificationType.Swap]: <SwapError />,
};
