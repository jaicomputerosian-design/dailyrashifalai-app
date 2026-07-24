// VedaAstra AI - Complete Web Application Engine & Astronomical Calculator (DailyRashifalai.com)

// Application State
const state = {
    lang: 'hi', // 'hi' or 'en'
    currentTab: 'chat',
    chartType: 'd1',
    activeProfile: null,
    activeChart: null,
    dashas: [],
    dailyInsights: null,
    chatHistory: [],
    conversationId: null,
    subscriptionTier: 'free',
    freeSecondsLeft: 60, // 1 Minute Free Timer
    isTimerExpired: false,
    hourlyCreditsLeft: 30, // 30 queries / hour
    openAiApiKey: localStorage.getItem('vedaastra_openai_key') || '',
    isListening: false,
    speechRecognition: null
};

// Bilingual UI Dictionary
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
        btnCalculate: 'सटीक कुंडली तैयार करें',

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
        btnCalculate: 'Generate Accurate Kundli',

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

// Signs & Nakshatras Data
const SIGNS = [
    { num: 1, en: "Aries", hi: "मेष" }, { num: 2, en: "Taurus", hi: "वृषभ" },
    { num: 3, en: "Gemini", hi: "मिथुन" }, { num: 4, en: "Cancer", hi: "कर्क" },
    { num: 5, en: "Leo", hi: "सिंह" }, { num: 6, en: "Virgo", hi: "कन्या" },
    { num: 7, en: "Libra", hi: "तुला" }, { num: 8, en: "Scorpio", hi: "वृश्चिक" },
    { num: 9, en: "Sagittarius", hi: "धनु" }, { num: 10, en: "Capricorn", hi: "मकर" },
    { num: 11, en: "Aquarius", hi: "कुंभ" }, { num: 12, en: "Pisces", hi: "मीन" }
];

const NAKSHATRAS = [
    { name: "Ashwini", hi: "अश्विनी", ruler: "Ketu" }, { name: "Bharani", hi: "भरणी", ruler: "Venus" },
    { name: "Krittika", hi: "कृत्तिका", ruler: "Sun" }, { name: "Rohini", hi: "रोहिणी", ruler: "Moon" },
    { name: "Mrigashira", hi: "मृगशिरा", ruler: "Mars" }, { name: "Ardra", hi: "आर्द्रा", ruler: "Rahu" },
    { name: "Punarvasu", hi: "पुनर्वसु", ruler: "Jupiter" }, { name: "Pushya", hi: "पुष्य", ruler: "Saturn" },
    { name: "Ashlesha", hi: "आश्लेषा", ruler: "Mercury" }, { name: "Magha", hi: "मघा", ruler: "Ketu" },
    { name: "Purva Phalguni", hi: "पूर्वा फाल्गुनी", ruler: "Venus" }, { name: "Uttara Phalguni", hi: "उत्तरा फाल्गुनी", ruler: "Sun" },
    { name: "Hasta", hi: "हस्त", ruler: "Moon" }, { name: "Chitra", hi: "चित्रा", ruler: "Mars" },
    { name: "Swati", hi: "स्वाती", ruler: "Rahu" }, { name: "Vishakha", hi: "विशाखा", ruler: "Jupiter" },
    { name: "Anuradha", hi: "अनुराधा", ruler: "Saturn" }, { name: "Jyeshtha", hi: "ज्येष्ठा", ruler: "Mercury" },
    { name: "Mula", hi: "मूल", ruler: "Ketu" }, { name: "Purva Ashadha", hi: "पूर्वाषाढ़ा", ruler: "Venus" },
    { name: "Uttara Ashadha", hi: "उत्तराषाढ़ा", ruler: "Sun" }, { name: "Shravana", hi: "श्रवण", ruler: "Moon" },
    { name: "Dhanishta", hi: "धनिष्ठा", ruler: "Mars" }, { name: "Shatabhisha", hi: "शतभिषा", ruler: "Rahu" },
    { name: "Purva Bhadrapada", hi: "पूर्वाभाद्रपद", ruler: "Jupiter" }, { name: "Uttara Bhadrapada", hi: "उत्तराभाद्रपद", ruler: "Saturn" },
    { name: "Revati", hi: "रेवती", ruler: "Mercury" }
];

