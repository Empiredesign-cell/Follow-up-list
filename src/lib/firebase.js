import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyAS_LhW8Kgxb9amoDMsHkta-rnKu5RnYZI',
  authDomain: 'follow-up-list.firebaseapp.com',
  projectId: 'follow-up-list',
  storageBucket: 'follow-up-list.firebasestorage.app',
  messagingSenderId: '1042244485783',
  appId: '1:1042244485783:web:a75b4e272133965de05fd2',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
