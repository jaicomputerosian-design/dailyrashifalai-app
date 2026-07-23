// VedaAstra AI - Core Web Client Application Logic

// Application State
const state = {
    lang: 'hi', // 'hi' or 'en'
    currentTab: 'chat', // AI Chat highlighted first!
    chartType: 'd1', // 'd1' (Rashi) or 'd9' (Navamsha)
    activeProfile: null,
    activeChart: null,
    dashas: [],
    dailyInsights: null,
    chatHistory: [],
    conversationId: null,
    subscriptionTier: 'free',
    freeSecondsLeft: 60, // 1 Minute Free Timer
    isTimerExpired: false,
    hourlyCreditsLeft: 30, // Hourly AI Credit limit (30/hour)
    openAiApiKey: localStorage.getItem('vedaastra_openai_key') || ''
};

// Bilingual UI Strings Dictionary
const I18N = {
    hi: {
        brandSubtitle: 'भारत के वेद, पुराण एवं ज्योतिष शास्त्रों द्वारा प्रामाणिक मार्गदर्शन',
        navProfile: 'जन्म प्रोफ़ाइल',
        navKundli: 'कुंडली व नवांश',
        navDasha: 'विंशोत्तरी दशा',
        navChat: '🤖 AI ज्योतिष चैट (प्रमुख)',
        navDaily: 'दैनिक गोचर फल',
        navLibrary: 'ग्रंथ ज्ञान-भंडार',
        navUpgrade: 'सदस्यता एवं प्लान',

        titleProfile: 'जन्म प्रोफ़ाइल एवं स्थान विवरण',
        descProfile: 'सटीक ग्रह स्थिति और दशा गणना के लिए अपना जन्म-विवरण दर्ज करें।',
        labelName: 'नाम',
        labelDOB: 'जन्म तिथि',
        labelTOB: 'जन्म समय',
        labelApproxTime: 'अनुमानित जन्म समय है (समय शुद्ध नहीं है)',
        labelPlace: 'जन्म स्थान / नगर',
        labelLat: 'अक्षांश (Latitude)',
        labelLon: 'देशांतर (Longitude)',
        labelTZ: 'समय-क्षेत्र (Timezone Offset)',
        btnCalculate: 'कुंडली तैयार करें',

        titleKundli: 'वैदिक कुंडली चार्ट एवं ग्रह स्थिति',
        descKundli: 'उत्तर भारतीय पद्धति, निरयण लाहिड़ी अयनांश (23.85°), ग्रह अंश, नक्षत्र-पाद एवं दृष्टियाँ।',
        tabD1: 'राशि कुंडली (D1)',
        tabD9: 'नवांश कुंडली (D9)',

        colPlanet: 'ग्रह',
        colSign: 'राशि',
        colDegree: 'अंश (Degree)',
        colNakshatra: 'नक्षत्र-पाद',
        colHouse: 'भाव (House)',
        colRetro: 'वक्री स्थिति',
        colDrishti: 'दृष्टियाँ (Aspects)',

        titleDasha: 'विंशोत्तरी दशा समयरेखा',
        descDasha: 'जन्म कालीन चंद्रमा नक्षत्र के अनुसार 120-वर्षीय महादशा एवं अंतर्दशा चक्र।',

        titleChat: '🤖 AI वैदिक ज्योतिष चैट (भारत के वेद, पुराण व शास्त्र से सही रास्ता)',
        descChat: 'अपना नाम, जन्म तिथि व समय देकर भारत के शास्त्रों से अपना सही मार्ग व उपाय जानें।',
        chip1: 'वेद व पुराणों के अनुसार मेरा सही रास्ता व करियर क्या है?',
        chip2: 'विवाह व जीवनसाथी का योग कैसा रहेगा?',
        chip3: 'धन संचय और आर्थिक उन्नति का क्या शास्त्र मार्ग है?',
        chip4: 'वर्तमान महादशा का क्या प्रभाव पड़ेगा?',
        chip5: 'मानसिक शांति व दैनिक पूजा के क्या वैदिक उपाय हैं?',
        inputPlaceholder: 'अपना नाम, जन्म समय या प्रश्न यहाँ लिखें...',
        btnSend: 'शास्त्रों से रास्ता जानें',

        titleDaily: 'व्यक्तिगत दैनिक गोचर फल',
        descDaily: 'आपकी जन्म-कुंडली + वर्तमान ग्रह गोचर (Gochar) के संयुक्त प्रभाव पर आधारित।',
        labelCareerScore: 'करियर व कर्म',
        labelRelScore: 'संबध व संवाद',
        labelMindScore: 'मानसिक शांति',
        labelRemedy: 'आज का दैनिक वैदिक उपाय',

        titleLibrary: 'सत्यापित शास्त्रीय ग्रंथ भंडार (वेद, पुराण, शास्त्र)',
        descLibrary: 'AI द्वारा प्रयुक्त मूल श्लोक, वेद सुक्त एवं पुराण संदर्भ।',

        basisHeader: 'गणना का आधार (कुंडली तथ्य):',
        sourceHeader: 'भारत के शास्त्र संदर्भ (Vedas, Puranas & Shastras):',
        cautionHeader: 'आवश्यक सावधानी एवं अस्वीकरण:'
    },
    en: {
        brandSubtitle: 'Authentic Scriptural Guidance from Bharat\'s Vedas, Puranas & Shastras',
        navProfile: 'Birth Profile',
        navKundli: 'Kundli & Navamsha',
        navDasha: 'Vimshottari Dasha',
        navChat: '🤖 AI Astro Chat (Featured)',
        navDaily: 'Daily Transits',
        navLibrary: 'Scripture Library',
        navUpgrade: 'Plans & Pricing',

        titleProfile: 'Birth Profile & Location Details',
        descProfile: 'Enter exact birth details for accurate Lahiri planetary coordinates & Vimshottari dasha.',
        labelName: 'Full Name',
        labelDOB: 'Date of Birth',
        labelTOB: 'Time of Birth',
        labelApproxTime: 'Approximate birth time (exact time unavailable)',
        labelPlace: 'Birth Location / City',
        labelLat: 'Latitude',
        labelLon: 'Longitude',
        labelTZ: 'Timezone Offset (Hours)',
        btnCalculate: 'Generate Kundli',

        titleKundli: 'Vedic Kundli Chart & Planetary Matrix',
        descKundli: 'North Indian Diamond Chart, Nirayana Lahiri Ayanamsha (23.85°), Nakshatras & Aspects.',
        tabD1: 'Rashi Chart (D1)',
        tabD9: 'Navamsha Chart (D9)',

        colPlanet: 'Planet',
        colSign: 'Zodiac Sign',
        colDegree: 'Degree',
        colNakshatra: 'Nakshatra & Pada',
        colHouse: 'House',
        colRetro: 'Retrograde',
        colDrishti: 'Aspects (Drishti)',

        titleDasha: 'Vimshottari Dasha Timeline',
        descDasha: '120-Year Mahadasha & Antardasha schedule calculated from Moon Nakshatra degree.',

        titleChat: '🤖 AI Vedic Astro Chat (True Scriptural Path)',
        descChat: 'Enter your birth details to reveal your True Path guided by Bharat\'s Vedas & Puranas.',
        chip1: 'What is my True Path & Career trajectory as per Vedas?',
        chip2: 'What are the traits of my prospective life partner?',
        chip3: 'What is the scriptural remedy for wealth & financial growth?',
        chip4: 'What is the impact of my current active Mahadasha?',
        chip5: 'What daily spiritual remedies are recommended for peace?',
        inputPlaceholder: 'Ask a question or enter your birth details...',
        btnSend: 'Reveal True Path',

        titleDaily: 'Personalized Daily Transit Insights',
        descDaily: 'Calculated using combined Natal Kundli + Current Real-Time Planetary Transits.',
        labelCareerScore: 'Career & Work',
        labelRelScore: 'Relationships & Harmony',
        labelMindScore: 'Mental Clarity',
        labelRemedy: 'Daily Recommended Vedic Remedy',

        titleLibrary: 'Verified Scripture Library (Vedas, Puranas)',
        descLibrary: 'Browse authentic Shlokas, Veda Suktas, and Purana citations used by the RAG search engine.',

        basisHeader: 'Astrological Basis (Chart Facts):',
        sourceHeader: 'Scriptural Citation (Vedas, Puranas & Shastras):',
        cautionHeader: 'Cautious Guidance & Disclaimer:'
    }
};

