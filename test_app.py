import unittest
from app.models import BirthProfile
from app.astro_engine import build_chart_snapshot, compute_vimshottari_dashas, calculate_daily_transit_insights
from app.ai_chat_engine import generate_vedic_ai_answer
from app.models import ChatRequest

class TestVedaAstraEngine(unittest.TestCase):
    def test_chart_generation(self):
        profile = BirthProfile(
            name="Rahul Test",
            dob="1995-08-15",
            tob="14:30",
            place_name="New Delhi, India",
            latitude=28.6139,
            longitude=77.2090,
            timezone_offset=5.5
        )
        chart = build_chart_snapshot(profile)
        self.assertIsNotNone(chart.chart_id)
        self.assertEqual(len(chart.planets), 10)
        self.assertEqual(len(chart.navamsha_planets), 10)
        print(f"✅ Generated Chart for {chart.profile.name}: Lagna = {chart.lagna_name} ({chart.lagna_name_hi}), Moon = {chart.moon_sign}")

    def test_dasha_calculation(self):
        profile = BirthProfile(
            name="Rahul Test",
            dob="1995-08-15",
            tob="14:30",
            place_name="New Delhi, India",
            latitude=28.6139,
            longitude=77.2090,
            timezone_offset=5.5
        )
        chart = build_chart_snapshot(profile)
        dashas = compute_vimshottari_dashas(chart)
        self.assertTrue(len(dashas) > 0)
        current_dasha = next((d for d in dashas if d.is_current), None)
        print(f"✅ Active Vimshottari Mahadasha: {current_dasha.lord if current_dasha else 'Calculated'}")

    def test_ai_chat_with_sources(self):
        profile = BirthProfile(
            name="Rahul Test",
            dob="1995-08-15",
            tob="14:30",
            place_name="New Delhi, India",
            latitude=28.6139,
            longitude=77.2090,
            timezone_offset=5.5
        )
        chart = build_chart_snapshot(profile)
        req = ChatRequest(chart_id=chart.chart_id, question="करियर व व्यापार में उन्नति कब मिलेगी?", language="hi")
        answer = generate_vedic_ai_answer(chart, req)
        self.assertTrue(len(answer.astrological_basis) > 0)
        self.assertTrue(len(answer.source_references) > 0)
        print(f"✅ AI Answer generated with {len(answer.source_references)} classical Shloka citations.")

if __name__ == "__main__":
    unittest.main()
