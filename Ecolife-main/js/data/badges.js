/* =========================================================
   EcoLife — Badge Definitions
   ========================================================= */

export const BADGE_RARITY = {
    common:    { name: 'Common',    color: '#00FF88', cssClass: 'chip--green' },
    rare:      { name: 'Rare',      color: '#4DA6FF', cssClass: 'chip--info' },
    epic:      { name: 'Epic',      color: '#B366FF', cssClass: 'chip--epic' },
    legendary: { name: 'Legendary', color: '#FFD700', cssClass: 'chip--legendary' }
};

export const BADGES = [
    // --- Streak Badges ---
    { id: 'streak_3',        name: 'Three-peat',        emoji: '🔥', description: 'Maintain a 3-day streak',                     rarity: 'common',    criteria: { type: 'streak', value: 3 } },
    { id: 'streak_7',        name: 'Week Warrior',       emoji: '⚡', description: 'Maintain a 7-day streak',                     rarity: 'common',    criteria: { type: 'streak', value: 7 } },
    { id: 'streak_14',       name: 'Fortnight Force',    emoji: '💪', description: 'Maintain a 14-day streak',                    rarity: 'rare',      criteria: { type: 'streak', value: 14 } },
    { id: 'streak_30',       name: 'Monthly Master',     emoji: '🏆', description: 'Maintain a 30-day streak',                    rarity: 'rare',      criteria: { type: 'streak', value: 30 } },
    { id: 'streak_100',      name: 'Century Legend',      emoji: '💎', description: 'Maintain a 100-day streak',                   rarity: 'legendary', criteria: { type: 'streak', value: 100 } },

    // --- Score Badges ---
    { id: 'score_100',       name: 'Green Starter',       emoji: '🌱', description: 'Reach 100 Green Score',                      rarity: 'common',    criteria: { type: 'score', value: 100 } },
    { id: 'score_500',       name: 'Eco Apprentice',      emoji: '🌿', description: 'Reach 500 Green Score',                      rarity: 'common',    criteria: { type: 'score', value: 500 } },
    { id: 'score_1000',      name: 'Green Guardian',      emoji: '🛡️', description: 'Reach 1,000 Green Score',                    rarity: 'rare',      criteria: { type: 'score', value: 1000 } },
    { id: 'score_2500',      name: 'Earth Champion',      emoji: '🌍', description: 'Reach 2,500 Green Score',                    rarity: 'epic',      criteria: { type: 'score', value: 2500 } },
    { id: 'score_5000',      name: 'Planet Protector',    emoji: '🦸', description: 'Reach 5,000 Green Score',                    rarity: 'legendary', criteria: { type: 'score', value: 5000 } },

    // --- Mission Completion Badges ---
    { id: 'first_mission',   name: 'First Step',          emoji: '👣', description: 'Complete your very first mission',            rarity: 'common',    criteria: { type: 'totalMissions', value: 1 } },
    { id: 'missions_10',     name: 'Getting Started',     emoji: '📋', description: 'Complete 10 missions',                       rarity: 'common',    criteria: { type: 'totalMissions', value: 10 } },
    { id: 'missions_25',     name: 'Mission Maven',       emoji: '🎯', description: 'Complete 25 missions',                       rarity: 'rare',      criteria: { type: 'totalMissions', value: 25 } },
    { id: 'missions_50',     name: 'Half Century',        emoji: '⭐', description: 'Complete 50 missions',                       rarity: 'rare',      criteria: { type: 'totalMissions', value: 50 } },
    { id: 'missions_100',    name: 'Mission Centurion',   emoji: '🏅', description: 'Complete 100 missions',                      rarity: 'epic',      criteria: { type: 'totalMissions', value: 100 } },

    // --- Category Mastery Badges ---
    { id: 'cat_transport_10',name: 'Road Less Traveled',  emoji: '🚴', description: 'Complete 10 transport missions',             rarity: 'rare',      criteria: { type: 'category', category: 'transport', value: 10 } },
    { id: 'cat_waste_10',    name: 'Waste Warrior',       emoji: '♻️', description: 'Complete 10 waste missions',                 rarity: 'rare',      criteria: { type: 'category', category: 'waste', value: 10 } },
    { id: 'cat_energy_10',   name: 'Power Saver',         emoji: '💡', description: 'Complete 10 energy missions',                rarity: 'rare',      criteria: { type: 'category', category: 'energy', value: 10 } },
    { id: 'cat_food_10',     name: 'Green Gourmet',       emoji: '🥗', description: 'Complete 10 food missions',                  rarity: 'rare',      criteria: { type: 'category', category: 'food', value: 10 } },
    { id: 'cat_water_10',    name: 'Water Sage',          emoji: '💧', description: 'Complete 10 water missions',                 rarity: 'rare',      criteria: { type: 'category', category: 'water', value: 10 } },

    // --- Special Badges ---
    { id: 'all_categories',  name: 'Well-Rounded',        emoji: '🌈', description: 'Complete at least 1 mission in every category', rarity: 'rare',   criteria: { type: 'allCategories', value: 1 } },
    { id: 'co2_10',          name: 'Carbon Cutter',       emoji: '✂️', description: 'Save 10 kg of CO₂',                          rarity: 'common',    criteria: { type: 'co2', value: 10 } },
    { id: 'co2_50',          name: 'Carbon Crusher',      emoji: '💚', description: 'Save 50 kg of CO₂',                          rarity: 'rare',      criteria: { type: 'co2', value: 50 } },
    { id: 'co2_100',         name: 'Carbon Hero',         emoji: '🦸‍♀️', description: 'Save 100 kg of CO₂',                         rarity: 'epic',      criteria: { type: 'co2', value: 100 } },
    { id: 'early_bird',      name: 'Early Adopter',       emoji: '🐦', description: 'Join EcoLife in its first year',              rarity: 'epic',      criteria: { type: 'special', value: 'earlyAdopter' } },
];

/** Get badge by ID */
export function getBadgeById(id) {
    return BADGES.find(b => b.id === id);
}

/** Get badges by rarity */
export function getBadgesByRarity(rarity) {
    return BADGES.filter(b => b.rarity === rarity);
}

/** Check which badges a user has unlocked */
export function checkBadgeUnlocks(userState) {
    const earned = userState.badges || [];
    const newBadges = [];
    
    for (const badge of BADGES) {
        if (earned.includes(badge.id)) continue;
        
        const { criteria } = badge;
        let unlocked = false;
        
        switch (criteria.type) {
            case 'streak':
                unlocked = (userState.streak?.current >= criteria.value) || (userState.streak?.longest >= criteria.value);
                break;
            case 'score':
                unlocked = (userState.greenScore || 0) >= criteria.value;
                break;
            case 'totalMissions':
                unlocked = (userState.completedMissions?.length || 0) >= criteria.value;
                break;
            case 'category':
                unlocked = (userState.categoryStats?.[criteria.category]?.completed || 0) >= criteria.value;
                break;
            case 'allCategories':
                unlocked = Object.values(userState.categoryStats || {}).every(cat => cat.completed >= criteria.value);
                break;
            case 'co2':
                unlocked = (userState.co2Saved || 0) >= criteria.value;
                break;
            case 'special':
                if (criteria.value === 'earlyAdopter') {
                    unlocked = true; // Everyone in MVP is an early adopter!
                }
                break;
        }
        
        if (unlocked) {
            newBadges.push(badge);
        }
    }
    
    return newBadges;
}
