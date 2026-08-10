/* =========================================================
   EcoLife — EcoBuddy AI Engine (Rule-Based MVP)
   
   Architecture: Single entry point generateRecommendations()
   returns { missions, tips, recyclingTip }.
   This function signature is the "contract" — swap in an LLM
   API call later without changing consumers.
   ========================================================= */

import { state } from '../state.js';
import { MISSIONS, CATEGORIES, getRandomMissions } from '../data/missions.js';

/**
 * Generate personalized recommendations based on user state.
 * 
 * CONTRACT (stable interface for future LLM swap):
 * @param {Object} userState - Current user state
 * @returns {{ missions: Array, tips: Array<string>, recyclingTip: string }}
 */
export function generateRecommendations(userState = null) {
    const s = userState || state.get();
    
    return {
        missions: generateDailyMissions(s),
        tips: generateTips(s),
        recyclingTip: generateRecyclingTip(s)
    };
}

/**
 * Generate 4-5 daily missions personalized to the user.
 * Rules:
 * 1. Favor weak categories (ones with fewer completions)
 * 2. Scale difficulty based on streak
 * 3. Avoid recently completed missions (last 3 days)
 * 4. Mix categories for variety
 * 5. Time-of-day awareness
 */
function generateDailyMissions(s) {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if we already generated missions today
    if (s.dailyMissionsDate === today && s.dailyMissions?.length > 0) {
        // Return existing missions, filtering out completed ones
        const completed = (s.completedMissions || []).map(m => m.missionId);
        const remaining = s.dailyMissions.filter(m => !completed.includes(m.id));
        if (remaining.length >= 5) return remaining;
        // If fewer than 5 remain, generate fresh ones below to top up to 5+
    }

    const categoryStats = s.categoryStats || {};
    const completedMissions = s.completedMissions || [];
    const streak = s.streak?.current || 0;

    // --- 1. Find weak categories ---
    const catScores = Object.entries(categoryStats).map(([cat, data]) => ({
        category: cat,
        completed: data.completed || 0
    }));
    catScores.sort((a, b) => a.completed - b.completed);
    const weakCategories = catScores.slice(0, 2).map(c => c.category);

    // --- 2. Determine target difficulty based on streak ---
    let targetDifficulty;
    if (streak >= 30) targetDifficulty = [3, 4, 5];
    else if (streak >= 14) targetDifficulty = [2, 3, 4];
    else if (streak >= 7) targetDifficulty = [2, 3];
    else if (streak >= 3) targetDifficulty = [1, 2, 3];
    else targetDifficulty = [1, 2];

    // --- 3. Get recently completed mission IDs (last 3 days) ---
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const recentIds = completedMissions
        .filter(m => new Date(m.completedAt) > threeDaysAgo)
        .map(m => m.missionId);

    // --- 4. Build mission pool ---
    let pool = MISSIONS.filter(m => !recentIds.includes(m.id));
    if (pool.length < 5) pool = MISSIONS; // Fallback if pool is small

    // Prioritize weak categories and matching difficulty
    const scored = pool.map(m => {
        let score = 0;
        if (weakCategories.includes(m.category)) score += 3;
        if (targetDifficulty.includes(m.difficulty)) score += 2;
        // Time-based bonuses
        const hour = new Date().getHours();
        if (hour < 12 && ['transport', 'energy'].includes(m.category)) score += 1;
        if (hour >= 12 && ['food', 'water', 'waste'].includes(m.category)) score += 1;
        // Add some randomness
        score += Math.random() * 2;
        return { ...m, _score: score };
    });

    // Sort by score and pick top 5-6, ensuring category variety
    scored.sort((a, b) => b._score - a._score);

    const selected = [];
    const usedCategories = new Set();
    
    for (const mission of scored) {
        if (selected.length >= 6) break;
        selected.push(mission);
        usedCategories.add(mission.category);
    }

    // Remove internal scoring
    return selected.map(({ _score, ...m }) => m);
}

/**
 * Generate personalized eco-tips based on user behavior.
 */
