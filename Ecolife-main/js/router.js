/* =========================================================
   EcoLife — Hash-based SPA Router
   ========================================================= */

import { state } from './state.js';

class Router {
    constructor() {
        this.routes = {};
        this.currentView = null;
        this.currentCleanup = null;
        this.authRequired = new Set();
        this.container = null;
    }

    /** Register a route */
    register(path, viewModule, { requiresAuth = false } = {}) {
        this.routes[path] = viewModule;
        if (requiresAuth) {
            this.authRequired.add(path);
        }
    }

    /** Initialize the router */
    init(containerSelector = '#app') {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error(`[Router] Container not found: ${containerSelector}`);
            this._hideLoader();
            return;
        }
        window.addEventListener('hashchange', () => this._onHashChange());
        // Handle initial route
        this._onHashChange();
    }

    /** Navigate to a path */
    navigate(path) {
        if (window.location.hash === `#${path}`) {
            // Force re-render if same path
            this._onHashChange();
        } else {
            window.location.hash = path;
        }
    }

    /** Get current path */
    getCurrentPath() {
        return window.location.hash.slice(1) || '/';
    }

    /** Handle hash changes */
    async _onHashChange() {
        const path = this.getCurrentPath();

        // Auth guard
        if (this.authRequired.has(path) && !state.get('isAuthenticated')) {
            this.navigate('/');
            return;
        }

        // Redirect authenticated users away from landing
        if (path === '/' && state.get('isAuthenticated')) {
            this.navigate('/dashboard');
            return;
        }

        const viewModule = this.routes[path];
        if (!viewModule) {
            // Default: go to landing or dashboard
            this.navigate(state.get('isAuthenticated') ? '/dashboard' : '/');
            return;
        }

        // Transition out current view
        if (this.currentCleanup) {
            try { this.currentCleanup(); } catch (e) { console.error(e); }
        }

        // Update state
        state.set('currentView', path);

        // Render new view
        try {
            const result = await viewModule.render(this.container);
            this.currentView = path;
            this.currentCleanup = result?.cleanup || null;
        } catch (e) {
            console.error(`[Router] Error rendering view for ${path}:`, e);
            this.container.innerHTML = `
                <main class="app-content">
                    <section class="empty-state">
                        <h1 class="empty-state__title">EcoLife could not finish loading</h1>
                        <p class="empty-state__text">Refresh the page, or check the browser console for the startup error.</p>
                        <button class="btn btn--primary" type="button" id="reloadApp">Reload</button>
                    </section>
                </main>
            `;
            document.getElementById('reloadApp')?.addEventListener('click', () => window.location.reload());
        } finally {
            this._hideLoader();
        }
    }

    _hideLoader() {
        const loader = document.getElementById('appLoader');
        if (loader) loader.classList.add('hidden');
    }
}

export const router = new Router();
