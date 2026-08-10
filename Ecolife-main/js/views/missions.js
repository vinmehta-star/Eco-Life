/* =========================================================
   EcoLife — Missions View
   ========================================================= */

import { state } from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { createMissionCard } from '../components/missionCard.js';
import { showToast, showScorePopup, showConfetti } from '../components/toast.js';
import { showBadgeUnlock } from '../components/badge.js';
import { completeMission, getStreakMultiplier } from '../engines/greenScore.js';
import { generateRecommendations } from '../engines/ecoBuddy.js';
import { CATEGORIES, MISSIONS, getMissionById } from '../data/missions.js';

function ensureDailyMissions(currentState, today) {
    const completedIds = new Set((currentState.completedMissions || []).map(m => m.missionId));
    const storedMissions = Array.isArray(currentState.dailyMissions) ? currentState.dailyMissions : [];
    let usableStoredMissions = storedMissions.filter(m => m?.id && !completedIds.has(m.id));

    if (currentState.dailyMissionsDate === today && usableStoredMissions.length >= 5) {
        return usableStoredMissions;
    }

    const recs = generateRecommendations(currentState);
    let candidateMissions = Array.isArray(recs.missions) ? recs.missions.filter(m => m?.id && !completedIds.has(m.id)) : [];

    const combinedIds = new Set(usableStoredMissions.map(m => m.id));
    for (const m of candidateMissions) {
        if (!combinedIds.has(m.id)) {
            usableStoredMissions.push(m);
            combinedIds.add(m.id);
        }
    }

    if (usableStoredMissions.length < 5) {
        const remainingPool = MISSIONS.filter(m => !completedIds.has(m.id) && !combinedIds.has(m.id));
        for (const m of remainingPool) {
            if (usableStoredMissions.length >= 6) break;
            usableStoredMissions.push(m);
        }
    }

    state.set({ dailyMissions: usableStoredMissions, dailyMissionsDate: today });
    return usableStoredMissions;
}
export async function render(appContainer) {
    const s = state.get();
    const streak = s.streak?.current || 0;
    const multiplier = getStreakMultiplier(streak);
    const activeMissionIds = s.activeMissions || [];
    const completedIds = (s.completedMissions || []).map(m => m.missionId);

    const today = new Date().toISOString().split('T')[0];
    ensureDailyMissions(s, today);

    let activeFilter = 'all';
    let activeTab = 'daily'; // 'daily' | 'history'

    appContainer.innerHTML = `
        <div class="app-layout">
            <div id="navContainer"></div>
            <main class="app-main">
                <div class="app-content">
                    <div class="missions">
                        <div class="missions__header-row">
                            <div class="page-header" style="margin-bottom:0">
                                <h1 class="page-title"><span class="page-title__emoji emoji">🎯</span>Eco-Missions</h1>
                                <p class="page-subtitle">Complete missions to earn points and grow your impact tree.</p>
                            </div>
                            ${streak > 0 ? `
                            <div class="missions__streak-info">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c-4.97 0-9-2.686-9-6C3 11.81 8.693 4.637 11.333 2.242a.971.971 0 0 1 1.334 0C15.307 4.637 21 11.81 21 16c0 3.314-4.03 6-9 6z"/></svg>
                                ${streak}-day streak (${multiplier.toFixed(1)}x bonus)
                            </div>` : ''}
                        </div>

                        <!-- Tabs -->
                        <div class="tabs" style="max-width:300px; margin-bottom:var(--space-lg);">
                            <button class="tab active" id="tabDaily">Daily Missions</button>
                            <button class="tab" id="tabHistory">History</button>
                        </div>

                        <!-- Category Filters -->
                        <div class="missions__filters" id="missionFilters">
                            <button class="category-filter active" data-cat="all">
                                All
                            </button>
                            ${Object.values(CATEGORIES).map(cat => `
                                <button class="category-filter" data-cat="${cat.id}">
                                    <span class="category-filter__dot" style="background:${cat.color}"></span>
                                    ${cat.name}
                                </button>
                            `).join('')}
                        </div>

                        <!-- Mission Cards Grid -->
                        <div class="missions__grid" id="missionsGrid"></div>

                        <!-- History -->
                        <div class="missions__history" id="missionsHistory" style="display:none">
                            <div class="card">
                                <div class="card__header">
                                    <h5 class="card__title">Completed Missions</h5>
                                    <span class="chip chip--green">${completedIds.length} total</span>
                                </div>
                                <div class="missions__history-list" id="historyList"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;

    renderNavbar(document.getElementById('navContainer'));

    // Render mission cards
    function renderMissions() {
        const grid = document.getElementById('missionsGrid');
        grid.innerHTML = '';

        let missions = ensureDailyMissions(state.get(), today);
        if (activeFilter !== 'all') {
            missions = missions.filter(m => m.category === activeFilter);
        }

        if (missions.length === 0) {
            grid.innerHTML = `
                <div class="empty-state" style="grid-column:1/-1;">
                    <div class="empty-state__icon" style="font-size:3rem; opacity:0.5;">🎯</div>
                    <h3 class="empty-state__title">No missions in this category</h3>
                    <p class="empty-state__text">Try a different category or check back tomorrow for new missions.</p>
                </div>
            `;
            return;
        }

        missions.forEach((mission, i) => {
            const isActive = activeMissionIds.includes(mission.id);
            const isCompleted = completedIds.includes(mission.id);

            const card = createMissionCard(mission, {
                isActive,
                isCompleted,
                onAccept: (m) => acceptMission(m),
                onComplete: (m) => handleComplete(m)
            });

            card.classList.add('fade-slide-up');
            card.style.animationDelay = `${i * 50}ms`;
            grid.appendChild(card);
        });
    }

    function acceptMission(mission) {
        const active = state.get('activeMissions') || [];
        if (!active.includes(mission.id)) {
            state.set('activeMissions', [...active, mission.id]);
            activeMissionIds.push(mission.id);
        }
        showToast({ title: 'Mission Accepted!', message: mission.title, type: 'info', icon: '🎯' });
        renderMissions();
    }

    function handleComplete(mission) {
        const result = completeMission(mission.id);
        if (!result) return;

        completedIds.push(mission.id);

        // Visual feedback
        showScorePopup(result.totalPoints);
        showConfetti(25);

        showToast({
            title: `+${result.totalPoints} points!`,
            message: `${mission.title} completed${result.bonusPoints > 0 ? ` (${result.bonusPoints} bonus from streak)` : ''}`,
            type: 'success',
            icon: '🎉'
        });

        if (result.leveledUp) {
            setTimeout(() => {
                showToast({ title: 'Level Up!', message: `You're now Level ${result.newLevel}!`, type: 'achievement', icon: '⬆️', duration: 5000 });
            }, 1500);
        }

        // Show badge unlocks
        if (result.newBadges.length > 0) {
            setTimeout(() => {
                showBadgeUnlock(result.newBadges[0]);
            }, 2000);
        }

        renderMissions();
    }

    // Render history
    function renderHistory() {
        const list = document.getElementById('historyList');
        const completed = [...(state.get('completedMissions') || [])].reverse().slice(0, 20);

        if (completed.length === 0) {
            list.innerHTML = '<p style="padding:var(--space-md);color:var(--text-muted);font-size:var(--font-sm);">No completed missions yet. Go complete your first one!</p>';
            return;
        }

        list.innerHTML = completed.map(entry => {
            const mission = getMissionById(entry.missionId);
            const date = new Date(entry.completedAt);
            const dateStr = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            return `
                <div class="history-item">
                    <div class="history-item__icon">${mission?.emoji || '✅'}</div>
                    <div class="history-item__info">
                        <div class="history-item__title">${mission?.title || entry.missionId}</div>
                        <div class="history-item__date">${dateStr}</div>
                    </div>
                    <div class="history-item__points">+${entry.points}</div>
                </div>
            `;
        }).join('');
    }

    // Filter clicks
    document.getElementById('missionFilters').addEventListener('click', (e) => {
        const btn = e.target.closest('.category-filter');
        if (!btn) return;

        document.querySelectorAll('.category-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.cat;
        renderMissions();
    });

    // Tab clicks
    document.getElementById('tabDaily').addEventListener('click', () => {
        activeTab = 'daily';
        document.getElementById('tabDaily').classList.add('active');
        document.getElementById('tabHistory').classList.remove('active');
        document.getElementById('missionsGrid').style.display = '';
        document.querySelector('.missions__filters').style.display = '';
        document.getElementById('missionsHistory').style.display = 'none';
    });

    document.getElementById('tabHistory').addEventListener('click', () => {
        activeTab = 'history';
        document.getElementById('tabHistory').classList.add('active');
        document.getElementById('tabDaily').classList.remove('active');
        document.getElementById('missionsGrid').style.display = 'none';
        document.querySelector('.missions__filters').style.display = 'none';
        document.getElementById('missionsHistory').style.display = '';
        renderHistory();
    });

    renderMissions();

    const loader = document.getElementById('appLoader');
    if (loader) loader.classList.add('hidden');

    return { cleanup: () => { } };
}

