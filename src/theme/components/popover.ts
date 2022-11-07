import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import type {
  PartsStyleFunction,
  SystemStyleFunction,
  SystemStyleObject,
} from '@chakra-ui/theme-tools';
import { cssVar, mode } from '@chakra-ui/theme-tools';

const $popperBg = cssVar('popper-bg');

const $arrowBg = cssVar('popper-arrow-bg');
const $arrowShadowColor = cssVar('popper-arrow-shadow-color');

const baseStylePopper: SystemStyleObject = {
  zIndex: 10,
};

const baseStyleContent: SystemStyleFunction = (props) => {
  const bg = mode('white', 'gray.800')(props);
  const borderColor = mode('gray.100', 'custom.4')(props);

  return {
    [$popperBg.variable]: `colors.${bg}`,
    bg: $popperBg.reference,
    [$arrowBg.variable]: $popperBg.reference,
    [$arrowShadowColor.variable]: 'transparent',
    width: 'xs',
    borderRadius: 'xl',
    shadow: 'md',
    border: '1px solid',
    borderColor,
    zIndex: 'inherit',
    _focus: {
      outline: 0,
      boxShadow: 'outline',
    },
  };
};

const baseStyleHeader: SystemStyleObject = {
  mx: 4,
  py: 4,
  px: 1,
  borderBottomWidth: '1px',
  fontWeight: 'bold',
};

const baseStyleBody: SystemStyleObject = {
  mx: 4,
  px: 1,
  py: 4,
};

const baseStyleFooter: SystemStyleObject = {
  px: 3,
  py: 2,
  borderTopWidth: '1px',
};

const baseStyleCloseButton: SystemStyleObject = {
  position: 'absolute',
  borderRadius: 'md',
  top: 1,
  insetEnd: 2,
  padding: 2,
};

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  popper: baseStylePopper,
  content: baseStyleContent(props),
  header: baseStyleHeader,
  body: baseStyleBody,
  footer: baseStyleFooter,
  closeButton: baseStyleCloseButton,
});

export default {
  parts: parts.keys,
  baseStyle,
};