function generateTips(s) {
    const tips = [];
    const streak = s.streak?.current || 0;
    const categoryStats = s.categoryStats || {};
    const co2Saved = s.co2Saved || 0;
    const totalMissions = (s.completedMissions || []).length;

    // Streak-based tips
    if (streak === 0) {
        tips.push('🌱 Start your eco-journey today! Complete your first mission to plant the seed of change.');
    } else if (streak < 7) {
        tips.push(`🔥 You're on a ${streak}-day streak! Keep going — habits form after 21 days.`);
    } else if (streak < 30) {
        tips.push(`⚡ Amazing ${streak}-day streak! You're building real habits. Try a harder mission today.`);
    } else {
        tips.push(`💎 Legendary ${streak}-day streak! You're an inspiration to the community.`);
    }

    // Category-specific tips
    const weakest = Object.entries(categoryStats)
        .sort((a, b) => (a[1].completed || 0) - (b[1].completed || 0))[0];
    
    if (weakest) {
        const catTips = {
            transport: '🚲 Try biking for short trips — it\'s exercise AND eco-friendly. Win-win!',
            waste: '♻️ Did you know? A single aluminum can takes 200 years to decompose. Recycle it and save energy!',
            energy: '💡 Switching to LED bulbs can save up to 80% energy compared to incandescent bulbs.',
            food: '🌿 Going meatless once a week can reduce your carbon footprint by up to 8%.',
            water: '💧 A dripping tap wastes up to 20,000 liters of water per year. Fix those leaks!'
        };
        if (catTips[weakest[0]]) {
            tips.push(catTips[weakest[0]]);
        }
    }

    // CO2-based tips
    if (co2Saved > 0) {
        tips.push(`🌍 You've saved ${co2Saved.toFixed(1)} kg of CO₂ — that's like planting ${(co2Saved / 22).toFixed(1)} trees!`);
    }

    // Seasonal/time tips
    const month = new Date().getMonth();
    if (month >= 3 && month <= 5) {
        tips.push('☀️ Spring is the perfect time to start a small herb garden on your windowsill!');
    } else if (month >= 6 && month <= 8) {
        tips.push('🌡️ Hot tip: air-dry your clothes in summer sun instead of using the dryer. Saves energy and smells great!');
    } else if (month >= 9 && month <= 10) {
        tips.push('🍂 Fall is compost season — those leaves are brown gold for your garden!');
    } else {
        tips.push('❄️ Winter tip: lower your thermostat by 1°C and wear a cozy sweater. Saves up to 10% on heating!');
    }

    return tips.slice(0, 3);
}

/**
 * Generate a recycling tip of the day.
 */
function generateRecyclingTip(s) {
    const tips = [
        '🥫 Rinse food containers before recycling — contaminated items often end up in landfills.',
        '🧴 Check the bottom of plastic items for the recycling number. #1 (PET) and #2 (HDPE) are most widely accepted.',
        '📦 Flatten your cardboard boxes! It saves space in recycling trucks and bins.',
        '🥤 Plastic straws are too small for recycling machines. Switch to reusable alternatives.',
        '🍕 Pizza boxes with grease? Tear off the clean top for recycling, compost the greasy bottom.',
        '🔋 Never throw batteries in regular trash! They contain toxic metals. Find a collection point.',
        '👕 Old clothes too worn to donate? Many recycling centers accept textiles for industrial rags.',
        '🫙 Glass is infinitely recyclable without quality loss. Every bottle counts!',
        '📱 E-waste is the fastest-growing waste stream. One million phones yield 35,000 lbs of copper!',
        '🛍️ Plastic bags jam recycling machines. Return them to grocery store collection bins instead.'
    ];
    
    // Use day of year as seed for consistent daily tip
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return tips[dayOfYear % tips.length];
}

/**
 * Future LLM integration point.
 * Replace this function body with an API call, keeping the same signature.
 * 
 * async function generateRecommendationsLLM(userState) {
 *     const response = await fetch('/api/ecobuddy', {
 *         method: 'POST',
 *         body: JSON.stringify({ userState }),
 *         headers: { 'Content-Type': 'application/json' }
 *     });
 *     return await response.json();
 *     // Expected: { missions: [...], tips: [...], recyclingTip: '...' }
 * }
 */
