import Icon, { IconProps } from '@chakra-ui/icon';
import { forwardRef } from '@chakra-ui/system';

export const PlusIcon = forwardRef<IconProps, 'svg'>((props, ref) => (
  <Icon
    ref={ref}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16.9062 7.9375H10.4375V1.46875C10.4375 1.10938 10.0781 0.75 9.71875 0.75H8.28125C7.87695 0.75 7.5625 1.10938 7.5625 1.46875V7.9375H1.09375C0.689453 7.9375 0.375 8.29688 0.375 8.65625V10.0938C0.375 10.498 0.689453 10.8125 1.09375 10.8125H7.5625V17.2812C7.5625 17.6855 7.87695 18 8.28125 18H9.71875C10.0781 18 10.4375 17.6855 10.4375 17.2812V10.8125H16.9062C17.2656 10.8125 17.625 10.498 17.625 10.0938V8.65625C17.625 8.29688 17.2656 7.9375 16.9062 7.9375Z"
      fill="#3B50ED"
    />
  </Icon>
));
