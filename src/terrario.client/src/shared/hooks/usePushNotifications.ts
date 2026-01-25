import { getToken, type Messaging } from "firebase/messaging";
import { useFirebaseApp } from "./useFirebase";
import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { config } from "../../config";
import { apiClient } from "../api/client";

async function saveToken(token: string) {
  try {
    await apiClient.saveFcmToken({
      token: token,
      deviceId: navigator.userAgent, // Use user agent as device ID
    });
    console.log("FCM token saved successfully");
  } catch (error) {
    console.error("Failed to save FCM token:", error);
  }
}

async function requestPermission(messaging: Messaging) {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: config.vapidKey,
    });
    saveToken(token);
  }
}

async function tryRequestPermission(messaging: Messaging) {
  try {
    await requestPermission(messaging);
  } catch {
    /* empty */
  }
}

export function usePushNotifications() {
  const { messaging } = useFirebaseApp();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (messaging && isAuthenticated) {
      tryRequestPermission(messaging);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);
}
