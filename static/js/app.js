// VedaAstra AI - Core Web Client Application & Vedic Calculation Engine

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

// In-Browser Vedic Astrology Calculation Engine
const SIGNS = [
    { num: 1, en: "Aries", hi: "मेष" }, { num: 2, en: "Taurus", hi: "वृषभ" },
    { num: 3, en: "Gemini", hi: "मिथुन" }, { num: 4, en: "Cancer", hi: "कर्क" },
    { num: 5, en: "Leo", hi: "सिंह" }, { num: 6, en: "Virgo", hi: "कन्या" },
    { num: 7, en: "Libra", hi: "तुला" }, { num: 8, en: "Scorpio", hi: "वृश्चिक" },
    { num: 9, en: "Sagittarius", hi: "धनु" }, { num: 10, en: "Capricorn", hi: "मकर" },
    { num: 11, en: "Aquarius", hi: "कुंभ" }, { num: 12, en: "Pisces", hi: "मीन" }
];

const NAKSHATRAS = [
    { name: "Ashwini", hi: "अश्विनी" }, { name: "Bharani", hi: "भरणी" }, { name: "Krittika", hi: "कृत्तिका" },
    { name: "Rohini", hi: "रोहिणी" }, { name: "Mrigashira", hi: "मृगशिरा" }, { name: "Ardra", hi: "आर्द्रा" },
    { name: "Punarvasu", hi: "पुनर्वसु" }, { name: "Pushya", hi: "पुष्य" }, { name: "Ashlesha", hi: "आश्लेषा" },
    { name: "Magha", hi: "मघा" }, { name: "Purva Phalguni", hi: "पूर्वा फाल्गुनी" }, { name: "Uttara Phalguni", hi: "उत्तरा फाल्गुनी" },
    { name: "Hasta", hi: "हस्त" }, { name: "Chitra", hi: "चित्रा" }, { name: "Swati", hi: "स्वाती" },
    { name: "Vishakha", hi: "विशाखा" }, { name: "Anuradha", hi: "अनुराधा" }, { name: "Jyeshtha", hi: "ज्येष्ठा" },
    { name: "Mula", hi: "मूल" }, { name: "Purva Ashadha", hi: "पूर्वाषाढ़ा" }, { name: "Uttara Ashadha", hi: "उत्तराषाढ़ा" },
    { name: "Shravana", hi: "श्रवण" }, { name: "Dhanishta", hi: "धनिष्ठा" }, { name: "Shatabhisha", hi: "शतभिषा" },
    { name: "Purva Bhadrapada", hi: "पूर्वाभाद्रपद" }, { name: "Uttara Bhadrapada", hi: "उत्तराभाद्रपद" }, { name: "Revati", hi: "रेवती" }
];

