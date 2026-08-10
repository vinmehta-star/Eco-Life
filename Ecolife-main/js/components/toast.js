import { playSuccess, playLevelUp, playPop } from '../services/sound.js';

let container = null;

function ensureContainer() {
    if (container && document.body.contains(container)) return container;
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    document.body.appendChild(container);
    return container;
}

/**
 * Show a toast notification.
 * @param {Object} options
 * @param {string} options.title - Toast title
 * @param {string} [options.message] - Toast body text
 * @param {string} [options.type] - 'success' | 'warning' | 'danger' | 'info' | 'achievement'
 * @param {number} [options.duration] - Auto-dismiss time in ms (default: 4000)
 * @param {string} [options.icon] - Emoji icon override
 */
export function showToast({ title, message = '', type = 'success', duration = 4000, icon = null }) {
    const c = ensureContainer();
    
    if (type === 'achievement') playLevelUp();
    else if (type === 'success') playSuccess();
    else playPop();
    
    const defaultIcons = {
        success: '✅',
        warning: '⚠️',
        danger: '❌',
        info: 'ℹ️',
        achievement: '🏆'
    };
    
    const toastIcon = icon || defaultIcons[type] || '✅';
    
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
        <div class="toast__icon">${toastIcon}</div>
        <div class="toast__content">
            <div class="toast__title">${title}</div>
            ${message ? `<div class="toast__message">${message}</div>` : ''}
        </div>
        <button class="toast__close" aria-label="Dismiss">✕</button>
        <div class="toast__progress" style="animation-duration: ${duration}ms"></div>
    `;
    
    // Close button
    toast.querySelector('.toast__close').addEventListener('click', () => dismissToast(toast));
    
    c.appendChild(toast);
    
    // Auto dismiss
    if (duration > 0) {
        setTimeout(() => dismissToast(toast), duration);
    }
    
    return toast;
}

function dismissToast(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add('toast--exit');
    setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
}

/** Show score popup in center of screen */
export function showScorePopup(points) {
    playSuccess();
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${points}`;
    document.body.appendChild(popup);
    setTimeout(() => {
        if (popup.parentNode) popup.parentNode.removeChild(popup);
    }, 1300);
}

/** Show confetti particles */
export function showConfetti(count = 30) {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    
    const colors = ['#00FF88', '#00D4FF', '#FFB800', '#B366FF', '#FF6B9D', '#FFD700'];
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'confetti-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '40%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDuration = (1 + Math.random() * 1.5) + 's';
        particle.style.animationDelay = Math.random() * 0.3 + 's';
        particle.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(particle);
    }
    
    document.body.appendChild(container);
    setTimeout(() => {
        if (container.parentNode) container.parentNode.removeChild(container);
    }, 3000);
}
