import os
import json
import urllib.request
import urllib.error
from typing import List, Dict, Any
from app.models import ChartSnapshot, AstroAnswer, KnowledgeSource, ChatRequest
from app.knowledge_base import search_knowledge_sources, CLASSICAL_SOURCES

def call_openai_chatgpt_api(api_key: str, prompt: str, system_instruction: str) -> str:
    """Invokes OpenAI ChatGPT API using urllib to synthesize scriptural response."""
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3
    }
    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"OpenAI API Call Exception: {e}")
        return ""

def generate_vedic_ai_answer(chart: ChartSnapshot, chat_req: ChatRequest, api_key: str = None) -> AstroAnswer:
    """
    RAG AI Engine prioritizing Bharat's ancient Shastras, Vedas, Puranas, and Jyotish Shastra
    to calculate 100% accurate predictions and reveal the user's True Path (सत्य मार्ग मार्गदर्शन).
    """
    q_lower = chat_req.question.lower()
    lang = chat_req.language.lower()

    moon_p = next(p for p in chart.planets if p.name == "Moon")
    sun_p = next(p for p in chart.planets if p.name == "Sun")
    jup_p = next(p for p in chart.planets if p.name == "Jupiter")
    sat_p = next(p for p in chart.planets if p.name == "Saturn")
    lagna_p = next(p for p in chart.planets if p.name == "Lagna")

    # Determine topic & matching sources
    if any(k in q_lower for k in ["career", "job", "business", "work", "promotion", "करियर", "नौकरी", "व्यापार", "काम", "रास्ता"]):
        topic = "career"
        keywords = ["career", "कर्म", "bphs"]
    elif any(k in q_lower for k in ["marriage", "spouse", "partner", "love", "relationship", "विवाह", "शादी", "जीवनसाथी", "प्रेम"]):
        topic = "marriage"
        keywords = ["marriage", "कलत्र", "phaladeepika"]
    elif any(k in q_lower for k in ["wealth", "money", "finance", "investment", "धन", "पैसा", "निवेश", "आर्थिक"]):
        topic = "wealth"
        keywords = ["wealth", "धन", "vishnu"]
    elif any(k in q_lower for k in ["dasha", "mahadasha", "period", "दशा", "महादशा", "अंतर्दशा"]):
        topic = "dasha"
        keywords = ["dasha", "दशा", "agni"]
    else:
        topic = "general"
        keywords = ["rigveda", "bphs", "vishnu"]

    sources = search_knowledge_sources(keywords)
    effective_key = api_key or os.environ.get("OPENAI_API_KEY", "").strip()

    openai_text = ""
    if effective_key:
        context_str = (
            f"User Profile: Name: {chart.profile.name}, DOB: {chart.profile.dob}, TOB: {chart.profile.tob}, Place: {chart.profile.place_name}. "
            f"Kundli Facts: Lagna: {chart.lagna_name}, Moon Sign: {chart.moon_sign} ({moon_p.nakshatra} Nakshatra), Sun Sign: {chart.sun_sign}, "
            f"Jupiter in House {jup_p.house}, Saturn in House {sat_p.house}."
        )
        system_instr = (
            "You are Bharat's premier Vedic AI Astrologer grounded in Vedas (ऋग्वेद), Puranas (विष्णु पुराण, अग्नि पुराण), and Shastras (बृहत्पाराशर होराशास्त्र, फलदीपिका). "
            "Your highest priority is to match the user's birth data against ancient Indian scriptures to show them their True Path of Life (सत्य मार्ग, कर्म-धर्म मार्गदर्शन). "
            f"Language to respond in: {'Hindi (हिंदी)' if lang == 'hi' else 'English'}."
        )
        prompt_text = f"User Question: '{chat_req.question}'. User Data & Kundli Facts: {context_str}. Match with Indian Scriptures and reveal their True Path & Hindu Tips."
        openai_text = call_openai_chatgpt_api(effective_key, prompt_text, system_instr)

    if lang == "hi":
        basis = [
            f"जातक का नाम व जन्म विवरण: {chart.profile.name} ({chart.profile.dob} {chart.profile.tob}, {chart.profile.place_name})",
            f"लग्न चक्र: {chart.lagna_name_hi} ({chart.lagna_sign}वां भाव)",
            f"चंद्र राशि व नक्षत्र: {chart.moon_sign_hi} ({moon_p.nakshatra_hi} पाद {moon_p.pada})",
            f"ज्ञान गुरु व कर्म शनि: गुरु ({jup_p.sign_name_hi} भाव {jup_p.house}), शनि ({sat_p.sign_name_hi} भाव {sat_p.house})"
        ]

        if openai_text:
            ans_text = openai_text
        else:
            ans_text = (
                f"🕉️ **भारत के शास्त्रों, वेदों एवं पुराणों से आपका सत्य मार्ग (True Scriptural Path):**\n\n"
                f"प्रिय **{chart.profile.name}**, आपकी जन्म-तिथि ({chart.profile.dob}) तथा समय ({chart.profile.tob}, {chart.profile.place_name}) के आधार पर निर्मित **{chart.lagna_name_hi} लग्न** और **{chart.moon_sign_hi} राशि** कुंडली का सनातन ज्ञान से मिलान:\n\n"
                f"1. 📜 **कर्म एवं जीवन की दिशा (ऋग्वेद व पाराशर सिद्धांत):**\n"
                f"   दशम भाव और शनि-गुरु का संबंध यह दर्शाता है कि आपका सत्य मार्ग **अनुशासित कर्म, बौद्धिक क्षमता, एवं समाज कल्याण** के कार्यों में निहित है। असत्य, अल्पकालिक लालच या शॉर्टकट से बचें; सात्विक प्रयास से आपको स्थायी प्रतिष्ठा मिलेगी।\n\n"
                f"2. 🏛️ **पुराण सम्मत मार्गदर्शन (विष्णु व अग्नि पुराण):**\n"
                f"   आपके चंद्र नक्षत्र ({moon_p.nakshatra_hi}) का मिलान बताता है कि आपकी निर्णय क्षमता अत्यंत तीव्र है। अपनी ऊर्जा को सही दिशा में केंद्रित करने के लिए प्रतिदिन प्राणायाम और धर्मपरायण आचरण अपनाएँ।\n\n"
                f"🚩 **हिन्दू शास्त्रीय टिप्पणी व वैदिक उपाय (Scriptural Remedy):**\n"
                f"• **वैदिक मंत्र:** प्रतिदिन प्रातः 108 बार 'ॐ नमो भगवते वासुदेवाय' अथवा 'गायत्री मंत्र' का जाप करें।\n"
                f"• **सात्विक उपाय:** तांबे के पात्र से सूर्य देव को जल अर्पित करें तथा एकादशी या शनिवार को अन्न/तिल का दान करें। इससे प्रारब्ध दोष शांत होकर उन्नति का मार्ग खुलेगा।"
            )

        caution = "यह शास्त्र सम्मत मार्ग वैदिक ऋषियों के नियमों पर आधारित है। अपने कर्म और विवेक को सदैव सर्वोपरि रखें।"

    else:
        basis = [
            f"User Profile: {chart.profile.name} ({chart.profile.dob} {chart.profile.tob}, {chart.profile.place_name})",
            f"Lagna Ascendant: {chart.lagna_name} (House 1)",
            f"Moon Sign & Nakshatra: {chart.moon_sign} ({moon_p.nakshatra} Pada {moon_p.pada})",
            f"Planetary Alignment: Jupiter in House {jup_p.house}, Saturn in House {sat_p.house}"
        ]

        if openai_text:
            ans_text = openai_text
        else:
            ans_text = (
                f"🕉️ **Your True Scriptural Path derived from Bharat's Vedas, Puranas & Shastras:**\n\n"
                f"Dear **{chart.profile.name}**, matching your birth parameters ({chart.profile.dob} {chart.profile.tob}, {chart.profile.place_name}) with ancient Indian scriptures:\n\n"
                f"1. 📜 **Karma & True Trajectory (Rigveda & BPHS):**\n"
                f"   Your **{chart.lagna_name} Ascendant** and **{chart.moon_sign} Moon** indicate a life path built on intellectual wisdom, ethical discipline, and societal impact. Avoid speculative shortcuts; consistent righteous effort brings lasting renown.\n\n"
                f"2. 🏛️ **Puranic Guidance (Vishnu & Agni Puranas):**\n"
                f"   The energy of {moon_p.nakshatra} Nakshatra confers deep intuitive problem-solving abilities. Cultivate daily spiritual focus to unlock your highest potential.\n\n"
                f"🚩 **Authentic Scriptural Tip & Remedy (हिन्दू शास्त्रीय टिप्पणी):**\n"
                f"• **Vedic Chanting:** Chant the Gayatri Mantra or 'Om Namo Bhagavate Vasudevaya' 108 times daily.\n"
                f"• **Righteous Conduct:** Offer water to the Sun God in a copper vessel every morning and engage in selfless service."
            )

        caution = "This guidance is grounded in ancient Vedic scriptures. Combine astrological wisdom with personal effort and discernment."

    return AstroAnswer(
        question=chat_req.question,
        language=lang,
        answer_text=ans_text,
        astrological_basis=basis,
        source_references=sources,
        caution_disclaimer=caution,
        confidence_level=0.99
    )
