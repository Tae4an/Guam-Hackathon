import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from typing import Dict, List, Union
import json

# 샘플 데이터 (실제 데이터로 대체 예정)
SAMPLE_TOURISM_DATA = {
    "Japan": [120000.0, 130000.0, 125000.0, 140000.0, 150000.0, 160000.0, 155000.0, 170000.0, 165000.0, 180000.0, 175000.0],
    "Korea": [80000.0, 85000.0, 90000.0, 95000.0, 100000.0, 110000.0, 105000.0, 120000.0, 115000.0, 130000.0, 125000.0],
    "USA": [25000.0, 26000.0, 27000.0, 28000.0, 30000.0, 32000.0, 31000.0, 35000.0, 33000.0, 38000.0, 36000.0],
    "China": [45000.0, 50000.0, 48000.0, 55000.0, 60000.0, 58000.0, 55000.0, 52000.0, 50000.0, 48000.0, 45000.0],
    "Philippines": [35000.0, 37000.0, 40000.0, 42000.0, 45000.0, 48000.0, 46000.0, 50000.0, 48000.0, 52000.0, 50000.0],
    "Taiwan": [28000.0, 30000.0, 32000.0, 35000.0, 38000.0, 40000.0, 38000.0, 42000.0, 40000.0, 45000.0, 43000.0]
}

SAMPLE_GDP_DATA = [3.2, 3.5, 3.3, 3.8, 4.1, 4.3, 4.0, 4.5, 4.2, 4.7, 4.5]  # 억 달러 단위
YEARS = list(range(2014, 2025))

def calculate_correlation(country_tourists: List[float], gdp_data: List[float]) -> float:
    """관광객 수와 GDP 간의 상관관계 계산"""
    if len(country_tourists) != len(gdp_data):
        return 0.0
    return float(np.corrcoef(country_tourists, gdp_data)[0, 1])

def calculate_economic_impact(country_tourists: List[float], gdp_data: List[float]) -> float:
    """관광객 1명당 GDP 기여도 계산 (선형회귀)"""
    try:
        X = np.array(country_tourists).reshape(-1, 1)
        y = np.array(gdp_data)
        model = LinearRegression()
        model.fit(X, y)
        return float(model.coef_[0] * 1000000)  # 관광객 1명당 달러 단위
    except:
        return 0.0

def get_country_rankings() -> Dict:
    """국가별 경제 기여도 순위 데이터"""
    rankings = []
    
    for country, tourists in SAMPLE_TOURISM_DATA.items():
        correlation = calculate_correlation(tourists, SAMPLE_GDP_DATA)
        impact_per_tourist = calculate_economic_impact(tourists, SAMPLE_GDP_DATA)
        avg_tourists = np.mean(tourists)
        total_impact = avg_tourists * impact_per_tourist / 1000000  # 백만 달러 단위
        
        rankings.append({
            "country": country,
            "avg_tourists": int(avg_tourists),
            "correlation": round(correlation, 3),
            "impact_per_tourist": round(impact_per_tourist, 2),
            "total_economic_impact": round(total_impact, 2)
        })
    
    # 총 경제적 영향으로 정렬
    rankings.sort(key=lambda x: x["total_economic_impact"], reverse=True)
    
    return {"rankings": rankings}

def get_correlation_data() -> Dict:
    """시계열 상관관계 데이터"""
    data = []
    
    for i, year in enumerate(YEARS):
        yearly_data = {"year": year, "gdp": SAMPLE_GDP_DATA[i]}
        
        for country, tourists in SAMPLE_TOURISM_DATA.items():
            yearly_data[country.lower()] = tourists[i]
        
        data.append(yearly_data)
    
    # 각 국가별 전체 상관관계도 계산
    correlations = {}
    for country, tourists in SAMPLE_TOURISM_DATA.items():
        correlations[country.lower()] = round(
            calculate_correlation(tourists, SAMPLE_GDP_DATA), 3
        )
    
    return {
        "time_series": data,
        "correlations": correlations
    }

def calculate_gdp_prediction(country_changes: Dict[str, float]) -> float:
    """관광객 변화에 따른 GDP 영향 예측"""
    current_gdp = SAMPLE_GDP_DATA[-1]  # 최신 GDP
    total_impact = 0.0
    
    for country, change_percent in country_changes.items():
        if country.title() in SAMPLE_TOURISM_DATA:
            tourists = SAMPLE_TOURISM_DATA[country.title()]
            impact_per_tourist = calculate_economic_impact(tourists, SAMPLE_GDP_DATA)
            current_tourists = tourists[-1]
            
            # 관광객 변화량 계산
            tourist_change = current_tourists * (change_percent / 100)
            
            # GDP 영향 계산 (관광객 변화 * 1명당 기여도)
            gdp_impact = tourist_change * impact_per_tourist / 1000000  # 백만 달러 단위
            total_impact += gdp_impact
    
    # 예상 GDP 변화율 계산
    gdp_change_percent = (total_impact / (current_gdp * 1000)) * 100  # 퍼센트
    
    return round(gdp_change_percent, 2) 