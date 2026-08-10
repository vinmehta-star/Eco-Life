/* =========================================================
   EcoLife — Recycling Item Database
   ========================================================= */

export const RECYCLING_CATEGORIES = [
    { id: 'plastic',   name: 'Plastic',    emoji: '🧴', color: '#4DA6FF' },
    { id: 'paper',     name: 'Paper',      emoji: '📄', color: '#FFB800' },
    { id: 'glass',     name: 'Glass',      emoji: '🫙', color: '#00FF88' },
    { id: 'metal',     name: 'Metal',      emoji: '🥫', color: '#8A8A8A' },
    { id: 'organic',   name: 'Organic',    emoji: '🍌', color: '#8BC34A' },
    { id: 'ewaste',    name: 'E-Waste',    emoji: '📱', color: '#B366FF' },
    { id: 'textile',   name: 'Textile',    emoji: '👕', color: '#FF6B9D' },
    { id: 'hazardous', name: 'Hazardous',  emoji: '⚠️', color: '#FF4D4D' }
];

export const RECYCLING_ITEMS = [
    // --- PLASTIC ---
    { name: 'Plastic Bottle (PET)',     aliases: ['pet bottle', 'water bottle', 'soda bottle', 'plastic bottle'],       category: 'plastic', bin: 'recyclable', resinCode: 1, isRecyclable: true,  emoji: '🧴',
      instructions: ['Empty and rinse the bottle', 'Remove the cap (recycle separately if accepted)', 'Crush to save space', 'Place in the recycling bin'],
      tips: 'PET (#1) is the most widely recycled plastic. One recycled bottle saves enough energy to power a laptop for 25 minutes.',
      co2Impact: 0.08 },
    { name: 'Plastic Bag',             aliases: ['polythene', 'carry bag', 'grocery bag', 'poly bag'],                 category: 'plastic', bin: 'special', resinCode: 4, isRecyclable: false, emoji: '🛍️',
      instructions: ['Plastic bags cannot go in curbside recycling', 'Collect clean, dry bags together', 'Return to grocery store drop-off bins', 'Better yet — switch to reusable bags!'],
      tips: 'Plastic bags jam recycling machinery. Most grocery stores have dedicated collection bins for plastic film.',
      co2Impact: 0.03 },
    { name: 'Plastic Container (HDPE)', aliases: ['shampoo bottle', 'detergent bottle', 'milk jug', 'hdpe'],           category: 'plastic', bin: 'recyclable', resinCode: 2, isRecyclable: true,  emoji: '🧴',
      instructions: ['Rinse the container', 'Replace the cap', 'Place in recycling bin', 'No need to remove labels'],
      tips: 'HDPE (#2) is recycled into drainage pipes, plastic lumber, and new bottles.',
      co2Impact: 0.1 },
    { name: 'Styrofoam',               aliases: ['thermocol', 'polystyrene', 'foam', 'eps'],                           category: 'plastic', bin: 'trash', resinCode: 6, isRecyclable: false, emoji: '📦',
      instructions: ['Styrofoam is NOT recyclable in most areas', 'Break into small pieces', 'Place in general waste', 'Avoid buying styrofoam-packaged products when possible'],
      tips: 'Styrofoam takes 500+ years to decompose. Try to avoid it entirely — bring your own containers for takeout.',
      co2Impact: 0.05 },
    { name: 'Plastic Straw',           aliases: ['straw', 'drinking straw'],                                            category: 'plastic', bin: 'trash', resinCode: 5, isRecyclable: false, emoji: '🥤',
      instructions: ['Too small for recycling machines', 'Place in general waste', 'Switch to metal, bamboo, or paper straws'],
      tips: 'Over 8 billion plastic straws pollute beaches worldwide. A reusable straw pays for itself in a week!',
      co2Impact: 0.01 },
    { name: 'Food Wrapper',            aliases: ['chip bag', 'candy wrapper', 'snack wrapper', 'wrapper'],              category: 'plastic', bin: 'trash', resinCode: 7, isRecyclable: false, emoji: '🍬',
      instructions: ['Multi-layer wrappers are not recyclable', 'Place in general waste', 'Look for brands with compostable packaging'],
      tips: 'Multi-layer packaging (foil + plastic) cannot be separated for recycling. Choose products with minimal packaging.',
      co2Impact: 0.02 },

    // --- PAPER ---
    { name: 'Newspaper',               aliases: ['news paper', 'paper'],                                                category: 'paper', bin: 'recyclable', isRecyclable: true, emoji: '📰',
      instructions: ['Keep dry and clean', 'Stack neatly or place in a paper bag', 'Place in recycling bin'],
      tips: 'Recycling one ton of newspaper saves 17 trees, 7,000 gallons of water, and 4,000 kWh of energy.',
      co2Impact: 0.05 },
    { name: 'Cardboard Box',           aliases: ['cardboard', 'box', 'shipping box', 'carton'],                         category: 'paper', bin: 'recyclable', isRecyclable: true, emoji: '📦',
      instructions: ['Remove tape and labels if possible', 'Flatten the box', 'Keep dry', 'Place in recycling bin'],
      tips: 'Cardboard can be recycled 5-7 times before the fibers become too short.',
      co2Impact: 0.1 },
    { name: 'Pizza Box',               aliases: ['pizza carton'],                                                        category: 'paper', bin: 'compost', isRecyclable: false, emoji: '🍕',
      instructions: ['Greasy portions CANNOT be recycled', 'Tear off clean portions and recycle those', 'Compost the greasy parts', 'Or place greasy parts in general waste'],
      tips: 'Grease contaminates paper recycling. Split the box: clean lid to recycling, greasy bottom to compost.',
      co2Impact: 0.03 },
    { name: 'Tissue / Paper Towel',    aliases: ['tissue', 'paper towel', 'napkin', 'toilet paper'],                    category: 'paper', bin: 'compost', isRecyclable: false, emoji: '🧻',
      instructions: ['Used tissues and paper towels are NOT recyclable', 'Compost them if you have a compost bin', 'Otherwise, place in general waste'],
      tips: 'Used paper products have fibers too short and contaminated for recycling, but they make great compost!',
      co2Impact: 0.01 },
    { name: 'Magazine / Glossy Paper', aliases: ['magazine', 'brochure', 'catalog', 'glossy'],                          category: 'paper', bin: 'recyclable', isRecyclable: true, emoji: '📚',
      instructions: ['Remove plastic wrapping', 'Recycle with mixed paper', 'No need to remove staples'],
      tips: 'Modern recycling can handle glossy coatings and staples. Just keep them dry.',
      co2Impact: 0.04 },

    // --- GLASS ---
    { name: 'Glass Bottle',            aliases: ['wine bottle', 'beer bottle', 'glass jar', 'bottle'],                  category: 'glass', bin: 'recyclable', isRecyclable: true, emoji: '🍾',
      instructions: ['Rinse the bottle', 'Remove the cap (recycle metal caps separately)', 'Do not break the glass', 'Place in glass recycling bin (sort by color if required)'],
      tips: 'Glass is 100% recyclable and can be recycled endlessly without losing quality!',
      co2Impact: 0.15 },
    { name: 'Drinking Glass / Ceramics',aliases: ['cup', 'mug', 'ceramic', 'pyrex', 'mirror'],                          category: 'glass', bin: 'trash', isRecyclable: false, emoji: '🥃',
      instructions: ['NOT the same as bottle glass — different melting point', 'Wrap carefully to prevent injury', 'Place in general waste', 'Consider donating if still usable'],
      tips: 'Ceramics, Pyrex, and window glass have different compositions and contaminate glass recycling.',
      co2Impact: 0.02 },
    { name: 'Glass Jar',               aliases: ['jam jar', 'sauce jar', 'pickle jar', 'mason jar'],                    category: 'glass', bin: 'recyclable', isRecyclable: true, emoji: '🫙',
      instructions: ['Rinse thoroughly', 'Remove metal lid (recycle separately)', 'Labels can stay on', 'Place in glass recycling'],
      tips: 'Clean glass jars can be reused for storage before recycling — give them a second life!',
      co2Impact: 0.12 },

    // --- METAL ---
    { name: 'Aluminum Can',            aliases: ['soda can', 'beer can', 'coke can', 'aluminium', 'tin can'],           category: 'metal', bin: 'recyclable', isRecyclable: true, emoji: '🥫',
      instructions: ['Rinse the can', 'Crush to save space (optional)', 'Place in recycling bin', 'No need to remove labels'],
      tips: 'Recycling aluminum saves 95% of the energy needed to make new aluminum. A can is back on the shelf in 60 days!',
      co2Impact: 0.2 },
    { name: 'Tin Foil / Aluminum Foil',aliases: ['foil', 'aluminium foil', 'tin foil'],                                 category: 'metal', bin: 'recyclable', isRecyclable: true, emoji: '🫕',
      instructions: ['Clean off food residue', 'Ball up small pieces into a larger ball (golf ball size minimum)', 'Place in recycling bin'],
      tips: 'Small foil pieces fall through sorting machines. Ball them up to make them large enough to be sorted.',
      co2Impact: 0.03 },
    { name: 'Aerosol Can',             aliases: ['spray can', 'deodorant can'],                                          category: 'metal', bin: 'recyclable', isRecyclable: true, emoji: '🧴',
      instructions: ['Ensure the can is fully empty', 'Do NOT puncture', 'Remove plastic cap and recycle separately', 'Place in metal recycling'],
      tips: 'Empty aerosol cans are safe to recycle. Just make sure they\'re fully empty — no residual pressure.',
      co2Impact: 0.08 },

    // --- ORGANIC ---
    { name: 'Fruit / Vegetable Scraps',aliases: ['fruit peel', 'banana peel', 'vegetable', 'peels', 'food scraps'],     category: 'organic', bin: 'compost', isRecyclable: false, emoji: '🍌',
      instructions: ['Place in your compost bin or green waste bin', 'Chop large scraps for faster decomposition', 'Keep separate from general waste'],
      tips: 'Composting food scraps reduces methane emissions from landfills and creates nutrient-rich soil.',
      co2Impact: 0.05 },
    { name: 'Coffee Grounds',          aliases: ['coffee', 'tea leaves', 'tea bags'],                                    category: 'organic', bin: 'compost', isRecyclable: false, emoji: '☕',
      instructions: ['Add to compost bin', 'Can also be used directly as garden fertilizer', 'Remove tea bags if they contain plastic mesh', 'Spread around acid-loving plants like roses'],
      tips: 'Coffee grounds are rich in nitrogen and make excellent compost. They also repel slugs and snails!',
      co2Impact: 0.02 },
    { name: 'Egg Shells',              aliases: ['eggshell', 'egg shell'],                                               category: 'organic', bin: 'compost', isRecyclable: false, emoji: '🥚',
      instructions: ['Crush the shells', 'Add to compost bin', 'Can also sprinkle in garden to deter pests', 'Rich in calcium for soil'],
      tips: 'Crushed eggshells add calcium to compost and can protect plants from slugs and cutworms.',
      co2Impact: 0.01 },

    // --- E-WASTE ---
    { name: 'Smartphone',              aliases: ['phone', 'mobile', 'cell phone', 'iphone', 'android'],                 category: 'ewaste', bin: 'special', isRecyclable: true, emoji: '📱',
      instructions: ['Factory reset and remove personal data', 'Remove SIM and memory cards', 'Take to an authorized e-waste collection center', 'Many manufacturers offer take-back programs'],
      tips: 'One million recycled smartphones yield 35,000 lbs of copper, 772 lbs of silver, and 75 lbs of gold.',
      co2Impact: 0.5 },
    { name: 'Laptop / Computer',       aliases: ['computer', 'laptop', 'pc', 'desktop'],                                category: 'ewaste', bin: 'special', isRecyclable: true, emoji: '💻',
      instructions: ['Back up and wipe all data', 'Remove the battery if possible', 'Take to certified e-waste recycler', 'Consider donating if still functional'],
      tips: 'E-waste contains valuable rare earth metals. Proper recycling recovers these materials safely.',
      co2Impact: 1.0 },
    { name: 'Batteries',               aliases: ['battery', 'aa battery', 'lithium battery', 'cell'],                   category: 'ewaste', bin: 'hazardous', isRecyclable: true, emoji: '🔋',
      instructions: ['NEVER throw batteries in regular trash or recycling', 'Tape the terminals of lithium batteries to prevent fires', 'Take to a battery collection point', 'Many electronics stores accept used batteries'],
      tips: 'Batteries contain toxic heavy metals. One button battery can contaminate 600,000 liters of water.',
      co2Impact: 0.15 },
    { name: 'Light Bulbs (CFL/LED)',   aliases: ['bulb', 'light bulb', 'cfl', 'fluorescent'],                           category: 'ewaste', bin: 'special', isRecyclable: true, emoji: '💡',
      instructions: ['CFL bulbs contain mercury — handle with care', 'Place in a sealed bag', 'Take to a hazardous waste collection point', 'LED bulbs can go to e-waste recycling', 'Incandescent bulbs go in general waste'],
      tips: 'CFLs contain small amounts of mercury. If one breaks, ventilate the room and clean up carefully.',
      co2Impact: 0.05 },

    // --- TEXTILE ---
    { name: 'Old Clothes',             aliases: ['clothing', 'shirt', 'pants', 'jeans', 'dress', 'clothes'],            category: 'textile', bin: 'special', isRecyclable: true, emoji: '👕',
      instructions: ['Wash before donating', 'Donate wearable items to charity or clothing banks', 'Torn/stained items can still be recycled as rags or insulation', 'Drop off at textile recycling bins'],
      tips: 'The average person throws away 70 lbs of clothing per year. Donating or recycling keeps textiles out of landfills.',
      co2Impact: 0.3 },
    { name: 'Shoes',                   aliases: ['sneakers', 'boots', 'sandals', 'footwear'],                           category: 'textile', bin: 'special', isRecyclable: true, emoji: '👟',
      instructions: ['Tie pairs together', 'Donate wearable shoes', 'Worn-out shoes can be recycled — Nike and others have take-back programs', 'Do not place in regular recycling'],
      tips: 'Athletic shoes can be ground up and turned into playground surfaces and running tracks!',
      co2Impact: 0.2 },

    // --- HAZARDOUS ---
    { name: 'Paint',                   aliases: ['paint can', 'paint tin', 'latex paint', 'oil paint'],                  category: 'hazardous', bin: 'hazardous', isRecyclable: false, emoji: '🎨',
      instructions: ['NEVER pour paint down the drain', 'Latex paint: dry out completely, then dispose in general waste', 'Oil-based paint: take to hazardous waste facility', 'Donate usable paint to community groups'],
      tips: 'A single gallon of paint can contaminate 250,000 gallons of drinking water.',
      co2Impact: 0.3 },
    { name: 'Medication',              aliases: ['pills', 'medicine', 'drugs', 'pharmaceutical', 'expired medicine'],    category: 'hazardous', bin: 'hazardous', isRecyclable: false, emoji: '💊',
      instructions: ['NEVER flush medications', 'Return to a pharmacy take-back program', 'If no program available: mix with coffee grounds or kitty litter, seal, and trash', 'Remove personal info from prescription labels'],
      tips: 'Flushed medications contaminate water supplies and affect aquatic ecosystems. Always use take-back programs.',
      co2Impact: 0.05 },
    { name: 'Motor Oil',               aliases: ['engine oil', 'used oil', 'car oil'],                                  category: 'hazardous', bin: 'hazardous', isRecyclable: true, emoji: '🛢️',
      instructions: ['NEVER pour down drains or into the ground', 'Store in a sealed container', 'Take to an auto parts store or recycling center', 'One gallon of used oil can be re-refined into 2.5 quarts of new oil'],
      tips: 'Used motor oil is the #1 source of oil pollution in waterways. Just 1 gallon contaminates 1 million gallons of water.',
      co2Impact: 0.4 }
];

/** Search items by name (fuzzy) */
export function searchRecyclingItems(query) {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase().trim();
    
    return RECYCLING_ITEMS.filter(item => {
        if (item.name.toLowerCase().includes(q)) return true;
        return item.aliases.some(alias => alias.includes(q));
    }).slice(0, 10);
}

/** Get items by category */
export function getItemsByCategory(categoryId) {
    return RECYCLING_ITEMS.filter(item => item.category === categoryId);
}

/** Get item by name */
export function getItemByName(name) {
    return RECYCLING_ITEMS.find(item => item.name.toLowerCase() === name.toLowerCase());
}