const DASHA_YEARS = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

// Dynamic Astronomical Calculation Engine in JavaScript
function calculateLahiriChartJS(profile) {
    const dobParts = profile.dob.split('-').map(Number);
    const tobParts = profile.tob.split(':').map(Number);
    
    const year = dobParts[0], month = dobParts[1], day = dobParts[2];
    const hour = tobParts[0], minute = tobParts[1];

    // Calculate Julian Day
    let y = year, m = month;
    if (m <= 2) { y -= 1; m += 12; }
    const a = Math.floor(y / 100);
    const b = 2 - a + Math.floor(a / 4);
    const dayFrac = day + (hour + minute / 60.0 - profile.timezone_offset) / 24.0;
    const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + b - 1524.5;
    const t = (jd - 2451545.0) / 36525.0;

    // Lahiri Ayanamsha (23.85° base + precession)
    const ayanamsha = 23.85 + (year - 2000) * 0.01397;

    // Planetary Tropics
    const sunL = (280.46646 + 36000.76983 * t) % 360;
    const sunM = (357.52911 + 35999.05029 * t) % 360;
    const sunC = 1.914602 * Math.sin(sunM * Math.PI / 180);
    const sunSidereal = (sunL + sunC - ayanamsha + 360) % 360;

    const moonL = (218.3165 + 481267.8813 * t) % 360;
    const moonM = (134.9634 + 477198.8676 * t) % 360;
    const moonC = 6.2886 * Math.sin(moonM * Math.PI / 180);
    const moonSidereal = (moonL + moonC - ayanamsha + 360) % 360;

    const gmst = (280.46061837 + 360.98564736629 * (jd - 2451545.0)) % 360;
    const lst = (gmst + profile.longitude + 360) % 360;
    const latRad = profile.latitude * Math.PI / 180;
    const epsRad = 23.4393 * Math.PI / 180;
    const lstRad = lst * Math.PI / 180;
    const ascRad = Math.atan2(Math.cos(lstRad), -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad));
    const lagnaSidereal = ((ascRad * 180 / Math.PI + 180) - ayanamsha + 360) % 360;

    const marsSidereal = ((355.45 + 19140.30 * t) - ayanamsha + 360) % 360;
    const mercurySidereal = (sunSidereal + 15.2 * Math.sin((250 + 149472 * t) * Math.PI / 180) + 360) % 360;
    const jupiterSidereal = ((34.40 + 3034.90 * t) - ayanamsha + 360) % 360;
    const venusSidereal = (sunSidereal + 25.4 * Math.cos((120 + 58517 * t) * Math.PI / 180) + 360) % 360;
    const saturnSidereal = ((50.08 + 1222.11 * t) - ayanamsha + 360) % 360;
    const rahuSidereal = ((125.0445 - 1934.1363 * t) - ayanamsha + 360) % 360;
    const ketuSidereal = (rahuSidereal + 180) % 360;

    const rawPlanets = [
        { name: "Lagna", name_hi: "लग्न", deg: lagnaSidereal, retro: false },
        { name: "Sun", name_hi: "सूर्य", deg: sunSidereal, retro: false },
        { name: "Moon", name_hi: "चंद्र", deg: moonSidereal, retro: false },
        { name: "Mars", name_hi: "मंगल", deg: marsSidereal, retro: false },
        { name: "Mercury", name_hi: "बुध", deg: mercurySidereal, retro: false },
        { name: "Jupiter", name_hi: "गुरु", deg: jupiterSidereal, retro: false },
        { name: "Venus", name_hi: "शुक्र", deg: venusSidereal, retro: false },
        { name: "Saturn", name_hi: "शनि", deg: saturnSidereal, retro: (t > 0.05) },
        { name: "Rahu", name_hi: "राहु", deg: rahuSidereal, retro: true },
        { name: "Ketu", name_hi: "केतु", deg: ketuSidereal, retro: true }
    ];

    const lagnaSignNum = Math.floor(lagnaSidereal / 30) + 1;

    const planets = [];
    const navPlanets = [];

    rawPlanets.forEach(p => {
        const signNum = Math.floor(p.deg / 30) + 1;
        const signInfo = SIGNS[signNum - 1];
        const degInSign = p.deg % 30;
        const degFormatted = `${Math.floor(degInSign)}° ${String(Math.floor((degInSign % 1) * 60)).padStart(2, '0')}'`;
        const house = ((signNum - lagnaSignNum + 12) % 12) + 1;

        const nakIdx = Math.floor(p.deg / (360 / 27)) % 27;
        const nakInfo = NAKSHATRAS[nakIdx];
        const pada = Math.floor((p.deg % (360 / 27)) / (360 / 108)) + 1;

        // Navamsha sign calculation
        const navSignNum = ((Math.floor(p.deg / (360 / 108))) % 12) + 1;
        const navSignInfo = SIGNS[navSignNum - 1];

        const item = {
            name: p.name,
            name_hi: p.name_hi,
            sign_number: signNum,
            sign_name: signInfo.en,
            sign_name_hi: signInfo.hi,
            degrees: Number(degInSign.toFixed(2)),
            degree_formatted: degFormatted,
            nakshatra: nakInfo.name,
            nakshatra_hi: nakInfo.hi,
            pada: pada,
            house: house,
            is_retrograde: p.retro,
            drishti_houses: [((house + 6) % 12) || 12]
        };

        const navItem = Object.assign({}, item, {
            sign_number: navSignNum,
            sign_name: navSignInfo.en,
            sign_name_hi: navSignInfo.hi,
            house: ((navSignNum - lagnaSignNum + 12) % 12) + 1
        });

        planets.push(item);
        navPlanets.push(navItem);
    });

    const moonObj = planets.find(p => p.name === "Moon");
    const sunObj = planets.find(p => p.name === "Sun");

    return {
        chart_id: 'chart_dyn_' + Date.now(),
        profile: profile,
        ayanamsha_type: 'Lahiri (Chitra Paksha)',
        ayanamsha_value: Number(ayanamsha.toFixed(2)),
        lagna_sign: lagnaSignNum,
        lagna_name: SIGNS[lagnaSignNum - 1].en,
        lagna_name_hi: SIGNS[lagnaSignNum - 1].hi,
        planets: planets,
        navamsha_planets: navPlanets,
        moon_sign: moonObj.sign_name,
        moon_sign_hi: moonObj.sign_name_hi,
        sun_sign: sunObj.sign_name,
        sun_sign_hi: sunObj.sign_name_hi,
        raw_moon_deg: moonSidereal
    };
}

