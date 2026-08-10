/* =========================================================
   EcoLife - Landing Page View (Immersive v2)
   ========================================================= */

import { signUp, signIn, signInWithGoogle } from '../services/auth.js';
import { router } from '../router.js';
import { state } from '../state.js';
import { showToast } from '../components/toast.js';

export async function render(appContainer) {
    appContainer.innerHTML = `
        <div class="landing">
            <!-- Navigation -->
            <nav class="landing-nav" id="landingNav">
                <div class="landing-nav__logo">
                    <svg viewBox="0 0 32 32" width="32" height="32">
                        <path d="M16 2C16 2 4 12 4 20C4 26.627 9.373 32 16 32C22.627 32 28 26.627 28 20C28 12 16 2 16 2Z" fill="none" stroke="#00FF88" stroke-width="2"/>
                        <path d="M16 32V14" fill="none" stroke="#00FF88" stroke-width="1.5"/>
                        <path d="M16 22C11 17 9 13 9 13" fill="none" stroke="#00FF88" stroke-width="1.5" stroke-linecap="round"/>
                        <path d="M16 18C21 13 23 9 23 9" fill="none" stroke="#00FF88" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    Eco<span>Life</span>
                </div>
                <div class="landing-nav__actions">
                    <button class="btn btn--ghost" id="navLogin">Sign In</button>
                    <button class="btn btn--primary" id="navSignup" style="border-radius: var(--radius-full); padding: 10px 24px;">
                        Get Started &rarr;
                    </button>
                </div>
            </nav>

            <!-- Hero Section: Two Column -->
            <section class="hero">
                <div class="hero__bg">
                    <div class="hero__bg-gradient"></div>
                    <div class="hero__grid"></div>
                </div>
                <div class="hero__particles" id="heroParticles"></div>

                <!-- Left: Text Content -->
                <div class="hero__left">
                    <div class="hero__badge">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8v4l3 3"/>
                        </svg>
                        Join the Green Revolution
                    </div>
                    <h1 class="hero__title">
                        Turn Everyday Actions
                        into <span class="hero__title-accent">Planet-Saving<br>Habits</span>
                    </h1>
                    <p class="hero__subtitle">
                        EcoLife gamifies sustainability. Complete daily eco-missions, 
                        grow your living impact tree, and join a global community 
                        forest - one green choice at a time.
                    </p>
                    <div class="hero__actions">
                        <button class="btn btn--primary btn--xl" id="heroStart" style="border-radius: var(--radius-full); gap: 10px;">
                            &#127793; Start Your Journey &rarr;
                        </button>
                        <button class="btn btn--secondary btn--xl" id="heroLearn" style="border-radius: var(--radius-full);">
                            Learn More &#9654;
                        </button>
                    </div>
                    <div class="hero__social-proof">
                        <div class="hero__avatars">
                            <div class="hero__avatar hero__avatar--img">V</div>
                            <div class="hero__avatar" style="background: linear-gradient(135deg, #2A7A3B, #00FF88)">A</div>
                            <div class="hero__avatar" style="background: linear-gradient(135deg, #1A5560, #00D4FF)">R</div>
                            <div class="hero__avatar" style="background: linear-gradient(135deg, #6A2A7A, #B366FF)">S</div>
                        </div>
                        <div class="hero__social-text">
                            <strong>Join 2,300+ eco warriors</strong>
                            making a real impact &#127757;
                        </div>
                    </div>
                </div>

                <!-- Right: Glowing Earth -->
                <div class="hero__right">
                    <div class="hero__globe-wrapper">
                        <img 
                            src="assets/earth_hero.png" 
                            alt="Glowing Earth with green network connections" 
                            class="hero__globe-img"
                        />
                    </div>
                </div>
            </section>

            <!-- Stats Banner -->
            <div class="hero-stats-banner" id="statsBanner">
                <div class="hero-stat">
                    <div class="hero-stat__icon">&#127807;</div>
                    <div class="hero-stat__text">
                        <div class="hero-stat__value">12,450+</div>
                        <div class="hero-stat__label">KG CO<sub>2</sub> Saved</div>
                        <div class="hero-stat__sublabel">Reducing our carbon footprint</div>
                    </div>
                </div>
                <div class="hero-stat">
                    <div class="hero-stat__icon">&#127795;</div>
                    <div class="hero-stat__text">
                        <div class="hero-stat__value">847</div>
                        <div class="hero-stat__label">Trees Grown</div>
                        <div class="hero-stat__sublabel">Restoring the earth</div>
                    </div>
                </div>
                <div class="hero-stat">
                    <div class="hero-stat__icon">&#9851;</div>
                    <div class="hero-stat__text">
                        <div class="hero-stat__value">34,210</div>
                        <div class="hero-stat__label">Missions Completed</div>
                        <div class="hero-stat__sublabel">Small actions, big impact</div>
                    </div>
                </div>
                <div class="hero-stat">
                    <div class="hero-stat__icon">&#128101;</div>
                    <div class="hero-stat__text">
                        <div class="hero-stat__value">2,300+</div>
                        <div class="hero-stat__label">Active Eco Warriors</div>
                        <div class="hero-stat__sublabel">Our global community</div>
                    </div>
                </div>
            </div>

            <!-- Features Section -->
            <section class="features" id="featuresSection">
                <div class="features__eyebrow">
                    <div class="features__eyebrow-line"></div>
                    <span class="features__eyebrow-text">&#10022; What We Offer &#10022;</span>
                    <div class="features__eyebrow-line"></div>
                </div>
                <div class="features__header">
                    <h2 class="features__title">Smart Features. <span>Real Impact.</span></h2>
                    <p class="features__subtitle">Everything you need to turn your eco-intentions into daily habits that matter.</p>
                </div>
                <div class="features__grid">
                    <div class="feature-card">
                        <div class="feature-card__icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <rect x="2" y="3" width="20" height="14" rx="2"/>
                                <path d="M8 21h8M12 17v4"/>
                                <circle cx="9" cy="10" r="2"/><path d="M15 8l-2 4-2-2-2 3"/>
                            </svg>
                        </div>
                        <h3 class="feature-card__title">AI Waste Scanner</h3>
                        <p class="feature-card__desc">Scan any waste item and get instant classification, disposal tips, and eco impact.</p>
                        <div class="feature-card__arrow">&rarr;</div>
                    </div>
                    <div class="feature-card">
                        <div class="feature-card__icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <h3 class="feature-card__title">Eco Missions</h3>
                        <p class="feature-card__desc">Complete fun daily missions, earn points, and build better sustainable habits.</p>
                        <div class="feature-card__arrow">&rarr;</div>
                    </div>
                    <div class="feature-card">
                        <div class="feature-card__icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <path d="M12 22V8"/><path d="M5 12l7-10 7 10"/>
                                <path d="M7 17l5-7 5 7"/>
                            </svg>
                        </div>
                        <h3 class="feature-card__title">Grow Your Tree</h3>
                        <p class="feature-card__desc">Earn points to grow your virtual tree and contribute to real forests worldwide.</p>
                        <div class="feature-card__arrow">&rarr;</div>
                    </div>
                    <div class="feature-card">
                        <div class="feature-card__icon-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <line x1="18" y1="20" x2="18" y2="10"/>
                                <line x1="12" y1="20" x2="12" y2="4"/>
                                <line x1="6" y1="20" x2="6" y2="14"/>
                            </svg>
                        </div>
                        <h3 class="feature-card__title">Leaderboards</h3>
                        <p class="feature-card__desc">Compete globally, climb the rankings, and become a top eco warrior in your community.</p>
                        <div class="feature-card__arrow">&rarr;</div>
                    </div>
                </div>
            </section>

            <!-- CTA Section -->
            <section class="cta-section">
                <div class="cta-section__box">
                    <h2 class="cta-section__title">Ready to Make a Difference?</h2>
                    <p class="cta-section__text">Join thousands of eco-warriors building sustainable habits every day.</p>
                    <button class="btn btn--primary btn--xl" id="ctaStart" style="border-radius: var(--radius-full);">&#127757; Join EcoLife Free</button>
                </div>
            </section>

            <!-- Footer -->
            <footer class="landing-footer">
                <p>&copy; ${new Date().getFullYear()} EcoLife - Making sustainability a daily habit. &#127793;</p>
            </footer>

            <!-- Auth Modal -->
            <div class="modal-overlay" id="authModal">
                <div class="modal auth-modal">
                    <div class="modal__header">
                        <h3 class="modal__title" id="authModalTitle">Welcome Back</h3>
                        <button class="modal__close" id="authModalClose">&times;</button>
                    </div>
                    <div class="auth-modal__tabs">
                        <div class="tabs">
                            <button class="tab active" id="tabLogin" data-tab="login">Sign In</button>
                            <button class="tab" id="tabSignup" data-tab="signup">Sign Up</button>
                        </div>
                    </div>
                    <form class="auth-modal__form" id="authForm">
                        <div class="input-group" id="nameGroup" style="display:none">
                            <label class="input-group__label" for="authName">Display Name</label>
                            <input class="input-group__field" type="text" id="authName" placeholder="Your name" autocomplete="name">
                        </div>
                        <div class="input-group">
                            <label class="input-group__label" for="authEmail">Email</label>
                            <input class="input-group__field" type="email" id="authEmail" placeholder="you@email.com" autocomplete="email" required>
                        </div>
                        <div class="input-group">
                            <label class="input-group__label" for="authPassword">Password</label>
                            <input class="input-group__field" type="password" id="authPassword" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" autocomplete="current-password" required minlength="6">
                        </div>
                        <div class="input-group" id="confirmPasswordGroup" style="display:none">
                            <label class="input-group__label" for="authConfirmPassword">Confirm Password</label>
                            <input class="input-group__field" type="password" id="authConfirmPassword" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" autocomplete="new-password">
                        </div>
                        <div id="authError" class="input-group__error" style="display:none; margin-bottom:12px;"></div>
                        <button type="submit" class="btn btn--primary btn--full btn--lg" id="authSubmit">Sign In</button>
                    </form>
                    <div class="divider-label"><span>or</span></div>
                    <div class="auth-modal__google">
                        <button class="btn btn--full btn--lg" id="googleSignIn">
                            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- Floating leaf particles ---
    const particleContainer = document.getElementById('heroParticles');
    for (let i = 0; i < 12; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'hero__leaf';
        const size = 10 + Math.random() * 18;
        leaf.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="#00FF88" stroke-width="1.5"><path d="M12 2C12 2 4 8 4 14C4 18.418 7.582 22 12 22C16.418 22 20 18.418 20 14C20 8 12 2 12 2Z"/></svg>`;
        leaf.style.left = (Math.random() * 100) + '%';
        leaf.style.animationDuration = (10 + Math.random() * 14) + 's';
        leaf.style.animationDelay = (Math.random() * 12) + 's';
        particleContainer.appendChild(leaf);
    }

    // --- Scroll effect for nav ---
    const nav = document.getElementById('landingNav');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);

    // --- Smooth scroll links ---
    // (Nav links removed)

    // --- Auth Modal Logic ---
    const modal = document.getElementById('authModal');
    let authMode = 'login';

    function openModal(mode = 'login') {
        authMode = mode;
        modal.classList.add('active');
        updateAuthUI();
        document.getElementById('authEmail').focus();
    }

    function closeModal() {
        modal.classList.remove('active');
        document.getElementById('authError').style.display = 'none';
    }

    function updateAuthUI() {
        const isSignup = authMode === 'signup';
        document.getElementById('authModalTitle').textContent = isSignup ? 'Create Account' : 'Welcome Back';
        document.getElementById('nameGroup').style.display = isSignup ? 'block' : 'none';
        const confirmGroup = document.getElementById('confirmPasswordGroup');
        const confirmInput = document.getElementById('authConfirmPassword');
        if (isSignup) {
            confirmGroup.style.display = 'block';
            confirmInput.setAttribute('required', 'required');
            confirmInput.setAttribute('minlength', '6');
        } else {
            confirmGroup.style.display = 'none';
            confirmInput.removeAttribute('required');
            confirmInput.removeAttribute('minlength');
            confirmInput.value = '';
        }
        document.getElementById('authSubmit').textContent = isSignup ? 'Create Account' : 'Sign In';
        document.getElementById('tabLogin').classList.toggle('active', !isSignup);
        document.getElementById('tabSignup').classList.toggle('active', isSignup);
    }

    document.getElementById('navLogin').addEventListener('click', () => openModal('login'));
    document.getElementById('navSignup').addEventListener('click', () => openModal('signup'));
    document.getElementById('heroStart').addEventListener('click', () => openModal('signup'));
    document.getElementById('ctaStart').addEventListener('click', () => openModal('signup'));
    document.getElementById('authModalClose').addEventListener('click', closeModal);
    document.getElementById('heroLearn').addEventListener('click', () => {
        document.getElementById('featuresSection').scrollIntoView({ behavior: 'smooth' });
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.getElementById('tabLogin').addEventListener('click', () => { authMode = 'login'; updateAuthUI(); });
    document.getElementById('tabSignup').addEventListener('click', () => { authMode = 'signup'; updateAuthUI(); });

    document.getElementById('authForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorEl = document.getElementById('authError');
        const submitBtn = document.getElementById('authSubmit');
        const email = document.getElementById('authEmail').value.trim();
        const password = document.getElementById('authPassword').value;
        const name = document.getElementById('authName').value.trim();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Please wait...';
        errorEl.style.display = 'none';

        let result;
        if (authMode === 'signup') {
            const confirmPassword = document.getElementById('authConfirmPassword').value;
            if (password !== confirmPassword) {
                errorEl.textContent = 'Passwords do not match.';
                errorEl.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Account';
                return;
            }
            result = await signUp(email, password, name);
        } else {
            result = await signIn(email, password);
        }

        if (result.success) {
            closeModal();
            router.navigate('/dashboard');
            if (result.offline) {
                showToast({ title: 'Offline Sign In', message: 'Firebase offline. Using offline developer mode.', type: 'info' });
            }
        } else {
            errorEl.textContent = result.error;
            errorEl.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = authMode === 'signup' ? 'Create Account' : 'Sign In';
        }
    });

    document.getElementById('googleSignIn').addEventListener('click', async () => {
        const result = await signInWithGoogle();
        if (result.success) {
            closeModal();
            router.navigate('/dashboard');
            if (result.offline) {
                showToast({ title: 'Offline Sign In', message: 'Google Sign-In using offline developer mode.', type: 'info' });
            }
        } else {
            showToast({ title: 'Sign In Failed', message: result.error || 'Check your Firebase configuration.', type: 'danger' });
        }
    });

    return {
        cleanup: () => {
            window.removeEventListener('scroll', onScroll);
        }
    };
}