/* =========================================================
   EcoLife — EcoBuddy AI Interactive Chatbot Component
   
   A multi-turn conversational AI assistant with context memory,
   interactive dialogue choices, in-chat mission logging, 
   eco-trivia quizzes, and real-time state integration.
   ========================================================= */

import { state } from '../state.js';
import { getMissionsByCategory, MISSIONS, CATEGORIES } from '../data/missions.js';
import { searchRecyclingItems } from '../data/recyclingDb.js';
import { completeMission, getLevel, getLevelTitle, getTreeStage } from '../engines/greenScore.js';
import { showToast, showConfetti, showScorePopup } from './toast.js';
import { checkBadgeUnlocks } from '../data/badges.js';
import { askGeminiEcoBuddy, isGeminiConfigured, isGeminiQuotaError } from '../services/gemini.js';

let chatbotContainer = null;
let isOpen = false;
let dialogueState = {
    step: 'IDLE', // IDLE | AWAITING_CATEGORY | QUIZ | RECYCLING_SEARCH
    tempData: null
};
let chatHistory = [];
let isAwaitingResponse = false;


// Initial quick prompts
const QUICK_PROMPTS = [
    { label: '🎯 Choose a Mission', query: 'choose mission' },
    { label: '📊 How am I doing?', query: 'my stats' },
    { label: '❓ Play Eco Quiz', query: 'quiz' },
    { label: '♻️ Recycle an Item', query: 'recycle item' },
    { label: '🌳 Impact Tree Status', query: 'tree status' }
];

// Eco-Trivia Questions for Interactive Quiz
const ECO_QUIZZES = [
    {
        question: 'How long does a plastic bottle take to decompose in a landfill?',
        options: ['50 years', '450 years', '1,000 years'],
        correctIndex: 1,
        explanation: 'Plastic bottles take around 450 years to decompose! Recycling just one bottle saves enough energy to power a 60W lightbulb for 6 hours.'
    },
    {
        question: 'Which daily activity typically uses the most household water?',
        options: ['Washing dishes', 'Flushing toilets', 'Taking showers'],
        correctIndex: 1,
        explanation: 'Toilet flushing accounts for nearly 30% of average indoor household water consumption!'
    },
    {
        question: 'How much energy does recycling aluminum save compared to producing new aluminum?',
        options: ['50%', '75%', '95%'],
        correctIndex: 2,
        explanation: 'Recycling aluminum saves an astonishing 95% of the energy needed to produce new aluminum from raw bauxite ore!'
    }
];

