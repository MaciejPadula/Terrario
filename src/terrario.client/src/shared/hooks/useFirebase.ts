import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { config } from "../../config";

export function useFirebaseApp() {
  try {
    const app = initializeApp(config.firebaseConfig);
    const messaging = getMessaging(app);
    return { app, messaging };
  } catch {
    return { app: null, messaging: null };
  }
}
