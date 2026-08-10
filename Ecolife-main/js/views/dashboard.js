/* =========================================================
   EcoLife — Dashboard View
   ========================================================= */

import { state } from '../state.js';
import { router } from '../router.js';
import { renderNavbar } from '../components/navbar.js';
import { renderImpactTree } from '../components/impactTree.js';
import { createWeeklyChart, updateChartData } from '../components/charts.js';
import { getLevel, getLevelTitle, getTreeStage, isStreakAtRisk } from '../engines/greenScore.js';
import { generateRecommendations } from '../engines/ecoBuddy.js';
import { CATEGORIES, MISSIONS } from '../data/missions.js';
import { BADGES } from '../data/badges.js';

export async function render(appContainer) {
    const s = state.get();
    const score = s.greenScore || 0;
    const streak = s.streak?.current || 0;
    const level = s.level || getLevel(score);
    const co2 = s.co2Saved || 0;
    const treeStage = getTreeStage(score);
    const completedToday = (s.completedMissions || []).filter(m => {
        return m.completedAt && m.completedAt.startsWith(new Date().toISOString().split('T')[0]);
    }).length;

    // Generate daily recommendations and persist them so Missions page stays in sync
    const today = new Date().toISOString().split('T')[0];
    const completedIds = new Set((s.completedMissions || []).map(m => m.missionId));
    const recs = generateRecommendations(s);

    let activeMissions = recs.missions.filter(m => !completedIds.has(m.id));
    if (activeMissions.length < 5) {
        const pool = MISSIONS.filter(m => !completedIds.has(m.id) && !activeMissions.some(u => u.id === m.id));
        activeMissions = [...activeMissions, ...pool.slice(0, 5 - activeMissions.length)];
    }
    activeMissions = activeMissions.slice(0, 5);
    const tips = recs.tips;

    if (s.dailyMissionsDate !== today || !s.dailyMissions || s.dailyMissions.length === 0) {
        state.set({ dailyMissions: activeMissions, dailyMissionsDate: today });
    }

    appContainer.innerHTML = `
        <div class="app-layout">
            <div id="navContainer"></div>
            <main class="app-main">
                <div class="app-content">
                    <div class="dashboard">
                        <!-- Page Header -->
                        <div class="page-header">
                            <h1 class="page-title">Welcome back, <span class="glow-text--subtle">${s.user?.displayName || 'EcoWarrior'}</span></h1>
                            <p class="page-subtitle">${getGreeting()} ${isStreakAtRisk() ? '⚠️ Complete a mission to keep your streak!' : ''}</p>
                        </div>

                        <!-- Stats Row -->
                        <div class="dashboard__stats">
                            <div class="stat-card glass-card fade-slide-up stagger-1">
                                <div class="stat-card__icon stat-card__icon--score">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                </div>
                                <div class="stat-card__info">
                                    <div class="stat-card__value" style="color:var(--accent)">${score.toLocaleString()}</div>
                                    <div class="stat-card__label">Green Score</div>
                                    <div class="stat-card__change">Lv.${level} ${getLevelTitle(level)}</div>
                                </div>
                            </div>
                            <div class="stat-card glass-card fade-slide-up stagger-2">
                                <div class="stat-card__icon stat-card__icon--streak">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c-4.97 0-9-2.686-9-6v-.002C3 11.81 8.693 4.637 11.333 2.242a.971.971 0 0 1 1.334 0C15.307 4.637 21 11.81 21 15.998V16c0 3.314-4.03 6-9 6z"/></svg>
                                </div>
                                <div class="stat-card__info">
                                    <div class="stat-card__value" style="color:var(--warning)">${streak}</div>
                                    <div class="stat-card__label">Day Streak</div>
                                    <div class="stat-card__change">${streak > 0 ? `Best: ${s.streak?.longest || streak}` : 'Start today!'}</div>
                                </div>
                            </div>
                            <div class="stat-card glass-card fade-slide-up stagger-3">
                                <div class="stat-card__icon stat-card__icon--level">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
                                </div>
                                <div class="stat-card__info">
                                    <div class="stat-card__value" style="color:var(--epic)">${completedToday}</div>
                                    <div class="stat-card__label">Done Today</div>
                                    <div class="stat-card__change">${(s.completedMissions || []).length} total</div>
                                </div>
                            </div>
                            <div class="stat-card glass-card fade-slide-up stagger-4">
                                <div class="stat-card__icon stat-card__icon--co2">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                </div>
                                <div class="stat-card__info">
                                    <div class="stat-card__value" style="color:var(--info)">${co2.toFixed(1)}</div>
                                    <div class="stat-card__label">kg CO₂ Saved</div>
                                    <div class="stat-card__change">≈ ${Math.max(0.1, co2 / 22).toFixed(1)} trees</div>
                                </div>
                            </div>
                        </div>

                        <!-- Main Grid -->
                        <div class="dashboard__grid">
                            <div class="dashboard__left">
                                <!-- Quick Actions -->
                                <div class="card">
                                    <div class="card__header">
                                        <h5 class="card__title">Quick Actions</h5>
                                    </div>
                                    <div class="quick-actions">
                                        <button class="quick-action" onclick="location.hash='#/missions'">
                                            <div class="quick-action__icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></div>
                                            <span class="quick-action__label">Missions</span>
                                        </button>
                                        <button class="quick-action" onclick="location.hash='#/recycling'">
                                            <div class="quick-action__icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="M14 16l-3 3 3 3"/></svg></div>
                                            <span class="quick-action__label">Recycle</span>
                                        </button>
                                        <button class="quick-action" onclick="location.hash='#/calculator'">
                                            <div class="quick-action__icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
                                            <span class="quick-action__label">Calculator</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Active Missions -->
                                <div class="card">
                                    <div class="card__header">
                                        <h5 class="card__title">Today's Missions</h5>
                                        <a href="#/missions" class="btn btn--ghost btn--sm">View All →</a>
                                    </div>
                                    <div class="active-missions__list">
                                        ${activeMissions.map(m => `
                                            <div class="active-mission-row" onclick="location.hash='#/missions'">
                                                <div class="active-mission-row__icon">${m.emoji || CATEGORIES[m.category]?.emoji || '🌱'}</div>
                                                <div class="active-mission-row__info">
                                                    <div class="active-mission-row__title">${m.title}</div>
                                                    <div class="active-mission-row__meta">${CATEGORIES[m.category]?.name || m.category} • Difficulty ${m.difficulty}/5</div>
                                                </div>
                                                <div class="active-mission-row__points">+${m.points}</div>
                                            </div>
                                        `).join('')}
                                        ${activeMissions.length === 0 ? '<p style="color:var(--text-muted);font-size:var(--font-sm);padding:var(--space-md);">No missions yet — head to Missions to get started!</p>' : ''}
                                    </div>
                                </div>

                                <!-- Weekly Activity Chart -->
                                <div class="card">
                                    <div class="card__header">
                                        <h5 class="card__title">Weekly Activity</h5>
                                    </div>
                                    <div class="chart-container">
                                        <canvas id="weeklyChart"></canvas>
                                    </div>
                                </div>

                                <!-- EcoBuddy Tips -->
                                <div class="card">
                                    <div class="card__header">
                                        <h5 class="card__title">🤖 EcoBuddy Tips</h5>
                                    </div>
                                    <div style="display:flex; flex-direction:column; gap:var(--space-sm);">
                                        ${tips.map(tip => `
                                            <div style="padding:var(--space-md); background:var(--bg-elevated); border-radius:var(--radius-md); font-size:var(--font-sm); color:var(--text-secondary); line-height:1.5;">${tip}</div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>

                            <div class="dashboard__right">
                                <!-- Tree Preview -->
                                <div class="card tree-preview">
                                    <div class="card__header" style="width:100%">
                                        <h5 class="card__title">My Impact Tree</h5>
                                        <a href="#/tree" class="btn btn--ghost btn--sm">Full View →</a>
                                    </div>
                                    <div id="dashTreeContainer" class="tree-preview__svg"></div>
                                    <div class="tree-preview__label">Stage ${treeStage.stage}/5</div>
                                    <div class="tree-preview__stage">${treeStage.icon} ${treeStage.name}</div>
                                </div>

                                <!-- Recent Badges -->
                                <div class="card">
                                    <div class="card__header">
                                        <h5 class="card__title">Badges</h5>
                                        <a href="#/community" class="btn btn--ghost btn--sm">All →</a>
                                    </div>
                                    <div class="recent-badges">
                                        ${renderRecentBadges(s.badges || [])}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;

    // Render navbar
    renderNavbar(document.getElementById('navContainer'));

    // Render mini tree
    const treeContainer = document.getElementById('dashTreeContainer');
    let treeCleanup = null;
    if (treeContainer) {
        const result = renderImpactTree(treeContainer, { compact: true });
        treeCleanup = result?.cleanup;
    }

    // Initialize weekly chart
    let chart = null;
    setTimeout(() => {
        chart = createWeeklyChart('weeklyChart');
        if (chart) {
            updateChartData(chart, s.weeklyActivity || [0, 0, 0, 0, 0, 0, 0]);
        }
    }, 100);

    // Hide loader
    const loader = document.getElementById('appLoader');
    if (loader) loader.classList.add('hidden');

    return {
        cleanup: () => {
            if (treeCleanup) treeCleanup();
            if (chart) chart.destroy();
        }
    };
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning! ☀️ Start your day with an eco-mission.";
    if (hour < 17) return "Good afternoon! 🌿 Keep up the green momentum.";
    if (hour < 21) return "Good evening! 🌙 Time for an evening eco-action.";
    return "Night owl mode! 🦉 Tomorrow's missions await.";
}

function renderRecentBadges(earnedIds) {
    const allBadges = BADGES.slice(0, 8);

    return allBadges.map(badge => {
        const earned = earnedIds.includes(badge.id);
        return `<div class="recent-badge ${earned ? '' : 'recent-badge--locked'}" title="${badge.name}: ${badge.description}">${badge.emoji}</div>`;
    }).join('');
}
