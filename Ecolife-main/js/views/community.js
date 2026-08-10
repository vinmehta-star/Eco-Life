/* =========================================================
   EcoLife — Community Forest & Leaderboard View
   ========================================================= */

import { state } from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderLeaderboard } from '../components/leaderboard.js';
import { renderBadgeShowcase } from '../components/badge.js';
import { getLeaderboard, getCommunityStats } from '../services/firestore.js';

export async function render(appContainer) {
    const s = state.get();
    const userBadges = s.badges || [];

    appContainer.innerHTML = `
        <div class="app-layout">
            <div id="navContainer"></div>
            <main class="app-main">
                <div class="app-content">
                    <div class="community">
                        <div class="page-header">
                            <h1 class="page-title"><span class="page-title__emoji emoji">🌲</span>Community Forest</h1>
                            <p class="page-subtitle">Join forces with eco-warriors worldwide. Together, our small actions grow a massive forest!</p>
                        </div>

                        <!-- Community Stats Banner -->
                        <div class="community__banner" id="communityStatsBanner">
                            <div class="community__stat glass-card">
                                <div class="community__stat-icon">🌲</div>
                                <div class="community__stat-value community__stat-value--green" id="statTotalTrees">...</div>
                                <div class="community__stat-label">Forest Trees</div>
                            </div>
                            <div class="community__stat glass-card">
                                <div class="community__stat-icon">🌍</div>
                                <div class="community__stat-value community__stat-value--blue" id="statTotalCO2">...</div>
                                <div class="community__stat-label">kg CO₂ Saved</div>
                            </div>
                            <div class="community__stat glass-card">
                                <div class="community__stat-icon">🎯</div>
                                <div class="community__stat-value community__stat-value--purple" id="statTotalScore">...</div>
                                <div class="community__stat-label">Total Green Points</div>
                            </div>
                            <div class="community__stat glass-card">
                                <div class="community__stat-icon">👥</div>
                                <div class="community__stat-value community__stat-value--gold" id="statActiveUsers">...</div>
                                <div class="community__stat-label">Active Eco-Warriors</div>
                            </div>
                        </div>

                        <!-- Tabs -->
                        <div class="tabs community__tabs" style="max-width:400px;">
                            <button class="tab active" id="tabForest">Community Forest</button>
                            <button class="tab" id="tabLeaderboard">Leaderboard</button>
                            <button class="tab" id="tabBadges">Badges (${userBadges.length})</button>
                        </div>

                        <!-- Community Forest View -->
                        <div id="forestSection" class="forest glass-card">
                            <div class="card__header" style="margin-bottom: var(--space-lg);">
                                <h5 class="card__title">🌲 Living Community Forest</h5>
                                <span class="chip chip--green" id="forestTreeCount">Loading trees...</span>
                            </div>
                            <p style="color:var(--text-secondary); font-size:var(--font-sm); margin-bottom:var(--space-lg);">
                                Every tree in this grid represents a real user's contribution! Hover over a tree to see their impact.
                            </p>
                            <div class="forest__grid" id="forestGrid"></div>
                        </div>

                        <!-- Leaderboard View -->
                        <div id="leaderboardSection" style="display:none;">
                            <div id="leaderboardContainer"></div>
                        </div>

                        <!-- Badges Showcase -->
                        <div id="badgesSection" style="display:none;">
                            <div style="margin-bottom:var(--space-lg);">
                                <h3>Achievement Wall</h3>
                                <p style="color:var(--text-secondary); font-size:var(--font-sm);">Complete missions and reach milestones to unlock unique achievement badges!</p>
                            </div>
                            <div id="badgeShowcaseContainer"></div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    `;

    renderNavbar(document.getElementById('navContainer'));

    // Tab Logic
    const tabForest = document.getElementById('tabForest');
    const tabLeaderboard = document.getElementById('tabLeaderboard');
    const tabBadges = document.getElementById('tabBadges');

    const forestSection = document.getElementById('forestSection');
    const leaderboardSection = document.getElementById('leaderboardSection');
    const badgesSection = document.getElementById('badgesSection');

    tabForest.addEventListener('click', () => {
        setTab(tabForest, forestSection);
    });

    tabLeaderboard.addEventListener('click', () => {
        setTab(tabLeaderboard, leaderboardSection);
    });

    tabBadges.addEventListener('click', () => {
        setTab(tabBadges, badgesSection);
    });

    function setTab(activeTab, activeSection) {
        [tabForest, tabLeaderboard, tabBadges].forEach(t => t.classList.remove('active'));
        [forestSection, leaderboardSection, badgesSection].forEach(s => s.style.display = 'none');
        activeTab.classList.add('active');
        activeSection.style.display = 'block';
    }

    // Load Async Data
    loadCommunityData();

    async function loadCommunityData() {
        const stats = await getCommunityStats();
        document.getElementById('statTotalTrees').textContent = stats.totalTrees.toLocaleString();
        document.getElementById('statTotalCO2').textContent = parseFloat(stats.totalCO2).toLocaleString();
        document.getElementById('statTotalScore').textContent = stats.totalScore.toLocaleString();
        document.getElementById('statActiveUsers').textContent = stats.activeUsers.toLocaleString();
        document.getElementById('forestTreeCount').textContent = `${stats.totalTrees} Trees`;

        const leaderboardUsers = await getLeaderboard(20);

        // Render Forest Grid
        renderForestGrid(leaderboardUsers, stats.totalTrees);

        // Render Leaderboard
        renderLeaderboard(document.getElementById('leaderboardContainer'), leaderboardUsers);

        // Render Badge Showcase
        renderBadgeShowcase(document.getElementById('badgeShowcaseContainer'), userBadges);
    }

    function renderForestGrid(users, totalTrees) {
        const grid = document.getElementById('forestGrid');
        const s = state.get();
        const isDemo = !s.user || (s.user.email || '').toLowerCase().includes('demo') || (s.user.uid || '').startsWith('offline-');
        
        function getMiniTreeSVG(stageIndex, color = '#00FF88') {
            const svgHeights = [24, 28, 32, 36, 40];
            const h = svgHeights[stageIndex] || 30;
            return `
                <svg viewBox="0 0 40 44" width="${h}" height="${h + 4}" style="filter: drop-shadow(0 2px 8px ${color}44);">
                    <path d="M20 40V24" stroke="#8B6914" stroke-width="3" stroke-linecap="round"/>
                    <path d="M20 8L10 24H30Z" fill="${color}" opacity="0.9"/>
                    <path d="M20 16L12 28H28Z" fill="${color}" opacity="0.8"/>
                    <circle cx="20" cy="12" r="3" fill="#7DFFB5"/>
                </svg>
            `;
        }

        const colors = ['#00FF88', '#00D4FF', '#FFB800', '#B366FF', '#7DFFB5'];

        const communityNames = [
            'Sophia Martinez', 'Liam Chen', 'Emma Watson', 'Aarav Sharma', 'Maya Patel',
            'Lucas Vance', 'Elena Rostova', 'Noah Kim', 'Chloe Dubois', 'Mateo Silva',
            'Zara Khan', 'Oliver Wright', 'Amara Okafor', 'Kai Tanaka', 'Isabella Rossi',
            'Ethan Hawke', 'Freya Lind', 'Leo Schmidt', 'Ananya Gupta', 'Hugo Mercier',
            'Mila Jovanovic', 'Gabriel Santos', 'Aria Montgomery', 'Zayn Malik', 'Nora Lindqvist',
            'Caleb Thorne', 'Layla Al-Mansoor', 'Julian Meyer', 'Kavya Reddy', 'Felix Dupont',
            'Zoe Bennett', 'Marcus Vance', 'Hannah Abbott', 'Tariq Habib', 'Sienna Brooks',
            'Rohan Verma', 'Astrid Nygård', 'Diego Ramos', 'Yuki Sato', 'Camila Navarro',
            'Sebastian Cole', 'Leila Haddad', 'Jasper Vance', 'Priya Sundaram', 'Victor Hugo',
            'Amelia Scott', 'Finn Larsen', 'Luna Kim', 'Ravi Mehta', 'Isabelle Fontaine'
        ];

        let forestItems = users.map(u => {
            const stageIndex = Math.min(4, Math.floor((u.greenScore || 0) / 1000));
            const color = colors[stageIndex % colors.length];
            const svgTree = getMiniTreeSVG(stageIndex, color);
            return `
                <div class="forest__tree">
                    ${svgTree}
                    <div class="forest__tree-tooltip">
                        <div class="forest__tree-name">${u.displayName} ${u.isCurrentUser ? '(You)' : ''}</div>
                        <div class="forest__tree-score">${(u.greenScore || 0).toLocaleString()} pts • Level ${u.level || 1}</div>
                    </div>
                </div>
            `;
        });

        // Demo mode: pad to 70 trees with named community members
        // Real mode: only show actual Firestore users (no fake padding)
        if (isDemo) {
            const TARGET_TREES = 70;
            const neededExtra = Math.max(0, TARGET_TREES - forestItems.length);

            for (let i = 0; i < neededExtra; i++) {
                const stageIndex = (i * 3 + 2) % 5;
                const color = colors[i % colors.length];
                const svgTree = getMiniTreeSVG(stageIndex, color);
                const name = communityNames[i % communityNames.length];
                const score = 850 + ((i * 137) % 3500);
                const level = Math.max(1, Math.floor(score / 500));

                forestItems.push(`
                    <div class="forest__tree">
                        ${svgTree}
                        <div class="forest__tree-tooltip">
                            <div class="forest__tree-name">${name}</div>
                            <div class="forest__tree-score">${score.toLocaleString()} pts • Level ${level}</div>
                        </div>
                    </div>
                `);
            }
            grid.innerHTML = forestItems.slice(0, TARGET_TREES).join('');
        } else {
            if (forestItems.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1; padding: var(--space-xl);">
                        <div style="font-size: 3rem;">🌱</div>
                        <p class="empty-state__text">No trees planted yet — complete missions to grow the community forest!</p>
                    </div>`;
            } else {
                grid.innerHTML = forestItems.join('');
            }
        }
    }

    const loader = document.getElementById('appLoader');
    if (loader) loader.classList.add('hidden');

    return { cleanup: () => {} };
}

