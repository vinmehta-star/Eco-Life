/* =========================================================
   EcoLife — Green Score Engine
   ========================================================= */

import { state } from '../state.js';
import { getMissionById } from '../data/missions.js';
import { checkBadgeUnlocks } from '../data/badges.js';

/** Level thresholds: Level = floor(sqrt(totalScore / 50)) + 1 */
export function getLevel(totalScore) {
    return Math.floor(Math.sqrt(totalScore / 50)) + 1;
}

/** Get progress to next level (0-100) */
export function getLevelProgress(totalScore) {
    const currentLevel = getLevel(totalScore);
    const currentLevelMin = Math.pow(currentLevel - 1, 2) * 50;
    const nextLevelMin = Math.pow(currentLevel, 2) * 50;
    const range = nextLevelMin - currentLevelMin;
    const progress = totalScore - currentLevelMin;
    return Math.min(100, (progress / range) * 100);
}

/** Get level title */
export function getLevelTitle(level) {
    const titles = [
        'Seedling',       // 1
        'Sprout',         // 2
        'Sapling',        // 3
        'Green Scout',    // 4
        'Eco Ranger',     // 5
        'Nature Knight',  // 6
        'Forest Guardian',// 7
        'Earth Sage',     // 8
        'Planet Champion', // 9
        'Eco Legend'      // 10+
    ];
    return titles[Math.min(level - 1, titles.length - 1)];
}

/** Calculate streak multiplier */
export function getStreakMultiplier(streakDays) {
    return Math.min(2, 1 + (streakDays * 0.1));
}

/** 
 * Complete a mission — updates score, streak, stats, checks badges.
 * Returns { points, bonusPoints, newLevel, newBadges, co2Saved }
 */
export function completeMission(missionId) {
    const mission = getMissionById(missionId);
    if (!mission) {
        console.error('[GreenScore] Mission not found:', missionId);
        return null;
    }

    const currentState = state.get();
    const today = new Date().toISOString().split('T')[0];
    
    // --- Update streak ---
    const streak = { ...currentState.streak };
    const lastActive = streak.lastActiveDate;
    
    if (lastActive === today) {
        // Already active today — no streak change
    } else if (lastActive === getYesterday()) {
        // Consecutive day
        streak.current += 1;
    } else {
        // Streak broken or first day
        streak.current = 1;
    }
    streak.longest = Math.max(streak.longest, streak.current);
    streak.lastActiveDate = today;

    // --- Calculate points with multiplier ---
    const multiplier = getStreakMultiplier(streak.current);
    const basePoints = mission.points;
    const bonusPoints = Math.round(basePoints * (multiplier - 1));
    const totalPoints = basePoints + bonusPoints;

    // --- Update scores ---
    const newGreenScore = (currentState.greenScore || 0) + totalPoints;
    const newLevel = getLevel(newGreenScore);
    const newCO2 = parseFloat(((currentState.co2Saved || 0) + (mission.co2Saved || 0)).toFixed(2));

    // --- Update category stats ---
    const categoryStats = { ...currentState.categoryStats };
    if (categoryStats[mission.category]) {
        categoryStats[mission.category] = {
            completed: (categoryStats[mission.category].completed || 0) + 1,
            points: (categoryStats[mission.category].points || 0) + totalPoints
        };
    }

    // --- Update weekly activity ---
    const weeklyActivity = [...(currentState.weeklyActivity || [0, 0, 0, 0, 0, 0, 0])];
    const dayOfWeek = new Date().getDay(); // 0=Sun, 1=Mon...
    const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Mon=0
    weeklyActivity[dayIndex] += totalPoints;

    // --- Add to completed missions ---
    const completedMissions = [...(currentState.completedMissions || [])];
    completedMissions.push({
        missionId: mission.id,
        completedAt: new Date().toISOString(),
        points: totalPoints,
        co2Saved: mission.co2Saved || 0
    });

    // --- Remove from active missions ---
    const activeMissions = (currentState.activeMissions || []).filter(id => id !== missionId);

    // --- Apply state updates ---
    const updates = {
        greenScore: newGreenScore,
        level: newLevel,
        streak,
        co2Saved: newCO2,
        categoryStats,
        weeklyActivity,
        completedMissions,
        activeMissions
    };
    state.set(updates);

    // --- Check for new badges ---
    const updatedState = state.get();
    const newBadges = checkBadgeUnlocks(updatedState);
    if (newBadges.length > 0) {
        const allBadges = [...(updatedState.badges || []), ...newBadges.map(b => b.id)];
        state.set('badges', allBadges);
    }

    return {
        points: basePoints,
        bonusPoints,
        totalPoints,
        multiplier,
        newLevel,
        leveledUp: newLevel > (currentState.level || 1),
        newBadges,
        co2Saved: mission.co2Saved || 0,
        newGreenScore
    };
}

/** Get yesterday's date string */
function getYesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

/** Get evaluated active streak (resets to 0 if inactive for >1 day) */
export function getActiveStreak(userState = null) {
    const streak = userState?.streak || state.get('streak');
    if (!streak) return { current: 0, longest: 0, lastActiveDate: null };
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = getYesterday();
    
    // If last active date is neither today nor yesterday, streak is broken
    if (streak.lastActiveDate && streak.lastActiveDate !== today && streak.lastActiveDate !== yesterday) {
        return { ...streak, current: 0 };
    }
    return streak;
}

/** Check if streak is at risk (no activity today and last activity was yesterday) */
export function isStreakAtRisk() {
    const streak = getActiveStreak();
    if (!streak || streak.current === 0) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return streak.lastActiveDate !== today;
}

/** Get tree growth stage based on score */
export function getTreeStage(score) {
    if (score >= 4000) return { stage: 5, name: 'Ancient Tree', icon: '🌳' };
    if (score >= 1500) return { stage: 4, name: 'Mature Tree',  icon: '🌲' };
    if (score >= 500)  return { stage: 3, name: 'Young Tree',   icon: '🌿' };
    if (score >= 100)  return { stage: 2, name: 'Sapling',      icon: '🌱' };
    return { stage: 1, name: 'Seed', icon: '🫘' };
}
