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
    // Register service worker manually with version to force update
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js?v=2');
        console.log('Service Worker registered successfully:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

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
