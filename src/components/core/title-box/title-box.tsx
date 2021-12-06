import { Box, Image, Flex } from '@chakra-ui/react';
import { arrowBackSrc, settingSrc } from '@/assets';

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
        pt="15px"
        pb="13px"
        px="21px"
        bg="#1E1E1E"
        fontSize={18}
        color="#F6FCFD"
        fontWeight={700}
        textAlign="center"
        borderTopRadius={20}
        borderBottomRadius={headerBottomRadius}
        direction="row"
      >
        {onArrowBack && (
          <Image
            onClick={onArrowBack}
            src={arrowBackSrc}
            cursor="pointer"
            mr="auto"
          />
        )}
        <Box ml={titleLeftAdjustment} mr={titleRightAdjustment}>
          {title}
        </Box>
        {settings && <Image src={settingSrc} ml="auto" />}
      </Flex>
      {children && (
        <Box py="8px" px="21px" bg="#282828" borderBottomRadius={20}>
          {children}
        </Box>
      )}
    </Flex>
  );
};
