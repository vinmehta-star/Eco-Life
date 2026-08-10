/* =========================================================
   EcoLife — Auth Service
   ========================================================= */

import { state } from '../state.js';
import { getFirebaseCDN, isFirebaseReady } from '../firebaseConfig.js';

let authModule = null;
let authInstance = null;

/** Load Firebase Auth module dynamically */
async function loadAuth() {
    if (authModule) return authModule;
    if (!isFirebaseReady()) return null;
    
    try {
        const CDN = getFirebaseCDN();
        authModule = await import(`${CDN}/firebase-auth.js`);
        const { initializeApp } = await import(`${CDN}/firebase-app.js`);
        // Auth instance is already created during initFirebase
        return authModule;
    } catch (e) {
        console.error('[Auth] Failed to load:', e);
        return null;
    }
}

/** Sign up with email/password */
export async function signUp(email, password, displayName) {
    const mod = await loadAuth();
    if (!mod) return offlineSignIn(displayName || email.split('@')[0], email);
    
    try {
        const { getAuth, createUserWithEmailAndPassword, updateProfile } = mod;
        const auth = getAuth();
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        
        if (displayName) {
            await updateProfile(cred.user, { displayName });
        }
        
        setUserState(cred.user, displayName, true);
        return { success: true, user: cred.user };
    } catch (e) {
        if (email.toLowerCase().includes('demo')) {
            console.warn('[Auth] Firebase sign-up failed for demo user, falling back to offline demo:', e);
            return offlineSignIn(displayName || email.split('@')[0], email, true);
        }
        return { success: false, error: getAuthError(e.code) };
    }
}

/** Sign in with email/password */
export async function signIn(email, password) {
    const mod = await loadAuth();
    if (!mod) return offlineSignIn(email.split('@')[0], email);
    
    try {
        const { getAuth, signInWithEmailAndPassword } = mod;
        const auth = getAuth();
        const cred = await signInWithEmailAndPassword(auth, email, password);
        setUserState(cred.user, null, true);
        return { success: true, user: cred.user };
    } catch (e) {
        if (email.toLowerCase().includes('demo')) {
            console.warn('[Auth] Firebase sign-in failed for demo user, falling back to offline demo:', e);
            return offlineSignIn(email.split('@')[0], email, true);
        }
        return { success: false, error: getAuthError(e.code) };
    }
}

/** Sign in with Google */
export async function signInWithGoogle() {
    const mod = await loadAuth();
    if (!mod) return offlineSignIn('EcoWarrior', 'offline@ecolife.app', false);
    
    try {
        const { getAuth, signInWithPopup, GoogleAuthProvider } = mod;
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        setUserState(cred.user, null, false);
        return { success: true, user: cred.user };
    } catch (e) {
        console.warn('[Auth] Google sign-in failed:', e.code, e.message);
        
        // Only fall back to offline for unrecoverable errors
        const offlineFallbackCodes = [
            'auth/operation-not-allowed',
            'auth/network-request-failed'
        ];
        
        if (offlineFallbackCodes.includes(e.code)) {
            const offlineResult = offlineSignIn('EcoWarrior', 'google@ecolife.app', false);
            return { success: true, user: offlineResult.user, offline: true, error: getAuthError(e.code) };
        }
        
        // For actionable errors (unauthorized domain, popup closed, etc.), show the real error
        return { success: false, error: getAuthError(e.code) };
    }
}

/** Sign out */
export async function signOutUser() {
    const mod = await loadAuth();
    if (mod) {
        try {
            const { getAuth, signOut } = mod;
            await signOut(getAuth());
        } catch (e) {
            console.error('[Auth] Sign out error:', e);
        }
    }
    
    state.reset();
}

/** Set up auth state listener */
export async function initAuthListener(callback) {
    const mod = await loadAuth();
    if (!mod) {
        const storedUser = state.get('user');

        // Offline/demo sessions do not have Firebase to re-validate them after
        // refresh, so keep the persisted demo user active.
        if (isOfflineDemoUser(storedUser) && state.get('isAuthenticated')) {
            if (callback) callback(storedUser);
            return;
        }

        state.set({ user: null, isAuthenticated: false });
        if (callback) callback(null);
        return;
    }

    const { getAuth, onAuthStateChanged } = mod;
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserState(user);
            if (callback) callback(user);
        } else {
            const storedUser = state.get('user');

            // Demo fallback users are intentionally local-only. Firebase will
            // report null on refresh, but the demo should remain signed in.
            if (isOfflineDemoUser(storedUser) && state.get('isAuthenticated')) {
                if (callback) callback(storedUser);
                return;
            }

            if (state.get('isAuthenticated')) {
                state.set({ user: null, isAuthenticated: false });
            }
            if (callback) callback(null);
        }
    });
}

function isOfflineDemoUser(user) {
    const email = (user?.email || '').toLowerCase();
    const uid = user?.uid || '';
    return email.includes('demo') || uid.startsWith('offline-');
}

/** Update state with user info */
function setUserState(firebaseUser, overrideName, isManual = false) {
    const email = (firebaseUser.email || '').toLowerCase();
    const isDemo = isManual && email.includes('demo');

    // On a brand-new manual sign-in, clear previous user's data.
    // On a session restore (isManual=false), preserve existing state.
    if (isManual) {
        state.reset();
    }

    if (isDemo) {
        state.loadDemoPresentationState();
    }

    const userData = {
        uid: firebaseUser.uid || 'offline-' + Date.now(),
        displayName: overrideName || firebaseUser.displayName || 'EcoWarrior',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || null
    };

    state.set({
        user: userData,
        isAuthenticated: true
    });

    // Set joinedAt if first time
    if (!state.get('joinedAt')) {
        state.set('joinedAt', new Date().toISOString());
    }
}

/** Offline sign-in fallback */
function offlineSignIn(name, email, isManual = true) {
    // Use a stable UID stored in localStorage so refresh keeps the same user.
    const OFFLINE_UID_KEY = 'ecolife_offline_uid';
    let stableUid = localStorage.getItem(OFFLINE_UID_KEY);

    const isDemo = isManual && (email || '').toLowerCase().includes('demo');

    // On a manual new sign-in, generate a fresh UID and reset state.
    if (isManual) {
        stableUid = 'offline-' + Date.now();
        localStorage.setItem(OFFLINE_UID_KEY, stableUid);
        state.reset();
    } else if (!stableUid) {
        stableUid = 'offline-' + Date.now();
        localStorage.setItem(OFFLINE_UID_KEY, stableUid);
    }

    const userData = {
        uid: stableUid,
        displayName: name,
        email: email,
        photoURL: null
    };

    if (isDemo) {
        state.loadDemoPresentationState();
    }

    state.set({
        user: userData,
        isAuthenticated: true,
        joinedAt: state.get('joinedAt') || new Date().toISOString()
    });

    return { success: true, user: userData, offline: true };
}

/** Map Firebase error codes to user-friendly messages */
function getAuthError(code) {
    const errors = {
        'auth/email-already-in-use': 'This email is already registered. Try signing in.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password. Please try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/popup-closed-by-user': 'Sign-in popup was closed.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/operation-not-allowed': 'Sign-in provider is disabled. Enable it in Firebase Console.',
        'auth/unauthorized-domain': 'This domain is not authorized in Firebase. Add it under Authentication → Settings → Authorized domains.'
    };
    return errors[code] || 'Something went wrong. Please try again.';
}

