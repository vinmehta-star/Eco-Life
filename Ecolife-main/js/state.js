/* =========================================================
   EcoLife — Global State Manager (Pub/Sub + LocalStorage)
   ========================================================= */

const STORAGE_KEY = 'ecolife_state';

// Default state for a new user
const DEFAULT_STATE = {
    user: null, // { uid, displayName, email, photoURL }
    isAuthenticated: false,
    greenScore: 0,
    level: 1,
    streak: {
        current: 0,
        longest: 0,
        lastActiveDate: null
    },
    completedMissions: [],   // [{ missionId, completedAt, points, co2Saved }]
    activeMissions: [],      // [missionId, ...]
    dailyMissions: [],       // missions generated for today
    dailyMissionsDate: null, // date string for when dailyMissions were generated
    badges: [],              // [badgeId, ...]
    co2Saved: 0,             // total kg
    categoryStats: {
        transport: { completed: 0, points: 0 },
        waste:     { completed: 0, points: 0 },
        energy:    { completed: 0, points: 0 },
        food:      { completed: 0, points: 0 },
        water:     { completed: 0, points: 0 }
    },
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0], // points per day this week (Mon-Sun)
    joinedAt: null,
    lastSyncedAt: null,
    onboardingComplete: false,
    currentView: 'landing'
};

class StateManager {
    constructor() {
        this._state = {};
        this._subscribers = {};     // { key: [callback, ...] }
        this._globalSubs = [];      // callbacks for any state change
        this._hydrate();
    }

