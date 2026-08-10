/* =========================================================
   EcoLife — Carbon Calculator View
   ========================================================= */

import { state } from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { calculateCarbonReport } from '../engines/carbonCalc.js';
import { createBreakdownChart } from '../components/charts.js';

export async function render(appContainer) {
    const report = calculateCarbonReport();

    appContainer.innerHTML = `
        <div class="app-layout">
            <div id="navContainer"></div>
            <main class="app-main">
                <div class="app-content">
                    <div class="calculator">
                        <div class="page-header">
                            <h1 class="page-title"><span class="page-title__emoji emoji">📊</span>Carbon Reduction Calculator</h1>
                            <p class="page-subtitle">Track your environmental footprint reduction and calculate your personal baseline.</p>
                        </div>

                        <!-- Baseline Estimator Wizard Card -->
                        <div class="baseline-wizard" id="baselineWizardCard">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-md);">
                                <h3 style="font-size:1.1rem; font-weight:700; color:var(--accent);">📋 Personal Baseline Carbon Estimator</h3>
                                <span class="chip chip--green" id="wizardStepTag">Step 1 of 4</span>
                            </div>

                            <div class="wizard-steps">
                                <div class="wizard-step-dot active" id="dot1">1</div>
                                <div class="wizard-step-dot" id="dot2">2</div>
                                <div class="wizard-step-dot" id="dot3">3</div>
                                <div class="wizard-step-dot" id="dot4">4</div>
                            </div>

                            <div id="wizardStepBody">
                                <!-- Step 1: Transport -->
                                <div id="step1" class="wizard-step-panel">
                                    <h4 style="font-size:var(--font-sm); margin-bottom:4px;">1. Primary Mode of Daily Transport</h4>
                                    <p style="font-size:var(--font-xs); color:var(--text-secondary);">How do you usually commute or travel daily?</p>
                                    <div class="wizard-option-grid">
                                        <button class="wizard-option-card" data-step="1" data-val="3.2">🚗 Gasoline Car (Single Occupant)</button>
                                        <button class="wizard-option-card" data-step="1" data-val="1.5">🚌 Public Transit (Bus / Metro)</button>
                                        <button class="wizard-option-card" data-step="1" data-val="0.4">🚴 Electric Vehicle / Bicycle / Walk</button>
                                        <button class="wizard-option-card" data-step="1" data-val="0.2">🏠 Work From Home (No Commute)</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Summary Cards -->
                        <div class="calculator__summary">
                            <div class="calc-summary-card glass-card">
                                <div class="calc-summary-card__icon">🌿</div>
                                <div class="calc-summary-card__value calc-summary-card__value--green">
                                    <span class="animated-counter">${report.totalKgSaved.toFixed(1)}</span>
                                    <span class="calc-summary-card__unit">kg</span>
                                </div>
                                <div class="calc-summary-card__label">Total CO₂ Saved</div>
                            </div>

                            <div class="calc-summary-card glass-card">
                                <div class="calc-summary-card__icon">📅</div>
                                <div class="calc-summary-card__value calc-summary-card__value--blue">
                                    <span>${report.dailyAvgKg}</span>
                                    <span class="calc-summary-card__unit">kg/day</span>
                                </div>
                                <div class="calc-summary-card__label">Daily Average Savings</div>
                            </div>

                            <div class="calc-summary-card glass-card">
                                <div class="calc-summary-card__icon">🎯</div>
                                <div class="calc-summary-card__value calc-summary-card__value--gold">
                                    <span>${report.annualProjectionTonnes}</span>
                                    <span class="calc-summary-card__unit">tonnes/yr</span>
                                </div>
                                <div class="calc-summary-card__label">Projected Annual Savings</div>
                            </div>
                        </div>

                        <!-- Main Grid -->
                        <div class="calculator__grid">
                            <!-- Comparison with Baselines -->
                            <div class="comparison glass-card">
                                <h3 class="comparison__title">Footprint Comparison</h3>
                                <p style="font-size:var(--font-xs); color:var(--text-secondary); margin-bottom:var(--space-lg);">
                                    Your projected annual reduction relative to average per-capita footprints.
                                </p>

                                <div class="comparison__bar-group">
                                    <div class="comparison__bar-label">
                                        <span class="comparison__bar-name">Your Annual Reduction</span>
                                        <span class="comparison__bar-value glow-text">${report.annualProjectionTonnes} tonnes</span>
                                    </div>
                                    <div class="comparison__bar">
                                        <div class="comparison__bar-fill comparison__bar-fill--you" style="width: ${Math.min(100, (report.annualProjectionTonnes / 4.7) * 100)}%;"></div>
                                    </div>
                                </div>

                                <div class="comparison__bar-group">
                                    <div class="comparison__bar-label">
                                        <span class="comparison__bar-name">India Average Footprint</span>
                                        <span class="comparison__bar-value" style="color:#FFB800">2.2 tonnes/year</span>
                                    </div>
                                    <div class="comparison__bar">
                                        <div class="comparison__bar-fill comparison__bar-fill--india" style="width: ${(2.2 / 4.7) * 100}%;"></div>
                                    </div>
                                </div>

                                <div class="comparison__bar-group">
                                    <div class="comparison__bar-label">
                                        <span class="comparison__bar-name">World Average Footprint</span>
                                        <span class="comparison__bar-value" style="color:#FF4D4D">4.7 tonnes/year</span>
                                    </div>
                                    <div class="comparison__bar">
                                        <div class="comparison__bar-fill comparison__bar-fill--world" style="width: 100%;"></div>
                                    </div>
                                </div>

                                <div style="margin-top: var(--space-lg); padding: var(--space-md); background: var(--bg-elevated); border-radius: var(--radius-md); font-size: var(--font-xs); color: var(--text-secondary); line-height: 1.5;">
                                    💡 <strong>Context:</strong> India's average per-capita carbon footprint is ~2.2 tonnes CO₂/year. By completing eco-missions, you are actively offsetting <strong>${report.vsIndia}%</strong> of an average Indian citizen's yearly footprint!
                                </div>
                            </div>

                            <!-- Category Breakdown Chart -->
                            <div class="breakdown glass-card">
                                <h3 class="breakdown__title">Savings by Category</h3>
                                <div class="breakdown__chart-container">
                                    <canvas id="calcBreakdownChart"></canvas>
                                </div>
                                <div class="breakdown__legend">
                                    <div class="breakdown__legend-item"><span class="breakdown__legend-dot" style="background:#4DA6FF"></span>Transport</div>
                                    <div class="breakdown__legend-item"><span class="breakdown__legend-dot" style="background:#00FF88"></span>Waste</div>
                                    <div class="breakdown__legend-item"><span class="breakdown__legend-dot" style="background:#FFB800"></span>Energy</div>
                                    <div class="breakdown__legend-item"><span class="breakdown__legend-dot" style="background:#FF6B9D"></span>Food</div>
                                    <div class="breakdown__legend-item"><span class="breakdown__legend-dot" style="background:#00D4FF"></span>Water</div>
                                </div>
                            </div>
                        </div>

                        <!-- Fun Equivalencies -->
                        <div class="equivalencies glass-card">
                            <h3 class="equivalencies__title">Real-World Impact</h3>
                            <div class="equivalencies__grid">
                                ${report.equivalencies.map(eq => `
                                    <div class="equivalency-card">
                                        <div class="equivalency-card__icon">${eq.emoji}</div>
                                        <div class="equivalency-card__text">${eq.text}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    `;

    renderNavbar(document.getElementById('navContainer'));

    // --- Interactive Baseline Wizard Logic ---
    const wizardBody = document.getElementById('wizardStepBody');
    const wizardTag = document.getElementById('wizardStepTag');
    let wizardAnswers = { transport: 1.5, diet: 1.8, energy: 1.2, waste: 0.5 };
    let currentStep = 1;

    const wizardStepsData = [
        {
            title: "1. Primary Mode of Daily Transport",
            subtitle: "How do you usually commute or travel daily?",
            options: [
                { label: "🚗 Gasoline Car (Single Occupant)", val: 3.2 },
                { label: "🚌 Public Transit (Bus / Metro)", val: 1.5 },
                { label: "🚴 Electric Vehicle / Bicycle / Walk", val: 0.4 },
                { label: "🏠 Work From Home (No Commute)", val: 0.2 }
            ]
        },
        {
            title: "2. Dietary Preference",
            subtitle: "What best describes your average weekly diet?",
            options: [
                { label: "🥩 High Meat / Beef Lover", val: 2.8 },
                { label: "🍗 Moderate / Balanced Omnivore", val: 1.8 },
                { label: "🥗 Vegetarian (Dairy/Eggs)", val: 1.1 },
                { label: "🌱 Fully Plant-Based / Vegan", val: 0.7 }
            ]
        },
        {
            title: "3. Household Energy Usage",
            subtitle: "What is your home heating, AC, and appliance usage?",
            options: [
                { label: "⚡ High AC / Heating & Constant Standby", val: 2.5 },
                { label: "💡 Average Household Energy Use", val: 1.4 },
                { label: "🍃 Energy Efficient / Cold Wash / LEDs", val: 0.8 },
                { label: "☀️ Rooftop Solar / Net Zero Home", val: 0.3 }
            ]
        },
        {
            title: "4. Consumption & Waste Habits",
            subtitle: "How much single-use plastic & packaging do you use?",
            options: [
                { label: "📦 Regular Takeout & Bottled Water", val: 1.2 },
                { label: "♻️ Moderate Recycler", val: 0.6 },
                { label: "🪱 Active Composter & Zero Waste Food", val: 0.3 },
                { label: "🛍️ Plastic-Free & Bulk Buyer", val: 0.1 }
            ]
        }
    ];

    wizardBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.wizard-option-card');
        if (!btn) return;

        const val = parseFloat(btn.dataset.val);
        if (currentStep === 1) wizardAnswers.transport = val;
        if (currentStep === 2) wizardAnswers.diet = val;
        if (currentStep === 3) wizardAnswers.energy = val;
        if (currentStep === 4) wizardAnswers.waste = val;

        if (currentStep < 4) {
            currentStep++;
            renderWizardStep();
        } else {
            renderWizardResult();
        }
    });

    function renderWizardStep() {
        const data = wizardStepsData[currentStep - 1];
        wizardTag.textContent = `Step ${currentStep} of 4`;
        
        for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`dot${i}`);
            if (dot) {
                dot.classList.toggle('completed', i < currentStep);
                dot.classList.toggle('active', i === currentStep);
            }
        }

        wizardBody.innerHTML = `
            <div class="wizard-step-panel fade-slide-up">
                <h4 style="font-size:var(--font-sm); margin-bottom:4px;">${data.title}</h4>
                <p style="font-size:var(--font-xs); color:var(--text-secondary);">${data.subtitle}</p>
                <div class="wizard-option-grid">
                    ${data.options.map(opt => `
                        <button class="wizard-option-card" data-step="${currentStep}" data-val="${opt.val}">${opt.label}</button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    function renderWizardResult() {
        const totalEstimatedBaseline = (wizardAnswers.transport + wizardAnswers.diet + wizardAnswers.energy + wizardAnswers.waste).toFixed(2);
        wizardTag.textContent = "Result Calculated!";
        
        for (let i = 1; i <= 4; i++) {
            const dot = document.getElementById(`dot${i}`);
            if (dot) dot.classList.add('completed');
        }

        wizardBody.innerHTML = `
            <div class="fade-slide-up" style="text-align:center; padding:var(--space-lg) 0;">
                <div style="font-size:2.5rem; margin-bottom:8px;">🎯</div>
                <h4 style="font-size:var(--font-md); font-weight:700; color:var(--accent);">Your Estimated Starting Carbon Footprint</h4>
                <div style="font-size:2.4rem; font-weight:900; color:#FFF; margin:8px 0;">
                    ${totalEstimatedBaseline} <span style="font-size:1rem; color:var(--text-muted); font-weight:400;">tonnes CO₂e / year</span>
                </div>
                <p style="font-size:var(--font-xs); color:var(--text-secondary); max-width:480px; margin:0 auto var(--space-md);">
                    By completing daily missions on EcoLife, you are projected to reduce this by <strong>${report.annualProjectionTonnes} tonnes/yr</strong> (${((report.annualProjectionTonnes / totalEstimatedBaseline) * 100).toFixed(1)}% footprint reduction)!
                </p>
                <button class="btn btn--secondary btn--sm" id="recalcWizardBtn">🔄 Recalculate Baseline</button>
            </div>
        `;

        document.getElementById('recalcWizardBtn').addEventListener('click', () => {
            currentStep = 1;
            renderWizardStep();
        });
    }

    // Create doughnut chart
    let chart = null;
    setTimeout(() => {
        chart = createBreakdownChart('calcBreakdownChart', report.breakdown);
    }, 100);

    const loader = document.getElementById('appLoader');
    if (loader) loader.classList.add('hidden');

    return {
        cleanup: () => {
            if (chart) chart.destroy();
        }
    };
}