// Preset Locations Database
const LOCATION_PRESETS = [
    { name: "New Delhi, India", lat: 28.6139, lon: 77.2090, tz: 5.5 },
    { name: "Mumbai, India", lat: 19.0760, lon: 72.8777, tz: 5.5 },
    { name: "Varanasi, India", lat: 25.3176, lon: 82.9739, tz: 5.5 },
    { name: "London, UK", lat: 51.5074, lon: -0.1278, tz: 0.0 },
    { name: "New York, USA", lat: 40.7128, lon: -74.0060, tz: -5.0 },
    { name: "San Francisco, USA", lat: 37.7749, lon: -122.4194, tz: -8.0 },
    { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708, tz: 4.0 },
    { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093, tz: 10.0 }
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    fetchDefaultChart();
    startFreeUsageTimer();
    switchTab('chat');
});

function initUI() {
    updateLanguageTexts();
    
    // Tab Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // Preset Location Selector
    const cityInput = document.getElementById('input-place');
    if (cityInput) {
        cityInput.addEventListener('change', (e) => {
            const match = LOCATION_PRESETS.find(p => p.name.toLowerCase() === e.target.value.toLowerCase());
            if (match) {
                document.getElementById('input-lat').value = match.lat;
                document.getElementById('input-lon').value = match.lon;
                document.getElementById('input-tz').value = match.tz;
            }
        });
    }

    // Chart Form Submit
    document.getElementById('form-birth-profile').addEventListener('submit', (e) => {
        e.preventDefault();
        generateUserChart();
    });

    // AI Chat Input
    document.getElementById('btn-send-chat').addEventListener('click', sendChatMessage);
    document.getElementById('input-chat-query').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

// 1-Minute Free Usage Live Countdown Timer
function startFreeUsageTimer() {
    const timerInterval = setInterval(() => {
        if (state.subscriptionTier === 'day_pass') {
            document.getElementById('free-timer-display').innerText = '1 Day Pass Active';
            clearInterval(timerInterval);
            return;
        }

        state.freeSecondsLeft--;
        if (state.freeSecondsLeft <= 0) {
            state.freeSecondsLeft = 0;
            state.isTimerExpired = true;
            document.getElementById('free-timer-display').innerText = '00:00 (Expired)';
            clearInterval(timerInterval);
            showPaywallModal();
        } else {
            const secs = state.freeSecondsLeft % 60;
            const mins = Math.floor(state.freeSecondsLeft / 60);
            const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            document.getElementById('free-timer-display').innerText = formatted;
        }
    }, 1000);
}

function updateHourlyCreditsUI() {
    const creditBadge = document.getElementById('hourly-credit-display');
    if (creditBadge) {
        creditBadge.innerText = `${state.hourlyCreditsLeft}/30`;
    }
}

function showPaywallModal() {
    document.getElementById('paywall-modal').classList.add('active');
    document.getElementById('input-chat-query').disabled = true;
    document.getElementById('btn-send-chat').disabled = true;
}

function hidePaywallModal() {
    document.getElementById('paywall-modal').classList.remove('active');
}

// OpenAI API Key Modal Controls
function openApiKeyModal() {
    document.getElementById('input-api-key-val').value = state.openAiApiKey;
    document.getElementById('apikey-modal').classList.add('active');
}

function closeApiKeyModal() {
    document.getElementById('apikey-modal').classList.remove('active');
}

function saveOpenAiKey() {
    const val = document.getElementById('input-api-key-val').value.trim();
    state.openAiApiKey = val;
    localStorage.setItem('vedaastra_openai_key', val);
    closeApiKeyModal();
    alert(state.lang === 'hi' ? 'आपकी ChatGPT API Key सुरक्षित रूप से सहेज ली गई है!' : 'Your ChatGPT API Key has been saved successfully!');
}

function toggleLanguage() {
    state.lang = state.lang === 'hi' ? 'en' : 'hi';
    document.getElementById('lang-toggle-btn').innerText = state.lang === 'hi' ? 'English' : 'हिंदी';
    updateLanguageTexts();
    if (state.activeChart) {
        renderChartUI(state.activeChart);
        renderDashaUI(state.dashas);
        renderDailyUI();
    }
}

function updateLanguageTexts() {
    const texts = I18N[state.lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) {
            el.innerText = texts[key];
        }
    });
    
    const chatInput = document.getElementById('input-chat-query');
    if (chatInput) chatInput.placeholder = texts.inputPlaceholder;
}

