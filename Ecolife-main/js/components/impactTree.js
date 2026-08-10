/* =========================================================
   EcoLife — Living Impact Tree (SVG Component)
   ========================================================= */

import { state } from '../state.js';
import { getTreeStage, getActiveStreak } from '../engines/greenScore.js';

/**
 * Render the SVG Impact Tree. Growth stage based on Green Score.
 * @param {HTMLElement} container 
 * @param {Object} [options]
 * @returns {Object} { update, cleanup }
 */
export function renderImpactTree(container, options = {}) {
    const { compact = false } = options;
    const score = state.get('greenScore') || 0;
    const activeStreakObj = getActiveStreak();
    const streak = activeStreakObj.current;
    const stage = getTreeStage(score);
    
    const isWilting = streak === 0 && score > 0 && activeStreakObj.lastActiveDate !== new Date().toISOString().split('T')[0];
    const hour = new Date().getHours();
    const isNight = hour >= 20 || hour < 6;
    
    const width = compact ? 200 : 400;
    const height = compact ? 220 : 440;
    
    const svgNS = 'http://www.w3.org/2000/svg';
    
    const wrapper = document.createElement('div');
    wrapper.className = 'impact-tree-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.width = width + 'px';
    wrapper.style.height = height + 'px';
    wrapper.style.margin = '0 auto';
    
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.classList.add('impact-tree');
    if (streak >= 7) svg.classList.add('impact-tree--glowing');
    if (isWilting) svg.classList.add('impact-tree--wilting');
    
    // SVG Gradients & Definitions
    const defs = document.createElementNS(svgNS, 'defs');
    defs.innerHTML = `
        <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#4A3510" />
            <stop offset="40%" stop-color="#8B6914" />
            <stop offset="100%" stop-color="#3A280B" />
        </linearGradient>
        <linearGradient id="leafGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#7DFFB5" />
            <stop offset="60%" stop-color="#00FF88" />
            <stop offset="100%" stop-color="#00AA55" />
        </linearGradient>
        <linearGradient id="leafGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#00F0FF" />
            <stop offset="100%" stop-color="#00E676" />
        </linearGradient>
        <radialGradient id="treeAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(0, 255, 136, 0.25)" />
            <stop offset="100%" stop-color="rgba(0, 255, 136, 0)" />
        </radialGradient>
    `;
    svg.appendChild(defs);

    // Ground
    const ground = createGround(svgNS, width, height);
    svg.appendChild(ground);
    
    // Draw tree based on stage
    const treeGroup = document.createElementNS(svgNS, 'g');
    treeGroup.setAttribute('transform', `translate(${width/2}, ${height - 40})`);
    
    drawTree(svgNS, treeGroup, stage.stage, isWilting, compact);
    svg.appendChild(treeGroup);
    
    wrapper.appendChild(svg);
    
    // Add particles
    if (stage.stage >= 3 && !compact) {
        addParticles(wrapper, stage.stage, isNight, width, height);
    }
    
    container.innerHTML = '';
    container.appendChild(wrapper);
    
    // Subscribe to score changes
    const unsub = state.subscribe('greenScore', (newScore) => {
        const newStage = getTreeStage(newScore);
        if (newStage.stage !== stage.stage) {
            // Re-render on stage change with flash
            const flash = document.createElement('div');
            flash.className = 'tree-grow-flash';
            wrapper.appendChild(flash);
            setTimeout(() => renderImpactTree(container, options), 1000);
        }
    });
    
    return {
        update: () => renderImpactTree(container, options),
        cleanup: () => unsub()
    };
}

function createGround(svgNS, width, height) {
    const g = document.createElementNS(svgNS, 'g');
    
    // Grass line
    const grass = document.createElementNS(svgNS, 'ellipse');
    grass.setAttribute('cx', width / 2);
    grass.setAttribute('cy', height - 35);
    grass.setAttribute('rx', width * 0.35);
    grass.setAttribute('ry', 8);
    grass.setAttribute('fill', 'rgba(0, 255, 136, 0.08)');
    g.appendChild(grass);
    
    // Ground line
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', width * 0.15);
    line.setAttribute('y1', height - 35);
    line.setAttribute('x2', width * 0.85);
    line.setAttribute('y2', height - 35);
    line.setAttribute('stroke', 'rgba(0, 255, 136, 0.15)');
    line.setAttribute('stroke-width', '1');
    g.appendChild(line);
    
    return g;
}

