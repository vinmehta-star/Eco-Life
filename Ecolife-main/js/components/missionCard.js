/* =========================================================
   EcoLife — Mission Card Component
   ========================================================= */

import { CATEGORIES } from '../data/missions.js';

/**
 * Render a single mission card.
 * @param {Object} mission - Mission data
 * @param {Object} options - { onComplete, onAccept, isActive, isCompleted }
 */
export function createMissionCard(mission, options = {}) {
    const { onComplete, onAccept, isActive = false, isCompleted = false } = options;
    const category = CATEGORIES[mission.category] || {};
    
    const card = document.createElement('div');
    card.className = `mission-card glass-card ${isActive ? 'mission-card--active' : ''} ${isCompleted ? 'mission-card--completed' : ''}`;
    card.id = `mission-${mission.id}`;
    
    // Difficulty dots
    const diffDots = Array.from({ length: 5 }, (_, i) =>
        `<span class="mission-card__difficulty-dot ${i < mission.difficulty ? 'filled' : ''}"></span>`
    ).join('');
    
    card.innerHTML = `
        ${isCompleted ? `<div class="mission-card__check"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg></div>` : ''}
        <div class="mission-card__top">
            <div class="mission-card__icon mission-card__icon--${mission.category}">${mission.emoji || category.emoji}</div>
            <div class="mission-card__points">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                +${mission.points}
            </div>
        </div>
        <div class="mission-card__title">${mission.title}</div>
        <div class="mission-card__desc">${mission.description}</div>
        <div class="mission-card__footer">
            <div class="mission-card__difficulty">${diffDots}</div>
            <div class="mission-card__co2">-${mission.co2Saved} kg CO₂</div>
        </div>
        ${!isCompleted ? `
        <div class="mission-card__actions">
            ${isActive ? 
                `<button class="btn btn--primary btn--sm btn--full mission-complete-btn" data-mission="${mission.id}">✓ Complete</button>` :
                `<button class="btn btn--secondary btn--sm btn--full mission-accept-btn" data-mission="${mission.id}">Accept Mission</button>`
            }
        </div>
        ` : ''}
    `;
    
    // Event listeners
    const completeBtn = card.querySelector('.mission-complete-btn');
    if (completeBtn && onComplete) {
        completeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onComplete(mission);
        });
    }
    
    const acceptBtn = card.querySelector('.mission-accept-btn');
    if (acceptBtn && onAccept) {
        acceptBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            onAccept(mission);
        });
    }
    
    return card;
}
