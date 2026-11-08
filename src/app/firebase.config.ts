// Firebase web config: it's fine for this to be public.
// Security is enforced by the Firestore rules (firestore.rules), not by hiding these values.
// TODO: replace with the values from Firebase console → Project settings → Your apps.
export const firebaseConfig = {
  apiKey: 'REPLACE_ME',
  authDomain: 'REPLACE_ME.firebaseapp.com',
  projectId: 'REPLACE_ME',
  storageBucket: 'REPLACE_ME.firebasestorage.app',
  messagingSenderId: 'REPLACE_ME',
  appId: 'REPLACE_ME',
};

// The only account allowed to add/delete recipes. Must match firestore.rules.
export const ADMIN_EMAIL = 'shayas106@gmail.com';