function drawTree(svgNS, group, stage, isWilting, compact) {
    const scale = compact ? 0.5 : 1;
    const leafColor = isWilting ? '#CC9933' : 'url(#leafGradGreen)';
    const leafColorDim = isWilting ? '#AA7722' : 'url(#leafGradEmerald)';
    const trunkColor = 'url(#trunkGrad)';
    const trunkColorDark = '#3A280B';
    
    switch (stage) {
        case 1: drawSeed(svgNS, group, scale, isWilting ? '#CC9933' : '#00FF88'); break;
        case 2: drawSapling(svgNS, group, scale, leafColor, leafColorDim, trunkColor); break;
        case 3: drawYoungTree(svgNS, group, scale, leafColor, leafColorDim, trunkColor, trunkColorDark); break;
        case 4: drawMatureTree(svgNS, group, scale, leafColor, leafColorDim, trunkColor, trunkColorDark); break;
        case 5: drawAncientTree(svgNS, group, scale, leafColor, leafColorDim, trunkColor, trunkColorDark); break;
    }
}

function drawSeed(svgNS, group, scale, color) {
    // Small sprout
    const stem = createPath(svgNS, 'M0,0 Q0,-30 0,-50', 'none', color, 2 * scale);
    stem.style.animation = 'branchGrow 1.5s ease forwards';
    group.appendChild(stem);
    
    // Two tiny leaves
    const leaf1 = createPath(svgNS, 'M0,-45 Q-15,-55 -8,-65 Q0,-55 0,-45', color, 'none', 0);
    leaf1.setAttribute('opacity', '0.8');
    leaf1.style.animation = 'leafAppear 0.8s ease 0.5s forwards';
    leaf1.style.opacity = '0';
    group.appendChild(leaf1);
    
    const leaf2 = createPath(svgNS, 'M0,-40 Q15,-50 8,-60 Q0,-50 0,-40', color, 'none', 0);
    leaf2.setAttribute('opacity', '0.8');
    leaf2.style.animation = 'leafAppear 0.8s ease 0.7s forwards';
    leaf2.style.opacity = '0';
    group.appendChild(leaf2);
}

function drawSapling(svgNS, group, scale, color, colorDim, trunk) {
    // Thin trunk
    const trunkPath = createPath(svgNS, 'M0,0 Q-2,-40 0,-90', 'none', trunk, 4 * scale);
    trunkPath.style.animation = 'branchGrow 1s ease forwards';
    group.appendChild(trunkPath);
    
    // Branches
    const branches = [
        { d: 'M0,-50 Q-25,-60 -30,-75', delay: 0.3 },
        { d: 'M0,-65 Q20,-70 28,-82', delay: 0.5 },
        { d: 'M0,-80 Q-15,-85 -20,-95', delay: 0.7 },
    ];
    
    branches.forEach(b => {
        const branch = createPath(svgNS, b.d, 'none', trunk, 2 * scale);
        branch.style.animation = `branchGrow 1s ease ${b.delay}s forwards`;
        branch.style.opacity = '0';
        group.appendChild(branch);
    });
    
    // Leaves
    const leaves = [
        { x: -30, y: -75, s: 8 }, { x: 28, y: -82, s: 9 },
        { x: -20, y: -95, s: 7 }, { x: 0, y: -90, s: 10 },
        { x: -15, y: -60, s: 6 }, { x: 15, y: -75, s: 7 },
        { x: -10, y: -85, s: 8 }, { x: 5, y: -95, s: 6 }
    ];
    
    leaves.forEach((l, i) => {
        const leaf = createLeaf(svgNS, l.x * scale, l.y * scale, l.s * scale, i % 2 === 0 ? color : colorDim);
        leaf.style.animation = `leafAppear 0.8s ease ${0.8 + i * 0.1}s forwards`;
        leaf.style.opacity = '0';
        group.appendChild(leaf);
    });
}

function drawYoungTree(svgNS, group, scale, color, colorDim, trunk, trunkDark) {
    // Thicker trunk
    const trunkPath = createPath(svgNS, 'M-4,0 Q-5,-50 -3,-120 L3,-120 Q5,-50 4,0 Z', trunk, trunkDark, 1);
    group.appendChild(trunkPath);
    
    // Main branches
    const branches = [
        'M0,-60 Q-35,-70 -50,-90', 'M0,-60 Q35,-65 45,-85',
        'M0,-80 Q-30,-90 -40,-110', 'M0,-85 Q25,-90 35,-108',
        'M0,-100 Q-20,-105 -28,-118', 'M0,-105 Q15,-108 22,-120',
        'M0,-115 Q-10,-120 -15,-130', 'M0,-118 Q10,-122 12,-132'
    ];
    
    branches.forEach((d, i) => {
        const b = createPath(svgNS, d, 'none', trunk, (3 - i * 0.2) * scale);
        b.style.animation = `branchGrow 1s ease ${i * 0.1}s forwards`;
        b.style.opacity = '0';
        group.appendChild(b);
    });
    
    // Canopy leaves
    for (let i = 0; i < 25; i++) {
        const angle = (i / 25) * Math.PI * 2;
        const radius = 30 + Math.random() * 40;
        const x = Math.cos(angle) * radius * scale;
        const y = (-100 + Math.sin(angle) * radius * 0.6) * scale;
        const size = (6 + Math.random() * 6) * scale;
        const c = Math.random() > 0.5 ? color : colorDim;
        
        const leaf = createLeaf(svgNS, x, y, size, c);
        leaf.style.animation = `leafAppear 0.6s ease ${0.5 + i * 0.05}s forwards`;
        leaf.style.opacity = '0';
        group.appendChild(leaf);
    }
}

