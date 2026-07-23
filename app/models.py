from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class BirthProfile(BaseModel):
    id: Optional[str] = None
    name: str = Field(..., example="Rahul Sharma")
    dob: str = Field(..., example="1995-08-15") # YYYY-MM-DD
    tob: str = Field(..., example="14:30")       # HH:MM
    is_approx_time: bool = False
    place_name: str = Field(..., example="New Delhi, India")
    latitude: float = Field(..., example=28.6139)
    longitude: float = Field(..., example=77.2090)
    timezone_offset: float = Field(..., example=5.5)

class PlanetPosition(BaseModel):
    name: str             # e.g., "Sun", "Moon", "Lagna", "Jupiter"
    name_hi: str          # e.g., "सूर्य", "चंद्र", "लग्न", "गुरु"
    sign_number: int      # 1 to 12
    sign_name: str        # e.g., "Aries", "Taurus"
    sign_name_hi: str     # e.g., "मेष", "वृषभ"
    degrees: float        # 0.0 to 30.0 within sign
    degree_formatted: str # e.g. "15° 24'"
    nakshatra: str        # e.g., "Ashwini"
    nakshatra_hi: str     # e.g., "अश्विनी"
    pada: int             # 1 to 4
    house: int            # 1 to 12 from Lagna
    is_retrograde: bool   # True/False
    drishti_houses: List[int] = [] # Houses this planet aspects

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
    verification_status: str = "Verified"

class AstroAnswer(BaseModel):
    question: str
    language: str = "en"  # "hi" or "en"
    answer_text: str
    astrological_basis: List[str]
    source_references: List[KnowledgeSource]
    caution_disclaimer: str
    confidence_level: float = 0.95

class ChatRequest(BaseModel):
    chart_id: str
    conversation_id: Optional[str] = None
    question: str
    language: str = "hi" # "hi" or "en"
    api_key: Optional[str] = None

class SubscriptionRequest(BaseModel):
    user_id: str
    plan_type: str  # "free" or "pro_tier"
    payment_id: Optional[str] = None
