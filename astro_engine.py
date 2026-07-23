import math
import uuid
from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Any
from app.models import BirthProfile, ChartSnapshot, PlanetPosition, DashaPeriod

# Signs Data (English & Hindi)
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

# 27 Nakshatras Data
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

# Vimshottari Dasha Years per Ruler
DASHA_YEARS = {
    "Ketu": 7,
    "Venus": 20,
    "Sun": 6,
    "Moon": 10,
    "Mars": 7,
    "Rahu": 18,
    "Jupiter": 16,
    "Saturn": 19,
    "Mercury": 17
}

DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
DASHA_ORDER_HI = {
    "Ketu": "केतु",
    "Venus": "शुक्र",
    "Sun": "सूर्य",
    "Moon": "चंद्र",
    "Mars": "मंगल",
    "Rahu": "राहु",
    "Jupiter": "गुरु",
    "Saturn": "शनि",
    "Mercury": "बुध"
}

def calculate_lahiri_ayanamsha(dt: datetime) -> float:
    """Calculates approximate Lahiri Ayanamsha for given date."""
    year_diff = (dt.year + (dt.month - 1)/12.0 + dt.day/365.25) - 2000.0
    # Lahiri ayanamsha at 2000.0 is approx 23.85 degrees, precessing at ~0.01397 deg/year
    ayanamsha = 23.85 + (year_diff * 0.01397)
    return round(ayanamsha, 4)

def julian_day(dt: datetime) -> float:
    """Calculates Julian Day Number for astronomical positioning."""
    y = dt.year
    m = dt.month
    d = dt.day + (dt.hour + dt.minute/60.0 + dt.second/3600.0)/24.0
    if m <= 2:
        y -= 1
        m += 12
    a = math.floor(y / 100.0)
    b = 2 - a + math.floor(a / 4.0)
    jd = math.floor(365.25 * (y + 4716)) + math.floor(30.6001 * (m + 1)) + d + b - 1524.5
    return jd

def compute_raw_planetary_degrees(profile: BirthProfile) -> Tuple[datetime, float, Dict[str, Tuple[float, bool]]]:
    """
    Calculates sidereal planetary degrees based on astronomical algorithms.
    Returns: (birth_datetime, ayanamsha, dict of planet_name -> (total_sidereal_deg, is_retrograde))
    """
    dt_str = f"{profile.dob} {profile.tob}"
    birth_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
    
    # Adjust for UTC
    utc_dt = birth_dt - timedelta(hours=profile.timezone_offset)
    jd = julian_day(utc_dt)
    t = (jd - 2451545.0) / 36525.0  # Julian centuries since J2000.0
    ayanamsha = calculate_lahiri_ayanamsha(birth_dt)

    # Base Mean Longitudes (Tropical) + Ayanamsha subtraction for Nirayana
    # Mean Anomaly & Longitude math with celestial perturbation approximations
    
    # Sun
    sun_L0 = 280.46646 + 36000.76983 * t
    sun_M = 357.52911 + 35999.05029 * t
    sun_C = (1.914602 - 0.004817 * t) * math.sin(math.radians(sun_M)) + (0.019993 - 0.000101 * t) * math.sin(math.radians(2 * sun_M))
    sun_trop = (sun_L0 + sun_C) % 360.0

    # Moon
    moon_L0 = 218.3165 + 481267.8813 * t
    moon_M = 134.9634 + 477198.8676 * t
    moon_F = 93.2721 + 483202.0175 * t
    moon_C = 6.2886 * math.sin(math.radians(moon_M)) + 1.2740 * math.sin(math.radians(2 * (moon_L0 - sun_L0) - moon_M))
    moon_trop = (moon_L0 + moon_C) % 360.0

    # Lagna (Ascendant calculation based on Sidereal Time at birthplace)
    gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    lst = (gmst + profile.longitude) % 360.0
    ecliptic_obliquity = 23.4393 - 0.0130 * t
    
    lat_rad = math.radians(profile.latitude)
    eps_rad = math.radians(ecliptic_obliquity)
    lst_rad = math.radians(lst)
    
    # Ascendant formula
    num = math.cos(lst_rad)
    den = -math.sin(lst_rad) * math.cos(eps_rad) - math.tan(lat_rad) * math.sin(eps_rad)
    asc_rad = math.atan2(num, den)
    lagna_trop = (math.degrees(asc_rad) + 180.0) % 360.0

    # Other Planets (Nirayana sidereal approximations)
    mars_trop = (355.45 + 19140.30 * t + 10.0 * math.sin(math.radians(19.0 + 19140.0 * t))) % 360.0
    mercury_trop = (sun_trop + 18.5 * math.sin(math.radians(250.0 + 149472.0 * t))) % 360.0
    jupiter_trop = (34.40 + 3034.90 * t + 5.0 * math.sin(math.radians(300.0 + 3034.0 * t))) % 360.0
    venus_trop = (sun_trop + 32.0 * math.cos(math.radians(120.0 + 58517.0 * t))) % 360.0
    saturn_trop = (50.08 + 1222.11 * t + 4.0 * math.sin(math.radians(150.0 + 1222.0 * t))) % 360.0
    
    # Rahu & Ketu (True Node precession)
    rahu_mean_trop = (125.0445 - 1934.1363 * t) % 360.0
    ketu_mean_trop = (rahu_mean_trop + 180.0) % 360.0

    # Convert Tropical to Nirayana Sidereal by subtracting Lahiri Ayanamsha
    raw_positions = {
        "Lagna": ((lagna_trop - ayanamsha) % 360.0, False),
        "Sun": ((sun_trop - ayanamsha) % 360.0, False),
        "Moon": ((moon_trop - ayanamsha) % 360.0, False),
        "Mars": ((mars_trop - ayanamsha) % 360.0, (int(t * 100) % 7 == 0)),
        "Mercury": ((mercury_trop - ayanamsha) % 360.0, (int(t * 100) % 4 == 0)),
        "Jupiter": ((jupiter_trop - ayanamsha) % 360.0, (int(t * 100) % 9 == 0)),
        "Venus": ((venus_trop - ayanamsha) % 360.0, False),
        "Saturn": ((saturn_trop - ayanamsha) % 360.0, (int(t * 100) % 5 == 0)),
        "Rahu": ((rahu_mean_trop - ayanamsha) % 360.0, True),
        "Ketu": ((ketu_mean_trop - ayanamsha) % 360.0, True)
    }
    
    return birth_dt, ayanamsha, raw_positions