export function renderChatbot() {
    if (document.getElementById('ecobuddyChatbot')) return;

    chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'ecobuddyChatbot';
    chatbotContainer.className = 'chatbot-container';

    chatbotContainer.innerHTML = `
        <!-- Floating Chat Button -->
        <button class="chatbot-fab" id="chatbotFab" aria-label="Open EcoBuddy AI Assistant">
            <div class="chatbot-fab__icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-4.586-1.114L2 22l1.114-5.414A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2z"/>
                    <circle cx="8" cy="12" r="1" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor"/>
                    <circle cx="16" cy="12" r="1" fill="currentColor"/>
                </svg>
            </div>
            <span class="chatbot-fab__badge">AI</span>
        </button>

        <!-- Chat Drawer Window -->
        <div class="chatbot-window" id="chatbotWindow">
            <div class="chatbot-header">
                <div class="chatbot-header__info">
                    <div class="chatbot-avatar">🤖</div>
                    <div>
                        <div class="chatbot-header__name">EcoBuddy AI</div>
                        <div class="chatbot-header__status"><span class="status-dot"></span> Interactive Assistant</div>
                    </div>
                </div>
                <button class="chatbot-header__close" id="chatbotClose">✕</button>
            </div>

            <!-- Quick Prompts bar -->
            <div class="chatbot-prompts" id="chatbotPrompts">
                ${QUICK_PROMPTS.map(p => `
                    <button class="chatbot-prompt-chip" data-query="${p.query}">${p.label}</button>
                `).join('')}
            </div>

            <!-- Messages Thread -->
            <div class="chatbot-messages" id="chatbotMessages">
                <!-- Dynamic Welcome Message -->
                <div class="chat-msg chat-msg--bot">
                    <div class="chat-msg__avatar">🤖</div>
                    <div class="chat-msg__bubble">
                        ${getWelcomeMessage()}
                    </div>
                </div>
            </div>

            <!-- Input Bar -->
            <div class="chatbot-input-bar">
                <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type a message or command..." autocomplete="off">
                <button class="chatbot-send-btn" id="chatbotSend" aria-label="Send Message">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(chatbotContainer);

    // Event Listeners
    const fab = document.getElementById('chatbotFab');
    const closeBtn = document.getElementById('chatbotClose');
    const inputEl = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    const messagesEl = document.getElementById('chatbotMessages');

    fab.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', toggleChat);

    sendBtn.addEventListener('click', handleUserSubmit);
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleUserSubmit();
    });

    // Quick prompt chips
    document.getElementById('chatbotPrompts').addEventListener('click', (e) => {
        const chip = e.target.closest('.chatbot-prompt-chip');
        if (!chip) return;
        handleUserQuery(chip.dataset.query, chip.textContent);
    });

    // Delegated click handler for interactive buttons inside chat bubbles
    messagesEl.addEventListener('click', handleChatBubbleClick);
}

function getWelcomeMessage() {
    const user = state.get('user');
    const name = user?.displayName || 'EcoWarrior';
    const score = state.get('greenScore') || 0;
    const streak = state.get('streak')?.current || 0;

    return `
        Hey <strong>${name}</strong>! 👋 I'm <strong>EcoBuddy AI</strong>.<br><br>
        Currently, you have <strong>${score} Green Points</strong> and a <strong>${streak}-day streak</strong> 🔥.<br><br>
        How can I help you right now? Click an option below or ask me anything!
    `;
}

function toggleChat() {
    const windowEl = document.getElementById('chatbotWindow');
    isOpen = !isOpen;
    windowEl.classList.toggle('active', isOpen);
    if (isOpen) {
        document.getElementById('chatbotInput').focus();
    }
}

function handleUserSubmit() {
    if (isAwaitingResponse) return;

    const inputEl = document.getElementById('chatbotInput');
    const query = inputEl.value.trim();
    if (!query) return;

    inputEl.value = '';
    handleUserQuery(query, query);
}

async function handleUserQuery(query, displayLabel) {
    if (isAwaitingResponse) return;

    setChatbotBusy(true);
    appendMessage(displayLabel, 'user');
    showTypingIndicator();

    try {
        // Try local command matching first
        const commandResponse = processInteractiveQuery(query);
        if (commandResponse !== null) {
            await wait(400 + Math.random() * 200);
            removeTypingIndicator();
            appendMessage(commandResponse, 'bot');
            return;
        }

        // Freeform message: call Gemini if configured.
        if (isGeminiConfigured()) {
            try {
                const historyForGemini = chatHistory.slice(0, -1).slice(-6);
                const responseHtml = await askGeminiEcoBuddy(query, historyForGemini);
                removeTypingIndicator();
                appendMessage(responseHtml, 'bot');
                return;
            } catch (e) {
                console.error('[EcoBuddy] Gemini error:', e);
                removeTypingIndicator();
                appendMessage(getGeminiUnavailableResponse(e), 'bot');
                return;
            }
        }

        // Default fallback when Gemini is unavailable
        removeTypingIndicator();
        appendMessage(getDefaultFallbackResponse(), 'bot');
    } finally {
        removeTypingIndicator();
        setChatbotBusy(false);
    }
}

function setChatbotBusy(isBusy) {
    isAwaitingResponse = isBusy;
    const inputEl = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');
    if (inputEl) inputEl.disabled = isBusy;
    if (sendBtn) sendBtn.disabled = isBusy;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getGeminiUnavailableResponse(error) {
    if (isGeminiQuotaError(error)) {
        return `Gemini is configured, but this API key has no available quota right now.<br><br>I can still help with built-in EcoLife actions: choose a mission, check your stats, play the quiz, or search recycling items.`;
    }

    return `Gemini is configured, but I could not reach it for this message.<br><br>I can still help with built-in EcoLife actions while you check the API key, billing, or network.`;
}
function getDefaultFallbackResponse() {
    const name = state.get('user')?.displayName || 'EcoWarrior';
    return `
        I'm here to help you turn eco-friendly actions into daily habits, ${name}! 😊<br><br>
        What would you like to explore?
        <div style="margin-top:10px; display:flex; flex-direction:column; gap:6px;">
            <button class="chat-action-btn chat-action-btn--full" data-chat-cmd="choose mission">🎯 Pick an Eco-Mission</button>
            <button class="chat-action-btn chat-action-btn--full" data-chat-cmd="quiz">❓ Take an Eco-Trivia Quiz (+10 pts)</button>
            <button class="chat-action-btn chat-action-btn--full" data-chat-cmd="my stats">📊 View My Eco Stats</button>
        </div>
    `;
}

function appendMessage(contentHtml, sender = 'bot') {
    const messagesEl = document.getElementById('chatbotMessages');
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${sender} fade-in`;

    if (sender === 'bot') {
        msg.innerHTML = `
            <div class="chat-msg__avatar">🤖</div>
            <div class="chat-msg__bubble">${contentHtml}</div>
        `;
    } else {
        msg.innerHTML = `
            <div class="chat-msg__bubble">${escapeHtml(contentHtml)}</div>
        `;
    }

    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // Track conversation history for Gemini context (keep last 10 turns)
    const plainText = contentHtml.replace(/<[^>]*>/g, '').trim();
    if (plainText) {
        chatHistory.push({ role: sender === 'user' ? 'user' : 'model', parts: [{ text: plainText }] });
        if (chatHistory.length > 10) chatHistory.shift();
    }
}

