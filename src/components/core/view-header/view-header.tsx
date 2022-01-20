import {
  Box,
  Flex,
  IconButton,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaArrowLeft } from '@react-icons/all-files/fa/FaArrowLeft';

type ViewHeaderProps = {
  title: string;
  onArrowBack?: () => void;
};

export const ViewHeader: React.FC<ViewHeaderProps> = ({
  title,
  onArrowBack,
  children,
}) => {
  const titleRightAdjustment = children ? 8 : 'auto';
  const titleLeftAdjustment = onArrowBack ? 8 : 'auto';

  const bg = useColorModeValue('gray.50', 'custom.2');
  const shadow = useColorModeValue('md', 'none');
  const color = useColorModeValue('gray.800', 'gray.50');

  return (
    <Flex direction="column">
      <Flex
        py={3}
        px={5}
        bg={bg}
        shadow={shadow}
        fontSize="lg"
        color={color}
        fontWeight={700}
        textAlign="center"
        borderTopRadius={20}
        borderBottomRadius={20}
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
        {children}
      </Flex>
    </Flex>
  );
};
