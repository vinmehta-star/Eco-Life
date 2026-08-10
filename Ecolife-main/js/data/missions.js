/* =========================================================
   EcoLife — Mission Templates & Definitions
   ========================================================= */

export const CATEGORIES = {
    transport: { id: 'transport', name: 'Transport',  icon: '🚲', color: '#4DA6FF', emoji: '🚲' },
    waste:     { id: 'waste',     name: 'Waste',      icon: '♻️', color: '#00FF88', emoji: '♻️' },
    energy:    { id: 'energy',    name: 'Energy',     icon: '⚡', color: '#FFB800', emoji: '⚡' },
    food:      { id: 'food',      name: 'Food',       icon: '🌱', color: '#FF6B9D', emoji: '🌱' },
    water:     { id: 'water',     name: 'Water',      icon: '💧', color: '#00D4FF', emoji: '💧' }
};

export const MISSIONS = [
    // ---- TRANSPORT ----
    { id: 'm_bike_01',      category: 'transport', title: 'Pedal Power',                description: 'Bike or walk instead of driving for at least one trip today.',              difficulty: 1, points: 20, co2Saved: 2.1,  emoji: '🚴' },
    { id: 'm_bus_01',       category: 'transport', title: 'Public Transit Hero',        description: 'Take the bus, metro, or train instead of a private vehicle.',                difficulty: 1, points: 15, co2Saved: 1.5,  emoji: '🚌' },
    { id: 'm_carpool_01',   category: 'transport', title: 'Carpool Champion',           description: 'Share a ride with a friend, colleague, or neighbor.',                       difficulty: 2, points: 20, co2Saved: 1.8,  emoji: '🚗' },
    { id: 'm_walk_01',      category: 'transport', title: 'Walk the Talk',              description: 'Walk to your destination instead of using any motorized transport.',         difficulty: 1, points: 15, co2Saved: 2.1,  emoji: '🚶' },
    { id: 'm_wfh_01',       category: 'transport', title: 'Zero Commute Day',           description: 'Work from home today and skip the commute entirely.',                       difficulty: 1, points: 25, co2Saved: 3.5,  emoji: '🏠' },
    { id: 'm_nofly_01',     category: 'transport', title: 'Grounded & Green',           description: 'Choose a train or bus over a flight for your next trip.',                    difficulty: 4, points: 40, co2Saved: 25.0, emoji: '✈️' },
    { id: 'm_eride_01',     category: 'transport', title: 'Electric Explorer',          description: 'Use an electric vehicle, e-scooter, or e-bike today.',                      difficulty: 2, points: 20, co2Saved: 1.5,  emoji: '🛴' },
    { id: 'm_stairs_01',    category: 'transport', title: 'Take the Stairs',            description: 'Skip the elevator and take the stairs all day.',                             difficulty: 1, points: 10, co2Saved: 0.3,  emoji: '🪜' },
    { id: 'm_errand_01',    category: 'transport', title: 'Bundle Your Errands',        description: 'Combine multiple errands into one trip to reduce driving.',                  difficulty: 2, points: 15, co2Saved: 1.2,  emoji: '📦' },
    { id: 'm_telecon_01',   category: 'transport', title: 'Virtual Meeting',            description: 'Replace an in-person meeting with a video call.',                            difficulty: 1, points: 15, co2Saved: 2.0,  emoji: '💻' },

    // ---- WASTE ----
    { id: 'm_recycle_01',   category: 'waste', title: 'Sort & Recycle',                 description: 'Properly sort and recycle at least 3 items today.',                          difficulty: 1, points: 15, co2Saved: 0.5,  emoji: '♻️' },
    { id: 'm_noplastic_01', category: 'waste', title: 'Plastic-Free Hour',              description: 'Go one full hour without using any single-use plastic.',                     difficulty: 1, points: 10, co2Saved: 0.2,  emoji: '🚫' },
    { id: 'm_noplastic_02', category: 'waste', title: 'Plastic-Free Day',               description: 'Avoid all single-use plastics for the entire day.',                          difficulty: 3, points: 30, co2Saved: 0.8,  emoji: '🌊' },
    { id: 'm_bag_01',       category: 'waste', title: 'Bring Your Own Bag',             description: 'Use a reusable bag for all shopping trips today.',                            difficulty: 1, points: 10, co2Saved: 0.3,  emoji: '🛍️' },
    { id: 'm_bottle_01',    category: 'waste', title: 'Refill Revolution',              description: 'Use a reusable water bottle all day — skip the disposables.',                 difficulty: 1, points: 15, co2Saved: 0.4,  emoji: '🧴' },
    { id: 'm_compost_01',   category: 'waste', title: 'Compost Captain',                description: 'Compost your food scraps instead of trashing them.',                         difficulty: 2, points: 20, co2Saved: 0.8,  emoji: '🪱' },
    { id: 'm_repair_01',    category: 'waste', title: 'Fix Don\'t Toss',                description: 'Repair something instead of throwing it away.',                               difficulty: 3, points: 25, co2Saved: 2.0,  emoji: '🔧' },
    { id: 'm_donate_01',    category: 'waste', title: 'Donate & Declutter',             description: 'Donate clothes or items you no longer need instead of discarding.',           difficulty: 2, points: 20, co2Saved: 1.5,  emoji: '📤' },
    { id: 'm_refuse_01',    category: 'waste', title: 'Just Say No',                    description: 'Refuse a receipt, free sample, or unnecessary packaging today.',              difficulty: 1, points: 10, co2Saved: 0.1,  emoji: '✋' },
    { id: 'm_zerowaste_01', category: 'waste', title: 'Zero Waste Meal',                description: 'Prepare and eat a meal that generates zero packaging waste.',                 difficulty: 3, points: 25, co2Saved: 0.6,  emoji: '🍽️' },

    // ---- ENERGY ----
    { id: 'm_lightsoff_01', category: 'energy', title: 'Lights Out',                    description: 'Turn off all unnecessary lights for the evening.',                           difficulty: 1, points: 10, co2Saved: 0.5,  emoji: '💡' },
    { id: 'm_unplug_01',    category: 'energy', title: 'Unplug & Save',                 description: 'Unplug 3+ devices that are on standby.',                                     difficulty: 1, points: 15, co2Saved: 0.3,  emoji: '🔌' },
    { id: 'm_coldwash_01',  category: 'energy', title: 'Cold Wash Warrior',             description: 'Wash your clothes in cold water instead of hot.',                             difficulty: 1, points: 15, co2Saved: 0.8,  emoji: '🧊' },
    { id: 'm_airdry_01',    category: 'energy', title: 'Air Dry Day',                   description: 'Air-dry your clothes instead of using a dryer.',                              difficulty: 1, points: 15, co2Saved: 1.2,  emoji: '☀️' },
    { id: 'm_ac_01',        category: 'energy', title: 'Fan Over AC',                   description: 'Use a fan instead of air conditioning for at least 4 hours.',                 difficulty: 2, points: 20, co2Saved: 1.5,  emoji: '🌀' },
    { id: 'm_screen_01',    category: 'energy', title: 'Screen-Free Hour',              description: 'Turn off all screens for one hour and go analog.',                            difficulty: 2, points: 15, co2Saved: 0.2,  emoji: '📵' },
    { id: 'm_solar_01',     category: 'energy', title: 'Solar Charger',                 description: 'Charge a device using solar power or renewable energy.',                      difficulty: 3, points: 25, co2Saved: 0.4,  emoji: '🔆' },
    { id: 'm_thermostat_01',category: 'energy', title: 'Thermostat Tweak',              description: 'Adjust your thermostat 2°C cooler (winter) or warmer (summer).',              difficulty: 2, points: 20, co2Saved: 1.0,  emoji: '🌡️' },
    { id: 'm_led_01',       category: 'energy', title: 'LED Swap',                      description: 'Replace one incandescent or CFL bulb with an LED.',                          difficulty: 2, points: 20, co2Saved: 0.5,  emoji: '💡' },
    { id: 'm_noidle_01',    category: 'energy', title: 'No Idle Zone',                  description: 'Avoid leaving any engine idling today.',                                      difficulty: 1, points: 10, co2Saved: 0.6,  emoji: '🚙' },

    // ---- FOOD ----
    { id: 'm_plantmeal_01', category: 'food', title: 'Plant-Powered Plate',             description: 'Eat a fully plant-based meal today.',                                         difficulty: 1, points: 20, co2Saved: 2.5,  emoji: '🥗' },
    { id: 'm_plantday_01',  category: 'food', title: 'Meatless Monday',                 description: 'Go fully vegetarian or vegan for the entire day.',                            difficulty: 2, points: 30, co2Saved: 5.0,  emoji: '🌿' },
    { id: 'm_local_01',     category: 'food', title: 'Eat Local',                       description: 'Buy produce from a local farmer\'s market or local vendor.',                  difficulty: 2, points: 20, co2Saved: 1.5,  emoji: '🏪' },
    { id: 'm_nowaste_01',   category: 'food', title: 'Clean Plate Club',                description: 'Eat everything on your plate — zero food waste today.',                       difficulty: 1, points: 15, co2Saved: 0.8,  emoji: '🍽️' },
    { id: 'm_seasonal_01',  category: 'food', title: 'Season\'s Best',                  description: 'Cook a meal using only seasonal, local ingredients.',                         difficulty: 2, points: 20, co2Saved: 1.2,  emoji: '🍅' },
    { id: 'm_leftovers_01', category: 'food', title: 'Leftover Remix',                  description: 'Transform yesterday\'s leftovers into a new delicious meal.',                 difficulty: 2, points: 20, co2Saved: 1.0,  emoji: '🔄' },
    { id: 'm_coffee_01',    category: 'food', title: 'Cup of Conscience',               description: 'Bring your own mug to the café or brew at home.',                             difficulty: 1, points: 10, co2Saved: 0.3,  emoji: '☕' },
    { id: 'm_grow_01',      category: 'food', title: 'Grow Something',                  description: 'Plant an herb, vegetable, or fruit seed.',                                    difficulty: 3, points: 25, co2Saved: 0.5,  emoji: '🌱' },
    { id: 'm_bulk_01',      category: 'food', title: 'Bulk Buy',                        description: 'Buy ingredients in bulk to reduce packaging waste.',                          difficulty: 2, points: 15, co2Saved: 0.4,  emoji: '🛒' },
    { id: 'm_nodelivery_01',category: 'food', title: 'Cook Don\'t Order',               description: 'Cook at home instead of ordering delivery.',                                  difficulty: 2, points: 20, co2Saved: 1.8,  emoji: '👨‍🍳' },

    // ---- WATER ----
    { id: 'm_shower_01',    category: 'water', title: 'Quick Rinse',                    description: 'Take a shower under 5 minutes today.',                                        difficulty: 1, points: 15, co2Saved: 0.5,  emoji: '🚿' },
    { id: 'm_tap_01',       category: 'water', title: 'Tap Patrol',                     description: 'Check and fix any dripping taps or leaks.',                                   difficulty: 2, points: 20, co2Saved: 0.3,  emoji: '🔧' },
    { id: 'm_dishes_01',    category: 'water', title: 'Efficient Dishes',               description: 'Wash dishes in a basin instead of running water, or run a full dishwasher.',   difficulty: 1, points: 10, co2Saved: 0.2,  emoji: '🍽️' },
    { id: 'm_rain_01',      category: 'water', title: 'Rain Harvest',                   description: 'Collect rainwater for watering plants.',                                      difficulty: 3, points: 25, co2Saved: 0.3,  emoji: '🌧️' },
    { id: 'm_garden_01',    category: 'water', title: 'Smart Watering',                 description: 'Water your garden early morning or late evening to reduce evaporation.',       difficulty: 1, points: 10, co2Saved: 0.2,  emoji: '🌻' },
    { id: 'm_fullload_01',  category: 'water', title: 'Full Load Only',                 description: 'Only run the washing machine with a full load.',                               difficulty: 1, points: 15, co2Saved: 0.5,  emoji: '🧺' },
    { id: 'm_brush_01',     category: 'water', title: 'Tap Off While Brushing',         description: 'Turn off the tap while brushing your teeth.',                                  difficulty: 1, points: 10, co2Saved: 0.1,  emoji: '🪥' },
    { id: 'm_reuse_01',     category: 'water', title: 'Reuse Water',                    description: 'Reuse cooking water, AC water, or rinse water for plants.',                    difficulty: 2, points: 15, co2Saved: 0.2,  emoji: '💧' },
    { id: 'm_car_wash_01',  category: 'water', title: 'Bucket Wash',                    description: 'Wash your car/bike with a bucket instead of a hose.',                          difficulty: 2, points: 15, co2Saved: 0.3,  emoji: '🪣' },
    { id: 'm_drink_01',     category: 'water', title: 'Filtered, Not Bottled',          description: 'Drink filtered tap water instead of buying bottled water.',                     difficulty: 1, points: 10, co2Saved: 0.3,  emoji: '🚰' }
];

/** Get missions by category */
export function getMissionsByCategory(categoryId) {
    return MISSIONS.filter(m => m.category === categoryId);
}

/** Get a mission by ID */
export function getMissionById(id) {
    return MISSIONS.find(m => m.id === id);
}

/** Get random missions, optionally filtering by category */
export function getRandomMissions(count, exclude = [], category = null) {
    let pool = [...MISSIONS];
    if (category) {
        pool = pool.filter(m => m.category === category);
    }
    pool = pool.filter(m => !exclude.includes(m.id));
    
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    return pool.slice(0, count);
}
