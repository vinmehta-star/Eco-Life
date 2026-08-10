/* =========================================================
   EcoLife â€” Sync Service (LocalStorage â†” Firestore)
   ========================================================= */

import { state } from '../state.js';
import { isFirebaseReady } from '../firebaseConfig.js';
import { saveUserProfile, getUserProfile, updateCommunityForest } from './firestore.js';

let syncQueue = [];
let isSyncing = false;

/** Initialize sync â€” pull from server, set up listeners */
export async function initSync() {
    // Listen for online/offline
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Initial sync if online and Firebase ready
    if (navigator.onLine && isFirebaseReady()) {
        const user = state.get('user');
        const isDemo = (user?.email || '').toLowerCase().includes('demo');
        
        if (isDemo) {
            await pushToServer();
        } else {
            await pullFromServer();
            await pushToServer();
        }
    }

    // Auto-sync on state changes (debounced)
    let syncTimer = null;
    state.subscribeAll((newState, changedKeys) => {
        const syncableKeys = ['greenScore', 'level', 'streak', 'completedMissions', 'badges', 'co2Saved', 'categoryStats'];
        const shouldSync = changedKeys.some(k => syncableKeys.includes(k));
        
        if (shouldSync && navigator.onLine && isFirebaseReady()) {
            clearTimeout(syncTimer);
            syncTimer = setTimeout(() => pushToServer(), 3000); // Debounce 3s
        }
    });
}

/** Pull latest data from Firestore and merge */
async function pullFromServer() {
    const user = state.get('user');
    if (!user?.uid || user.uid.startsWith('offline-')) return;

    try {
        const serverData = await getUserProfile(user.uid);
        if (serverData) {
            // Server wins for these fields
            const serverFields = ['greenScore', 'level', 'streak', 'badges', 'co2Saved', 'categoryStats'];
            const updates = {};
            
            for (const field of serverFields) {
                if (serverData[field] !== undefined) {
                    // For score, take the higher value
                    if (field === 'greenScore') {
                        updates[field] = Math.max(state.get(field) || 0, serverData[field] || 0);
                    } else {
                        updates[field] = serverData[field];
                    }
                }
            }
            
            // Merge completed missions (union)
            if (serverData.completedMissions) {
                const localMissions = state.get('completedMissions') || [];
                const serverMissions = serverData.completedMissions || [];
                const mergedIds = new Set();
                const merged = [];
                
                for (const m of [...serverMissions, ...localMissions]) {
                    const key = m.missionId + m.completedAt;
                    if (!mergedIds.has(key)) {
                        mergedIds.add(key);
                        merged.push(m);
                    }
                }
                updates.completedMissions = merged;
            }
            
            state.set(updates);
            state.set('lastSyncedAt', new Date().toISOString());
            console.log('[Sync] Pulled from server');
        }
    } catch (e) {
        console.error('[Sync] Pull failed:', e);
    }
}

/** Push current state to Firestore */
export async function pushToServer() {
    const user = state.get('user');
    if (!user?.uid || user.uid.startsWith('offline-')) return;
    if (isSyncing) return;

    isSyncing = true;
    try {
        const data = state.exportForServer();
        const profileSaved = await saveUserProfile(user.uid, data);
        const forestSaved = await updateCommunityForest(user.uid);

        if (profileSaved || forestSaved) {
            state.set('lastSyncedAt', new Date().toISOString());
            console.log('[Sync] Pushed to server');
        }
    } catch (e) {
        console.error('[Sync] Push failed:', e);
    } finally {
        isSyncing = false;
    }
}

/** Handle coming back online */
function onOnline() {
    console.log('[Sync] Back online â€” syncing...');
    if (isFirebaseReady()) {
        pushToServer();
    }
}

/** Handle going offline */
function onOffline() {
    console.log('[Sync] Offline â€” changes cached locally');
}

/** Force a sync now */
export async function forceSync() {
    if (navigator.onLine && isFirebaseReady()) {
        await pushToServer();
        await pullFromServer();
    }
}