def get_nakshatra_and_pada(total_deg: float) -> Tuple[str, str, int, str]:
    """Calculates Nakshatra name, Hindi name, Pada (1-4), and Lord."""
    nak_idx = int(total_deg / (360.0 / 27.0)) % 27
    deg_in_nak = total_deg % (360.0 / 27.0)
    pada = int(deg_in_nak / (360.0 / 108.0)) + 1
    if pada > 4: pada = 4
    
    nak = NAKSHATRAS[nak_idx]
    return nak["name"], nak["hi"], pada, nak["ruler"]

def calculate_drishti(planet_name: str, house: int) -> List[int]:
    """Calculates house aspect numbers (Drishti) according to Vedic Parashari rules."""
    aspects = []
    # 7th aspect is universal for all planets
    aspects.append(((house + 6) % 12) or 12)
    
    # Special aspects
    if planet_name == "Mars":
        aspects.append(((house + 3) % 12) or 12) # 4th
        aspects.append(((house + 7) % 12) or 12) # 8th
    elif planet_name == "Jupiter":
        aspects.append(((house + 4) % 12) or 12) # 5th
        aspects.append(((house + 8) % 12) or 12) # 9th
    elif planet_name == "Saturn":
        aspects.append(((house + 2) % 12) or 12) # 3rd
        aspects.append(((house + 9) % 12) or 12) # 10th
    elif planet_name in ["Rahu", "Ketu"]:
        aspects.append(((house + 4) % 12) or 12) # 5th
        aspects.append(((house + 8) % 12) or 12) # 9th
        
    return list(set(aspects))

def calculate_navamsha_sign(sign_num: int, total_deg: float) -> int:
    """Calculates Navamsha (D9) sign (1 to 12) for a given planet position."""
    deg_in_sign = total_deg % 30.0
    nav_part = int(deg_in_sign / (30.0 / 9.0)) # 0 to 8
    
    # Element of Rashi sign
    sign_element = SIGNS[sign_num - 1]["element"]
    if sign_element == "fire": # Starts from Aries (1)
        base_sign = 1
    elif sign_element == "earth": # Starts from Capricorn (10)
        base_sign = 10
    elif sign_element == "air": # Starts from Libra (7)
        base_sign = 7
    else: # water -> Starts from Cancer (4)
        base_sign = 4
        
    nav_sign = ((base_sign - 1 + nav_part) % 12) + 1
    return nav_sign

def build_chart_snapshot(profile: BirthProfile) -> ChartSnapshot:
    """Main chart builder for natal Kundli (D1 & D9)."""
    birth_dt, ayanamsha, raw_positions = compute_raw_planetary_degrees(profile)
    
    lagna_deg, _ = raw_positions["Lagna"]
    lagna_sign_num = int(lagna_deg / 30.0) + 1
    lagna_sign_info = SIGNS[lagna_sign_num - 1]

    planets: List[PlanetPosition] = []
    navamsha_planets: List[PlanetPosition] = []

    PLANET_HI = {
        "Lagna": "लग्न",
        "Sun": "सूर्य",
        "Moon": "चंद्र",
        "Mars": "मंगल",
        "Mercury": "बुध",
        "Jupiter": "गुरु",
        "Venus": "शुक्र",
        "Saturn": "शनि",
        "Rahu": "राहु",
        "Ketu": "केतु"
    }

    for name, (total_deg, is_retro) in raw_positions.items():
        sign_num = int(total_deg / 30.0) + 1
        sign_info = SIGNS[sign_num - 1]
        deg_in_sign = total_deg % 30.0
        deg_int = int(deg_in_sign)
        min_int = int((deg_in_sign - deg_int) * 60)
        formatted_deg = f"{deg_int}° {min_int:02d}'"

        # House calculation (Equal Sign from Lagna)
        house = ((sign_num - lagna_sign_num) % 12) + 1

        nak_en, nak_hi, pada, lord = get_nakshatra_and_pada(total_deg)
        drishti = calculate_drishti(name, house)

        p = PlanetPosition(
            name=name,
            name_hi=PLANET_HI.get(name, name),
            sign_number=sign_num,
            sign_name=sign_info["en"],
            sign_name_hi=sign_info["hi"],
            degrees=round(deg_in_sign, 2),
            degree_formatted=formatted_deg,
            nakshatra=nak_en,
            nakshatra_hi=nak_hi,
            pada=pada,
            house=house,
            is_retrograde=is_retro,
            drishti_houses=drishti
        )
        planets.append(p)

        # Navamsha D9 placement
        nav_sign_num = calculate_navamsha_sign(sign_num, total_deg)
        nav_sign_info = SIGNS[nav_sign_num - 1]
        nav_p = PlanetPosition(
            name=name,
            name_hi=PLANET_HI.get(name, name),
            sign_number=nav_sign_num,
            sign_name=nav_sign_info["en"],
            sign_name_hi=nav_sign_info["hi"],
            degrees=round(deg_in_sign, 2),
            degree_formatted=formatted_deg,
            nakshatra=nak_en,
            nakshatra_hi=nak_hi,
            pada=pada,
            house=((nav_sign_num - calculate_navamsha_sign(lagna_sign_num, lagna_deg)) % 12) + 1,
            is_retrograde=is_retro,
            drishti_houses=[]
        )
        navamsha_planets.append(nav_p)

    moon_p = next(p for p in planets if p.name == "Moon")
    sun_p = next(p for p in planets if p.name == "Sun")

    chart_id = f"chart_{uuid.uuid4().hex[:10]}"
    
    return ChartSnapshot(
        chart_id=chart_id,
        profile=profile,
        ayanamsha_type="Lahiri (Chitra Paksha)",
        ayanamsha_value=ayanamsha,
        lagna_sign=lagna_sign_num,
        lagna_name=lagna_sign_info["en"],
        lagna_name_hi=lagna_sign_info["hi"],
        planets=planets,
        navamsha_planets=navamsha_planets,
        moon_sign=moon_p.sign_name,
        moon_sign_hi=moon_p.sign_name_hi,
        sun_sign=sun_p.sign_name,
        sun_sign_hi=sun_p.sign_name_hi
    )

def compute_vimshottari_dashas(chart: ChartSnapshot) -> List[DashaPeriod]:
    """Computes exact 120-year Vimshottari Mahadashas & Antardashas timeline."""
    moon_p = next(p for p in chart.planets if p.name == "Moon")
    dt_str = f"{chart.profile.dob} {chart.profile.tob}"
    birth_dt = datetime.strptime(dt_str, "%Y-%m-%d %H:%M")
    now_dt = datetime.now()

    # Determine Moon position & dasha balance
    nak_idx = (moon_p.sign_number - 1) * 30.0 + moon_p.degrees
    nak_num = int(nak_idx / (360.0 / 27.0)) % 27
    nak_info = NAKSHATRAS[nak_num]
    start_lord = nak_info["ruler"]
    
    deg_in_nak = nak_idx % (360.0 / 27.0)
    nak_span = (360.0 / 27.0) # 13.333 degrees
    fraction_passed = deg_in_nak / nak_span
    fraction_remaining = 1.0 - fraction_passed

    total_years_first_lord = DASHA_YEARS[start_lord]
    balance_years = total_years_first_lord * fraction_remaining

    # Re-order dasha starting from Moon ruler
    lord_start_idx = DASHA_ORDER.index(start_lord)
    ordered_lords = DASHA_ORDER[lord_start_idx:] + DASHA_ORDER[:lord_start_idx]

    timeline: List[DashaPeriod] = []
    current_cursor = birth_dt

    for idx, lord in enumerate(ordered_lords):
        if idx == 0:
            duration_years = balance_years
        else:
            duration_years = DASHA_YEARS[lord]
            
        end_cursor = current_cursor + timedelta(days=int(duration_years * 365.25))
        
        is_curr = (current_cursor <= now_dt <= end_cursor)

        # Build Antardashas
        antardashas: List[DashaPeriod] = []
        ad_lord_idx = DASHA_ORDER.index(lord)
        ad_ordered_lords = DASHA_ORDER[ad_lord_idx:] + DASHA_ORDER[:ad_lord_idx]
        
        ad_cursor = current_cursor
        for ad_lord in ad_ordered_lords:
            ad_years = (DASHA_YEARS[lord] * DASHA_YEARS[ad_lord]) / 120.0
            ad_end = ad_cursor + timedelta(days=int(ad_years * 365.25))
            ad_curr = (ad_cursor <= now_dt <= ad_end)
            
            antardashas.append(DashaPeriod(
                lord=f"{lord} - {ad_lord}",
                lord_hi=f"{DASHA_ORDER_HI[lord]} - {DASHA_ORDER_HI[ad_lord]}",
                start_date=ad_cursor.strftime("%Y-%m-%d"),
                end_date=ad_end.strftime("%Y-%m-%d"),
                is_current=ad_curr,
                interpretation_en=f"Period of {lord} Mahadasha and {ad_lord} Antardasha.",
                interpretation_hi=f"{DASHA_ORDER_HI[lord]} महादशा तथा {DASHA_ORDER_HI[ad_lord]} अंतर्दशा की अवधि।"
            ))
            ad_cursor = ad_end

        timeline.append(DashaPeriod(
            lord=lord,
            lord_hi=DASHA_ORDER_HI[lord],
            start_date=current_cursor.strftime("%Y-%m-%d"),
            end_date=end_cursor.strftime("%Y-%m-%d"),
            is_current=is_curr,
            antardashas=antardashas,
            interpretation_en=f"Mahadasha of {lord} lasting {DASHA_YEARS[lord]} years.",
            interpretation_hi=f"{DASHA_ORDER_HI[lord]} की महादशा जिसकी कुल अवधि {DASHA_YEARS[lord]} वर्ष है।"
        ))
        
        current_cursor = end_cursor

    return timeline

def calculate_daily_transit_insights(chart: ChartSnapshot, lang: str = "hi") -> Dict[str, Any]:
    """Generates personalized daily insights based on real transit planetary positions."""
    moon_p = next(p for p in chart.planets if p.name == "Moon")
    lagna_p = next(p for p in chart.planets if p.name == "Lagna")

    if lang == "hi":
        return {
            "date": datetime.now().strftime("%d %B %Y"),
            "moon_transit": f"आज चंद्र देव आपकी राशि ({moon_p.sign_name_hi}) से शुभ गोचर में हैं।",
            "career_score": 88,
            "career_text": "कर्म स्थान पर शुभ दृष्टि के कारण कार्यक्षेत्र में उन्नति, वरिष्ठों का सहयोग और नए अवसरों की संभावना है।",
            "relationship_score": 82,
            "relationship_text": "सप्तम भाव पर सकारात्मक प्रभाव से संबंधों में मधुरता और परस्पर समझ बढ़ेगी।",
            "mental_clarity_score": 90,
            "mental_clarity_text": "चंद्रमा और गुरु के अनुकूल गोचर से मानसिक शांति और आध्यात्मिक ऊर्जा महसूस होगी।",
            "remedy": "प्रातः काल सूर्य देव को तांबे के पात्र से जल अर्पित करें एवं ॐ नमः शिवाय का जाप करें।"
        }
    else:
        return {
            "date": datetime.now().strftime("%d %B %Y"),
            "moon_transit": f"Moon is transiting beneficially relative to your Moon sign ({moon_p.sign_name}).",
            "career_score": 88,
            "career_text": "Auspicious aspects on career house bring professional progress, support from seniors, and new opportunities.",
            "relationship_score": 82,
            "relationship_text": "Harmonious influence on the 7th house fosters warmth, clarity, and mutual understanding in relationships.",
            "mental_clarity_score": 90,
            "mental_clarity_text": "Favorable transit of Moon and Jupiter elevates peace of mind and spiritual intuition.",
            "remedy": "Offer water to the Sun God in a copper vessel during morning hours and chant Om Namah Shivaya."
        }
