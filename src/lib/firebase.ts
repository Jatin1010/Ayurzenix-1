import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, setPersistence, browserLocalPersistence, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Configure Persistence
setPersistence(auth, browserLocalPersistence).catch(err => console.warn("Firebase Auth persistence error:", err));

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Logout utility
 */
export const logoutUser = async () => {
  try {
    await auth.signOut();
    localStorage.removeItem('user_session');
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

/**
 * Phone Auth helpers
 */
export const requestPhoneAuth = async (phoneNumber: string, appVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
  return signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export { RecaptchaVerifier, app };

// Simple connection health check
async function checkHealth() {
  try {
    await getDocFromServer(doc(db, 'test', 'health'));
  } catch (e) {
    // Silent catch
  }
}
checkHealth();