function drawMatureTree(svgNS, group, scale, color, colorDim, trunk, trunkDark) {
    // Thick trunk
    const trunkPath = createPath(svgNS, 'M-7,0 Q-8,-40 -6,-60 Q-7,-80 -5,-130 L5,-130 Q7,-80 6,-60 Q8,-40 7,0 Z', trunk, trunkDark, 1);
    group.appendChild(trunkPath);
    
    // Roots
    const roots = ['M-7,0 Q-20,5 -30,2', 'M7,0 Q20,5 28,3', 'M-4,0 Q-15,8 -22,5'];
    roots.forEach(d => {
        group.appendChild(createPath(svgNS, d, 'none', trunk, 2 * scale));
    });
    
    // Major branches
    const majorBranches = [
        'M0,-60 Q-45,-70 -65,-100', 'M0,-60 Q45,-65 60,-95',
        'M0,-80 Q-40,-95 -55,-120', 'M0,-85 Q40,-95 50,-118',
        'M0,-100 Q-30,-110 -40,-130', 'M0,-105 Q28,-112 35,-132',
        'M0,-120 Q-18,-125 -25,-140', 'M0,-125 Q15,-130 20,-142'
    ];
    
    majorBranches.forEach((d, i) => {
        const b = createPath(svgNS, d, 'none', trunk, (4 - i * 0.3) * scale);
        b.style.animation = `branchGrow 0.8s ease ${i * 0.08}s forwards`;
        b.style.opacity = '0';
        group.appendChild(b);
    });
    
    // Dense canopy
    for (let i = 0; i < 50; i++) {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 35 + Math.random() * 55;
        const x = Math.cos(angle) * radius * scale;
        const y = (-115 + Math.sin(angle) * radius * 0.5) * scale;
        const size = (5 + Math.random() * 8) * scale;
        const c = i % 3 === 0 ? '#00E676' : (i % 2 === 0 ? color : colorDim);
        
        const leaf = createLeaf(svgNS, x, y, size, c);
        leaf.style.animation = `leafAppear 0.5s ease ${0.3 + i * 0.03}s forwards`;
        leaf.style.opacity = '0';
        group.appendChild(leaf);
    }
    
    // Flowers
    for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 30 + Math.random() * 40;
        const x = Math.cos(angle) * r * scale;
        const y = (-115 + Math.sin(angle) * r * 0.4) * scale;
        const flower = createFlower(svgNS, x, y, 4 * scale);
        flower.style.animation = `leafAppear 0.5s ease ${1.5 + i * 0.1}s forwards`;
        flower.style.opacity = '0';
        group.appendChild(flower);
    }
}