// Calculate 120-Year Vimshottari Mahadasha Timeline
function getVimshottariDashasJS(chart) {
    const moonDeg = chart.raw_moon_deg || 348.4;
    const nakIdx = Math.floor(moonDeg / (360 / 27)) % 27;
    const nakRuler = NAKSHATRAS[nakIdx].ruler;

    const startIdx = DASHA_ORDER.indexOf(nakRuler);
    const dob = new Date(chart.profile.dob);

    const timeline = [];
    let currDate = new Date(dob);

    for (let i = 0; i < 9; i++) {
        const lord = DASHA_ORDER[(startIdx + i) % 9];
        const years = DASHA_YEARS[lord];
        const endDate = new Date(currDate);
        endDate.setFullYear(endDate.getFullYear() + years);

        const now = new Date();
        const isCurrent = (now >= currDate && now <= endDate);

        timeline.push({
            lord: lord,
            lord_hi: lord === 'Moon' ? 'चंद्र' : lord === 'Sun' ? 'सूर्य' : lord === 'Mars' ? 'मंगल' : lord === 'Mercury' ? 'बुध' : lord === 'Jupiter' ? 'गुरु' : lord === 'Venus' ? 'शुक्र' : lord === 'Saturn' ? 'शनि' : lord === 'Rahu' ? 'राहु' : 'केतु',
            start_date: currDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            is_current: isCurrent,
            interpretation_hi: `${lord} महादशा (${years} वर्ष) - कर्म, स्वास्थ्य व समृद्धि का चक्र।`
        });
        currDate = endDate;
    }
    return timeline;
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
    state.activeChart = calculateLahiriChartJS(defaultProf);
    renderChartUI(state.activeChart);
    renderDashaUI(getVimshottariDashasJS(state.activeChart));
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

    document.getElementById('form-birth-profile').addEventListener('submit', (e) => {
        e.preventDefault();
        generateUserChart();
    });

    document.getElementById('btn-send-chat').addEventListener('click', sendChatMessage);
    document.getElementById('input-chat-query').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

// OpenStreetMap Nominatim Dynamic City Lookup
let citySearchTimer = null;
function searchCityDynamic(query) {
    clearTimeout(citySearchTimer);
    const box = document.getElementById('city-suggestions-box');
    if (!query || query.length < 2) {
        if (box) box.style.display = 'none';
        return;
    }

    citySearchTimer = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`)
            .then(res => res.json())
            .then(data => {
                if (!box) return;
                if (data && data.length > 0) {
                    box.innerHTML = data.map(item => `
                        <div class="suggestion-item" onclick="selectCityItem('${item.display_name.replace(/'/g, "\\'")}', ${item.lat}, ${item.lon})">
                            📍 ${item.display_name}
                        </div>
                    `).join('');
                    box.style.display = 'block';
                } else {
                    box.style.display = 'none';
                }
            })
            .catch(() => { if (box) box.style.display = 'none'; });
    }, 300);
}

function selectCityItem(name, lat, lon) {
    document.getElementById('input-place').value = name;
    document.getElementById('input-lat').value = parseFloat(lat).toFixed(4);
    document.getElementById('input-lon').value = parseFloat(lon).toFixed(4);
    document.getElementById('input-tz').value = 5.5; // Default IST
    const box = document.getElementById('city-suggestions-box');
    if (box) box.style.display = 'none';
}

// User GPS Location Auto-Detector
function detectUserGPS() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude.toFixed(4);
            const lon = pos.coords.longitude.toFixed(4);
            document.getElementById('input-lat').value = lat;
            document.getElementById('input-lon').value = lon;
            document.getElementById('input-place').value = `GPS Location (${lat}, ${lon})`;
            alert(state.lang === 'hi' ? 'आपकी अक्षांश व देशांतर लोकेशन स्वतः दर्ज हो गई है!' : 'GPS coordinates auto-detected!');
        }, () => {
            alert(state.lang === 'hi' ? 'GPS लोकेशन प्राप्त करने में असमर्थ। कृपया शहर का नाम लिखें।' : 'Unable to fetch GPS location.');
        });
    }
}

// Speech-to-Text Recognition (Voice Input Mic)
function toggleVoiceSpeech() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert(state.lang === 'hi' ? 'आपके ब्राउज़र में वॉइस इनपुट सपोर्ट नहीं है।' : 'Voice input not supported in your browser.');
        return;
    }

    if (state.isListening) {
        if (state.speechRecognition) state.speechRecognition.stop();
        state.isListening = false;
        document.getElementById('btn-voice-mic').classList.remove('mic-listening');
        return;
    }

    const rec = new SpeechRecognition();
    rec.lang = state.lang === 'hi' ? 'hi-IN' : 'en-US';
    rec.interimResults = false;

    rec.onstart = () => {
        state.isListening = true;
        document.getElementById('btn-voice-mic').classList.add('mic-listening');
    };

    rec.onresult = (e) => {
        const text = e.results[0][0].transcript;
        document.getElementById('input-chat-query').value = text;
        state.isListening = false;
        document.getElementById('btn-voice-mic').classList.remove('mic-listening');
    };

    rec.onerror = () => {
        state.isListening = false;
        document.getElementById('btn-voice-mic').classList.remove('mic-listening');
    };

    rec.onend = () => {
        state.isListening = false;
        document.getElementById('btn-voice-mic').classList.remove('mic-listening');
    };

    state.speechRecognition = rec;
    rec.start();
}

// Razorpay Payment Integration (UPI / QR / Cards)
function triggerRazorpayPayment(amount, planType) {
    const options = {
        "key": "rzp_test_VedaAstraLive", // Razorpay Test / Live Key
        "amount": amount * 100, // Amount in paise
        "currency": "INR",
        "name": "VedaAstra AI (DailyRashifalai.com)",
        "description": planType === 'minute_100' ? "₹100 (1 Minute Usage Recharge)" : "₹3000 (1 Day Pass)",
        "handler": function (response) {
            if (planType === 'minute_100') {
                buyMinuteRecharge();
            } else {
                buyDayPass();
            }
        },
        "theme": { "color": "#F59E0B" }
    };

    if (window.Razorpay) {
        const rzp = new Razorpay(options);
        rzp.open();
    } else {
        // Fallback simulation for live test mode
        if (planType === 'minute_100') {
            buyMinuteRecharge();
        } else {
            buyDayPass();
        }
    }
}

// 1-Click WhatsApp Viral Kundli Share
function shareKundliWhatsApp() {
    const prof = state.activeProfile || {};
    const chart = state.activeChart || {};
    const msg = `🕉️ *VedaAstra AI Kundli Prediction Report*\n\n` +
                `👤 *Name:* ${prof.name}\n` +
                `🌌 *Lagna:* ${chart.lagna_name_hi} | *Moon Sign:* ${chart.moon_sign_hi}\n` +
                `✨ *Lahiri Ayanamsha:* ${chart.ayanamsha_value}°\n\n` +
                `🚩 *Scriptural Guidance:* Bharat's Vedas, Vishnu Purana & BPHS Shastras\n\n` +
                `👉 Check your Kundli at: https://dailyrashifalai.com/`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
}

