/* =========================================================
   EcoLife — Navigation Bar Component
   ========================================================= */

import { state } from '../state.js';
import { router } from '../router.js';
import { signOutUser } from '../services/auth.js';
import { getLevel, getLevelTitle } from '../engines/greenScore.js';

const NAV_ITEMS = [
    { path: '/dashboard',  label: 'Dashboard',  icon: dashboardIcon,  id: 'nav-dashboard' },
    { path: '/missions',   label: 'Missions',   icon: missionsIcon,   id: 'nav-missions' },
    { path: '/tree',       label: 'My Tree',     icon: treeIcon,       id: 'nav-tree' },
    { path: '/recycling',  label: 'Recycling',   icon: recyclingIcon,  id: 'nav-recycling' },
    { path: '/profile',    label: 'Profile',     icon: profileIcon,    id: 'nav-profile' },
    { path: '/community',  label: 'Community',   icon: communityIcon,  id: 'nav-community' },
    { path: '/calculator', label: 'Calculator',  icon: calculatorIcon, id: 'nav-calculator' },
];

export function renderNavbar(container) {
    const user = state.get('user');
    const level = state.get('level') || 1;
    const initials = user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'E';
    
    // Desktop sidebar
    const sidebar = document.createElement('nav');
    sidebar.className = 'sidebar';
    sidebar.id = 'mainSidebar';
    sidebar.innerHTML = `
        <div class="sidebar__header">
            <div class="sidebar__logo" id="navLogo">
                <svg viewBox="0 0 32 32" width="28" height="28">
                    <path d="M16 2C16 2 4 12 4 20C4 26.627 9.373 32 16 32C22.627 32 28 26.627 28 20C28 12 16 2 16 2Z" fill="none" stroke="#00FF88" stroke-width="2"/>
                    <path d="M16 32V14" fill="none" stroke="#00FF88" stroke-width="1.5"/>
                    <path d="M16 20C12 16 10 12 10 12" fill="none" stroke="#00FF88" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M16 17C20 13 22 9 22 9" fill="none" stroke="#00FF88" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span class="sidebar__logo-text">Eco<span>Life</span></span>
            </div>
            <button class="sidebar__toggle" id="sidebarToggle" aria-label="Toggle Sidebar">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="sidebar__nav" id="sidebarNav">
            ${NAV_ITEMS.map(item => `
                <a href="#${item.path}" class="sidebar__link" id="${item.id}" data-path="${item.path}">
                    <span class="sidebar__link-icon">${item.icon()}</span>
                    <span class="sidebar__link-label">${item.label}</span>
                </a>
            `).join('')}
        </div>
        <div class="sidebar__footer">
            <div class="sidebar__user" id="navUserInfo" style="cursor: pointer;">
                <div class="avatar avatar--sm">${initials}</div>
                <div class="sidebar__user-info">
                    <div class="sidebar__user-name">${user?.displayName || 'EcoWarrior'}</div>
                    <div class="sidebar__user-level">Lv.${level} ${getLevelTitle(level)}</div>
                </div>
            </div>
            <button class="sidebar__signout btn btn--ghost btn--sm" id="navSignOut">
                ${signOutIcon()}
                <span>Sign Out</span>
            </button>
        </div>
    `;
    
    // Mobile bottom nav
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';
    mobileNav.id = 'mobileNav';
    mobileNav.innerHTML = `
        ${NAV_ITEMS.slice(0, 5).map(item => `
            <a href="#${item.path}" class="mobile-nav__item" data-path="${item.path}">
                <span class="mobile-nav__icon">${item.icon()}</span>
                <span class="mobile-nav__label">${item.label}</span>
            </a>
        `).join('')}
    `;
    
    container.appendChild(sidebar);
    container.appendChild(mobileNav);
    
    // Set active state
    updateActiveNav();
    
    // Event listeners
    const toggleBtn = sidebar.querySelector('#sidebarToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }

    sidebar.querySelector('#navSignOut').addEventListener('click', async () => {
        await signOutUser();
        router.navigate('/');
    });

    const userInfo = sidebar.querySelector('#navUserInfo');
    if (userInfo) {
        userInfo.addEventListener('click', () => {
            router.navigate('/profile');
        });
    }
    
    // Listen for route changes to update active nav
    state.subscribe('currentView', updateActiveNav);
    
    // Listen for user/level changes
    state.subscribe('level', (newLevel) => {
        const nameEl = sidebar.querySelector('.sidebar__user-level');
        if (nameEl) nameEl.textContent = `Lv.${newLevel} ${getLevelTitle(newLevel)}`;
    });
    
    return { sidebar, mobileNav };
}

function updateActiveNav() {
    const currentPath = router.getCurrentPath();
    
    document.querySelectorAll('.sidebar__link, .mobile-nav__item').forEach(link => {
        const path = link.dataset.path;
        link.classList.toggle('active', path === currentPath);
    });
}

// --- SVG Icon Functions ---
function dashboardIcon() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`;
}

function missionsIcon() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
}

function treeIcon() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V8"/><path d="M5 12l7-10 7 10"/><path d="M7 17l5-7 5 7"/></svg>`;
}

function recyclingIcon() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="M14 16l-3 3 3 3"/><path d="M8.293 13.596 4.875 7.97l2.08-3.602a1.785 1.785 0 0 1 1.57-.882h4.627"/><path d="M10 5l3-3-3-3"/><path d="m16.62 10.168 3.347 5.79-2.066 3.578a1.83 1.83 0 0 1-1.57.89H12"/><path d="m20 10-3-3 3-3"/></svg>`;
}

function communityIcon() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
}

function calculatorIcon() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
}

function profileIcon() {
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
}

function signOutIcon() {
    return `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`;
}
