/* =========================================================
   EcoLife — Carbon Calculator Engine
   ========================================================= */

import { state } from '../state.js';
import { BASELINES, EQUIVALENCIES, getAnnualProjection, compareToBaseline } from '../data/carbonFactors.js';
import { getMissionById } from '../data/missions.js';

/**
 * Calculate comprehensive carbon impact report.
 * @returns {Object} Full carbon report
 */
export function calculateCarbonReport() {
    const s = state.get();
    const co2Saved = s.co2Saved || 0;
    const joinedAt = s.joinedAt ? new Date(s.joinedAt) : new Date();
    const daysSinceJoin = Math.max(1, Math.floor((Date.now() - joinedAt.getTime()) / 86400000));
    const dailyAvg = co2Saved / daysSinceJoin;
    const annualProjection = getAnnualProjection(co2Saved, daysSinceJoin);
    const annualProjectionTonnes = annualProjection / 1000;

    return {
        totalKgSaved: co2Saved,
        dailyAvgKg: parseFloat(dailyAvg.toFixed(2)),
        annualProjectionKg: parseFloat(annualProjection.toFixed(1)),
        annualProjectionTonnes: parseFloat(annualProjectionTonnes.toFixed(2)),
        daysSinceJoin,
        
        // Comparison percentages (how much of baseline you've offset)
        vsIndia: parseFloat(compareToBaseline(annualProjection, 'india').toFixed(1)),
        vsWorld: parseFloat(compareToBaseline(annualProjection, 'world').toFixed(1)),
        
        // Category breakdown
        breakdown: getCategoryBreakdown(s),
        
        // Fun equivalencies
        equivalencies: getRelevantEquivalencies(co2Saved),
        
        // Baselines for comparison chart
        baselines: BASELINES
    };
}

/**
 * Get CO2 savings broken down by category.
 */
function getCategoryBreakdown(s) {
    const completedMissions = s.completedMissions || [];
    const breakdown = {
        transport: 0,
        waste: 0,
        energy: 0,
        food: 0,
        water: 0
    };
    
    for (const mission of completedMissions) {
        const co2 = mission.co2Saved || 0;
        if (mission.missionId) {
            const def = getMissionById(mission.missionId);
            const cat = def?.category;
            if (cat && breakdown[cat] !== undefined) {
                breakdown[cat] += co2;
                continue;
            }
            // Fallback prefix check
            for (const c of Object.keys(breakdown)) {
                const catPrefixes = {
                    transport: ['m_bike', 'm_bus', 'm_carpool', 'm_walk', 'm_wfh', 'm_nofly', 'm_eride', 'm_stairs', 'm_errand', 'm_telecon'],
                    waste: ['m_recycle', 'm_noplastic', 'm_bag', 'm_bottle', 'm_compost', 'm_repair', 'm_donate', 'm_refuse', 'm_zerowaste'],
                    energy: ['m_lightsoff', 'm_unplug', 'm_coldwash', 'm_airdry', 'm_ac', 'm_screen', 'm_solar', 'm_thermostat', 'm_led', 'm_noidle'],
                    food: ['m_plantmeal', 'm_plantday', 'm_local', 'm_nowaste', 'm_seasonal', 'm_leftovers', 'm_coffee', 'm_grow', 'm_bulk', 'm_nodelivery'],
                    water: ['m_shower', 'm_tap', 'm_dishes', 'm_rain', 'm_garden', 'm_fullload', 'm_brush', 'm_reuse', 'm_car_wash', 'm_drink']
                };
                
                if (catPrefixes[c]?.some(prefix => mission.missionId.startsWith(prefix))) {
                    breakdown[c] += co2;
                    break;
                }
            }
        }
    }
    
    // Round values
    for (const key of Object.keys(breakdown)) {
        breakdown[key] = parseFloat(breakdown[key].toFixed(2));
    }
    
    return breakdown;
}

/**
 * Get fun equivalencies relevant to the user's savings amount.
 */
function getRelevantEquivalencies(kgCO2) {
    if (kgCO2 <= 0) {
        return [
            { emoji: '🌱', text: 'Complete eco-missions to start reducing your carbon footprint!' },
            { emoji: '🌍', text: 'Every small action counts toward a healthier planet.' }
        ];
    }
    
    return [
        { emoji: '🌳', text: `Equivalent to ${Math.max(0.1, kgCO2 / 22).toFixed(1)} trees absorbing CO₂ for a year` },
        { emoji: '🚗', text: `${(kgCO2 / 0.21).toFixed(0)} km of car driving avoided` },
        { emoji: '💡', text: `${(kgCO2 * 200).toFixed(0)} hours of LED lighting saved` },
        { emoji: '📱', text: `${(kgCO2 / 0.008).toFixed(0)} smartphone charges worth of energy` },
        { emoji: '🍔', text: `${(kgCO2 / 6.61).toFixed(1)} beef meals replaced with plant-based` },
        { emoji: '🚿', text: `${(kgCO2 / 0.5).toFixed(0)} 5-minute showers saved in energy` }
    ];
}