    /** Hydrate state from LocalStorage, merging with defaults */
    _hydrate() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Deep merge with defaults to ensure new fields exist
                this._state = this._deepMerge(structuredClone(DEFAULT_STATE), parsed);
                // Keep stored auth so the app stays logged in while Firebase re-validates.
                // If Firebase comes back with null the auth listener will clear it.
                // (isAuthenticated & user remain from localStorage)
            } else {
                this._state = structuredClone(DEFAULT_STATE);
            }
        } catch (e) {
            console.warn('[State] Failed to hydrate from LocalStorage:', e);
            this._state = structuredClone(DEFAULT_STATE);
        }
    }

    /** Persist state to LocalStorage */
    _persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
        } catch (e) {
            console.warn('[State] Failed to persist to LocalStorage:', e);
        }
    }

    /** Deep merge source into target (target values are overwritten by source) */
    _deepMerge(target, source) {
        for (const key of Object.keys(source)) {
            if (
                source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
                target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])
            ) {
                target[key] = this._deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
        return target;
    }

    /** Get entire state or a specific key */
    get(key) {
        if (key === undefined) return this._state;
        return this._state[key];
    }

    /** Set state — pass an object to merge, or (key, value) */
    set(keyOrObj, value) {
        let changedKeys = [];

        if (typeof keyOrObj === 'string') {
            const oldVal = this._state[keyOrObj];
            this._state[keyOrObj] = value;
            changedKeys = [keyOrObj];
            if (oldVal !== value) {
                this._notify(keyOrObj, value, oldVal);
            }
        } else if (typeof keyOrObj === 'object') {
            for (const [k, v] of Object.entries(keyOrObj)) {
                const oldVal = this._state[k];
                this._state[k] = v;
                changedKeys.push(k);
                if (oldVal !== v) {
                    this._notify(k, v, oldVal);
                }
            }
        }

        // Persist after changes
        this._persist();

        // Global subscribers
        if (changedKeys.length > 0) {
            this._globalSubs.forEach(cb => {
                try { cb(this._state, changedKeys); } catch (e) { console.error(e); }
            });
        }
    }

    /** Update a nested key using a path like "streak.current" */
    setNested(path, value) {
        const keys = path.split('.');
        const topKey = keys[0];
        const oldTopVal = structuredClone(this._state[topKey]);
        
        let obj = this._state;
        for (let i = 0; i < keys.length - 1; i++) {
            if (!obj[keys[i]] || typeof obj[keys[i]] !== 'object') {
                obj[keys[i]] = {};
            }
            obj = obj[keys[i]];
        }
        const lastKey = keys[keys.length - 1];
        const oldVal = obj[lastKey];
        obj[lastKey] = value;
        
        this._persist();
        if (oldVal !== value) {
            this._notify(topKey, this._state[topKey], oldTopVal);
            this._notify(path, value, oldVal);
        }
        this._globalSubs.forEach(cb => {
            try { cb(this._state, [topKey, path]); } catch (e) { console.error(e); }
        });
    }

    /** Subscribe to changes on a specific key */
    subscribe(key, callback) {
        if (!this._subscribers[key]) {
            this._subscribers[key] = [];
        }
        this._subscribers[key].push(callback);

        // Return unsubscribe function
        return () => {
            this._subscribers[key] = this._subscribers[key].filter(cb => cb !== callback);
        };
    }

    /** Subscribe to all state changes */
    subscribeAll(callback) {
        this._globalSubs.push(callback);
        return () => {
            this._globalSubs = this._globalSubs.filter(cb => cb !== callback);
        };
    }

    /** Notify subscribers for a key */
    _notify(key, newVal, oldVal) {
        if (this._subscribers[key]) {
            this._subscribers[key].forEach(cb => {
                try { cb(newVal, oldVal, key); } catch (e) { console.error(e); }
            });
        }
    }

    /** Load presentation dummy content */
    loadDemoPresentationState() {
        const today = new Date().toISOString().split('T')[0];
        const demoData = {
            greenScore: 1850,
            level: 4,
            streak: {
                current: 5,
                longest: 12,
                lastActiveDate: new Date().toISOString()
            },
            completedMissions: [
                { missionId: "m_bike_01", completedAt: new Date(Date.now() - 86400000 * 4).toISOString(), points: 20, co2Saved: 2.1 },
                { missionId: "m_bus_01", completedAt: new Date(Date.now() - 86400000 * 4).toISOString(), points: 15, co2Saved: 1.5 },
                { missionId: "m_recycle_01", completedAt: new Date(Date.now() - 86400000 * 3).toISOString(), points: 15, co2Saved: 0.5 },
                { missionId: "m_noplastic_02", completedAt: new Date(Date.now() - 86400000 * 3).toISOString(), points: 30, co2Saved: 0.8 },
                { missionId: "m_bottle_01", completedAt: new Date(Date.now() - 86400000 * 2).toISOString(), points: 15, co2Saved: 0.4 },
                { missionId: "m_lightsoff_01", completedAt: new Date(Date.now() - 86400000 * 2).toISOString(), points: 10, co2Saved: 0.5 },
                { missionId: "m_unplug_01", completedAt: new Date(Date.now() - 86400000 * 1).toISOString(), points: 15, co2Saved: 0.3 },
                { missionId: "m_plantmeal_01", completedAt: new Date(Date.now() - 86400000 * 1).toISOString(), points: 20, co2Saved: 2.5 },
                { missionId: "m_plantday_01", completedAt: new Date().toISOString(), points: 30, co2Saved: 5.0 },
                { missionId: "m_compost_01", completedAt: new Date().toISOString(), points: 20, co2Saved: 0.8 },
                { missionId: "m_stairs_01", completedAt: new Date().toISOString(), points: 10, co2Saved: 0.3 }
            ],
            dailyMissionsDate: today,
            dailyMissions: [
                { id: "m_airdry_01", category: "energy", title: "Air Dry Day", description: "Air-dry your clothes instead of using a dryer.", difficulty: 1, points: 15, co2Saved: 1.2, emoji: "☀️" },
                { id: "m_refuse_01", category: "waste", title: "Just Say No", description: "Refuse a receipt or unnecessary packaging today.", difficulty: 1, points: 10, co2Saved: 0.1, emoji: "✋" },
                { id: "m_bottle_02", category: "waste", title: "BYO Bottle", description: "Bring your reusable water bottle everywhere today.", difficulty: 1, points: 15, co2Saved: 0.4, emoji: "🍶" },
                { id: "m_bike_02", category: "transport", title: "Pedal Power", description: "Use a bicycle for at least one errand or trip today.", difficulty: 2, points: 25, co2Saved: 2.1, emoji: "🚲" },
                { id: "m_shower_01", category: "water", title: "5-Minute Shower", description: "Cap your shower at 5 minutes or less to save water.", difficulty: 1, points: 15, co2Saved: 0.6, emoji: "🚿" }
            ],
            badges: [
                'streak_3', 'streak_7', 'score_100', 'score_500', 'score_1000',
                'first_mission', 'missions_10', 'cat_waste_10', 'cat_energy_10',
                'co2_10', 'co2_50', 'early_bird'
            ],
            co2Saved: 82.4,
            categoryStats: {
                transport: { completed: 3, points: 350 },
                waste:     { completed: 4, points: 450 },
                energy:    { completed: 2, points: 300 },
                food:      { completed: 2, points: 350 },
                water:     { completed: 1, points: 150 }
            },
            weeklyActivity: [150, 300, 450, 200, 350, 400, 0],
            onboardingComplete: true
        };

        // Merge keeping existing user info
        this._state = {
            ...this._state,
            ...demoData
        };
        this._persist();
    }

    /** Reset state to defaults (used on sign out) */
    reset() {
        this._state = structuredClone(DEFAULT_STATE);
        this._persist();
        this._globalSubs.forEach(cb => {
            try { cb(this._state, Object.keys(DEFAULT_STATE)); } catch (e) { console.error(e); }
        });
    }

    /** Import state from Firestore sync */
    importFromServer(serverState) {
        // Merge server data with current state, server wins for score/badges/community
        const merged = this._deepMerge(structuredClone(this._state), serverState);
        this._state = merged;
        this._persist();
    }

    /** Export state for Firestore sync */
    exportForServer() {
        const { currentView, ...rest } = this._state;
        return rest;
    }
}

// Singleton
export const state = new StateManager();
export { DEFAULT_STATE };
