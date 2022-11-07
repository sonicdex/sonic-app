import { addNotification, NotificationType, store } from '@/store';

export const copyToClipboard = (
  text: string,
  message = 'Copied to clipboard'
): void => {
  navigator.clipboard.writeText(text);
  store.dispatch(
    addNotification({
      id: String(new Date().getTime()),
      title: message,
      type: NotificationType.Success,
    })
  );
};