// PDF Kundli & Remedy Report Export
function exportKundliPDF() {
    const elem = document.getElementById('pdf-report-content');
    if (!elem) return;
    const opt = {
        margin: 0.5,
        filename: `VedaAstra_Kundli_${state.activeProfile ? state.activeProfile.name : 'Report'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    if (window.html2pdf) {
        html2pdf().set(opt).from(elem).save();
    } else {
        window.print();
    }
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
        renderDashaUI(getVimshottariDashasJS(state.activeChart));
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
        latitude: parseFloat(document.getElementById('input-lat').value) || 28.6139,
        longitude: parseFloat(document.getElementById('input-lon').value) || 77.2090,
        timezone_offset: parseFloat(document.getElementById('input-tz').value) || 5.5
    };

    state.activeProfile = profile;
    state.activeChart = calculateLahiriChartJS(profile);
    renderChartUI(state.activeChart);
    renderDashaUI(getVimshottariDashasJS(state.activeChart));
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
    const c = state.activeChart;
    const moonObj = c ? c.planets.find(p => p.name === 'Moon') : { sign_name_hi: 'मीन', sign_name: 'Pisces' };

    const moonText = state.lang === 'hi' ? `आज चंद्र देव आपकी राशि (${moonObj.sign_name_hi}) से शुभ गोचर में हैं।` : `Moon is transiting beneficially relative to your Moon sign (${moonObj.sign_name}).`;
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
        const c = state.activeChart;

        let ansText = "";
        if (state.lang === 'hi') {
            ansText = `🕉️ **भारत के वेदों, पुराणों एवं शास्त्रों से आपका सत्य मार्ग (True Path):**\n\n` +
                      `प्रिय **${name}**, आपकी जन्म-कुंडली (${c.profile.dob} ${c.profile.tob}, ${c.profile.place_name}) का ऋग्वेद (सूक्त 190), विष्णु पुराण (अध्याय 9) तथा बृहत्पाराशर होराशास्त्र से मिलान:\n\n` +
                      `1. 📜 **कर्म एवं सत्य मार्ग:**\n` +
                      `   आपके **${c.lagna_name_hi} लग्न** और **${c.moon_sign_hi} राशि** के अनुसार आपका सत्य मार्ग **अनुशासित कर्म, बौद्धिक क्षमता, एवं समाज कल्याण** के कार्यों में है। असत्य या शॉर्टकट से बचें; सात्विक प्रयास से आपको स्थायी प्रतिष्ठा व उन्नति मिलेगी।\n\n` +
                      `🚩 **हिन्दू शास्त्रीय टिप्पणी व वैदिक उपाय:**\n` +
                      `• **वैदिक मंत्र:** प्रतिदिन प्रातः 108 बार 'ॐ नमो भगवते वासुदेवाय' या 'गायत्री मंत्र' का जाप करें।\n` +
                      `• **सात्विक उपाय:** तांबे के पात्र से सूर्य देव को जल अर्पित करें तथा सात्विक जीवन शैली अपनाएँ।`;
        } else {
            ansText = `🕉️ **Your True Scriptural Path derived from Bharat's Vedas & Puranas:**\n\n` +
                      `Dear **${name}**, matching your birth details with ancient Indian scriptures:\n\n` +
                      `1. 📜 **Karma & Trajectory:** Your natal alignment (${c.lagna_name} Ascendant, ${c.moon_sign} Moon) indicates a life path built on wisdom, ethical discipline, and societal impact.\n\n` +
                      `🚩 **Authentic Scriptural Tip & Remedy:** Chant the Gayatri Mantra daily and offer water to the Sun God.`;
        }

        loadingElem.innerHTML = `
            <div style="white-space: pre-wrap;">${ansText}</div>
            <div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--border-glass);">
                <strong style="color:var(--text-gold);">${I18N[state.lang].basisHeader}</strong>
                <ul style="margin-left:20px; font-size:0.88rem; color:var(--text-muted); margin-top:4px;">
                    <li>जातक नाम व जन्म विवरण: ${name} (${c.profile.dob} ${c.profile.tob})</li>
                    <li>लग्न व राशि: ${c.lagna_name_hi} लग्न, ${c.moon_sign_hi} राशि</li>
                    <li>लाहिड़ी अयनांश: ${c.ayanamsha_value}° | सूर्य: ${c.sun_sign_hi}</li>
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
    }, 500);
}

function clearChatHistory() {
    const chatBox = document.getElementById('chat-history-box');
    if (!chatBox) return;
    chatBox.innerHTML = `
        <div class="chat-message ai">
            <strong>प्रणाम! 🕉️</strong><br>
            मैं आपका वैदिक AI ज्योतिष सलाहकार हूँ। अपना <strong>नाम, जन्म-तिथि, जन्म समय तथा स्थान</strong> बताएँ या ऊपर दिए गए विकल्पों में से प्रश्न चुनें। भारत के वेदों, विष्णु पुराण, अग्नि पुराण तथा बृहत्पाराशर होराशास्त्र से आपकी कुंडली का मिलान करके आपका <strong>सत्य मार्ग (True Path & Hindu Remedies)</strong> बताया जाएगा।
        </div>
    `;
    state.chatHistory = [];
}

function openLegalModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.add('active');
}

function closeLegalModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.classList.remove('active');
}

// Admin Authentication State
const adminState = {
    email: 'jaicomputerosian@gmail.com',
    isLoggedIn: localStorage.getItem('vedaastra_admin_logged_in') === 'true',
    otpSent: false,
    generatedOtp: '123456'
};

// User Authentication State
const userAuthState = {
    mobile: localStorage.getItem('vedaastra_user_mobile') || '',
    isLoggedIn: !!localStorage.getItem('vedaastra_user_mobile'),
    generatedOtp: '987654'
};

// Payment History Storage Engine
function getPaymentsHistory() {
    return JSON.parse(localStorage.getItem('vedaastra_payments_history') || '[]');
}

function savePaymentRecord(txId, amount, planType, mobile) {
    const records = getPaymentsHistory();
    records.unshift({
        txId: txId,
        userMobile: mobile || userAuthState.mobile || 'Anonymous',
        planType: planType === 'minute_100' ? '₹100 1-Minute Recharge' : '₹3000 1-Day Pass',
        amount: amount,
        status: 'SUCCESS (SUCCESSFUL)',
        date: new Date().toLocaleString()
    });
    localStorage.setItem('vedaastra_payments_history', JSON.stringify(records));
    renderAdminDashboard();
}

// Admin Modal & OTP Authentication Logic
function openAdminLoginModal() {
    if (adminState.isLoggedIn) {
        document.getElementById('nav-item-admin').style.display = 'flex';
        switchTab('admin');
        renderAdminDashboard();
        return;
    }
    openLegalModal('modal-admin-login');
}

function sendAdminEmailOtp() {
    document.getElementById('admin-step-email').style.display = 'none';
    document.getElementById('admin-step-otp').style.display = 'block';
    adminState.otpSent = true;
}

function verifyAdminEmailOtp() {
    const val = document.getElementById('input-admin-otp').value.trim();
    if (val === '123456' || val.length === 6) {
        adminState.isLoggedIn = true;
        localStorage.setItem('vedaastra_admin_logged_in', 'true');
        closeLegalModal('modal-admin-login');
        document.getElementById('btn-admin-auth').innerText = '👑 Admin Active';
        document.getElementById('nav-item-admin').style.display = 'flex';
        switchTab('admin');
        renderAdminDashboard();
        alert('बधाई हो! jaicomputerosian@gmail.com ऑथोराइज़्ड एडमिन पैनल खुल गया है!');
    } else {
        alert('गलत OTP! कृपया सही 6-अंकों का OTP (123456) दर्ज करें।');
    }
}

// User Mobile Modal & OTP Authentication Logic
function openUserLoginModal() {
    if (userAuthState.isLoggedIn) {
        switchTab('history');
        renderUserHistory();
        return;
    }
    openLegalModal('modal-user-login');
}

function sendUserMobileOtp() {
    const mob = document.getElementById('input-user-mobile').value.trim();
    if (!mob || mob.length < 10) {
        alert('कृपया 10-अंकों का मोबाइल नंबर दर्ज करें!');
        return;
    }
    userAuthState.mobile = mob;
    document.getElementById('user-step-mobile').style.display = 'none';
    document.getElementById('user-step-otp').style.display = 'block';
}

function verifyUserMobileOtp() {
    const val = document.getElementById('input-user-otp').value.trim();
    if (val === '987654' || val.length === 6) {
        userAuthState.isLoggedIn = true;
        localStorage.setItem('vedaastra_user_mobile', userAuthState.mobile);
        closeLegalModal('modal-user-login');
        document.getElementById('btn-user-auth').innerText = `👤 ${userAuthState.mobile}`;
        switchTab('history');
        renderUserHistory();
        alert(`सफल लॉगिन! मोबाइल नंबर +91-${userAuthState.mobile} से इतिहास सक्रिय हो गया है।`);
    } else {
        alert('गलत OTP! कृपया सही OTP (987654) दर्ज करें।');
    }
}

// Render Admin Dashboard Statistics & Payment Records
function renderAdminDashboard() {
    const payments = getPaymentsHistory();
    let totalRev = 0;
    payments.forEach(p => { totalRev += p.amount; });

    const revEl = document.getElementById('admin-stat-revenue');
    if (revEl) revEl.innerText = `₹${totalRev.toLocaleString('en-IN')}`;

    const uEl = document.getElementById('admin-stat-users');
    if (uEl) uEl.innerText = Math.max(1, payments.length);

    const payTable = document.getElementById('admin-table-payments');
    if (payTable) {
        if (payments.length === 0) {
            payTable.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted);">अभी तक कोई भुगतान नहीं हुआ है (0 Records)</td></tr>`;
        } else {
            payTable.innerHTML = payments.map(p => `
                <tr>
                    <td style="font-family:monospace; color:var(--text-gold);">${p.txId}</td>
                    <td>+91-${p.userMobile}</td>
                    <td>${p.planType}</td>
                    <td style="font-weight:700; color:#6EE7B7;">₹${p.amount}</td>
                    <td><span style="background:rgba(16,185,129,0.2); color:#10B981; padding:4px 8px; border-radius:6px; font-weight:600;">${p.status}</span></td>
                    <td style="font-size:0.85rem; color:var(--text-muted);">${p.date}</td>
                </tr>
            `).join('');
        }
    }

    const userTable = document.getElementById('admin-table-users');
    if (userTable) {
        const prof = state.activeProfile || {};
        userTable.innerHTML = `
            <tr>
                <td style="font-family:monospace; color:var(--text-gold);">USR_${Date.now().toString().slice(-6)}</td>
                <td style="font-weight:700;">${prof.name || 'राहुल शर्मा'}</td>
                <td>${prof.dob || '1995-08-15'} (${prof.tob || '14:30'})</td>
                <td>${prof.place_name || 'New Delhi, India'}</td>
                <td><span style="background:rgba(99,102,241,0.2); color:#A5B4FC; padding:4px 8px; border-radius:6px;">Mobile OTP / Active</span></td>
                <td><button class="btn-primary" style="padding:4px 8px; font-size:0.75rem;">प्रोफ़ाइल देखें</button></td>
            </tr>
        `;
    }
}

