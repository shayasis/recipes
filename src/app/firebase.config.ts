// Firebase web config: it's fine for this to be public.
// Security is enforced by the Firestore rules (firestore.rules), not by hiding these values.
// From Firebase console → Project settings → Your apps (project: recipes-10c41).
export const firebaseConfig = {
  apiKey: 'AIzaSyBfwKFH1GZrnAHXNNpVJu69tYrxvHdicR4',
  authDomain: 'recipes-10c41.firebaseapp.com',
  projectId: 'recipes-10c41',
  storageBucket: 'recipes-10c41.firebasestorage.app',
  messagingSenderId: '882304730425',
  appId: '1:882304730425:web:861e195246708f9a3354e8',
};

// The only account allowed to add/delete recipes. Must match firestore.rules.
export const ADMIN_EMAIL = 'shayas106@gmail.com';
