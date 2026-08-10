/* =========================================================
   EcoLife — Google Gemini AI Service
   Powers the AI Recycling Scanner
   ========================================================= */

const LOCAL_STORAGE_KEY = 'gemini_api_key';
const PLACEHOLDER_API_KEY = 'YOUR_GEMINI_API_KEY';
const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash-lite';

function isValidGeminiApiKey(value) {
    return typeof value === 'string' &&
        value.trim() !== '' &&
        value.trim() !== PLACEHOLDER_API_KEY;
}

/** Get the configured Gemini API key */
export function getGeminiApiKey() {
    const configuredKey = window.ECOLIFE_CONFIG?.geminiApiKey;
    if (isValidGeminiApiKey(configuredKey)) {
        const trimmedKey = configuredKey.trim();
        if (localStorage.getItem(LOCAL_STORAGE_KEY) !== trimmedKey) {
            localStorage.setItem(LOCAL_STORAGE_KEY, trimmedKey);
        }
        return trimmedKey;
    }

    const storedKey = localStorage.getItem(LOCAL_STORAGE_KEY);
    return isValidGeminiApiKey(storedKey) ? storedKey.trim() : null;
}

function getGeminiModel() {
    const configuredModel = window.ECOLIFE_CONFIG?.geminiModel;
    return typeof configuredModel === 'string' && configuredModel.trim() !== '' ?
        configuredModel.trim() :
        DEFAULT_GEMINI_MODEL;
}

function getGeminiGenerateContentUrl(apiKey) {
    const model = encodeURIComponent(getGeminiModel());
    const key = encodeURIComponent(apiKey);
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

function createGeminiApiError(message, status = null, code = null) {
    const error = new Error(`Gemini API error: ${message}`);
    error.status = status;
    error.code = code;
    return error;
}
const RECYCLING_PROMPT = `You are an expert recycling assistant. Analyze this image and identify the item shown.

Respond with ONLY valid JSON in exactly this format (no markdown, no explanation):
{
  "itemName": "exact item name",
  "emoji": "single relevant emoji",
  "category": "one of: Plastics, Glass, Paper & Cardboard, Metal, Electronics, Organic Waste, Hazardous, Textiles, General Waste",
  "isRecyclable": true or false,
  "bin": "one of: recycling, general, organic, hazardous, ewaste, donation",
  "binLabel": "short bin label e.g. Blue Recycling Bin",
  "confidence": number between 0 and 100,
  "disposalSteps": ["step 1", "step 2", "step 3"],
  "funFact": "one interesting recycling fact about this item",
  "co2Impact": number (kg CO2 saved by recycling, 0 if not recyclable),
  "warning": "optional warning or null"
}

Be concise in steps (max 12 words each). Return only JSON.`;

/**
 * Analyze an image file using Gemini Vision and return recycling classification.
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} - Parsed recycling result
 */
export async function analyzeImageWithGemini(imageFile) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY_NOT_SET');
    }

    const apiUrl = getGeminiGenerateContentUrl(apiKey);

    // Convert image to base64
    const base64 = await fileToBase64(imageFile);
    const mimeType = imageFile.type || 'image/jpeg';

    const requestBody = {
        contents: [{
            parts: [
                { text: RECYCLING_PROMPT },
                {
                    inline_data: {
                        mime_type: mimeType,
                        data: base64
                    }
                }
            ]
        }],
        generationConfig: {
            maxOutputTokens: 512,
        }
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err?.error?.message || `HTTP ${response.status}`;
        throw createGeminiApiError(msg, response.status, err?.error?.status || err?.error?.code || null);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown code fences if present
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
        return normalizeGeminiResult(JSON.parse(cleaned));
    } catch (e) {
        console.error('[Gemini] Failed to parse response:', text);
        throw new Error('Could not parse AI response. Please try again.');
    }
}


function normalizeGeminiResult(result) {
    const binMap = {
        recycling: 'recyclable',
        recyclable: 'recyclable',
        general: 'trash',
        trash: 'trash',
        organic: 'compost',
        compost: 'compost',
        ewaste: 'special',
        donation: 'special',
        hazardous: 'hazardous'
    };

    return {
        ...result,
        bin: binMap[String(result?.bin || '').toLowerCase()] || 'trash'
    };
}
/** Convert File to base64 string (without data: prefix) */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Remove "data:image/jpeg;base64," prefix
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/** Check if Gemini API is configured */
export function isGeminiConfigured() {
    return getGeminiApiKey() !== null;
}
/** True when Gemini failed for quota, billing, or rate-limit reasons. */
export function isGeminiQuotaError(error) {
    const message = String(error?.message || '').toLowerCase();
    return error?.status === 429 ||
        message.includes('quota') ||
        message.includes('rate limit') ||
        message.includes('billing') ||
        message.includes('resource_exhausted');
}

const ECOBUDDY_SYSTEM_PROMPT = `You are EcoBuddy AI, a friendly, encouraging gamified sustainability assistant in the EcoLife app.
Keep responses concise (max 3-4 sentences), positive, and focused on practical eco-friendly advice.
Help the user complete their green goals, answer recycling queries, or give tips to live sustainably.
Always return responses formatted as clean inline HTML (use <strong>, <em>, <br> only, do not use markdown codeblocks or other HTML tags).`;

/**
 * Send a chat message to Gemini and get a conversational response.
 * @param {string} userMessage - User's chat message
 * @param {Array} history - Optional previous messages [{role: 'user'|'model', parts: [{text: string}]}]
 */
export async function askGeminiEcoBuddy(userMessage, history = []) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY_NOT_SET');
    }

    const apiUrl = getGeminiGenerateContentUrl(apiKey);

    const safeHistory = Array.isArray(history) ? history.filter(entry => {
        return ['user', 'model'].includes(entry?.role) && Array.isArray(entry.parts);
    }) : [];

    const contents = [
        ...safeHistory,
        {
            role: 'user',
            parts: [{ text: userMessage }]
        }
    ];

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{ text: ECOBUDDY_SYSTEM_PROMPT }]
            },
            contents,
            generationConfig: {
                maxOutputTokens: 256,
            }
        })
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err?.error?.message || `HTTP ${response.status}`;
        throw createGeminiApiError(msg, response.status, err?.error?.status || err?.error?.code || null);
    }

    const data = await response.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean up markdown markers if any got returned
    text = text.replace(/```html\n?/g, '').replace(/```\n?/g, '').trim();
    return text;
}