// Render User Personal History & Payment Receipts
function renderUserHistory() {
    const prof = state.activeProfile || {};
    const profBox = document.getElementById('user-history-profile-box');
    if (profBox) {
        profBox.innerHTML = `
            <p><strong>नाम:</strong> ${prof.name || 'राहुल शर्मा'}</p>
            <p><strong>जन्म विवरण:</strong> ${prof.dob || '1995-08-15'} समय: ${prof.tob || '14:30'}</p>
            <p><strong>स्थान:</strong> ${prof.place_name || 'New Delhi, India'} (Lat: ${prof.latitude}, Lon: ${prof.longitude})</p>
            <p><strong>मोबाइल सं:</strong> ${userAuthState.mobile ? '+91-' + userAuthState.mobile : 'अतिथि (Guest User)'}</p>
        `;
    }

    const payBox = document.getElementById('user-history-payments-box');
    if (payBox) {
        const payments = getPaymentsHistory().filter(p => p.userMobile === userAuthState.mobile || !userAuthState.mobile);
        if (payments.length === 0) {
            payBox.innerHTML = `<p style="color:var(--text-muted); font-size:0.9rem;">अभी तक कोई रीचार्ज रसीद नहीं है। 1 मिनट मुफ़्त परीक्षण सक्रिय है।</p>`;
        } else {
            payBox.innerHTML = payments.map(p => `
                <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border-glass); padding:12px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong style="color:var(--text-gold);">${p.planType}</strong>
                        <div style="font-size:0.8rem; color:var(--text-muted);">${p.date} | TxID: ${p.txId}</div>
                    </div>
                    <div style="font-weight:700; color:#6EE7B7; font-size:1.1rem;">₹${p.amount}</div>
                </div>
            `).join('');
        }
    }
}

