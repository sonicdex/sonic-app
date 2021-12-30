import {
  Box,
  IconButton,
  Flex,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import { FaArrowLeft, FaCog } from 'react-icons/fa';

type TitleBoxProps = {
  title: string;
  onArrowBack?: () => void;
  settings?: React.ReactNode;
};

export const TitleBox: React.FC<TitleBoxProps> = ({
  title,
  onArrowBack,
  settings,
  children,
}) => {
  const headerBottomRadius = children ? 0 : 20;
  const titleRightAdjustment = settings ? 8 : 'auto';
  const titleLeftAdjustment = onArrowBack ? 8 : 'auto';

  return (
    <Flex direction="column">
      <Flex
        py={3}
        px={5}
        bg="#1E1E1E"
        fontSize="lg"
        color="#F6FCFD"
        fontWeight={700}
        textAlign="center"
        borderTopRadius={20}
        borderBottomRadius={headerBottomRadius}
        direction="row"
        align="center"
      >
        {onArrowBack && (
          <Tooltip label="Back">
            <IconButton
              size="sm"
              isRound
              onClick={onArrowBack}
              variant="outline"
              aria-label="back"
              icon={<FaArrowLeft />}
              mr="auto"
            />
          </Tooltip>
        )}
        <Box
          pr={titleLeftAdjustment}
          pl={titleRightAdjustment}
          w="100%"
          mx="auto"
        >
          {title}
        </Box>
        {settings && (
          <Menu>
            <MenuButton
              as={IconButton}
              isRound
              size="sm"
              aria-label="settings"
              icon={<FaCog />}
              ml="auto"
            />
            <MenuList
              bg="#1E1E1E"
              border="none"
              borderRadius={20}
              ml={-20}
              py={0}
            >
              {settings}
            </MenuList>
          </Menu>
        )}
      </Flex>
      {children}
    </Flex>
  );
};
