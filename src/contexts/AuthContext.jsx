import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setFirebaseUser(user);
    if (!user) {
      setProfile(null);
      setProfileReady(true);
      setAuthReady(true);
    } else {
      setProfileReady(false);
      setAuthReady(true);
    }
  }), []);

  useEffect(() => {
    if (!firebaseUser) return undefined;
    const ref = doc(db, 'users', firebaseUser.uid);
    return onSnapshot(ref, (snap) => {
      setProfile(snap.exists() ? { uid: firebaseUser.uid, ...snap.data() } : null);
      setProfileReady(true);
    }, (error) => {
      console.error('Profile load failed', error);
      setProfile(null);
      setProfileReady(true);
    });
  }, [firebaseUser]);

  const value = useMemo(() => ({
    firebaseUser,
    profile,
    authReady,
    profileReady,
    isAuthenticated: !!firebaseUser,
    isActive: profile?.active !== false,
    isSuperAdmin: profile?.role === 'super_admin',
    isDivisionAdmin: profile?.role === 'division_admin',
    logout: () => signOut(auth),
  }), [firebaseUser, profile, authReady, profileReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