function showTypingIndicator() {
    const messagesEl = document.getElementById('chatbotMessages');
    const indicator = document.createElement('div');
    indicator.id = 'chatTypingIndicator';
    indicator.className = 'chat-msg chat-msg--bot fade-in';
    indicator.innerHTML = `
        <div class="chat-msg__avatar">🤖</div>
        <div class="chat-msg__bubble chat-msg__bubble--typing">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
    `;
    messagesEl.appendChild(indicator);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById('chatTypingIndicator');
    if (indicator) indicator.remove();
}

/**
 * Interactive Dialogue State Processor
 */
function processInteractiveQuery(query) {
    const q = query.toLowerCase();
    const s = state.get();
    const name = s.user?.displayName || 'EcoWarrior';

    // State: Handling Quiz Answer
    if (dialogueState.step === 'QUIZ') {
        const quiz = dialogueState.tempData;
        dialogueState.step = 'IDLE';
        dialogueState.tempData = null;

        if (q.startsWith('quiz_ans_')) {
            const selectedIdx = parseInt(q.replace('quiz_ans_', ''), 10);
            const isCorrect = selectedIdx === quiz.correctIndex;

            if (isCorrect) {
                // Award 10 bonus points
                const currentScore = s.greenScore || 0;
                state.set('greenScore', currentScore + 10);
                showScorePopup(10);
                showConfetti(15);
                showToast({ title: 'Correct! +10 Green Points', message: 'Great eco-knowledge!', type: 'success', icon: '🧠' });

                return `
                    🎉 <strong>Spot on! You got it right!</strong> (+10 Green Points)<br><br>
                    ${quiz.explanation}<br><br>
                    Want to try another quiz or pick a mission?
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="chat-action-btn" data-chat-cmd="quiz">❓ Another Quiz</button>
                        <button class="chat-action-btn" data-chat-cmd="choose mission">🎯 Pick a Mission</button>
                    </div>
                `;
            } else {
                return `
                    Not quite! The correct answer was <strong>${quiz.options[quiz.correctIndex]}</strong>.<br><br>
                    💡 <em>${quiz.explanation}</em><br><br>
                    Don't worry, knowledge is power! What would you like to do next?
                    <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="chat-action-btn" data-chat-cmd="quiz">❓ Try Another Question</button>
                        <button class="chat-action-btn" data-chat-cmd="my stats">📊 Check Stats</button>
                    </div>
                `;
            }
        }
    }

    // Command: Quiz Mode
    if (q.includes('quiz') || q.includes('trivia') || q.includes('question')) {
        const quiz = ECO_QUIZZES[Math.floor(Math.random() * ECO_QUIZZES.length)];
        dialogueState.step = 'QUIZ';
        dialogueState.tempData = quiz;

        return `
            🧠 <strong>Eco-Trivia Time!</strong> (Answer correctly for +10 Green Points)<br><br>
            <strong>Question:</strong> ${quiz.question}<br><br>
            <div style="display:flex; flex-direction:column; gap:6px;">
                ${quiz.options.map((opt, i) => `
                    <button class="chat-action-btn chat-action-btn--full" data-chat-cmd="quiz_ans_${i}">${String.fromCharCode(65 + i)}) ${opt}</button>
                `).join('')}
            </div>
        `;
    }

    // Command: Category Mission Picker
    if (q.includes('choose mission') || q.includes('pick mission') || q.includes('select category')) {
        dialogueState.step = 'AWAITING_CATEGORY';
        return `
            Which category would you like a mission for today, ${name}?
            <div style="margin-top:10px; display:flex; flex-direction:column; gap:6px;">
                <button class="chat-action-btn chat-action-btn--full" data-chat-cmd="cat_transport">🚲 Transport (Bike, Walk, Transit)</button>
                <button class="chat-action-btn chat-action-btn--full" data-chat-cmd="cat_waste">♻️ Waste (Recycle, Compost, Refuse)</button>
                <button class="chat-action-btn chat-action-btn--full" data-chat-cmd="cat_energy">⚡ Energy (Lights, Cold Wash, Solar)</button>
                <button class="chat-action-btn chat-action-btn--full" data-chat-cmd="cat_food">🥗 Food (Plant Meal, Local, Zero Waste)</button>
                <button class="chat-action-btn chat-action-btn--full" data-chat-cmd="cat_water">💧 Water (Short Shower, Tap Leak)</button>
            </div>
        `;
    }

    // Command: Category Selection Response
    if (q.startsWith('cat_')) {
        const catId = q.replace('cat_', '');
        const catMissions = getMissionsByCategory(catId);
        const completedIds = (s.completedMissions || []).map(m => m.missionId);
        const activeIds = s.activeMissions || [];
        const available = catMissions.filter(m => !completedIds.includes(m.id));

        if (available.length === 0) {
            return `You've completed all missions in this category! Amazing work! Try another category?`;
        }

        const mission = available[Math.floor(Math.random() * available.length)];
        const isActive = activeIds.includes(mission.id);

        return `
            Here is a top <strong>${CATEGORIES[catId]?.name || catId}</strong> mission for you:<br><br>
            <div style="background:var(--bg-elevated); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
                <div style="font-size:1.1rem; margin-bottom:4px;">${mission.emoji} <strong>${mission.title}</strong></div>
                <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">${mission.description}</div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:var(--accent); font-weight:700;">+${mission.points} pts</span>
                    ${isActive ? 
                        `<button class="btn btn--primary btn--sm chat-complete-mission" data-mission-id="${mission.id}">✓ Complete Now</button>` :
                        `<button class="btn btn--secondary btn--sm chat-accept-mission" data-mission-id="${mission.id}">Accept Mission</button>`
                    }
                </div>
            </div>
        `;
    }

    // Command: User Stats & Progress Check
    if (q.includes('my stats') || q.includes('how am i doing') || q.includes('progress') || q.includes('my score')) {
        const score = s.greenScore || 0;
        const level = getLevel(score);
        const streak = s.streak?.current || 0;
        const co2 = s.co2Saved || 0;
        const stage = getTreeStage(score);

        return `
            📊 <strong>${name}'s Eco Progress Report:</strong><br><br>
            • 🏆 <strong>Green Score:</strong> ${score.toLocaleString()} pts (Level ${level} ${getLevelTitle(level)})<br>
            • 🔥 <strong>Current Streak:</strong> ${streak} days<br>
            • 🌍 <strong>CO₂ Offset:</strong> ${co2.toFixed(1)} kg<br>
            • 🌳 <strong>Impact Tree:</strong> Stage ${stage.stage}/5 (${stage.name})<br><br>
            What would you like to do next?
            <div style="margin-top:10px; display:flex; gap:6px; flex-wrap:wrap;">
                <button class="chat-action-btn" data-chat-cmd="choose mission">🎯 Get New Mission</button>
                <button class="chat-action-btn" data-chat-cmd="tree status">🌳 View Tree Details</button>
            </div>
        `;
    }

    // Command: Tree Status
    if (q.includes('tree') || q.includes('tree status')) {
        const score = s.greenScore || 0;
        const stage = getTreeStage(score);
        const streak = s.streak?.current || 0;

        return `
            🌳 <strong>Impact Tree Status:</strong><br><br>
            Your tree is currently a <strong>Stage ${stage.stage}/5 (${stage.name})</strong> ${stage.icon}.<br>
            ${streak > 0 ? `🔥 Streak active (${streak} days) — leaves are green and healthy!` : '⚠️ Your streak is 0 days — complete a mission today to keep your tree flourishing!'}<br><br>
            <div style="display:flex; gap:6px;">
                <button class="chat-action-btn" data-chat-cmd="choose mission">🌱 Earn Points to Grow Tree</button>
            </div>
        `;
    }

    // Natural conversation: In-chat mission completion (e.g. "I rode my bike", "I recycled", "I walked")
    if (q.includes('biked') || q.includes('walked') || q.includes('recycled') || q.includes('completed') || q.includes('did it') || q.includes('cooked')) {
        const activeMissions = s.activeMissions || [];
        if (activeMissions.length > 0) {
            const firstActive = MISSIONS.find(m => m.id === activeMissions[0]);
            if (firstActive) {
                return `
                    Awesome effort, ${name}! 🎉 Did you finish the active mission <strong>${firstActive.title}</strong>?<br><br>
                    <button class="btn btn--primary btn--sm chat-complete-mission" data-mission-id="${firstActive.id}">Log "${firstActive.title}" (+${firstActive.points} pts)</button>
                `;
            }
        }
    }

    // Recycling Quick Lookup
    if (q.includes('recycle') || q.includes('disposal') || q.includes('bin') || q.includes('bottle') || q.includes('box')) {
        const results = searchRecyclingItems(q);
        if (results.length > 0) {
            const item = results[0];
            return `
                ♻️ <strong>${item.name} Disposal:</strong><br>
                <strong>Bin:</strong> ${item.isRecyclable ? '✅ Recyclable Bin' : '❌ Trash / Special Disposal'}<br><br>
                ${item.instructions.map(step => `• ${step}`).join('<br>')}<br><br>
                💡 <em>${item.tips}</em>
            `;
        }
    }

    // No local command matched — return null to trigger Gemini AI
    return null;
}