function drawAncientTree(svgNS, group, scale, color, colorDim, trunk, trunkDark) {
    // Massive trunk
    const trunkPath = createPath(svgNS, 'M-10,0 Q-12,-30 -10,-60 Q-12,-90 -8,-140 L8,-140 Q12,-90 10,-60 Q12,-30 10,0 Z', trunk, trunkDark, 1.5);
    group.appendChild(trunkPath);
    
    // Deep roots
    const roots = ['M-10,0 Q-30,8 -45,3', 'M10,0 Q30,8 42,4', 'M-5,0 Q-20,12 -35,8', 'M5,0 Q22,10 38,6'];
    roots.forEach(d => group.appendChild(createPath(svgNS, d, 'none', trunk, 3 * scale)));
    
    // Massive branch network
    const branches = [
        'M0,-60 Q-55,-75 -80,-110', 'M0,-60 Q55,-70 75,-105',
        'M0,-80 Q-50,-100 -70,-130', 'M0,-85 Q50,-100 65,-128',
        'M0,-100 Q-40,-115 -55,-140', 'M0,-105 Q38,-118 50,-142',
        'M0,-120 Q-28,-130 -38,-150', 'M0,-125 Q25,-135 32,-152',
        'M0,-135 Q-15,-140 -20,-155', 'M0,-138 Q12,-142 16,-156'
    ];
    
    branches.forEach((d, i) => {
        const b = createPath(svgNS, d, 'none', trunk, (5 - i * 0.3) * scale);
        b.style.animation = `branchGrow 0.6s ease ${i * 0.06}s forwards`;
        b.style.opacity = '0';
        group.appendChild(b);
    });
    
    // Massive canopy with glow
    for (let i = 0; i < 80; i++) {
        const angle = (i / 80) * Math.PI * 2;
        const radius = 40 + Math.random() * 70;
        const x = Math.cos(angle) * radius * scale;
        const y = (-130 + Math.sin(angle) * radius * 0.45) * scale;
        const size = (5 + Math.random() * 10) * scale;
        const colors = [color, colorDim, '#00E676', '#7DFFB5', '#00D4FF'];
        const c = colors[Math.floor(Math.random() * colors.length)];
        
        const leaf = createLeaf(svgNS, x, y, size, c);
        leaf.style.animation = `leafAppear 0.4s ease ${0.2 + i * 0.02}s forwards`;
        leaf.style.opacity = '0';
        group.appendChild(leaf);
    }
    
    // Glowing aura
    const aura = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    aura.setAttribute('cx', 0);
    aura.setAttribute('cy', -120 * scale);
    aura.setAttribute('rx', 90 * scale);
    aura.setAttribute('ry', 70 * scale);
    aura.setAttribute('fill', 'none');
    aura.setAttribute('stroke', 'rgba(0, 255, 136, 0.1)');
    aura.setAttribute('stroke-width', '2');
    aura.style.animation = 'pulseGlow 3s ease-in-out infinite';
    group.appendChild(aura);
    
    // Flowers and fruits
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = 30 + Math.random() * 50;
        const x = Math.cos(angle) * r * scale;
        const y = (-130 + Math.sin(angle) * r * 0.4) * scale;
        const flower = createFlower(svgNS, x, y, 5 * scale);
        flower.style.animation = `leafAppear 0.5s ease ${1.8 + i * 0.1}s forwards`;
        flower.style.opacity = '0';
        group.appendChild(flower);
    }
}

// --- Helper functions ---
function createPath(svgNS, d, fill, stroke, strokeWidth) {
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', fill);
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', strokeWidth);
    path.setAttribute('stroke-linecap', 'round');
    return path;
}

function createLeaf(svgNS, x, y, size, color) {
    const leaf = document.createElementNS(svgNS, 'ellipse');
    leaf.setAttribute('cx', x);
    leaf.setAttribute('cy', y);
    leaf.setAttribute('rx', size);
    leaf.setAttribute('ry', size * 0.6);
    leaf.setAttribute('fill', color);
    leaf.setAttribute('opacity', '0.7');
    leaf.setAttribute('transform', `rotate(${Math.random() * 360} ${x} ${y})`);
    leaf.classList.add('tree-leaf');
    return leaf;
}

function createFlower(svgNS, x, y, size) {
    const g = document.createElementNS(svgNS, 'g');
    const colors = ['#FFD700', '#FF6B9D', '#FF9500', '#FFFFFF'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const petal = document.createElementNS(svgNS, 'ellipse');
        petal.setAttribute('cx', x + Math.cos(angle) * size * 0.6);
        petal.setAttribute('cy', y + Math.sin(angle) * size * 0.6);
        petal.setAttribute('rx', size * 0.5);
        petal.setAttribute('ry', size * 0.3);
        petal.setAttribute('fill', color);
        petal.setAttribute('opacity', '0.8');
        petal.setAttribute('transform', `rotate(${angle * 180 / Math.PI} ${x + Math.cos(angle) * size * 0.6} ${y + Math.sin(angle) * size * 0.6})`);
        g.appendChild(petal);
    }
    
    // Center
    const center = document.createElementNS(svgNS, 'circle');
    center.setAttribute('cx', x);
    center.setAttribute('cy', y);
    center.setAttribute('r', size * 0.3);
    center.setAttribute('fill', '#FFD700');
    g.appendChild(center);
    
    return g;
}

function addParticles(wrapper, stage, isNight, width, height) {
    const count = stage >= 5 ? 12 : (stage >= 4 ? 8 : 4);
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = isNight ? 'tree-firefly' : 'tree-particle';
        particle.style.left = (20 + Math.random() * 60) + '%';
        particle.style.top = (10 + Math.random() * 50) + '%';
        particle.style.animationDelay = (Math.random() * 4) + 's';
        particle.style.animationDuration = (3 + Math.random() * 4) + 's';
        wrapper.appendChild(particle);
    }
}
