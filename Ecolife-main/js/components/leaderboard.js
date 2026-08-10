/* =========================================================
   EcoLife — Leaderboard Component
   ========================================================= */

import { state } from '../state.js';

/**
 * Render the leaderboard table.
 * @param {HTMLElement} container
 * @param {Array} users - Array of { uid, displayName, greenScore, level }
 */
export function renderLeaderboard(container, users = []) {
    const currentUid = state.get('user')?.uid;
    
    const trophies = ['🥇', '🥈', '🥉'];
    
    const rows = users.map((user, i) => {
        const rank = i + 1;
        const isCurrent = user.uid === currentUid || user.isCurrentUser;
        const topClass = rank <= 3 ? `leaderboard__row--top${rank}` : '';
        const currentClass = isCurrent ? 'leaderboard__row--current' : '';
        const initials = user.displayName ? user.displayName.charAt(0).toUpperCase() : '?';
        
        return `
            <div class="leaderboard__row ${topClass} ${currentClass}">
                <div class="leaderboard__rank ${rank <= 3 ? 'leaderboard__rank--trophy' : ''}">
                    ${rank <= 3 ? trophies[rank - 1] : rank}
                </div>
                <div class="leaderboard__user">
                    <div class="avatar avatar--sm">${initials}</div>
                    <div>
                        <div class="leaderboard__name">${user.displayName}${isCurrent ? ' (You)' : ''}</div>
                        <div class="leaderboard__level">Level ${user.level || 1}</div>
                    </div>
                </div>
                <div class="leaderboard__score">${(user.greenScore || 0).toLocaleString()}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="leaderboard glass-card">
            <div class="leaderboard__header">
                <h5 class="leaderboard__title">🏆 Global Leaderboard</h5>
            </div>
            <div class="leaderboard__table">
                ${rows || '<div class="empty-state"><p class="empty-state__text">No data yet — be the first!</p></div>'}
            </div>
        </div>
    `;
}