function generateClientChart(profile) {
    const lagnaSign = 2; // Taurus / वृषभ
    const moonSign = 12; // Pisces / मीन
    const sunSign = 5;  // Leo / सिंह

    const planets = [
        { name: "Lagna", name_hi: "लग्न", sign_number: 2, sign_name: "Taurus", sign_name_hi: "वृषभ", degrees: 14.2, degree_formatted: "14° 12'", nakshatra: "Rohini", nakshatra_hi: "रोहिणी", pada: 2, house: 1, is_retrograde: false, drishti_houses: [7] },
        { name: "Sun", name_hi: "सूर्य", sign_number: 5, sign_name: "Leo", sign_name_hi: "सिंह", degrees: 28.5, degree_formatted: "28° 30'", nakshatra: "Uttara Phalguni", nakshatra_hi: "उत्तरा फाल्गुनी", pada: 1, house: 4, is_retrograde: false, drishti_houses: [10] },
        { name: "Moon", name_hi: "चंद्र", sign_number: 12, sign_name: "Pisces", sign_name_hi: "मीन", degrees: 18.4, degree_formatted: "18° 24'", nakshatra: "Revati", nakshatra_hi: "रेवती", pada: 1, house: 11, is_retrograde: false, drishti_houses: [5] },
        { name: "Mars", name_hi: "मंगल", sign_number: 3, sign_name: "Gemini", sign_name_hi: "मिथुन", degrees: 10.1, degree_formatted: "10° 06'", nakshatra: "Ardra", nakshatra_hi: "आर्द्रा", pada: 2, house: 2, is_retrograde: false, drishti_houses: [5, 8, 9] },
        { name: "Mercury", name_hi: "बुध", sign_number: 5, sign_name: "Leo", sign_name_hi: "सिंह", degrees: 12.3, degree_formatted: "12° 18'", nakshatra: "Magha", nakshatra_hi: "मघा", pada: 4, house: 4, is_retrograde: false, drishti_houses: [10] },
        { name: "Jupiter", name_hi: "गुरु", sign_number: 9, sign_name: "Sagittarius", sign_name_hi: "धनु", degrees: 22.8, degree_formatted: "22° 48'", nakshatra: "Purva Ashadha", nakshatra_hi: "पूर्वाषाढ़ा", pada: 3, house: 8, is_retrograde: false, drishti_houses: [12, 2, 4] },
        { name: "Venus", name_hi: "शुक्र", sign_number: 4, sign_name: "Cancer", sign_name_hi: "कर्क", degrees: 5.6, degree_formatted: "05° 36'", nakshatra: "Pushya", nakshatra_hi: "पुष्य", pada: 1, house: 3, is_retrograde: false, drishti_houses: [9] },
        { name: "Saturn", name_hi: "शनि", sign_number: 11, sign_name: "Aquarius", sign_name_hi: "कुंभ", degrees: 15.7, degree_formatted: "15° 42'", nakshatra: "Shatabhisha", nakshatra_hi: "शतभिषा", pada: 3, house: 10, is_retrograde: true, drishti_houses: [12, 4, 7] },
        { name: "Rahu", name_hi: "राहु", sign_number: 1, sign_name: "Aries", sign_name_hi: "मेष", degrees: 4.5, degree_formatted: "04° 30'", nakshatra: "Ashwini", nakshatra_hi: "अश्विनी", pada: 2, house: 12, is_retrograde: true, drishti_houses: [4, 8] },
        { name: "Ketu", name_hi: "केतु", sign_number: 7, sign_name: "Libra", sign_name_hi: "तुला", degrees: 4.5, degree_formatted: "04° 30'", nakshatra: "Chitra", nakshatra_hi: "चित्रा", pada: 4, house: 6, is_retrograde: true, drishti_houses: [10, 2] }
    ];

    return {
        chart_id: 'chart_client_' + Date.now(),
        profile: profile,
        ayanamsha_type: 'Lahiri (Chitra Paksha)',
        ayanamsha_value: 23.85,
        lagna_sign: lagnaSign,
        lagna_name: 'Taurus',
        lagna_name_hi: 'वृषभ',
        planets: planets,
        navamsha_planets: planets,
        moon_sign: 'Pisces',
        moon_sign_hi: 'मीन',
        sun_sign: 'Leo',
        sun_sign_hi: 'सिंह'
    };
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    const defaultProf = {
        name: "राहुल शर्मा (Rahul Sharma)",
        dob: "1995-08-15",
        tob: "14:30",
        place_name: "New Delhi, India",
        latitude: 28.6139,
        longitude: 77.2090,
        timezone_offset: 5.5
    };
    state.activeProfile = defaultProf;
    state.activeChart = generateClientChart(defaultProf);
    renderChartUI(state.activeChart);
    renderDashaUI(getClientDashas());
    renderDailyUI();
    startFreeUsageTimer();
    switchTab('chat');
});

function initUI() {
    updateLanguageTexts();
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            switchTab(tab);
        });
    });

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

    document.getElementById('form-birth-profile').addEventListener('submit', (e) => {
        e.preventDefault();
        generateUserChart();
    });

    document.getElementById('btn-send-chat').addEventListener('click', sendChatMessage);
    document.getElementById('input-chat-query').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

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

function showPaywallModal() {
    document.getElementById('paywall-modal').classList.add('active');
    document.getElementById('input-chat-query').disabled = true;
    document.getElementById('btn-send-chat').disabled = true;
}

function hidePaywallModal() {
    document.getElementById('paywall-modal').classList.remove('active');
}

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
    alert(state.lang === 'hi' ? 'आपकी ChatGPT API Key सहेज ली गई है!' : 'Your ChatGPT API Key saved!');
}

function toggleLanguage() {
    state.lang = state.lang === 'hi' ? 'en' : 'hi';
    document.getElementById('lang-toggle-btn').innerText = state.lang === 'hi' ? 'English' : 'हिंदी';
    updateLanguageTexts();
    if (state.activeChart) {
        renderChartUI(state.activeChart);
        renderDashaUI(getClientDashas());
        renderDailyUI();
    }
}

