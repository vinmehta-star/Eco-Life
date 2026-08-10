/* =========================================================
   EcoLife - Application Entry Point
   ========================================================= */

import { router } from './router.js';
import { state } from './state.js';
import { initFirebase } from './firebaseConfig.js';
import { initAuthListener } from './services/auth.js';
import { initSync } from './services/sync.js';

// Import Views
import * as landingView from './views/landing.js';
import * as dashboardView from './views/dashboard.js';
import * as missionsView from './views/missions.js';
import * as treeView from './views/tree.js';
import * as recyclingView from './views/recycling.js';
import * as communityView from './views/community.js';
import * as calculatorView from './views/calculator.js';
import * as profileView from './views/profile.js';

import { renderChatbot } from './components/chatbot.js';

async function initApp() {
    console.log('Initializing EcoLife App...');

    // 1. Register Routes
    router.register('/', landingView, { requiresAuth: false });
    router.register('/dashboard', dashboardView, { requiresAuth: true });
    router.register('/missions', missionsView, { requiresAuth: true });
    router.register('/tree', treeView, { requiresAuth: true });
    router.register('/recycling', recyclingView, { requiresAuth: true });
    router.register('/community', communityView, { requiresAuth: true });
    router.register('/calculator', calculatorView, { requiresAuth: true });
    router.register('/profile', profileView, { requiresAuth: true });

    // 2. Manage Chatbot Visibility based on state
    function updateChatbotVisibility() {
        if (state.get('isAuthenticated')) {
            renderChatbot();
        } else {
            const bot = document.getElementById('ecobuddyChatbot');
            if (bot) bot.remove();
        }
    }
    state.subscribe('isAuthenticated', updateChatbotVisibility);
    updateChatbotVisibility();

    // 3. Start Router immediately - don't wait for Firebase
    router.init('#app');

    // 4. Initialize Firebase + Auth + Sync in the background
    //    These complete asynchronously; auth listener will update state
    //    and the router/chatbot subscriptions will react automatically.
    (async () => {
        try {
            await initFirebase();
            console.log('[App] Firebase initialized');

            // Set up auth listener - re-navigates if user is already signed in
            await initAuthListener((user) => {
                if (user) {
                    console.log(`[Auth] Signed in as ${user.displayName || user.email}`);
                    // If we're still on the landing page, go to dashboard
                    if (router.getCurrentPath() === '/') {
                        router.navigate('/dashboard');
                    }
                } else {
                    console.log('[Auth] Signed out');
                }
            });

            // Run sync after auth is ready
            await initSync();
        } catch (e) {
            console.error('[App] Background init error:', e);
        }
    })();
}

// Start app on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
