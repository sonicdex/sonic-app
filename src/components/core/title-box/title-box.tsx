import { settingSrc, arrowBackSrc } from '@/assets';
import { Box, Flex } from "@chakra-ui/react"

type TitleBoxProps = {
  children?: any,
  settings?: any,
  onArrowBack?: () => void,
  title: string,
};

export const TitleBox = ({...props} : TitleBoxProps) => {
  const { title, children, settings, onArrowBack } = props;

  const headerBottomRadius = children ? 0 : 20;
  const titleRightAdjustment = settings ? "-16px" : "auto";
  const titleLeftAdjustment = onArrowBack ? "-16px" : "auto";

  return (
    <Flex
      direction="column"
    >
      <Flex
        pt={15}
        pb={13}
        px={21}
        bg="#1E1E1E"
        fontSize={18}
        color="#F6FCFD"
        fontWeight={700}
        textAlign="center"
        borderTopRadius={20}
        borderBottomRadius={headerBottomRadius}
        direction="row"
      >
        { onArrowBack && (
          <Box
            as="img"
            src={arrowBackSrc}
            mr="auto"
          />
        )}
        <Box
          ml={titleLeftAdjustment}
          mr={titleRightAdjustment}
        >
          {title}
        </Box>
        { settings && (
          <Box
            as="img"
            src={settingSrc}
            ml="auto"
          />
        )}
      </Flex>
      { children && (
        <Box
          py={15}
          px={21}
          bg="#282828"
          borderBottomRadius={20}
        >
          {children}
        </Box>
      )}
    </Flex>
  )
}
