/* =========================================================
   EcoLife — Score Card Component
   ========================================================= */

import { state } from '../state.js';
import { getLevel, getLevelProgress, getLevelTitle, getStreakMultiplier } from '../engines/greenScore.js';

/**
 * Render the Green Score card with animated ring.
 */
export function renderScoreCard(container) {
    const score = state.get('greenScore') || 0;
    const level = getLevel(score);
    const progress = getLevelProgress(score);
    const streak = state.get('streak')?.current || 0;
    const multiplier = getStreakMultiplier(streak);
    
    container.innerHTML = `
        <div class="score-card glass-card">
            <div class="score-card__ring-wrapper">
                <svg class="score-card__ring" viewBox="0 0 120 120" width="120" height="120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--bg-elevated)" stroke-width="8"/>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent)" stroke-width="8"
                        stroke-dasharray="${2 * Math.PI * 52}"
                        stroke-dashoffset="${2 * Math.PI * 52 * (1 - progress / 100)}"
                        stroke-linecap="round"
                        transform="rotate(-90 60 60)"
                        style="transition: stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1); filter: drop-shadow(0 0 6px rgba(0,255,136,0.4));"
                    />
                </svg>
                <div class="score-card__ring-content">
                    <div class="score-card__level">Lv.${level}</div>
                    <div class="score-card__title">${getLevelTitle(level)}</div>
                </div>
            </div>
            <div class="score-card__details">
                <div class="score-card__score">
                    <span class="score-card__score-value glow-text">${score.toLocaleString()}</span>
                    <span class="score-card__score-label">Green Score</span>
                </div>
                <div class="score-card__meta">
                    <div class="score-card__streak">
                        <span class="score-card__streak-icon">🔥</span>
                        <span>${streak} day${streak !== 1 ? 's' : ''}</span>
                    </div>
                    ${multiplier > 1 ? `<div class="score-card__multiplier chip chip--green">${multiplier.toFixed(1)}x</div>` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Subscribe to score updates for live animation
    return state.subscribe('greenScore', (newScore) => {
        const newLevel = getLevel(newScore);
        const newProgress = getLevelProgress(newScore);
        const ring = container.querySelector('.score-card__ring circle:last-child');
        const scoreEl = container.querySelector('.score-card__score-value');
        const levelEl = container.querySelector('.score-card__level');
        const titleEl = container.querySelector('.score-card__title');
        
        if (ring) ring.setAttribute('stroke-dashoffset', 2 * Math.PI * 52 * (1 - newProgress / 100));
        if (scoreEl) animateCounter(scoreEl, score, newScore);
        if (levelEl) levelEl.textContent = `Lv.${newLevel}`;
        if (titleEl) titleEl.textContent = getLevelTitle(newLevel);
    });
}

/** Animate a number counter from old to new value */
function animateCounter(el, from, to) {
    const duration = 600;
    const start = performance.now();
    
    function step(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(from + (to - from) * eased);
        el.textContent = current.toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
    }
    
    requestAnimationFrame(step);
}
