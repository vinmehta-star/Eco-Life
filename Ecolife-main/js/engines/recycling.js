/* =========================================================
   EcoLife — Recycling Classifier (Decision Tree)
   ========================================================= */

import { searchRecyclingItems, getItemsByCategory, RECYCLING_ITEMS } from '../data/recyclingDb.js';

/**
 * Classify an item for recycling.
 * @param {string} query - Item name or description
 * @returns {Object|null} - Classified result or null
 */
export function classifyItem(query) {
    if (!query || query.trim().length < 2) return null;
    
    const results = searchRecyclingItems(query);
    if (results.length === 0) return null;
    
    const item = results[0]; // Best match
    
    return {
        item: item,
        binType: getBinInfo(item.bin),
        steps: item.instructions,
        funFact: item.tips,
        co2Impact: item.co2Impact,
        category: item.category,
        isRecyclable: item.isRecyclable
    };
}

/**
 * Get bin info (color, label, icon)
 */
export function getBinInfo(binType) {
    const bins = {
        recyclable: { label: 'Recyclable', icon: '♻️', cssClass: 'result-card__bin--recyclable', description: 'Place in your recycling bin' },
        compost:    { label: 'Compostable', icon: '🌱', cssClass: 'result-card__bin--compost',    description: 'Place in compost or green waste bin' },
        trash:      { label: 'General Waste', icon: '🗑️', cssClass: 'result-card__bin--trash',   description: 'Place in general waste bin' },
        hazardous:  { label: 'Hazardous', icon: '⚠️', cssClass: 'result-card__bin--hazardous',    description: 'Take to hazardous waste collection point' },
        special:    { label: 'Special Disposal', icon: '📍', cssClass: 'result-card__bin--special', description: 'Requires special collection — see instructions' }
    };
    return bins[binType] || bins.trash;
}


/**
 * Search items with autocomplete suggestions
 */
export function getAutocompleteSuggestions(query) {
    return searchRecyclingItems(query);
}

/**
 * Get all items in a category
 */
export function getItemsForCategory(categoryId) {
    return getItemsByCategory(categoryId);
}
