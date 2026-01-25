import { usePushNotifications } from "../hooks/usePushNotifications";

export function PushNotificationProvider(props: { children: React.ReactNode }) {
  usePushNotifications();

  return <>{props.children}</>;
}
