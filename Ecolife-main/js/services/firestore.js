/* =========================================================
   EcoLife â€” Firestore Service
   ========================================================= */

import { state } from '../state.js';
import { getFirebaseCDN, isFirebaseReady, db } from '../firebaseConfig.js';

let firestoreModule = null;
let dbInstance = null;

/** Lazy load Firestore module */
async function loadFirestore() {
    if (!isFirebaseReady()) return null;
    if (firestoreModule && dbInstance) return firestoreModule;
    
    try {
        const CDN = getFirebaseCDN();
        firestoreModule = await import(`${CDN}/firebase-firestore.js`);
        dbInstance = db || firestoreModule.getFirestore();
        return firestoreModule;
    } catch (e) {
        console.error('[Firestore] Failed to load:', e);
        return null;
    }
}

/** Save user profile to Firestore */
export async function saveUserProfile(uid, data) {
    const mod = await loadFirestore();
    if (!mod || !dbInstance) return false;
    
    try {
        const { doc, setDoc, serverTimestamp } = mod;
        await setDoc(doc(dbInstance, 'users', uid), {
            ...data,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return true;
    } catch (e) {
        console.error('[Firestore] Save profile error:', e);
        return false;
    }
}

/** Get user profile from Firestore */
export async function getUserProfile(uid) {
    const mod = await loadFirestore();
    if (!mod || !dbInstance) return null;
    
    try {
        const { doc, getDoc } = mod;
        const snap = await getDoc(doc(dbInstance, 'users', uid));
        return snap.exists() ? snap.data() : null;
    } catch (e) {
        console.error('[Firestore] Get profile error:', e);
        return null;
    }
}

/** Update community forest data */
export async function updateCommunityForest(uid) {
    const mod = await loadFirestore();
    if (!mod || !dbInstance) return false;
    
    try {
        const { doc, setDoc, serverTimestamp } = mod;
        
        // Update user's contribution
        await setDoc(doc(dbInstance, 'forest', uid), {
            displayName: state.get('user')?.displayName || 'Anonymous',
            greenScore: state.get('greenScore') || 0,
            level: state.get('level') || 1,
            co2Saved: state.get('co2Saved') || 0,
            updatedAt: serverTimestamp()
        }, { merge: true });
        
        return true;
    } catch (e) {
        console.error('[Firestore] Update forest error:', e);
        return false;
    }
}

/** Get leaderboard â€” top N users by score */
export async function getLeaderboard(count = 20) {
    const user = state.get('user');
    const isDemo = !user || (user.email || '').toLowerCase().includes('demo') || (user.uid || '').startsWith('offline-');
    if (isDemo) return getFakeLeaderboard();

    const mod = await loadFirestore();
    if (!mod || !dbInstance) {
        // Firebase not available â€” return only the current user so the page isn't blank
        const currentScore = state.get('greenScore') || 0;
        return [{
            uid: user.uid,
            displayName: user.displayName || 'You',
            greenScore: currentScore,
            level: state.get('level') || 1,
            co2Saved: state.get('co2Saved') || 0,
            isCurrentUser: true
        }];
    }
    
    try {
        const { collection, query, orderBy, limit, getDocs } = mod;
        const q = query(
            collection(dbInstance, 'forest'),
            orderBy('greenScore', 'desc'),
            limit(count)
        );
        const snap = await getDocs(q);
        const users = [];
        snap.forEach(doc => {
            users.push({ uid: doc.id, ...doc.data() });
        });

        // Mark the current user's entry
        return users.map(u => ({
            ...u,
            isCurrentUser: u.uid === user.uid
        }));
    } catch (e) {
        console.error('[Firestore] Get leaderboard error:', e);
        return [];
    }
}

/** Get community stats */
export async function getCommunityStats() {
    const user = state.get('user');
    const isDemo = !user || (user.email || '').toLowerCase().includes('demo') || (user.uid || '').startsWith('offline-');
    if (isDemo) return getFakeCommunityStats();

    const mod = await loadFirestore();
    if (!mod || !dbInstance) {
        // Firebase not available â€” return real local data only
        const userScore = state.get('greenScore') || 0;
        return {
            totalTrees: Math.floor(userScore / 500),
            totalCO2: (state.get('co2Saved') || 0).toFixed(1),
            totalScore: userScore,
            activeUsers: userScore > 0 ? 1 : 0
        };
    }
    
    try {
        const { collection, getDocs } = mod;
        const snap = await getDocs(collection(dbInstance, 'forest'));
        
        let totalTrees = 0;
        let totalCO2 = 0;
        let totalScore = 0;
        let activeUsers = 0;
        
        snap.forEach(doc => {
            const data = doc.data();
            totalTrees += Math.floor((data.greenScore || 0) / 500);
            totalCO2 += data.co2Saved || 0;
            totalScore += data.greenScore || 0;
            activeUsers++;
        });

        return {
            totalTrees,
            totalCO2: totalCO2.toFixed(1),
            totalScore,
            activeUsers
        };
    } catch (e) {
        console.error('[Firestore] Get community stats error:', e);
        return { totalTrees: 0, totalCO2: '0.0', totalScore: 0, activeUsers: 0 };
    }
}

/** Fake leaderboard for offline / demo mode */
function getFakeLeaderboard() {
    const names = [
        'Sophia Martinez', 'Liam Chen', 'Emma Watson', 'Aarav Sharma', 'Maya Patel',
        'Lucas Vance', 'Elena Rostova', 'Noah Kim', 'Chloe Dubois', 'Mateo Silva',
        'Zara Khan', 'Oliver Wright', 'Amara Okafor', 'Kai Tanaka', 'Isabella Rossi',
        'Ethan Hawke', 'Freya Lind', 'Leo Schmidt', 'Ananya Gupta', 'Hugo Mercier'
    ];
    const currentUser = state.get('user');
    
    const baseScores = [4850, 4200, 3950, 3600, 3100, 2850, 2600, 2400, 2150, 1900, 1750, 1500, 1300, 1100, 950, 850, 750, 650, 550, 450];
    
    const leaders = names.map((name, i) => ({
        uid: `demo-${i}`,
        displayName: name,
        greenScore: baseScores[i] || Math.max(100, 5000 - i * 220),
        level: Math.max(1, 10 - Math.floor(i / 2)),
        co2Saved: parseFloat((65 - i * 2.8).toFixed(1))
    }));
    
    // Insert current user if authenticated
    if (currentUser) {
        const userScore = state.get('greenScore') || 0;
        const userEntry = {
            uid: currentUser.uid,
            displayName: currentUser.displayName || 'EcoWarrior',
            greenScore: userScore,
            level: state.get('level') || 1,
            co2Saved: state.get('co2Saved') || 0,
            isCurrentUser: true
        };
        if (!leaders.some(l => l.uid === currentUser.uid)) {
            leaders.push(userEntry);
        }
    }
    
    // Sort by score
    leaders.sort((a, b) => b.greenScore - a.greenScore);
    
    return leaders.slice(0, 20);
}

/** Fake community stats for offline / demo mode */
function getFakeCommunityStats() {
    const userScore = state.get('greenScore') || 0;
    const userCO2 = state.get('co2Saved') || 0;
    
    return {
        totalTrees: 70,
        totalCO2: (12450.5 + userCO2).toFixed(1),
        totalScore: 178500 + userScore,
        activeUsers: 52
    };
}

