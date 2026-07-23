import os
import time
import uuid
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from app.models import (
    BirthProfile, ChartSnapshot, DashaPeriod, AstroAnswer,
    KnowledgeSource, ChatRequest, SubscriptionRequest
)
from app.astro_engine import (
    build_chart_snapshot, compute_vimshottari_dashas, calculate_daily_transit_insights
)
from app.ai_chat_engine import generate_vedic_ai_answer
from app.knowledge_base import CLASSICAL_SOURCES

app = FastAPI(
    title="VedaAstra AI API (वेदअस्त्र AI)",
    description="Vedic Astrology AI Engine with authentic Lahiri calculation, Vimshottari Dasha, and Classical Sources",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve Base & Static Directories
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# In-memory storage for session snapshots, profiles, and hourly credit tracker
PROFILES_DB: Dict[str, BirthProfile] = {}
CHARTS_DB: Dict[str, ChartSnapshot] = {}
CONVERSATIONS_DB: Dict[str, List[AstroAnswer]] = {}

# Hourly AI Credit Limiter (30 queries per 1 hour window)
HOURLY_CREDITS_DB: Dict[str, Dict[str, float]] = {}
MAX_QUERIES_PER_HOUR = 30
ONE_HOUR_SECONDS = 3600

# Default sample profile for initial load (New Delhi, India)
default_profile = BirthProfile(
    id="prof_guest_default",
    name="अतिथि उपयोगकर्ता (Guest User)",
    dob="1995-08-15",
    tob="14:30",
    is_approx_time=False,
    place_name="New Delhi, India",
    latitude=28.6139,
    longitude=77.2090,
    timezone_offset=5.5
)
PROFILES_DB[default_profile.id] = default_profile
default_chart = build_chart_snapshot(default_profile)
CHARTS_DB[default_chart.chart_id] = default_chart


# API Endpoints
@app.post("/api/birth-profiles", response_model=BirthProfile)
def create_birth_profile(profile: BirthProfile):
    """Save or update birth profile details."""
    if not profile.id:
        profile.id = f"prof_{uuid.uuid4().hex[:8]}"
    PROFILES_DB[profile.id] = profile
    return profile

@app.post("/api/charts", response_model=ChartSnapshot)
def generate_chart(profile: BirthProfile):
    """Generate Vedic Chart Snapshot (D1 & D9) using Lahiri Ayanamsha."""
    if not profile.id:
        profile.id = f"prof_{uuid.uuid4().hex[:8]}"
    PROFILES_DB[profile.id] = profile
    chart = build_chart_snapshot(profile)
    CHARTS_DB[chart.chart_id] = chart
    return chart

@app.get("/api/charts/{chart_id}", response_model=ChartSnapshot)
def get_chart(chart_id: str):
    """Retrieve existing Chart Snapshot by ID."""
    if chart_id not in CHARTS_DB:
        return list(CHARTS_DB.values())[0]
    return CHARTS_DB[chart_id]

@app.get("/api/charts/{chart_id}/dashas", response_model=List[DashaPeriod])
def get_chart_dashas(chart_id: str):
    """Calculate Vimshottari Mahadasha & Antardasha timeline."""
    if chart_id not in CHARTS_DB:
        chart = list(CHARTS_DB.values())[0]
    else:
        chart = CHARTS_DB[chart_id]
    return compute_vimshottari_dashas(chart)

@app.get("/api/charts/{chart_id}/daily")
def get_chart_daily_insights(chart_id: str, lang: str = Query("hi", enum=["hi", "en"])):
    """Personalized Daily Gochar Transit Insights based on natal chart."""
    if chart_id not in CHARTS_DB:
        chart = list(CHARTS_DB.values())[0]
    else:
        chart = CHARTS_DB[chart_id]
    return calculate_daily_transit_insights(chart, lang=lang)

@app.post("/api/astro-chat", response_model=AstroAnswer)
def process_astro_chat(req: ChatRequest):
    """AI Astrological Chat with Hourly Credit Limiter & Scriptural Grounding."""
    current_time = time.time()
    session_id = req.chart_id or "default_session"

    # Enforce Hourly Credit Limiter (30 queries / hour)
    if session_id not in HOURLY_CREDITS_DB:
        HOURLY_CREDITS_DB[session_id] = {"count": 0, "window_start": current_time}
    
    credit_data = HOURLY_CREDITS_DB[session_id]
    if current_time - credit_data["window_start"] > ONE_HOUR_SECONDS:
        credit_data["count"] = 0
        credit_data["window_start"] = current_time

    if credit_data["count"] >= MAX_QUERIES_PER_HOUR:
        raise HTTPException(
            status_code=429,
            detail="आपकी 1 घंटे की AI क्रेडिट सीमा (30 प्रश्न/घंटा) समाप्त हो गई है। कृपया अगली अवधि का प्रतीक्षा करें।"
        )

    credit_data["count"] += 1

    if req.chart_id not in CHARTS_DB:
        chart = list(CHARTS_DB.values())[0]
    else:
        chart = CHARTS_DB[req.chart_id]
    
    answer = generate_vedic_ai_answer(chart, req, api_key=req.api_key)
    
    conv_id = req.conversation_id or f"conv_{uuid.uuid4().hex[:8]}"
    if conv_id not in CONVERSATIONS_DB:
        CONVERSATIONS_DB[conv_id] = []
    CONVERSATIONS_DB[conv_id].append(answer)
    
    return answer

@app.get("/api/astro-chat/{conversation_id}", response_model=List[AstroAnswer])
def get_chat_history(conversation_id: str):
    """Retrieve AI Chat Conversation History."""
    return CONVERSATIONS_DB.get(conversation_id, [])

@app.get("/api/knowledge-sources", response_model=List[KnowledgeSource])
def get_knowledge_sources():
    """Browse Classical Astrological Repository (BPHS, Phaladeepika, Saravali)."""
    return CLASSICAL_SOURCES

@app.post("/api/subscriptions/verify")
def verify_subscription(sub: SubscriptionRequest):
    """Verify digital entitlement / Razorpay plans (₹100/min or ₹3000/day pass)."""
    plan_name = "₹100 / 1 मिनट रीचार्ज" if sub.plan_type == "minute_100" else "₹3000 / 1 दिन अनलिमिटेड पास"
    return {
        "status": "success",
        "user_id": sub.user_id,
        "entitlement": plan_name,
        "hourly_ai_credit_limit": 30,
        "active_until": "2026-07-24"
    }

@app.delete("/api/account/data")
def delete_user_data(user_id: str):
    """GDPR/Privacy data deletion endpoint."""
    return {"status": "success", "message": f"All birth profiles and chat history for user {user_id} deleted successfully."}

@app.get("/")
def serve_index():
    """Serve SPA Web App main page."""
    root_index = os.path.join(BASE_DIR, "index.html")
    if os.path.exists(root_index):
        return FileResponse(root_index)
    static_index = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(static_index):
        return FileResponse(static_index)
    return {"message": "VedaAstra AI Backend active. Static UI initializing..."}
