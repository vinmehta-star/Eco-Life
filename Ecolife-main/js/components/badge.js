/* =========================================================
   EcoLife — Badge Component
   ========================================================= */

import { BADGES, BADGE_RARITY, getBadgeById } from '../data/badges.js';
import { playBadge } from '../services/sound.js';

/**
 * Render the badge showcase grid.
 * @param {HTMLElement} container
 * @param {Array<string>} earnedBadgeIds
 */
export function renderBadgeShowcase(container, earnedBadgeIds = []) {
    const cards = BADGES.map(badge => {
        const isEarned = earnedBadgeIds.includes(badge.id);
        const rarity = BADGE_RARITY[badge.rarity];
        
        return `
            <div class="badge-card glass-card ${isEarned ? '' : 'badge-card--locked'}" data-badge="${badge.id}">
                <span class="badge-card__icon">${badge.emoji}</span>
                <div class="badge-card__name">${badge.name}</div>
                <div class="badge-card__desc">${badge.description}</div>
                <span class="badge-card__rarity chip ${rarity.cssClass}">${rarity.name}</span>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `<div class="badge-showcase">${cards}</div>`;
}

/**
 * Show badge unlock overlay animation.
 * @param {Object} badge - Badge object
 */
export function showBadgeUnlock(badge) {
    playBadge();
    const rarity = BADGE_RARITY[badge.rarity];
    
    const overlay = document.createElement('div');
    overlay.className = 'badge-unlock';
    overlay.innerHTML = `
        <div class="badge-unlock__content">
            <div class="badge-unlock__label">Badge Unlocked!</div>
            <div class="badge-unlock__icon">${badge.emoji}</div>
            <div class="badge-unlock__name" style="color: ${rarity.color}">${badge.name}</div>
            <div class="badge-unlock__desc">${badge.description}</div>
            <button class="btn btn--primary btn--lg" style="margin-top: 24px;" id="badgeUnlockDismiss">Awesome!</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    overlay.querySelector('#badgeUnlockDismiss').addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    });
    
    // Also dismiss on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    });
}
