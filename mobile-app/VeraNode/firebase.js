import { initializeApp, getApps, getApp } from "firebase/app"; // Moved getApps and getApp here
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // Removed them from here
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your config remains the same
const firebaseConfig = {
  apiKey: "AIzaSyBsuqZRSYNaG6GWt5F5gPR2MyYSPiB8QyM",
  authDomain: "veranode-836e3.firebaseapp.com",
  projectId: "veranode-836e3",
  storageBucket: "veranode-836e3.firebasestorage.app",
  messagingSenderId: "687137819180",
  appId: "1:687137819180:web:10d4ea68460a384ff01f89"
};

// Initialize Firebase
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };