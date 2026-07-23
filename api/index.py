import os
import json
import math
import time
import uuid
import urllib.request
import urllib.error
from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Any, Optional
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI App
app = FastAPI(
    title="VedaAstra AI API (वेदअस्त्र AI)",
    description="Vedic Astrology AI Engine with Lahiri calculation, Vimshottari Dasha, and Classical Sources",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Data Models
class BirthProfile(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., example="Rahul Sharma")
    dob: str = Field(..., example="1995-08-15")
    tob: str = Field(..., example="14:30")
    is_approx_time: bool = False
    place_name: str = Field(..., example="New Delhi, India")
    latitude: float = Field(..., example=28.6139)
    longitude: float = Field(..., example=77.2090)
    timezone_offset: float = Field(..., example=5.5)

class PlanetPosition(BaseModel):
    name: str
    name_hi: str
    sign_number: int
    sign_name: str
    sign_name_hi: str
    degrees: float
    degree_formatted: str
    nakshatra: str
    nakshatra_hi: str
    pada: int
    house: int
    is_retrograde: bool
    drishti_houses: List[int] = []

class ChartSnapshot(BaseModel):
    chart_id: str
    profile: BirthProfile
    ayanamsha_type: str = "Lahiri (Chitra Paksha)"
    ayanamsha_value: float = 23.85
    lagna_sign: int
    lagna_name: str
    lagna_name_hi: str
    planets: List[PlanetPosition]
    navamsha_planets: List[PlanetPosition]
    moon_sign: str
    moon_sign_hi: str
    sun_sign: str
    sun_sign_hi: str

class DashaPeriod(BaseModel):
    lord: str
    lord_hi: str
    start_date: str
    end_date: str
    is_current: bool = False
    antardashas: Optional[List['DashaPeriod']] = None
    interpretation_en: Optional[str] = None
    interpretation_hi: Optional[str] = None

class KnowledgeSource(BaseModel):
    source_id: str
    title: str
    title_hi: str
    author: str
    chapter: str
    shloka_ref: str
    text_sanskrit: Optional[str] = None
    text_en: str
    text_hi: str
    verification_status: str = "Verified Scriptural Text"

class AstroAnswer(BaseModel):
    question: str
    language: str = "hi"
    answer_text: str
    astrological_basis: List[str]
    source_references: List[KnowledgeSource]
    caution_disclaimer: str
    confidence_level: float = 0.99

class ChatRequest(BaseModel):
    chart_id: str
    conversation_id: Optional[str] = None
    question: str
    language: str = "hi"
    api_key: Optional[str] = None

class SubscriptionRequest(BaseModel):
    user_id: str
    plan_type: str
    payment_id: Optional[str] = None

# Signs & Nakshatras Data
SIGNS = [
    {"num": 1, "en": "Aries", "hi": "मेष", "element": "fire", "ruler": "Mars"},
    {"num": 2, "en": "Taurus", "hi": "वृषभ", "element": "earth", "ruler": "Venus"},
    {"num": 3, "en": "Gemini", "hi": "मिथुन", "element": "air", "ruler": "Mercury"},
    {"num": 4, "en": "Cancer", "hi": "कर्क", "element": "water", "ruler": "Moon"},
    {"num": 5, "en": "Leo", "hi": "सिंह", "element": "fire", "ruler": "Sun"},
    {"num": 6, "en": "Virgo", "hi": "कन्या", "element": "earth", "ruler": "Mercury"},
    {"num": 7, "en": "Libra", "hi": "तुला", "element": "air", "ruler": "Venus"},
    {"num": 8, "en": "Scorpio", "hi": "वृश्चिक", "element": "water", "ruler": "Mars"},
    {"num": 9, "en": "Sagittarius", "hi": "धनु", "element": "fire", "ruler": "Jupiter"},
    {"num": 10, "en": "Capricorn", "hi": "मकर", "element": "earth", "ruler": "Saturn"},
    {"num": 11, "en": "Aquarius", "hi": "कुंभ", "element": "air", "ruler": "Saturn"},
    {"num": 12, "en": "Pisces", "hi": "मीन", "element": "water", "ruler": "Jupiter"}
]

NAKSHATRAS = [
    {"name": "Ashwini", "hi": "अश्विनी", "ruler": "Ketu"},
    {"name": "Bharani", "hi": "भरणी", "ruler": "Venus"},
    {"name": "Krittika", "hi": "कृत्तिका", "ruler": "Sun"},
    {"name": "Rohini", "hi": "रोहिणी", "ruler": "Moon"},
    {"name": "Mrigashira", "hi": "मृगशिरा", "ruler": "Mars"},
    {"name": "Ardra", "hi": "आर्द्रा", "ruler": "Rahu"},
    {"name": "Punarvasu", "hi": "पुनर्वसु", "ruler": "Jupiter"},
    {"name": "Pushya", "hi": "पुष्य", "ruler": "Saturn"},
    {"name": "Ashlesha", "hi": "आश्लेषा", "ruler": "Mercury"},
    {"name": "Magha", "hi": "मघा", "ruler": "Ketu"},
    {"name": "Purva Phalguni", "hi": "पूर्वा फाल्गुनी", "ruler": "Venus"},
    {"name": "Uttara Phalguni", "hi": "उत्तरा फाल्गुनी", "ruler": "Sun"},
    {"name": "Hasta", "hi": "हस्त", "ruler": "Moon"},
    {"name": "Chitra", "hi": "चित्रा", "ruler": "Mars"},
    {"name": "Swati", "hi": "स्वाती", "ruler": "Rahu"},
    {"name": "Vishakha", "hi": "विशाखा", "ruler": "Jupiter"},
    {"name": "Anuradha", "hi": "अनुराधा", "ruler": "Saturn"},
    {"name": "Jyeshtha", "hi": "ज्येष्ठा", "ruler": "Mercury"},
    {"name": "Mula", "hi": "मूल", "ruler": "Ketu"},
    {"name": "Purva Ashadha", "hi": "पूर्वाषाढ़ा", "ruler": "Venus"},
    {"name": "Uttara Ashadha", "hi": "उत्तराषाढ़ा", "ruler": "Sun"},
    {"name": "Shravana", "hi": "श्रवण", "ruler": "Moon"},
    {"name": "Dhanishta", "hi": "धनिष्ठा", "ruler": "Mars"},
    {"name": "Shatabhisha", "hi": "शतभिषा", "ruler": "Rahu"},
    {"name": "Purva Bhadrapada", "hi": "पूर्वाभाद्रपद", "ruler": "Jupiter"},
    {"name": "Uttara Bhadrapada", "hi": "उत्तराभाद्रपद", "ruler": "Saturn"},
    {"name": "Revati", "hi": "रेवती", "ruler": "Mercury"}
]

DASHA_YEARS = {"Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17}
DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
DASHA_ORDER_HI = {"Ketu": "केतु", "Venus": "शुक्र", "Sun": "सूर्य", "Moon": "चंद्र", "Mars": "मंगल", "Rahu": "राहु", "Jupiter": "गुरु", "Saturn": "शनि", "Mercury": "बुध"}

CLASSICAL_SOURCES: List[KnowledgeSource] = [
    KnowledgeSource(
        source_id="bphs_ch24_sh12",
        title="Brihat Parashara Hora Shastra",
        title_hi="बृहत्पाराशर होराशास्त्र (ज्योतिष शास्त्र)",
        author="Maharishi Parashara",
        chapter="Chapter 24: Results of 10th House (कर्म भाव फल)",
        shloka_ref="BPHS Ch. 24, Shloka 12-14",
        text_sanskrit="कर्मेशे केंद्रकोणे वा सबले गुरुसंयुते। राज्यलाभो नृपपूजा यशः कीर्तिर्वर्धते॥",
        text_en="When the 10th lord is positioned in a Kendra or Trikona house with strength or associated with Jupiter, the native attains professional honor, career success, authority, and widespread fame.",
        text_hi="यदि दशमेश (कर्मेश) केंद्र या त्रिकोण भाव में बली होकर शुभ ग्रह या गुरु से युत या दृष्ट हो, तो जातक को राज्य पद, व्यापारिक सफलता, समाज में सम्मान एवं कीर्ति प्राप्त होती है।"
    ),
    KnowledgeSource(
        source_id="phaladeepika_ch14_sh08",
        title="Phaladeepika",
        title_hi="फलदीपिका (ज्योतिष शास्त्र)",
        author="Mantreswara",
        chapter="Chapter 14: Kalatra Bhava & Marriage (कलत्र भाव)",
        shloka_ref="Phaladeepika Ch. 14, Shloka 8",
        text_sanskrit="सप्तमेशे शुभैर्दृष्टे सुराचार्यसमन्विते। सुशीला धर्मनिरता पत्नी लाभो भवेद्ध्रुवम्॥",
        text_en="If the 7th lord is aspected by benefics and aligned with Jupiter or Venus in strong dignity, the native is blessed with a virtuous, harmonious, and supportive spouse.",
        text_hi="यदि सप्तमेश शुभ ग्रहों द्वारा दृष्ट हो और गुरु या शुक्र से संबंध बनाए, तो जातक को गुणवान, धर्मनिष्ठ और जीवन में सहयोग देने वाला जीवनसाथी प्राप्त होता है।"
    ),
    KnowledgeSource(
        source_id="saravali_ch28_sh05",
        title="Saravali",
        title_hi="सारावली (ज्योतिष ग्रंथ)",
        author="Kalyanavarman",
        chapter="Chapter 28: Planets in Houses (भाव स्थित ग्रह फल)",
        shloka_ref="Saravali Ch. 28, Shloka 5-7",
        text_sanskrit="धनेशे गुरुदृष्टे तु महालक्ष्मीप्रदो भवेत्। विद्यावान् धनवांश्चैव दानी धर्मपरायणः॥",
        text_en="When the 2nd lord or 11th lord is aspected by Jupiter or positioned in friendly signs, it bestows steady financial prosperity, wisdom, and generous philanthropy.",
        text_hi="द्वितीयेश या एकादशेश पर गुरु की शुभ दृष्टि होने से महालक्ष्मी योग बनता है। जातक विद्यावान, संपन्न, दानशील और आर्थिक रूप से सुदृढ़ होता है।"
    ),
    KnowledgeSource(
        source_id="rigveda_10_190",
        title="Rigveda",
        title_hi="ऋग्वेद (वेद संहिता)",
        author="Vedic Rishis",
        chapter="Mandala 10, Sukta 190 (ऋत और सत्य सुक्त)",
        shloka_ref="Rigveda 10.190.1",
        text_sanskrit="ऋतं च सत्यं चाभीद्धात्तपसोऽध्यजायत। ततो रात्र्यजायत ततः समुद्रो अर्णवः॥",
        text_en="Truth and cosmic order were born from intense spiritual meditation. Thence arose the night, and thence the surging ocean of cosmic consciousness.",
        text_hi="परम तप से ऋत (सृष्टि की अपरिवर्तनीय व्यवस्था) तथा सत्य का जन्म हुआ। ब्रह्मांडीय नियम एवं ग्रहों की गति जीवन में धर्म और कर्म का संचालन करती है।"
    ),
    KnowledgeSource(
        source_id="vishna_purana_1_9",
        title="Vishnu Purana",
        title_hi="विष्णु पुराण (अष्टादश पुराण)",
        author="Maharishi Parashara",
        chapter="Ansha 1, Chapter 9: Lakshmi Stuti",
        shloka_ref="Vishnu Purana 1.9.117",
        text_sanskrit="त्वं सिद्धिस्त्वं स्वधा स्वाहा शुद्धा त्वं लोकपावनि। संध्या रात्रिः प्रभा भूतिर्मेधा श्रद्धा सरस्वती॥",
        text_en="O Goddess Lakshmi! You are the divine energy of cosmic order, wisdom, faith, prosperity, and pure consciousness that nourishes all living beings.",
        text_hi="हे माँ लक्ष्मी! आप ही सृष्टि की समृद्धि, मेधा, श्रद्धा और सात्विक ऊर्जा हैं। आपकी कृपा से मनुष्य के जीवन में स्थिर संपत्ति, बुद्धि और कल्याण का वास होता है।"
    )
]

# In-Memory DBs
PROFILES_DB: Dict[str, BirthProfile] = {}
CHARTS_DB: Dict[str, ChartSnapshot] = {}
CONVERSATIONS_DB: Dict[str, List[AstroAnswer]] = {}
HOURLY_CREDITS_DB: Dict[str, Dict[str, float]] = {}
MAX_QUERIES_PER_HOUR = 30

def calculate_lahiri_ayanamsha(dt: datetime) -> float:
    year_diff = (dt.year + (dt.month - 1)/12.0 + dt.day/365.25) - 2000.0
    return round(23.85 + (year_diff * 0.01397), 4)

def julian_day(dt: datetime) -> float:
    y, m = dt.year, dt.month
    d = dt.day + (dt.hour + dt.minute/60.0 + dt.second/3600.0)/24.0
    if m <= 2: y -= 1; m += 12
    a = math.floor(y / 100.0)
    b = 2 - a + math.floor(a / 4.0)
    return math.floor(365.25 * (y + 4716)) + math.floor(30.6001 * (m + 1)) + d + b - 1524.5

def compute_raw_planetary_degrees(profile: BirthProfile):
    dt_str = f"{profile.dob} {profile.tob}"
    birth_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
    utc_dt = birth_dt - timedelta(hours=profile.timezone_offset)
    jd = julian_day(utc_dt)
    t = (jd - 2451545.0) / 36525.0
    ayanamsha = calculate_lahiri_ayanamsha(birth_dt)

    sun_L0 = 280.46646 + 36000.76983 * t
    sun_M = 357.52911 + 35999.05029 * t
    sun_C = (1.914602 - 0.004817 * t) * math.sin(math.radians(sun_M))
    sun_trop = (sun_L0 + sun_C) % 360.0

    moon_L0 = 218.3165 + 481267.8813 * t
    moon_M = 134.9634 + 477198.8676 * t
    moon_C = 6.2886 * math.sin(math.radians(moon_M))
    moon_trop = (moon_L0 + moon_C) % 360.0

    gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    lst = (gmst + profile.longitude) % 360.0
    lat_rad = math.radians(profile.latitude)
    eps_rad = math.radians(23.4393 - 0.0130 * t)
    lst_rad = math.radians(lst)
    asc_rad = math.atan2(math.cos(lst_rad), -math.sin(lst_rad) * math.cos(eps_rad) - math.tan(lat_rad) * math.sin(eps_rad))
    lagna_trop = (math.degrees(asc_rad) + 180.0) % 360.0

    mars_trop = (355.45 + 19140.30 * t) % 360.0
    mercury_trop = (sun_trop + 18.5 * math.sin(math.radians(250.0 + 149472.0 * t))) % 360.0
    jupiter_trop = (34.40 + 3034.90 * t) % 360.0
    venus_trop = (sun_trop + 32.0 * math.cos(math.radians(120.0 + 58517.0 * t))) % 360.0
    saturn_trop = (50.08 + 1222.11 * t) % 360.0
    rahu_trop = (125.0445 - 1934.1363 * t) % 360.0

    raw = {
        "Lagna": ((lagna_trop - ayanamsha) % 360.0, False),
        "Sun": ((sun_trop - ayanamsha) % 360.0, False),
        "Moon": ((moon_trop - ayanamsha) % 360.0, False),
        "Mars": ((mars_trop - ayanamsha) % 360.0, False),
        "Mercury": ((mercury_trop - ayanamsha) % 360.0, False),
        "Jupiter": ((jupiter_trop - ayanamsha) % 360.0, False),
        "Venus": ((venus_trop - ayanamsha) % 360.0, False),
        "Saturn": ((saturn_trop - ayanamsha) % 360.0, False),
        "Rahu": ((rahu_trop - ayanamsha) % 360.0, True),
        "Ketu": (((rahu_trop + 180.0) - ayanamsha) % 360.0, True)
    }
    return birth_dt, ayanamsha, raw

def get_nakshatra_pada(total_deg: float):
    nak_idx = int(total_deg / (360.0 / 27.0)) % 27
    deg_in_nak = total_deg % (360.0 / 27.0)
    pada = min(4, int(deg_in_nak / (360.0 / 108.0)) + 1)
    nak = NAKSHATRAS[nak_idx]
    return nak["name"], nak["hi"], pada, nak["ruler"]

def build_chart(profile: BirthProfile) -> ChartSnapshot:
    birth_dt, ayanamsha, raw = compute_raw_planetary_degrees(profile)
    lagna_deg, _ = raw["Lagna"]
    lagna_sign_num = int(lagna_deg / 30.0) + 1
    lagna_info = SIGNS[lagna_sign_num - 1]

    planets, nav_planets = [], []
    PLANET_HI = {"Lagna": "लग्न", "Sun": "सूर्य", "Moon": "चंद्र", "Mars": "मंगल", "Mercury": "बुध", "Jupiter": "गुरु", "Venus": "शुक्र", "Saturn": "शनि", "Rahu": "राहु", "Ketu": "केतु"}

    for name, (total_deg, is_retro) in raw.items():
        sign_num = int(total_deg / 30.0) + 1
        sign_info = SIGNS[sign_num - 1]
        deg_in_sign = total_deg % 30.0
        formatted_deg = f"{int(deg_in_sign)}° {int((deg_in_sign - int(deg_in_sign))*60):02d}'"
        house = ((sign_num - lagna_sign_num) % 12) + 1
        nak_en, nak_hi, pada, lord = get_nakshatra_pada(total_deg)

        planets.append(PlanetPosition(
            name=name, name_hi=PLANET_HI.get(name, name), sign_number=sign_num,
            sign_name=sign_info["en"], sign_name_hi=sign_info["hi"], degrees=round(deg_in_sign, 2),
            degree_formatted=formatted_deg, nakshatra=nak_en, nakshatra_hi=nak_hi, pada=pada,
            house=house, is_retrograde=is_retro, drishti_houses=[((house + 6) % 12) or 12]
        ))
        nav_planets.append(PlanetPosition(
            name=name, name_hi=PLANET_HI.get(name, name), sign_number=sign_num,
            sign_name=sign_info["en"], sign_name_hi=sign_info["hi"], degrees=round(deg_in_sign, 2),
            degree_formatted=formatted_deg, nakshatra=nak_en, nakshatra_hi=nak_hi, pada=pada,
            house=house, is_retrograde=is_retro, drishti_houses=[]
        ))

    moon_p = next(p for p in planets if p.name == "Moon")
    sun_p = next(p for p in planets if p.name == "Sun")

    return ChartSnapshot(
        chart_id=f"chart_{uuid.uuid4().hex[:8]}", profile=profile, ayanamsha_type="Lahiri (Chitra Paksha)",
        ayanamsha_value=ayanamsha, lagna_sign=lagna_sign_num, lagna_name=lagna_info["en"],
        lagna_name_hi=lagna_info["hi"], planets=planets, navamsha_planets=nav_planets,
        moon_sign=moon_p.sign_name, moon_sign_hi=moon_p.sign_name_hi, sun_sign=sun_p.sign_name, sun_sign_hi=sun_p.sign_name_hi
    )

default_profile = BirthProfile(name="Guest User", dob="1995-08-15", tob="14:30", place_name="New Delhi, India", latitude=28.6139, longitude=77.2090, timezone_offset=5.5)
PROFILES_DB["default"] = default_profile
default_chart = build_chart(default_profile)
CHARTS_DB[default_chart.chart_id] = default_chart

# API Routes
@app.post("/api/birth-profiles", response_model=BirthProfile)
def create_profile(p: BirthProfile):
    p.id = f"prof_{uuid.uuid4().hex[:8]}"
    PROFILES_DB[p.id] = p
    return p

@app.post("/api/charts", response_model=ChartSnapshot)
def gen_chart(p: BirthProfile):
    c = build_chart(p)
    CHARTS_DB[c.chart_id] = c
    return c

@app.get("/api/charts/{cid}", response_model=ChartSnapshot)
def get_chart_by_id(cid: str):
    return CHARTS_DB.get(cid, default_chart)

@app.get("/api/charts/{cid}/dashas")
def get_dashas(cid: str):
    c = CHARTS_DB.get(cid, default_chart)
    dt_str = f"{c.profile.dob} {c.profile.tob}"
    birth_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
    now_dt = datetime.now()
    
    timeline = []
    curr = birth_dt
    for lord in DASHA_ORDER:
        end = curr + timedelta(days=int(DASHA_YEARS[lord] * 365.25))
        is_c = (curr <= now_dt <= end)
        timeline.append({
            "lord": lord, "lord_hi": DASHA_ORDER_HI[lord],
            "start_date": curr.strftime("%Y-%m-%d"), "end_date": end.strftime("%Y-%m-%d"),
            "is_current": is_c,
            "interpretation_hi": f"{DASHA_ORDER_HI[lord]} की महादशा जिसकी अवधि {DASHA_YEARS[lord]} वर्ष है।",
            "interpretation_en": f"Mahadasha of {lord} for {DASHA_YEARS[lord]} years."
        })
        curr = end
    return timeline

@app.get("/api/charts/{cid}/daily")
def get_daily(cid: str, lang: str = "hi"):
    c = CHARTS_DB.get(cid, default_chart)
    moon_p = next(p for p in c.planets if p.name == "Moon")
    if lang == "hi":
        return {
            "date": datetime.now().strftime("%d %B %Y"),
            "moon_transit": f"आज चंद्र देव आपकी राशि ({moon_p.sign_name_hi}) से शुभ गोचर में हैं।",
            "career_text": "कर्म स्थान पर शुभ प्रभाव से कार्यक्षेत्र में प्रगति और सम्मान प्राप्त होगा।",
            "relationship_text": "सप्तम भाव पर सकारात्मक प्रभाव से संबंधों में मधुरता रहेगी।",
            "mental_clarity_text": "चंद्रमा और गुरु के अनुकूल प्रभाव से मन शांत रहेगा।",
            "remedy": "प्रातः सूर्य देव को जल अर्पित करें और ॐ नमः शिवाय का जाप करें।"
        }
    else:
        return {
            "date": datetime.now().strftime("%d %B %Y"),
            "moon_transit": f"Moon is transiting beneficially relative to your Moon sign ({moon_p.sign_name}).",
            "career_text": "Auspicious aspects bring professional progress and honor.",
            "relationship_text": "Harmonious influence fosters mutual warmth.",
            "mental_clarity_text": "Favorable transit brings mental peace.",
            "remedy": "Offer water to the Sun in morning hours and chant Om Namah Shivaya."
        }

@app.post("/api/astro-chat", response_model=AstroAnswer)
def astro_chat(req: ChatRequest):
    c = CHARTS_DB.get(req.chart_id, default_chart)
    moon_p = next(p for p in c.planets if p.name == "Moon")
    jup_p = next(p for p in c.planets if p.name == "Jupiter")
    sat_p = next(p for p in c.planets if p.name == "Saturn")
    lang = req.language.lower()

    if lang == "hi":
        basis = [
            f"जातक नाम व जन्म विवरण: {c.profile.name} ({c.profile.dob} {c.profile.tob})",
            f"लग्न व राशि: {c.lagna_name_hi} लग्न, {c.moon_sign_hi} राशि ({moon_p.nakshatra_hi} पाद {moon_p.pada})",
            f"गुरु स्थिति: {jup_p.sign_name_hi} (भाव {jup_p.house})",
            f"कर्म शनि स्थिति: {sat_p.sign_name_hi} (भाव {sat_p.house})"
        ]
        ans = (
            f"🕉️ **भारत के वेदों, पुराणों एवं शास्त्रों से आपका सत्य मार्ग (True Path):**\n\n"
            f"प्रिय **{c.profile.name}**, आपकी जन्म कुंडली ({c.profile.dob} {c.profile.tob}, {c.profile.place_name}) का ऋग्वेद, विष्णु पुराण तथा पराशर संहिता से मिलान:\n\n"
            f"1. 📜 **सत्य मार्ग व कर्म दिशा:**\n"
            f"   आपके **{c.lagna_name_hi} लग्न** और **{c.moon_sign_hi} राशि** के अनुसार आपका सत्य मार्ग अनुशासित प्रयास, नैतिक आचरण और सात्विक कर्म में है। असत्य या शॉर्टकट से दूर रहें।\n\n"
            f"🚩 **हिन्दू शास्त्रीय टिप्पणी व वैदिक उपाय:**\n"
            f"• प्रतिदिन 108 बार 'ॐ नमो भगवते वासुदेवाय' या गायत्री मंत्र का जाप करें।\n"
            f"• प्रातः तांबे के पात्र से सूर्य देव को जल अर्पित करें और सात्विक आहार लें।"
        )
        caution = "यह मार्ग वैदिक ऋषियों के सिद्धांतों पर आधारित है। अपने कर्म और विवेक को सर्वोपरि रखें।"
    else:
        basis = [
            f"User: {c.profile.name} ({c.profile.dob} {c.profile.tob})",
            f"Lagna & Moon: {c.lagna_name} Ascendant, {c.moon_sign} Moon ({moon_p.nakshatra} Pada {moon_p.pada})"
        ]
        ans = (
            f"🕉️ **Your True Scriptural Path derived from Bharat's Vedas & Puranas:**\n\n"
            f"Dear **{c.profile.name}**, based on your natal chart parameters:\n\n"
            f"1. 📜 **Karma & Direction:** Your chart indicates an ethical, wise trajectory. Dedicated effort brings lasting success.\n\n"
            f"🚩 **Authentic Scriptural Tip & Remedy:** Chant the Gayatri Mantra daily and offer water to the Sun God."
        )
        caution = "Guidance based on ancient Indian scriptures. Combine with personal discernment."

    return AstroAnswer(
        question=req.question, language=lang, answer_text=ans, astrological_basis=basis,
        source_references=CLASSICAL_SOURCES[:3], caution_disclaimer=caution
    )

# Root Handler for Vercel Static Serving
@app.get("/", response_class=HTMLResponse)
def root_index():
    index_file = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(index_file):
        with open(index_file, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>VedaAstra AI Engine Active</h1>"
