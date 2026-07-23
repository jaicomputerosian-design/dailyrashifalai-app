import os
import sys

# Ensure venv Python is used if uvicorn is present
try:
    import uvicorn
except ImportError:
    print("Error: uvicorn not installed. Make sure virtualenv is activated.")
    sys.exit(1)

if __name__ == "__main__":
    print("==========================================================")
    print(" 🕉️  Starting VedaAstra AI (वेदअस्त्र AI) Web Application...")
    print(" 🌟  Access Web App at: http://localhost:8000")
    print(" 📜  API Docs at:     http://localhost:8000/docs")
    print("==========================================================")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