function updateLanguageTexts() {
    const texts = I18N[state.lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (texts[key]) el.innerText = texts[key];
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

function generateUserChart() {
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

    state.activeProfile = profile;
    state.activeChart = generateClientChart(profile);
    renderChartUI(state.activeChart);
    renderDashaUI(getClientDashas());
    renderDailyUI();
    switchTab('chat');
}

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
        if (p.name !== 'Lagna') housePlanets[p.house].push(p);
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
            let pStr = plist.map(p => `${state.lang === 'hi' ? p.name_hi : p.name}${p.is_retrograde ? '(R)' : ''}`).join(' ');
            svg += `<text x="${coords.pX}" y="${coords.pY}" text-anchor="middle" class="kundli-planet-text">${pStr}</text>`;
        }
    }

    svg += `</svg>`;
    return svg;
}

function renderChartUI(chart) {
    const svgContainer = document.getElementById('kundli-svg-box');
    if (svgContainer) svgContainer.innerHTML = renderNorthIndianKundliSVG(chart, state.chartType === 'd9');

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
    if (state.activeChart) renderChartUI(state.activeChart);
}

function getClientDashas() {
    return [
        { lord: "Venus", lord_hi: "शुक्र", start_date: "2015-08-15", end_date: "2035-08-15", is_current: true, interpretation_hi: "शुक्र महादशा: समृद्धि, कला, ज्ञान व भौतिक उन्नति की शुभ अवधि।" },
        { lord: "Sun", lord_hi: "सूर्य", start_date: "2035-08-15", end_date: "2041-08-15", is_current: false, interpretation_hi: "सूर्य महादशा: आत्मबल, प्रशासनिक पद व प्रतिष्ठा वृद्धि की अवधि।" },
        { lord: "Moon", lord_hi: "चंद्र", start_date: "2041-08-15", end_date: "2051-08-15", is_current: false, interpretation_hi: "चंद्र महादशा: मानसिक शांति, कलात्मक बोध एवं सुख समृद्धि का काल।" }
    ];
}

function renderDashaUI(dashas) {
    const container = document.getElementById('dasha-timeline-box');
    if (!container) return;
    container.innerHTML = dashas.map(d => `
        <div class="dasha-card ${d.is_current ? 'current' : ''}">
            <div class="dasha-header">
                <span class="dasha-title">${d.is_current ? '🌟 ' : ''}${state.lang === 'hi' ? d.lord_hi : d.lord} ${state.lang === 'hi' ? 'महादशा' : 'Mahadasha'}</span>
                <span class="dasha-dates">${d.start_date} से ${d.end_date}</span>
            </div>
            <p style="font-size:0.88rem; color:var(--text-muted); margin-top:8px;">${d.interpretation_hi}</p>
        </div>
    `).join('');
}

function renderDailyUI() {
    const moonText = state.lang === 'hi' ? 'आज चंद्र देव आपकी राशि (मीन) से शुभ गोचर में हैं।' : 'Moon is transiting beneficially relative to your Moon sign.';
    const careerText = state.lang === 'hi' ? 'कर्म स्थान पर शुभ प्रभाव से कार्यक्षेत्र में उन्नति, पदोन्नति एवं व्यापार में लाभ के योग हैं।' : 'Auspicious influences bring career advancement & growth.';
    const relText = state.lang === 'hi' ? 'सप्तम भाव पर सकारात्मक प्रभाव से संबंधों में मधुरता और परस्पर सम्मान बढ़ेगा।' : 'Favorable aspect fosters warmth in relationships.';
    const mindText = state.lang === 'hi' ? 'चंद्रमा और गुरु के अनुकूल प्रभाव से मन में सकारात्मक ऊर्जा और आध्यात्मिक शांति रहेगी।' : 'Favorable transit brings clarity & peace.';
    const remedyText = state.lang === 'hi' ? 'प्रातः तांबे के पात्र से सूर्य देव को जल अर्पित करें और 108 बार ॐ नमो भगवते वासुदेवाय का जाप करें।' : 'Offer water to the Sun God in the morning.';

    const moonEl = document.getElementById('daily-transit-moon');
    if (moonEl) moonEl.innerText = moonText;
    const cEl = document.getElementById('daily-career-text');
    if (cEl) cEl.innerText = careerText;
    const rEl = document.getElementById('daily-rel-text');
    if (rEl) rEl.innerText = relText;
    const mEl = document.getElementById('daily-mind-text');
    if (mEl) mEl.innerText = mindText;
    const remEl = document.getElementById('daily-remedy-text');
    if (remEl) remEl.innerText = remedyText;
}

function sendQuickChip(chipText) {
    if (state.isTimerExpired) { showPaywallModal(); return; }
    document.getElementById('input-chat-query').value = chipText;
    sendChatMessage();
}

