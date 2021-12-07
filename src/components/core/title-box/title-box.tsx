import { Box, IconButton, Flex, Tooltip } from '@chakra-ui/react';
import { FaArrowLeft, FaCog } from 'react-icons/fa';

type TitleBoxProps = {
  children?: any;
  settings?: any;
  onArrowBack?: () => void;
  title: string;
};

export const TitleBox = ({
  children,
  title,
  settings,
  onArrowBack,
}: TitleBoxProps) => {
  const headerBottomRadius = children ? 0 : 20;
  const titleRightAdjustment = settings ? '-16px' : 'auto';
  const titleLeftAdjustment = onArrowBack ? '-18px' : 'auto';

  return (
    <Flex direction="column">
      <Flex
        pt={4}
        pb={3}
        px={5}
        bg="#1E1E1E"
        fontSize="lg"
        color="#F6FCFD"
        fontWeight={700}
        textAlign="center"
        borderTopRadius={20}
        borderBottomRadius={headerBottomRadius}
        direction="row"
      >
        {onArrowBack && (
          <Tooltip label="Back">
            <IconButton
              size="sm"
              isRound
              variant="outline"
              onClick={onArrowBack}
              aria-label="back"
              icon={<FaArrowLeft />}
              mr="auto"
            />
          </Tooltip>
        )}
        <Box ml={titleLeftAdjustment} mr={titleRightAdjustment}>
          {title}
        </Box>
        {settings && (
          <Tooltip label="Settings">
            <IconButton
              isRound
              variant="outline"
              size="sm"
              aria-label="settings"
              icon={<FaCog />}
              ml="auto"
            />
          </Tooltip>
        )}
      </Flex>
      {children && (
        <Box py={2} px={5} bg="#282828" borderBottomRadius={20}>
          {children}
        </Box>
      )}
    </Flex>
  );
};