function switchTab(tabId) {
    state.currentTab = tabId;
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.toggle('active', el.id === `tab-${tabId}`);
    });
}

// Fetch Initial Default Chart
async function fetchDefaultChart() {
    try {
        const res = await fetch('/api/charts/chart_default');
        if (res.ok) {
            const chart = await res.json();
            state.activeChart = chart;
            renderChartUI(chart);
            fetchDashas(chart.chart_id);
            fetchDaily(chart.chart_id);
        }
    } catch (err) {
        console.error("Failed to load default chart:", err);
    }
}

// Generate Chart on Form Submission
async function generateUserChart() {
    const profile = {
        name: document.getElementById('input-name').value || "User Profile",
        dob: document.getElementById('input-dob').value,
        tob: document.getElementById('input-tob').value,
        is_approx_time: document.getElementById('input-approx').checked,
        place_name: document.getElementById('input-place').value,
        latitude: parseFloat(document.getElementById('input-lat').value),
        longitude: parseFloat(document.getElementById('input-lon').value),
        timezone_offset: parseFloat(document.getElementById('input-tz').value)
    };

    try {
        const res = await fetch('/api/charts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        });
        if (res.ok) {
            const chart = await res.json();
            state.activeChart = chart;
            renderChartUI(chart);
            fetchDashas(chart.chart_id);
            fetchDaily(chart.chart_id);
            switchTab('chat');
        }
    } catch (err) {
        alert("Error generating chart: " + err.message);
    }
}

// Render North Indian Kundli Diamond SVG Layout
function renderNorthIndianKundliSVG(chart, isD9 = false) {
    const planetsList = isD9 ? chart.navamsha_planets : chart.planets;
    const lagnaSign = isD9 ? chart.navamsha_planets.find(p => p.name === 'Lagna').sign_number : chart.lagna_sign;

    const houseSigns = {};
    for (let h = 1; h <= 12; h++) {
        houseSigns[h] = ((lagnaSign - 1 + (h - 1)) % 12) + 1;
    }

    const housePlanets = {};
    for (let h = 1; h <= 12; h++) housePlanets[h] = [];
    planetsList.forEach(p => {
        if (p.name !== 'Lagna') {
            housePlanets[p.house].push(p);
        }
    });

    const houseCoords = {
        1:  { signX: 200, signY: 150, pX: 200, pY: 175 },
        2:  { signX: 100, signY: 50,  pX: 100, pY: 75 },
        3:  { signX: 50,  signY: 100, pX: 50,  pY: 125 },
        4:  { signX: 150, signY: 200, pX: 125, pY: 220 },
        5:  { signX: 50,  signY: 300, pX: 50,  pY: 325 },
        6:  { signX: 100, signY: 350, pX: 100, pY: 375 },
        7:  { signX: 200, signY: 250, pX: 200, pY: 275 },
        8:  { signX: 300, signY: 350, pX: 300, pY: 375 },
        9:  { signX: 350, signY: 300, pX: 350, pY: 325 },
        10: { signX: 250, signY: 200, pX: 275, pY: 220 },
        11: { signX: 350, signY: 100, pX: 350, pY: 125 },
        12: { signX: 300, signY: 50,  pX: 300, pY: 75 }
    };

    let svg = `
    <svg viewBox="0 0 400 400" class="kundli-svg" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="380" height="380" fill="none" stroke="#F59E0B" stroke-width="2.5" />
        <line x1="10" y1="10" x2="390" y2="390" class="kundli-grid-line" />
        <line x1="390" y1="10" x2="10" y2="390" class="kundli-grid-line" />
        <polygon points="200,10 390,200 200,390 10,200" fill="none" stroke="#F59E0B" stroke-width="2" />
    `;

    for (let h = 1; h <= 12; h++) {
        const signNum = houseSigns[h];
        const coords = houseCoords[h];

        svg += `<text x="${coords.signX}" y="${coords.signY}" text-anchor="middle" class="kundli-house-num">${signNum}</text>`;

        const plist = housePlanets[h];
        if (plist.length > 0) {
            let pStr = plist.map(p => {
                const name = state.lang === 'hi' ? p.name_hi : p.name;
                const retro = p.is_retrograde ? '(R)' : '';
                return `${name}${retro}`;
            }).join(' ');
            svg += `<text x="${coords.pX}" y="${coords.pY}" text-anchor="middle" class="kundli-planet-text">${pStr}</text>`;
        }
    }

    svg += `</svg>`;
    return svg;
}

function renderChartUI(chart) {
    const svgContainer = document.getElementById('kundli-svg-box');
    if (svgContainer) {
        svgContainer.innerHTML = renderNorthIndianKundliSVG(chart, state.chartType === 'd9');
    }

    const tableBody = document.getElementById('planetary-table-body');
    if (tableBody) {
        const planetsList = state.chartType === 'd9' ? chart.navamsha_planets : chart.planets;
        tableBody.innerHTML = planetsList.map(p => `
            <tr>
                <td style="font-weight:700; color:var(--text-gold);">${state.lang === 'hi' ? p.name_hi : p.name}</td>
                <td>${state.lang === 'hi' ? p.sign_name_hi : p.sign_name} (${p.sign_number})</td>
                <td>${p.degree_formatted}</td>
                <td>${state.lang === 'hi' ? p.nakshatra_hi : p.nakshatra} (पाद ${p.pada})</td>
                <td style="font-weight:600;">${p.house}</td>
                <td>${p.is_retrograde ? '<span style="color:#EF4444; font-weight:bold;">वक्री (Retro)</span>' : 'मार्गी (Direct)'}</td>
                <td>${p.drishti_houses.length ? p.drishti_houses.join(', ') : '-'}</td>
            </tr>
        `).join('');
    }
}

function setChartType(type) {
    state.chartType = type;
    document.getElementById('btn-chart-d1').classList.toggle('active', type === 'd1');
    document.getElementById('btn-chart-d9').classList.toggle('active', type === 'd9');
    if (state.activeChart) {
        renderChartUI(state.activeChart);
    }
}

async function fetchDashas(chartId) {
    try {
        const res = await fetch(`/api/charts/${chartId}/dashas`);
        if (res.ok) {
            state.dashas = await res.json();
            renderDashaUI(state.dashas);
        }
    } catch (err) {
        console.error("Dasha fetch failed:", err);
    }
}

function renderDashaUI(dashas) {
    const container = document.getElementById('dasha-timeline-box');
    if (!container) return;

    container.innerHTML = dashas.map(d => {
        const title = state.lang === 'hi' ? d.lord_hi : d.lord;
        const interp = state.lang === 'hi' ? d.interpretation_hi : d.interpretation_en;
        const activeClass = d.is_current ? 'current' : '';

        return `
            <div class="dasha-card ${activeClass}">
                <div class="dasha-header">
                    <span class="dasha-title">
                        ${d.is_current ? '🌟 ' : ''}${title} ${state.lang === 'hi' ? 'महादशा' : 'Mahadasha'}
                    </span>
                    <span class="dasha-dates">${d.start_date} से ${d.end_date}</span>
                </div>
                <p style="font-size:0.88rem; color:var(--text-muted); margin-top:8px;">${interp}</p>
            </div>
        `;
    }).join('');
}

async function fetchDaily(chartId) {
    try {
        const res = await fetch(`/api/charts/${chartId}/daily?lang=${state.lang}`);
        if (res.ok) {
            state.dailyInsights = await res.json();
            renderDailyUI();
        }
    } catch (err) {
        console.error("Daily insights fetch failed:", err);
    }
}

function renderDailyUI() {
    if (!state.dailyInsights) return;
    const d = state.dailyInsights;

    document.getElementById('daily-transit-moon').innerText = d.moon_transit;
    document.getElementById('daily-career-text').innerText = d.career_text;
    document.getElementById('daily-rel-text').innerText = d.relationship_text;
    document.getElementById('daily-mind-text').innerText = d.mental_clarity_text;
    document.getElementById('daily-remedy-text').innerText = d.remedy;
}

// AI Chat Interaction
function sendQuickChip(chipText) {
    if (state.isTimerExpired) {
        showPaywallModal();
        return;
    }
    document.getElementById('input-chat-query').value = chipText;
    sendChatMessage();
}

async function sendChatMessage() {
    if (state.isTimerExpired) {
        showPaywallModal();
        return;
    }

    if (state.hourlyCreditsLeft <= 0) {
        alert(state.lang === 'hi' ? 'आपकी 1 घंटे की AI क्रेडिट सीमा (30 प्रश्न/घंटा) समाप्त हो गई है। कृपया अगली अवधि का प्रतीक्षा करें।' : 'Hourly AI Credit limit (30/hour) reached. Please wait for the next hour window.');
        return;
    }

    const input = document.getElementById('input-chat-query');
    const query = input.value.trim();
    if (!query) return;

    input.value = '';
    const chatBox = document.getElementById('chat-history-box');

    chatBox.innerHTML += `
        <div class="chat-message user">
            <strong>${query}</strong>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;

    const loadingId = 'loading-' + Date.now();
    chatBox.innerHTML += `
        <div class="chat-message ai" id="${loadingId}">
            <em>✨ ${state.lang === 'hi' ? 'भारत के वेद, पुराण एवं शास्त्रों से आपका सत्य मार्ग मैच किया जा रहा है...' : 'Matching birth profile with Bharat\'s Vedas, Puranas & Shastras...'}</em>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const chartId = state.activeChart ? state.activeChart.chart_id : 'chart_default';
        const res = await fetch('/api/astro-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chart_id: chartId,
                conversation_id: state.conversationId,
                question: query,
                language: state.lang,
                api_key: state.openAiApiKey
            })
        });

        if (res.ok) {
            const data = await res.json();
            const loadingElem = document.getElementById(loadingId);

            // Deduct hourly credit
            state.hourlyCreditsLeft = Math.max(0, state.hourlyCreditsLeft - 1);
            updateHourlyCreditsUI();

            const basisList = data.astrological_basis.map(b => `<li>${b}</li>`).join('');
            const sourcesList = data.source_references.map(s => `
                <div class="source-box">
                    <strong>📖 ${state.lang === 'hi' ? s.title_hi : s.title}</strong> (${s.shloka_ref})
                    ${s.text_sanskrit ? `<div class="shloka-text">${s.text_sanskrit}</div>` : ''}
                    <p style="margin-top:4px;">${state.lang === 'hi' ? s.text_hi : s.text_en}</p>
                </div>
            `).join('');

            loadingElem.innerHTML = `
                <div style="white-space: pre-wrap;">${data.answer_text}</div>

                <div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--border-glass);">
                    <strong style="color:var(--text-gold);">${I18N[state.lang].basisHeader}</strong>
                    <ul style="margin-left:20px; font-size:0.88rem; color:var(--text-muted); margin-top:4px;">${basisList}</ul>
                </div>

                <div style="margin-top:10px;">
                    <strong style="color:var(--text-gold);">${I18N[state.lang].sourceHeader}</strong>
                    ${sourcesList}
                </div>

                <div class="caution-box">
                    <strong>⚠️ ${I18N[state.lang].cautionHeader}</strong> ${data.caution_disclaimer}
                </div>
            `;
            chatBox.scrollTop = chatBox.scrollHeight;
        } else if (res.status === 429) {
            const errData = await res.json();
            const loadingElem = document.getElementById(loadingId);
            loadingElem.innerHTML = `<span style="color:#EF4444; font-weight:bold;">⚠️ ${errData.detail}</span>`;
        }
    } catch (err) {
        console.error("Chat error:", err);
    }
}