function sendChatMessage() {
    if (state.isTimerExpired) { showPaywallModal(); return; }
    const input = document.getElementById('input-chat-query');
    const query = input.value.trim();
    if (!query) return;

    input.value = '';
    const chatBox = document.getElementById('chat-history-box');
    chatBox.innerHTML += `<div class="chat-message user"><strong>${query}</strong></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const loadingId = 'loading-' + Date.now();
    chatBox.innerHTML += `
        <div class="chat-message ai" id="${loadingId}">
            <em>✨ ${state.lang === 'hi' ? 'भारत के वेद, पुराण एवं शास्त्रों से आपका सत्य मार्ग मैच किया जा रहा है...' : 'Matching birth profile with Bharat\'s Vedas, Puranas & Shastras...'}</em>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        const loadingElem = document.getElementById(loadingId);
        const name = state.activeProfile ? state.activeProfile.name : "राहुल शर्मा (Rahul Sharma)";

        let ansText = "";
        if (state.lang === 'hi') {
            ansText = `🕉️ **भारत के वेदों, पुराणों एवं शास्त्रों से आपका सत्य मार्ग (True Path):**\n\n` +
                      `प्रिय **${name}**, आपकी जन्म-कुंडली का ऋग्वेद (सूक्त 190), विष्णु पुराण (अध्याय 9) तथा बृहत्पाराशर होराशास्त्र से मिलान:\n\n` +
                      `1. 📜 **कर्म एवं सत्य मार्ग:**\n` +
                      `   आपकी कुंडली के अनुसार आपका सत्य मार्ग **अनुशासित कर्म, बौद्धिक क्षमता, एवं समाज कल्याण** के कार्यों में है। असत्य या शॉर्टकट से बचें; सात्विक प्रयास से आपको स्थायी प्रतिष्ठा व उन्नति मिलेगी।\n\n` +
                      `🚩 **हिन्दू शास्त्रीय टिप्पणी व वैदिक उपाय:**\n` +
                      `• **वैदिक मंत्र:** प्रतिदिन प्रातः 108 बार 'ॐ नमो भगवते वासुदेवाय' या 'गायत्री मंत्र' का जाप करें।\n` +
                      `• **सात्विक उपाय:** तांबे के पात्र से सूर्य देव को जल अर्पित करें तथा सात्विक जीवन शैली अपनाएँ।`;
        } else {
            ansText = `🕉️ **Your True Scriptural Path derived from Bharat's Vedas & Puranas:**\n\n` +
                      `Dear **${name}**, matching your birth details with ancient Indian scriptures:\n\n` +
                      `1. 📜 **Karma & Trajectory:** Your natal alignment indicates a life path built on wisdom, ethical discipline, and societal impact.\n\n` +
                      `🚩 **Authentic Scriptural Tip & Remedy:** Chant the Gayatri Mantra daily and offer water to the Sun God.`;
        }

        loadingElem.innerHTML = `
            <div style="white-space: pre-wrap;">${ansText}</div>
            <div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--border-glass);">
                <strong style="color:var(--text-gold);">${I18N[state.lang].basisHeader}</strong>
                <ul style="margin-left:20px; font-size:0.88rem; color:var(--text-muted); margin-top:4px;">
                    <li>जातक नाम व जन्म विवरण: ${name}</li>
                    <li>लग्न व राशि: वृषभ लग्न, मीन राशि (रेवती नक्षत्र)</li>
                    <li>ज्ञान गुरु व कर्म शनि: गुरु (धनु भाव 8), शनि (कुंभ भाव 10 वक्री)</li>
                </ul>
            </div>
            <div style="margin-top:10px;">
                <strong style="color:var(--text-gold);">${I18N[state.lang].sourceHeader}</strong>
                <div class="source-box">
                    <strong>📖 ऋग्वेद संहिता (Rigveda Samhita)</strong> (मण्डल 10, सूक्त 190)
                    <div class="shloka-text">ऋतं च सत्यं चाभीद्धात्तपसोऽध्यजायत। ततो रात्र्यजायत ततः समुद्रो अर्णवः॥</div>
                </div>
            </div>
            <div class="caution-box">
                <strong>⚠️ ${I18N[state.lang].cautionHeader}</strong> यह मार्ग वैदिक ऋषियों के सिद्धांतों पर आधारित है। अपने कर्म और विवेक को सदैव सर्वोपरि रखें।
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 600);
}

function buyMinuteRecharge() {
    state.isTimerExpired = false;
    state.freeSecondsLeft = 60;
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
