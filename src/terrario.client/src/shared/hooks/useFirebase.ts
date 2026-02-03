import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";
import { config } from "../../config";

export function useFirebaseApp() {
  try {
    const app = initializeApp(config.firebaseConfig);
    const messaging = getMessaging(app);
    const analytics = getAnalytics(app);
    return { app, messaging, analytics };
  } catch {
    return { app: null, messaging: null, analytics: null };
  }
}
