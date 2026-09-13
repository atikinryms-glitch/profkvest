# FastAPI Backend for Guild of Travelers Quest

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import os
import re
from dotenv import load_dotenv
from quest_data import QUEST_DATA
from ai_service import analyze_answer as ai_analyze

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Guild of Travelers API",
    description="Backend for career guidance quest in D&D style",
    version="1.0.0"
)

# CORS Middleware (allow frontend to communicate with backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Google Sheets setup (optional)
try:
    import gspread
    from google.oauth2.service_account import Credentials
    
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    KEY_FILE = os.getenv("GOOGLE_KEY_FILE", "google_credentials.json")
    SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
    
    if SHEET_ID and os.path.exists(KEY_FILE):
        creds = Credentials.from_service_account_file(KEY_FILE, scopes=SCOPES)
        client = gspread.authorize(creds)
        sheet = client.open_by_key(SHEET_ID).sheet1
        print("✅ Google Sheets connected!")
    else:
        sheet = None
        print("⚠️ Google Sheets not configured - results will be printed to console")
except Exception as e:
    sheet = None
    print(f"⚠️ Google Sheets error: {e}")


# Pydantic models for request/response validation
class LoginRequest(BaseModel):
    code: str
    heroName: str = Field(..., alias="heroName")
    
    class Config:
        populate_by_name = True


class QuestResult(BaseModel):
    code: str
    hero_name: str
    class_name: str
    quest_type: str
    scores: dict
    choices: str


class AnalyzeRequest(BaseModel):
    answer: str


# API Endpoints

@app.get("/")
def read_root():
    """Health check endpoint"""
    return {"message": "🏰 Сервер Гильдии Путников работает!", "status": "online"}


@app.get("/api/quest")
def get_quest():
    """Get all quest situations (20 total)"""
    return {"quest": QUEST_DATA}


@app.post("/api/login")
def login(request: LoginRequest):
    """
    Validate login code and extract class info
    Code format: 8А02, 11Б15 (1-2 digits + letter + 2 digits)
    """
    code = request.code.upper().strip()
    hero_name = request.heroName.strip()
    
    # Validate code format with regex
    pattern = r"^\d{1,2}[А-ЯA-Z]\d{2}$"
    if not re.match(pattern, code):
        raise HTTPException(
            status_code=400, 
            detail="Неверный формат кода. Пример: 8А02, 11Б15"
        )
    
    # Extract class name from code (8А02 → 8А)
    class_name = re.match(r"^(\d{1,2}[А-ЯA-Z])", code).group(1)
    
    return {
        "success": True,
        "code": code,
        "class_name": class_name,
        "hero_name": hero_name
    }


@app.post("/api/analyze_answer")
def analyze_answer_endpoint(request: AnalyzeRequest):
    """
    Analyze free-form answer using AI (keyword-based or YandexGPT)
    Returns scores for each Klimov type
    """
    answer = request.answer.strip()
    
    if not answer or len(answer) < 10:
        raise HTTPException(
            status_code=400, 
            detail="Ответ слишком короткий (минимум 10 символов)"
        )
    
    try:
        scores = ai_analyze(answer)
        return scores
    except Exception as e:
        print(f"❌ AI analysis error: {e}")
        # Return default balanced scores on error
        return {"Ч-П": 1, "Ч-Т": 1, "Ч-Х": 1, "Ч-Ч": 2, "Ч-З": 1}


@app.post("/api/save_result")
def save_result(result: QuestResult):
    """
    Save quest result to Google Sheets or console
    """
    if sheet is None:
        # Fallback mode: print to console
        print("\n" + "="*60)
        print("📜 НОВЫЙ РЕЗУЛЬТАТ КВЕСТА:")
        print(f"   Код: {result.code}")
        print(f"   Имя героя: {result.hero_name}")
        print(f"   Класс: {result.class_name}")
        print(f"   Тип профессии: {result.quest_type}")
        print(f"   Баллы: {result.scores}")
        print(f"   Выборы: {result.choices}")
        print("="*60 + "\n")
        return {
            "success": True, 
            "message": "Результат сохранён в консоли (Google Sheets не подключён)"
        }
    
    try:
        # Format row for Google Sheets
        row = [
            result.code.upper(),
            result.hero_name,
            result.class_name,
            result.scores.get("date", ""),
            result.quest_type,
            result.scores.get("Ч-П", 0),
            result.scores.get("Ч-Т", 0),
            result.scores.get("Ч-Х", 0),
            result.scores.get("Ч-Ч", 0),
            result.scores.get("Ч-З", 0),
            result.choices
        ]
        
        sheet.append_row(row)
        return {"success": True, "message": "Результат сохранён в Гильдии!"}
    
    except Exception as e:
        print(f"❌ Google Sheets error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Не удалось сохранить результат: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    
    uvicorn.run(app, host=host, port=port, reload=debug)
