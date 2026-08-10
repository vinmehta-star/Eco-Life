/* =========================================================
   EcoLife — Firebase Configuration
   ========================================================= */

// ---------- IMPORTANT ----------
// Replace the values below with your Firebase project credentials.
// Go to Firebase Console → Project Settings → Web App → Config
// --------------------------------

const firebaseConfig = {
    apiKey: "Your Api Key",
    authDomain: "eco-life-saver.firebaseapp.com",
    projectId: "eco-life-saver",
    storageBucket: "eco-life-saver.firebasestorage.app",
    messagingSenderId: "994184005004",
    appId: "Your API Id"
};

// Firebase SDK version
const FIREBASE_VERSION = '12.17.1';
const FIREBASE_CDN = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}`;

let app = null;
let auth = null;
let db = null;
let firebaseReady = false;

/**
 * Initialize Firebase — dynamically imports SDK modules.
 * Returns { app, auth, db } or null if config is placeholder.
 */
export async function initFirebase() {
    // Skip if placeholder config
    if (firebaseConfig.apiKey === 'YOUR_API_KEY') {
        console.warn('[Firebase] Using placeholder config — Firebase features disabled. Update firebaseConfig.js with your credentials.');
        return null;
    }

    try {
        const importPromise = (async () => {
            const appMod = await import(`${FIREBASE_CDN}/firebase-app.js`);
            const authMod = await import(`${FIREBASE_CDN}/firebase-auth.js`);
            const dbMod = await import(`${FIREBASE_CDN}/firebase-firestore.js`);
            return { appMod, authMod, dbMod };
        })();

        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firebase CDN load timed out (3s)')), 3000)
        );

        const { appMod, authMod, dbMod } = await Promise.race([importPromise, timeoutPromise]);

        const { initializeApp } = appMod;
        const { getAuth } = authMod;
        const { getFirestore } = dbMod;

        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        firebaseReady = true;

        console.log('[Firebase] Initialized successfully');
        return { app, auth, db };
    } catch (e) {
        console.error('[Firebase] Initialization failed:', e);
        return null;
    }
}

/** Check if Firebase is configured and ready */
export function isFirebaseReady() {
    return firebaseReady;
}

/** Get Firebase CDN base URL */
export function getFirebaseCDN() {
    return FIREBASE_CDN;
}

export { firebaseConfig, app, auth, db };
