/* =========================================================
   EcoLife — Carbon Emission Factors
   ========================================================= */

/** CO2 emission factors (kg CO2e per action) */
export const CARBON_FACTORS = {
    // Transport (kg CO2e saved per instance)
    transport: {
        bike_instead_of_drive: 2.1,     // per 10 km
        bus_instead_of_drive: 1.5,      // per 10 km
        carpool: 1.8,                   // per trip
        walk: 2.1,                      // per 10 km
        work_from_home: 3.5,            // per day
        train_instead_of_flight: 25.0,  // per trip
        electric_vehicle: 1.5,          // per 10 km
        no_idle: 0.6,                   // per day
        bundle_errands: 1.2,            // per trip
        virtual_meeting: 2.0            // per meeting
    },
    // Waste (kg CO2e saved per instance)
    waste: {
        recycle_items: 0.5,             // per 3 items
        plastic_free_hour: 0.2,
        plastic_free_day: 0.8,
        reusable_bag: 0.3,             // per trip
        reusable_bottle: 0.4,          // per day
        compost: 0.8,                  // per day
        repair_item: 2.0,
        donate: 1.5,
        refuse_single_use: 0.1,
        zero_waste_meal: 0.6
    },
    // Energy (kg CO2e saved per instance)
    energy: {
        lights_off: 0.5,               // per evening
        unplug_devices: 0.3,           // per day
        cold_wash: 0.8,                // per load
        air_dry: 1.2,                  // per load
        fan_over_ac: 1.5,              // per 4 hours
        screen_free_hour: 0.2,
        solar_charge: 0.4,
        thermostat_adjust: 1.0,        // per day
        led_swap: 0.5,                 // per bulb
        no_idle_engine: 0.6            // per day
    },
    // Food (kg CO2e saved per instance)
    food: {
        plant_based_meal: 2.5,          // vs beef meal
        meatless_day: 5.0,
        eat_local: 1.5,                // per meal
        no_food_waste: 0.8,            // per day
        seasonal_cooking: 1.2,
        leftover_remix: 1.0,
        own_mug: 0.3,
        grow_food: 0.5,
        bulk_buy: 0.4,
        cook_at_home: 1.8              // vs delivery
    },
    // Water (kg CO2e saved per instance — water treatment energy)
    water: {
        short_shower: 0.5,              // per shower
        fix_leak: 0.3,                  // per day
        efficient_dishes: 0.2,          // per wash
        rain_harvest: 0.3,              // per collection
        smart_watering: 0.2,
        full_load: 0.5,                // per load
        tap_off_brushing: 0.1,         // per day
        reuse_water: 0.2,
        bucket_wash: 0.3,             // vs hose
        filtered_not_bottled: 0.3      // per day
    }
};

/** Baseline references (tonnes CO2e per year) */
export const BASELINES = {
    india: {
        label: 'India Average',
        annual: 2.2,       // tonnes/year
        daily: 6.03,       // kg/day (2200 / 365)
        color: '#FFB800'
    },
    world: {
        label: 'World Average',
        annual: 4.7,
        daily: 12.88,
        color: '#FF4D4D'
    },
    target: {
        label: 'Climate Target',
        annual: 2.0,       // Paris agreement aligned
        daily: 5.48,
        color: '#00FF88'
    }
};

/** Fun equivalencies — what does X kg of CO2 look like? */
export const EQUIVALENCIES = [
    { threshold: 0.5,   emoji: '🌳', text: (kg) => `${(kg / 22).toFixed(1)} trees absorbing CO₂ for a year` },
    { threshold: 1,     emoji: '🚗', text: (kg) => `${(kg / 0.21).toFixed(0)} km of driving saved` },
    { threshold: 2,     emoji: '💡', text: (kg) => `${(kg / 0.005).toFixed(0)} hours of LED light` },
    { threshold: 5,     emoji: '🍔', text: (kg) => `${(kg / 6.61).toFixed(1)} beef burgers not eaten` },
    { threshold: 10,    emoji: '✈️', text: (kg) => `${(kg / 255).toFixed(2)} domestic flights avoided` },
    { threshold: 0.1,   emoji: '📱', text: (kg) => `${(kg / 0.008).toFixed(0)} smartphone charges` },
];

/** Get relevant equivalencies for a given kg CO2 saved */
export function getEquivalencies(kgCO2) {
    return EQUIVALENCIES.map(eq => ({
        emoji: eq.emoji,
        text: eq.text(kgCO2)
    }));
}

/** Calculate annual projection from total saved over N days */
export function getAnnualProjection(totalKgSaved, daysSinceJoin) {
    if (daysSinceJoin <= 0) return 0;
    const dailyAvg = totalKgSaved / daysSinceJoin;
    return dailyAvg * 365;
}

/** Compare to baseline as percentage */
export function compareToBaseline(annualKgSaved, baseline = 'india') {
    const ref = BASELINES[baseline];
    if (!ref) return 0;
    return (annualKgSaved / (ref.annual * 1000)) * 100;
}