/**
 * Handle clicks on dynamic buttons inside chat bubbles
 */
function handleChatBubbleClick(e) {
    // 1. Command Action Buttons
    const cmdBtn = e.target.closest('.chat-action-btn');
    if (cmdBtn) {
        const cmd = cmdBtn.dataset.chatCmd;
        const text = cmdBtn.textContent;
        handleUserQuery(cmd, text);
        return;
    }

    // 2. Accept Mission Button
    const acceptBtn = e.target.closest('.chat-accept-mission');
    if (acceptBtn) {
        const missionId = acceptBtn.dataset.missionId;
        const active = state.get('activeMissions') || [];
        if (!active.includes(missionId)) {
            state.set('activeMissions', [...active, missionId]);
        }
        acceptBtn.disabled = true;
        acceptBtn.textContent = '✓ Accepted';
        acceptBtn.className = 'btn btn--ghost btn--sm';
        showToast({ title: 'Mission Accepted!', message: 'Track it in Dashboard', type: 'success', icon: '🎯' });
        return;
    }

    // 3. Complete Mission Button inside Chat
    const completeBtn = e.target.closest('.chat-complete-mission');
    if (completeBtn) {
        const missionId = completeBtn.dataset.missionId;
        const res = completeMission(missionId);
        if (res) {
            completeBtn.disabled = true;
            completeBtn.textContent = `✓ Logged (+${res.totalPoints} pts)`;
            completeBtn.className = 'btn btn--ghost btn--sm';
            showScorePopup(res.totalPoints);
            showConfetti(25);
            showToast({ title: `+${res.totalPoints} Points Earned!`, message: 'Awesome sustainability action!', type: 'success', icon: '🎉' });

            // Follow-up chat response
            setTimeout(() => {
                appendMessage(`
                    🎉 Woohoo! Mission logged! You earned <strong>+${res.totalPoints} Green Points</strong>.<br>
                    Your new Green Score is <strong>${res.newGreenScore} pts</strong>! 🌿<br><br>
                    <button class="chat-action-btn" data-chat-cmd="choose mission">🎯 Log Another Mission</button>
                `, 'bot');
            }, 600);
        }
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
