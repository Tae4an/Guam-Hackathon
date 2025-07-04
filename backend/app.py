from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List
import uvicorn

from analysis import (
    get_country_rankings,
    get_correlation_data,
    calculate_gdp_prediction
)

app = FastAPI(
    title="TourismGDP Analyzer API",
    description="괌 관광객-GDP 상관관계 분석 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 개발 서버
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request 모델 정의
class PredictionRequest(BaseModel):
    country_changes: Dict[str, float]  # {"Japan": 10, "Korea": -5, ...}

@app.get("/")
async def root():
    return {"message": "TourismGDP Analyzer API"}

@app.get("/api/rankings")
async def get_rankings():
    """국가별 경제 기여도 순위 데이터"""
    return get_country_rankings()

@app.get("/api/correlations")
async def get_correlations():
    """관광객 수 vs GDP 상관관계 데이터"""
    return get_correlation_data()

@app.post("/api/predict")
async def predict_gdp_impact(request: PredictionRequest):
    """관광객 변화에 따른 GDP 영향 예측"""
    prediction = calculate_gdp_prediction(request.country_changes)
    return {"predicted_gdp_change": prediction}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 