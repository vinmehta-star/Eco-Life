/* =========================================================
   EcoLife — Official Sustainability Certificate Generator
   (100% Client-Side, Free, Printable & Downloadable)
   ========================================================= */

import { state } from '../state.js';
import { getLevel, getLevelTitle } from '../engines/greenScore.js';

export function showCertificateModal() {
    const s = state.get();
    const user = s.user || { displayName: 'EcoWarrior' };
    const score = s.greenScore || 0;
    const level = s.level || getLevel(score);
    const levelTitle = getLevelTitle(level);
    const co2 = (s.co2Saved || 0).toFixed(1);
    const trees = Math.max(1, Math.floor(score / 500));
    const certId = 'ECO-' + Math.floor(100000 + Math.random() * 900000);
    const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.id = 'certModalOverlay';
    overlay.style.zIndex = '10000';

    overlay.innerHTML = `
        <div class="modal cert-modal" style="max-width: 780px; width: 95%; background: #0A120D; border: 2px solid var(--accent); padding: var(--space-xl); border-radius: var(--radius-lg); position: relative; box-shadow: 0 0 40px rgba(0,255,136,0.3);">
            <button class="modal__close" id="closeCertModal" style="position:absolute; top:16px; right:16px;">✕</button>

            <!-- Printable Certificate Container -->
            <div id="printableCertificate" style="border: 2px solid rgba(0,255,136,0.4); padding: 32px; background: radial-gradient(circle at center, #112217 0%, #080F0A 100%); border-radius: 12px; text-align: center; color: #FFFFFF; position: relative; overflow: hidden;">
                <!-- Decorative Corner Accents -->
                <div style="position:absolute; top:12px; left:12px; width:24px; height:24px; border-top:2px solid var(--accent); border-left:2px solid var(--accent);"></div>
                <div style="position:absolute; top:12px; right:12px; width:24px; height:24px; border-top:2px solid var(--accent); border-right:2px solid var(--accent);"></div>
                <div style="position:absolute; bottom:12px; left:12px; width:24px; height:24px; border-bottom:2px solid var(--accent); border-left:2px solid var(--accent);"></div>
                <div style="position:absolute; bottom:12px; right:12px; width:24px; height:24px; border-bottom:2px solid var(--accent); border-right:2px solid var(--accent);"></div>

                <!-- Header -->
                <div style="margin-bottom: 20px;">
                    <div style="display:inline-flex; align-items:center; gap:8px; font-size:1.2rem; font-weight:800; color:var(--accent); letter-spacing:2px; text-transform:uppercase;">
                        🌱 EcoLife Sustainability Council
                    </div>
                    <h2 style="font-size: 2.2rem; font-weight: 900; margin-top: 10px; font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #00FF88 0%, #00D4FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        OFFICIAL CERTIFICATE OF IMPACT
                    </h2>
                    <p style="font-size: 0.85rem; color: #8A8A8A; letter-spacing: 1px;">VERIFIED PLANETARY CONTRIBUTION CREDENTIAL</p>
                </div>

                <!-- Recipient -->
                <div style="margin: 28px 0;">
                    <p style="font-size: 0.95rem; color: #CCCCCC; margin-bottom: 6px;">This certificate is proudly awarded to</p>
                    <div style="font-size: 2.4rem; font-weight: 800; color: #FFFFFF; border-bottom: 1px stroke rgba(255,255,255,0.2); display: inline-block; padding: 0 20px 6px;">
                        ${escapeHtml(user.displayName)}
                    </div>
                </div>

                <!-- Body Text -->
                <p style="max-width: 580px; margin: 0 auto 24px; font-size: 0.95rem; color: #A0A0A0; line-height: 1.6;">
                    For outstanding dedication to sustainable living, habit formation, and carbon footprint reduction on the <strong>EcoLife Platform</strong>.
                </p>

                <!-- Stats Grid -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 24px 0; background: rgba(0,0,0,0.3); padding: 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);">
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: var(--accent);">${score.toLocaleString()}</div>
                        <div style="font-size: 0.75rem; color: #888;">GREEN SCORE (LVL ${level})</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #00D4FF;">${co2} kg</div>
                        <div style="font-size: 0.75rem; color: #888;">CO₂ OFFSET</div>
                    </div>
                    <div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #FFB800;">${trees} Tree${trees !== 1 ? 's' : ''}</div>
                        <div style="font-size: 0.75rem; color: #888;">COMMUNITY IMPACT</div>
                    </div>
                </div>

                <!-- Footer Signatures & Stamp -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; padding-top: 16px; border-top: 1px stroke rgba(255,255,255,0.1);">
                    <div style="text-align: left;">
                        <div style="font-size: 0.75rem; color: #777;">ISSUED ON</div>
                        <div style="font-size: 0.85rem; font-weight: 600; color: #DDD;">${issueDate}</div>
                        <div style="font-size: 0.7rem; color: var(--accent); margin-top: 2px;">VERIFIED ID: ${certId}</div>
                    </div>

                    <!-- Seal Badge -->
                    <div style="width: 70px; height: 70px; border-radius: 50%; background: linear-gradient(135deg, #FFD700, #FFA500); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #000; box-shadow: 0 0 15px rgba(255,215,0,0.5);">
                        <span style="font-size: 1.4rem;">🏅</span>
                        <span style="font-size: 0.55rem; font-weight: 900; letter-spacing: 0.5px;">VERIFIED</span>
                    </div>

                    <div style="text-align: right;">
                        <div style="font-size: 1rem; font-family: 'Brush Script MT', cursive, sans-serif; color: var(--accent);">EcoBuddy AI</div>
                        <div style="font-size: 0.75rem; color: #777; border-top: 1px stroke #444; padding-top: 2px;">EcoLife Verification Officer</div>
                    </div>
                </div>
            </div>

            <!-- Actions Bar -->
            <div style="display: flex; gap: 12px; margin-top: 20px; justify-content: flex-end;">
                <button class="btn btn--secondary" id="closeCertBtn">Close</button>
                <button class="btn btn--primary" id="printCertBtn">🖨️ Print / Save PDF Certificate</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector('#closeCertModal').addEventListener('click', close);
    overlay.querySelector('#closeCertBtn').addEventListener('click', close);
    
    overlay.querySelector('#printCertBtn').addEventListener('click', () => {
        window.print();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
