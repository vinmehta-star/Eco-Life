/* =========================================================
   EcoLife — Tree View (Full page Impact Tree)
   ========================================================= */

import { state } from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderImpactTree } from '../components/impactTree.js';
import { getTreeStage, getLevel, getLevelProgress } from '../engines/greenScore.js';
import { showCertificateModal } from '../components/certificate.js';

export async function render(appContainer) {
    const s = state.get();
    const score = s.greenScore || 0;
    const streak = s.streak?.current || 0;
    const co2 = s.co2Saved || 0;
    const treeStage = getTreeStage(score);
    const totalMissions = (s.completedMissions || []).length;
    
    const stageBadgeClass = ['', 'tree-stage-badge--seed', 'tree-stage-badge--sapling', 'tree-stage-badge--young', 'tree-stage-badge--mature', 'tree-stage-badge--ancient'][treeStage.stage];
    
    appContainer.innerHTML = `
        <div class="app-layout">
            <div id="navContainer"></div>
            <main class="app-main">
                <div class="app-content">
                    <div class="tree-view">
                        <div class="page-header" style="text-align:center; width:100%;">
                            <h1 class="page-title"><span class="page-title__emoji emoji">🌳</span>My Living Impact Tree</h1>
                            <p class="page-subtitle">Your tree grows as you complete eco-missions. Keep your streak alive to help it flourish!</p>
                        </div>
                        
                        <div class="tree-stage-badge ${stageBadgeClass}">
                            ${treeStage.icon} Stage ${treeStage.stage}/5 — ${treeStage.name}
                        </div>

                        <div class="tree-view__container" id="fullTreeContainer" style="margin-top:var(--space-lg);">
                        </div>

                        <div class="tree-info">
                            <div class="tree-info__stat glass-card">
                                <div class="tree-info__stat-value glow-text">${score.toLocaleString()}</div>
                                <div class="tree-info__stat-label">Green Score</div>
                            </div>
                            <div class="tree-info__stat glass-card">
                                <div class="tree-info__stat-value" style="color:var(--warning)">${streak}</div>
                                <div class="tree-info__stat-label">Day Streak</div>
                            </div>
                            <div class="tree-info__stat glass-card">
                                <div class="tree-info__stat-value" style="color:var(--info)">${co2.toFixed(1)} kg</div>
                                <div class="tree-info__stat-label">CO₂ Saved</div>
                            </div>
                            <div class="tree-info__stat glass-card">
                                <div class="tree-info__stat-value" style="color:var(--epic)">${totalMissions}</div>
                                <div class="tree-info__stat-label">Missions Done</div>
                            </div>
                        </div>

                        <div style="margin-top:var(--space-lg); text-align:center;">
                            <button class="btn btn--primary btn--lg" id="treeCertBtn">📜 View & Print Sustainability Certificate</button>
                        </div>

                        <!-- Growth Guide -->
                        <div class="card" style="max-width:600px; width:100%; margin-top:var(--space-xl);">
                            <div class="card__header"><h5 class="card__title">Growth Stages</h5></div>
                            <div style="display:flex; flex-direction:column; gap:var(--space-sm);">
                                ${renderGrowthGuide(treeStage.stage)}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    `;
    
    renderNavbar(document.getElementById('navContainer'));
    
    document.getElementById('treeCertBtn').addEventListener('click', () => {
        showCertificateModal();
    });
    
    // Render the full-size tree
    const treeContainer = document.getElementById('fullTreeContainer');
    const treeResult = renderImpactTree(treeContainer, { compact: false });
    
    const loader = document.getElementById('appLoader');
    if (loader) loader.classList.add('hidden');
    
    return {
        cleanup: () => { if (treeResult?.cleanup) treeResult.cleanup(); }
    };
}

function renderGrowthGuide(currentStage) {
    const stages = [
        { stage: 1, name: 'Seed', score: '0–99', icon: '🫘', desc: 'A tiny sprout reaching for the sun' },
        { stage: 2, name: 'Sapling', score: '100–499', icon: '🌱', desc: 'Growing branches and first leaves' },
        { stage: 3, name: 'Young Tree', score: '500–1499', icon: '🌿', desc: 'A spreading canopy takes shape' },
        { stage: 4, name: 'Mature Tree', score: '1500–3999', icon: '🌲', desc: 'Full canopy with flowers and fruit' },
        { stage: 5, name: 'Ancient Tree', score: '4000+', icon: '🌳', desc: 'Majestic, glowing, legendary' },
    ];
    
    return stages.map(s => {
        const isCurrent = s.stage === currentStage;
        const isPast = s.stage < currentStage;
        
        return `
            <div style="display:flex; align-items:center; gap:var(--space-md); padding:var(--space-md); background:${isCurrent ? 'var(--accent-glow-subtle)' : 'var(--bg-elevated)'}; border-radius:var(--radius-md); border:1px solid ${isCurrent ? 'rgba(0,255,136,0.2)' : 'transparent'};">
                <span style="font-size:1.5rem; opacity:${isPast || isCurrent ? 1 : 0.3}">${s.icon}</span>
                <div style="flex:1;">
                    <div style="font-size:var(--font-sm); font-weight:600; color:${isCurrent ? 'var(--accent)' : isPast ? 'var(--text-primary)' : 'var(--text-muted)'}">
                        ${s.name} ${isCurrent ? '← You are here' : isPast ? '✓' : ''}
                    </div>
                    <div style="font-size:var(--font-xs); color:var(--text-muted);">${s.score} pts — ${s.desc}</div>
                </div>
            </div>
        `;
    }).join('');
}

