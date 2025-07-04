from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from analysis import (
    get_country_rankings, 
    get_correlations, 
    get_monthly_data,
    predict_gdp_impact,
    DATA  # 전역 데이터 객체
)
from pydantic import BaseModel
from typing import Dict, Any
import uvicorn

app = FastAPI(title="괌 비즈니스 인사이트 API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TourismChange(BaseModel):
    japan: float = 0
    korea: float = 0
    usa: float = 0
    china: float = 0
    philippines: float = 0
    taiwan: float = 0

@app.get("/")
async def root():
    return {"message": "괌 비즈니스 인사이트 API에 오신 것을 환영합니다!"}

@app.get("/api/rankings")
async def get_rankings():
    """국가별 경제 기여도 순위 반환"""
    try:
        rankings = get_country_rankings()
        return rankings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/correlations")
async def get_correlations_endpoint():
    """시계열 상관관계 데이터 반환"""
    try:
        correlations = get_correlations()
        return correlations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/monthly")
async def get_monthly_endpoint():
    """월별 데이터 및 계절성 분석 반환"""
    try:
        monthly_data = get_monthly_data()
        return monthly_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict")
async def predict_gdp(request: TourismChange):
    """관광객 변화에 따른 GDP 영향 예측"""
    tourism_changes = request.dict()
    try:
        prediction = predict_gdp_impact(tourism_changes)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 