import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function logError(error: any, context: string) {
  try {
    const errorLog = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
      context,
      timestamp: serverTimestamp(),
      userId: auth.currentUser?.uid || 'anonymous',
      userEmail: auth.currentUser?.email || 'anonymous',
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorType: error?.name || 'UnknownError'
    };

    await addDoc(collection(db, 'app_errors'), errorLog);
    console.error(`Logged error to Firestore: [${context}]`, error instanceof Error ? error.message : error);
  } catch (e) {
    console.error('Failed to log error to Firestore:', e);
  }
}