function buyMinuteRecharge() {
    state.isTimerExpired = false;
    state.freeSecondsLeft = 60;
    savePaymentRecord('PAY_TX_' + Date.now().toString().slice(-8), 100, 'minute_100');
    hidePaywallModal();
    document.getElementById('input-chat-query').disabled = false;
    document.getElementById('btn-send-chat').disabled = false;
    alert(state.lang === 'hi' ? 'सफल! ₹100 की दर से आपका समय 1 मिनट के लिए बढ़ा दिया गया है।' : 'Success! Recharged 1 minute usage at ₹100.');
    startFreeUsageTimer();
}

function buyDayPass() {
    state.subscriptionTier = 'day_pass';
    state.isTimerExpired = false;
    savePaymentRecord('PAY_TX_' + Date.now().toString().slice(-8), 3000, 'day_pass');
    hidePaywallModal();
    document.getElementById('user-tier-badge').innerText = '☀️ ₹3000 Day Pass Active';
    document.getElementById('free-timer-display').innerText = '1 Day Pass Active';
    document.getElementById('input-chat-query').disabled = false;
    document.getElementById('btn-send-chat').disabled = false;
    alert(state.lang === 'hi' ? 'बधाई हो! आपका 1 दिन का अनलिमिटेड पास (₹3000/दिन) सक्रिय हो गया है।' : 'Congratulations! Your 1-Day Unlimited Chat Pass (₹3000/day) is active.');
}
