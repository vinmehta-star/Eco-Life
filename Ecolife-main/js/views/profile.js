/* =========================================================
   EcoLife — Profile & Settings View
   ========================================================= */

import { state } from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { signOutUser } from '../services/auth.js';
import { router } from '../router.js';
import { getLevel, getLevelTitle } from '../engines/greenScore.js';
import { showToast } from '../components/toast.js';
import { showCertificateModal } from '../components/certificate.js';

export async function render(appContainer) {
    const s = state.get();
    const user = s.user || { displayName: 'EcoWarrior', email: '' };
    const level = s.level || getLevel(s.greenScore || 0);

    appContainer.innerHTML = `
        <div class="app-layout">
            <div id="navContainer"></div>
            <main class="app-main">
                <div class="app-content">
                    <div class="profile" style="max-width: 600px; margin: 0 auto;">
                        <div class="page-header" style="text-align: center;">
                            <div class="avatar avatar--xl" style="margin: 0 auto var(--space-md);">${user.displayName.charAt(0).toUpperCase()}</div>
                            <h1 class="page-title">${user.displayName}</h1>
                            <p class="page-subtitle">${user.email || 'Offline User'} • Level ${level} ${getLevelTitle(level)}</p>
                        </div>

                        <!-- Official Certificate Banner -->
                        <div class="card glass-card" style="margin-bottom: var(--space-lg); border: 1px solid var(--accent); background: radial-gradient(circle at top right, rgba(0,255,136,0.1), transparent);">
                            <div class="card__header">
                                <h5 class="card__title" style="color:var(--accent);">📜 Official Eco-Impact Certificate</h5>
                            </div>
                            <p style="font-size:var(--font-sm); color:var(--text-secondary); margin-bottom:var(--space-md); line-height:1.5;">
                                Download or print your verified Sustainability Credential showing your total CO₂ saved, Green Score, and community rank.
                            </p>
                            <button class="btn btn--primary btn--full" id="claimCertBtn">📜 View & Print Impact Certificate</button>
                        </div>

                        <div class="card glass-card" style="margin-bottom: var(--space-lg);">
                            <div class="card__header">
                                <h5 class="card__title">Account Details</h5>
                            </div>
                            <div class="input-group">
                                <label class="input-group__label">Display Name</label>
                                <input class="input-group__field" type="text" id="profileName" value="${user.displayName}">
                            </div>
                            <div class="input-group">
                                <label class="input-group__label">Email Address</label>
                                <input class="input-group__field" type="email" value="${user.email}" disabled style="opacity: 0.6;">
                            </div>
                            <button class="btn btn--primary btn--full" id="saveProfileBtn">Save Profile</button>
                        </div>

                        <div class="card glass-card" style="margin-bottom: var(--space-lg);">
                            <div class="card__header">
                                <h5 class="card__title">Sync & Data</h5>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-md);">
                                <div>
                                    <div style="font-size:var(--font-sm); font-weight:600;">Last Synced</div>
                                    <div style="font-size:var(--font-xs); color:var(--text-secondary);">${s.lastSyncedAt ? new Date(s.lastSyncedAt).toLocaleString() : 'Not synced yet'}</div>
                                </div>
                                <span class="chip ${navigator.onLine ? 'chip--green' : 'chip--warning'}">${navigator.onLine ? 'Online' : 'Offline'}</span>
                            </div>
                        </div>

                        <div class="card glass-card">
                            <button class="btn btn--danger btn--full" id="profileSignOut">Sign Out</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;

    renderNavbar(document.getElementById('navContainer'));

    document.getElementById('claimCertBtn').addEventListener('click', () => {
        showCertificateModal();
    });

    document.getElementById('saveProfileBtn').addEventListener('click', () => {
        const newName = document.getElementById('profileName').value.trim();
        if (newName) {
            state.setNested('user.displayName', newName);
            showToast({ title: 'Profile Updated!', message: 'Your name has been updated.', type: 'success', icon: '👤' });
            router.navigate('/profile');
        }
    });

    document.getElementById('profileSignOut').addEventListener('click', async () => {
        await signOutUser();
        router.navigate('/');
    });

    const loader = document.getElementById('appLoader');
    if (loader) loader.classList.add('hidden');

    return { cleanup: () => {} };
}
