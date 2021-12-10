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
          <Box>
            <Menu>
              <MenuButton>
                <IconButton
                  isRound
                  size="sm"
                  aria-label="settings"
                  icon={<FaCog />}
                  ml="auto"
                />
              </MenuButton>
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
          </Box>
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