// Payment Simulator (Plan 1: ₹100 / 1 Min, Plan 2: ₹3000 / 1 Day Pass)
function buyMinuteRecharge() {
    state.isTimerExpired = false;
    state.freeSecondsLeft = 60; // 1 min recharge
    hidePaywallModal();
    document.getElementById('input-chat-query').disabled = false;
    document.getElementById('btn-send-chat').disabled = false;
    alert(state.lang === 'hi' ? 'सफल! ₹100 की दर से आपका समय 1 मिनट के लिए बढ़ा दिया गया है।' : 'Success! Recharged 1 minute usage at ₹100.');
    startFreeUsageTimer();
}

function buyDayPass() {
    state.subscriptionTier = 'day_pass';
    state.isTimerExpired = false;
    hidePaywallModal();
    document.getElementById('user-tier-badge').innerText = '☀️ ₹3000 Day Pass Active';
    document.getElementById('free-timer-display').innerText = '1 Day Pass Active';
    document.getElementById('input-chat-query').disabled = false;
    document.getElementById('btn-send-chat').disabled = false;
    alert(state.lang === 'hi' ? 'बधाई हो! आपका 1 दिन का अनलिमिटेड पास (₹3000/दिन) सक्रिय हो गया है।' : 'Congratulations! Your 1-Day Unlimited Chat Pass (₹3000/day) is active.');
}
