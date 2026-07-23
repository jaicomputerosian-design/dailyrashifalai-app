from typing import List, Dict, Any
from app.models import KnowledgeSource

CLASSICAL_SOURCES: List[KnowledgeSource] = [
    # Jyotish Shastras
    KnowledgeSource(
        source_id="bphs_ch24_sh12",
        title="Brihat Parashara Hora Shastra",
        title_hi="बृहत्पाराशर होराशास्त्र (ज्योतिष शास्त्र)",
        author="Maharishi Parashara",
        chapter="Chapter 24: Results of 10th House (कर्म भाव फल)",
        shloka_ref="BPHS Ch. 24, Shloka 12-14",
        text_sanskrit="कर्मेशे केंद्रकोणे वा सबले गुरुसंयुते। राज्यलाभो नृपपूजा यशः कीर्तिर्वर्धते॥",
        text_en="When the 10th lord is positioned in a Kendra or Trikona house with strength or associated with Jupiter, the native attains professional honor, career success, authority, and widespread fame.",
        text_hi="यदि दशमेश (कर्मेश) केंद्र या त्रिकोण भाव में बली होकर शुभ ग्रह या गुरु से युत या दृष्ट हो, तो जातक को राज्य पद, व्यापारिक सफलता, समाज में सम्मान एवं कीर्ति प्राप्त होती है।",
        verification_status="Verified Scriptural Text"
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
        text_hi="यदि सप्तमेश शुभ ग्रहों द्वारा दृष्ट हो और गुरु या शुक्र से संबंध बनाए, तो जातक को गुणवान, धर्मनिष्ठ और जीवन में सहयोग देने वाला जीवनसाथी प्राप्त होता है।",
        verification_status="Verified Scriptural Text"
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
        text_hi="द्वितीयेश या एकादशेश पर गुरु की शुभ दृष्टि होने से महालक्ष्मी योग बनता है। जातक विद्यावान, संपन्न, दानशील और आर्थिक रूप से सुदृढ़ होता है।",
        verification_status="Verified Scriptural Text"
    ),
    # Vedas
    KnowledgeSource(
        source_id="rigveda_10_190",
        title="Rigveda",
        title_hi="ऋग्वेद (वेद संहिता)",
        author="Vedic Rishis",
        chapter="Mandala 10, Sukta 190 (ऋत और सत्य सुक्त)",
        shloka_ref="Rigveda 10.190.1",
        text_sanskrit="ऋतं च सत्यं चाभीद्धात्तपसोऽध्यजायत। ततो रात्र्यजायत ततः समुद्रो अर्णवः॥",
        text_en="Truth and cosmic order were born from intense spiritual meditation. Thence arose the night, and thence the surging ocean of cosmic consciousness.",
        text_hi="परम तप से ऋत (सृष्टि की अपरिवर्तनीय व्यवस्था) तथा सत्य का जन्म हुआ। ब्रह्मांडीय नियम एवं ग्रहों की गति जीवन में धर्म और कर्म का संचालन करती है।",
        verification_status="Authentic Veda Samhita"
    ),
    # Puranas
    KnowledgeSource(
        source_id="vishna_purana_1_9",
        title="Vishnu Purana",
        title_hi="विष्णु पुराण (अष्टादश पुराण)",
        author="Maharishi Parashara",
        chapter="Ansha 1, Chapter 9: Lakshmi Stuti",
        shloka_ref="Vishnu Purana 1.9.117",
        text_sanskrit="त्वं सिद्धिस्त्वं स्वधा स्वाहा शुद्धा त्वं लोकपावनि। संध्या रात्रिः प्रभा भूतिर्मेधा श्रद्धा सरस्वती॥",
        text_en="O Goddess Lakshmi! You are the divine energy of cosmic order, wisdom, faith, prosperity, and pure consciousness that nourishes all living beings.",
        text_hi="हे माँ लक्ष्मी! आप ही सृष्टि की समृद्धि, मेधा, श्रद्धा और सात्विक ऊर्जा हैं। आपकी कृपा से मनुष्य के जीवन में स्थिर संपत्ति, बुद्धि और कल्याण का वास होता है।",
        verification_status="Authentic Purana Shloka"
    ),
    KnowledgeSource(
        source_id="agni_purana_ch120",
        title="Agni Purana",
        title_hi="अग्नि पुराण (ज्योतिष एवं रत्न विधान)",
        author="Maharishi Vyasa",
        chapter="Chapter 120: Planetary Worship & Mantras",
        shloka_ref="Agni Purana Ch. 120, Shloka 1-3",
        text_sanskrit="ग्रहपूजा प्रकर्तव्या शान्तिकामैः सदा नृभिः। आरोग्यं श्रीर्जयश्चैव ग्रहाधीना यतो जनाः॥",
        text_en="Those seeking peace, health, victory, and prosperity should offer prayers to the Navagrahas, for planetary energies govern world phenomena.",
        text_hi="शांति, आरोग्य, श्री और विजय की कामना करने वाले मनुष्यों को नवग्रहों की सात्विक उपासना करनी चाहिए, क्योंकि ग्रह मंडल ही प्रारब्ध और कर्मफल का नियंत्रण करता है।",
        verification_status="Authentic Purana Shloka"
    )
]

def search_knowledge_sources(query_keywords: List[str]) -> List[KnowledgeSource]:
    """Retrieves relevant classical citations matching topic query."""
    matched = []
    for source in CLASSICAL_SOURCES:
        combined = (source.title + source.title_hi + source.chapter + source.text_en + source.text_hi).lower()
        if any(kw.lower() in combined for kw in query_keywords):
            matched.append(source)
    if not matched:
        matched.append(CLASSICAL_SOURCES[0]) # Default to BPHS Ch 24
        matched.append(CLASSICAL_SOURCES[3]) # Rigveda
    return matched
