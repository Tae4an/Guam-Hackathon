#!/usr/bin/env python3
"""
관광객 및 GDP 데이터 전처리 스크립트
CSV 파일을 읽어서 분석용 JSON 형태로 변환
"""

import pandas as pd
import json
import numpy as np
from sklearn.linear_model import LinearRegression

def process_tourism_data(csv_file_path):
    """
    관광객 데이터 CSV를 처리하여 JSON으로 변환
    
    예상 CSV 형태:
    Year,Japan,Korea,USA,China,Philippines,Taiwan
    2014,120000,80000,25000,45000,35000,28000
    ...
    """
    try:
        df = pd.read_csv(csv_file_path)
        
        # 연도별 데이터를 국가별로 변환
        tourism_data = {}
        for column in df.columns:
            if column != 'Year':
                tourism_data[column] = df[column].tolist()
        
        return tourism_data
    except FileNotFoundError:
        print(f"파일을 찾을 수 없습니다: {csv_file_path}")
        return None
    except Exception as e:
        print(f"데이터 처리 오류: {e}")
        return None

def process_gdp_data(csv_file_path):
    """
    GDP 데이터 CSV를 처리하여 리스트로 변환
    
    예상 CSV 형태:
    Year,GDP
    2014,3.2
    ...
    """
    try:
        df = pd.read_csv(csv_file_path)
        return df['GDP'].tolist()
    except FileNotFoundError:
        print(f"파일을 찾을 수 없습니다: {csv_file_path}")
        return None
    except Exception as e:
        print(f"GDP 데이터 처리 오류: {e}")
        return None

def calculate_correlations_and_impacts(tourism_data, gdp_data):
    """
    상관관계 및 경제적 영향 계산
    """
    results = {}
    
    for country, tourists in tourism_data.items():
        if len(tourists) == len(gdp_data):
            # 상관관계 계산
            correlation = np.corrcoef(tourists, gdp_data)[0, 1]
            
            # 경제적 영향 계산 (선형회귀)
            try:
                X = np.array(tourists).reshape(-1, 1)
                y = np.array(gdp_data)
                model = LinearRegression()
                model.fit(X, y)
                impact_per_tourist = model.coef_[0] * 1000000  # 관광객 1명당 달러
            except:
                impact_per_tourist = 0
            
            results[country] = {
                'avg_tourists': int(np.mean(tourists)),
                'correlation': round(correlation, 3),
                'impact_per_tourist': round(impact_per_tourist, 2),
                'total_economic_impact': round(np.mean(tourists) * impact_per_tourist / 1000000, 2)
            }
    
    return results

def generate_sample_data():
    """
    샘플 데이터 생성 (실제 데이터가 없을 때 사용)
    """
    tourism_data = {
        "Japan": [120000, 130000, 125000, 140000, 150000, 160000, 155000, 170000, 165000, 180000, 175000],
        "Korea": [80000, 85000, 90000, 95000, 100000, 110000, 105000, 120000, 115000, 130000, 125000],
        "USA": [25000, 26000, 27000, 28000, 30000, 32000, 31000, 35000, 33000, 38000, 36000],
        "China": [45000, 50000, 48000, 55000, 60000, 58000, 55000, 52000, 50000, 48000, 45000],
        "Philippines": [35000, 37000, 40000, 42000, 45000, 48000, 46000, 50000, 48000, 52000, 50000],
        "Taiwan": [28000, 30000, 32000, 35000, 38000, 40000, 38000, 42000, 40000, 45000, 43000]
    }
    
    gdp_data = [3.2, 3.5, 3.3, 3.8, 4.1, 4.3, 4.0, 4.5, 4.2, 4.7, 4.5]
    years = list(range(2014, 2025))
    
    return tourism_data, gdp_data, years

def create_time_series_data(tourism_data, gdp_data, years):
    """
    시계열 차트용 데이터 생성
    """
    time_series = []
    
    for i, year in enumerate(years):
        yearly_data = {"year": year, "gdp": gdp_data[i]}
        for country, tourists in tourism_data.items():
            yearly_data[country.lower()] = tourists[i]
        time_series.append(yearly_data)
    
    return time_series

def main():
    """
    메인 처리 함수
    """
    print("🌏 TourismGDP Analyzer - 데이터 전처리 시작")
    
    # 실제 데이터 파일 경로 (있다면)
    tourism_csv = "data/tourism_data.csv"
    gdp_csv = "data/gdp_data.csv"
    
    # 데이터 로드 시도
    tourism_data = process_tourism_data(tourism_csv)
    gdp_data = process_gdp_data(gdp_csv)
    
    # 실제 데이터가 없으면 샘플 데이터 사용
    if tourism_data is None or gdp_data is None:
        print("📊 실제 데이터가 없어 샘플 데이터를 사용합니다.")
        tourism_data, gdp_data, years = generate_sample_data()
    else:
        years = list(range(2014, 2014 + len(gdp_data)))
    
    # 분석 수행
    analysis_results = calculate_correlations_and_impacts(tourism_data, gdp_data)
    time_series_data = create_time_series_data(tourism_data, gdp_data, years)
    
    # 상관관계 계산
    correlations = {}
    for country, tourists in tourism_data.items():
        correlations[country.lower()] = round(np.corrcoef(tourists, gdp_data)[0, 1], 3)
    
    # 결과 JSON 생성
    output_data = {
        "rankings": {
            "rankings": sorted(
                [{"country": k, **v} for k, v in analysis_results.items()],
                key=lambda x: x["total_economic_impact"],
                reverse=True
            )
        },
        "correlations": {
            "time_series": time_series_data,
            "correlations": correlations
        }
    }
    
    # JSON 파일로 저장
    with open('../backend/processed_data.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print("✅ 데이터 전처리 완료!")
    print(f"📈 분석된 국가 수: {len(tourism_data)}")
    print(f"📅 분석 기간: {years[0]} - {years[-1]}")
    print(f"🏆 TOP 3 경제 기여국:")
    
    for i, country_data in enumerate(output_data["rankings"]["rankings"][:3]):
        print(f"   {i+1}. {country_data['country']}: ${country_data['total_economic_impact']}M")

if __name__ == "__main__":
    main()
