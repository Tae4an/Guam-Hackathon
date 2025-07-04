import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime
import os
from typing import List, Dict, Any

def load_real_data():
    """실제 CSV 데이터를 로드하고 연별/월별 데이터를 처리"""
    try:
        # 1. 관광객 월별 데이터 로드
        tourism_path = os.path.join('data', 'Gual_Tourism(arrival)_10Y.csv')
        tourism_df = pd.read_csv(tourism_path)
        
        # Month 컬럼을 날짜로 변환하고 연도 추출
        tourism_df['Year'] = pd.to_datetime(tourism_df['Month'], format='%Y-%m').dt.year
        tourism_df['Month_num'] = pd.to_datetime(tourism_df['Month'], format='%Y-%m').dt.month
        
        # 2. GDP 연별 데이터 로드
        gdp_path = os.path.join('data', 'Guam_GDP_10Y.csv')
        gdp_df = pd.read_csv(gdp_path)
        
        # GDP 데이터 처리 (첫 번째 행의 연도별 값 추출)
        gdp_row = gdp_df.iloc[0]  # "Gross domestic product" 행
        gdp_years = {}
        
        for year in range(2014, 2023):  # 2014-2022년
            if str(year) in gdp_row.index:
                # 콤마 제거하고 숫자로 변환
                gdp_value = str(gdp_row[str(year)]).replace(',', '').replace('"', '')
                gdp_years[year] = float(gdp_value) / 1000  # 단위를 10억 달러로 변환
        
        # 3. 연별 관광객 데이터 집계
        yearly_tourism = tourism_df.groupby('Year').agg({
            'Korea': 'sum',
            'Japan': 'sum',
            'US/Hawaii': 'sum',
            'Philippines': 'sum',
            'Taiwan': 'sum',
            'China': 'sum'
        }).reset_index()
        
        # 4. 월별 데이터 정리 (최근 3년)
        monthly_data = []
        for _, row in tourism_df.iterrows():
            if row['Year'] >= 2022:  # 최근 3년 데이터
                monthly_data.append({
                    'year': int(row['Year']),
                    'month': int(row['Month_num']),
                    'month_str': row['Month'],
                    'korea': float(row['Korea']) if pd.notna(row['Korea']) else 0,
                    'japan': float(row['Japan']) if pd.notna(row['Japan']) else 0,
                    'usa': float(row['US/Hawaii']) if pd.notna(row['US/Hawaii']) else 0,
                    'philippines': float(row['Philippines']) if pd.notna(row['Philippines']) else 0,
                    'taiwan': float(row['Taiwan']) if pd.notna(row['Taiwan']) else 0,
                    'china': float(row['China']) if pd.notna(row['China']) else 0,
                    'total': float(row['Total Arrivals']) if pd.notna(row['Total Arrivals']) else 0
                })
        
        # 5. 연별 데이터 정리
        yearly_data = {}
        for _, row in yearly_tourism.iterrows():
            year = int(row['Year'])
            if year in gdp_years and year >= 2014 and year <= 2022:
                yearly_data[year] = {
                    'gdp': gdp_years[year],
                    'korea': float(row['Korea']) if pd.notna(row['Korea']) else 0,
                    'japan': float(row['Japan']) if pd.notna(row['Japan']) else 0,
                    'usa': float(row['US/Hawaii']) if pd.notna(row['US/Hawaii']) else 0,
                    'philippines': float(row['Philippines']) if pd.notna(row['Philippines']) else 0,
                    'taiwan': float(row['Taiwan']) if pd.notna(row['Taiwan']) else 0,
                    'china': float(row['China']) if pd.notna(row['China']) else 0
                }
        
        # 6. 계절성 분석
        seasonal_patterns = analyze_seasonality(tourism_df)
        
        return {
            'yearly': yearly_data,
            'monthly': monthly_data,
            'seasonality': seasonal_patterns
        }
        
    except Exception as e:
        print(f"데이터 로드 오류: {e}")
        # 오류 시 기본 샘플 데이터 반환
        return get_sample_data()

def analyze_seasonality(tourism_df):
    """계절성 패턴 분석"""
    patterns = {}
    countries = ['Korea', 'Japan', 'US/Hawaii', 'Philippines', 'Taiwan', 'China']
    
    for country in countries:
        # 월별 평균 계산 (2019년 이전 정상 데이터만 사용)
        pre_covid = tourism_df[tourism_df['Year'] < 2020]
        monthly_avg = pre_covid.groupby('Month_num')[country].mean()
        
        # 피크 시즌과 비수기 구분
        peak_threshold = monthly_avg.quantile(0.7)
        low_threshold = monthly_avg.quantile(0.3)
        
        peak_months = monthly_avg[monthly_avg >= peak_threshold].index.tolist()
        low_months = monthly_avg[monthly_avg <= low_threshold].index.tolist()
        
        country_key = country.lower().replace('/', '_').replace('us_hawaii', 'usa')
        patterns[country_key] = {
            'peak_months': peak_months,
            'low_months': low_months,
            'monthly_average': monthly_avg.to_dict(),
        }
    
    return patterns

def get_sample_data():
    """기존 샘플 데이터 (백업용)"""
    return {
        'yearly': {
            2014: {"gdp": 5.61, "japan": 819000.0, "korea": 320000.0, "usa": 71000.0, "china": 15000.0, "philippines": 12000.0, "taiwan": 43000.0},
            2015: {"gdp": 5.80, "japan": 820000.0, "korea": 440000.0, "usa": 70000.0, "china": 22000.0, "philippines": 13000.0, "taiwan": 41000.0},
            2016: {"gdp": 5.90, "japan": 780000.0, "korea": 520000.0, "usa": 38000.0, "china": 25000.0, "philippines": 22000.0, "taiwan": 41000.0},
            2017: {"gdp": 6.01, "japan": 740000.0, "korea": 700000.0, "usa": 79000.0, "china": 18000.0, "philippines": 23000.0, "taiwan": 33000.0},
            2018: {"gdp": 6.05, "japan": 660000.0, "korea": 750000.0, "usa": 92000.0, "china": 13000.0, "philippines": 18000.0, "taiwan": 31000.0},
            2019: {"gdp": 6.36, "japan": 720000.0, "korea": 770000.0, "usa": 95000.0, "china": 10000.0, "philippines": 21000.0, "taiwan": 30000.0},
            2020: {"gdp": 5.92, "japan": 300000.0, "korea": 150000.0, "usa": 43000.0, "china": 2000.0, "philippines": 2500.0, "taiwan": 7000.0},
            2021: {"gdp": 6.23, "japan": 38000.0, "korea": 56000.0, "usa": 56000.0, "china": 300.0, "philippines": 2700.0, "taiwan": 2400.0},
            2022: {"gdp": 6.91, "japan": 200000.0, "korea": 320000.0, "usa": 73000.0, "china": 6000.0, "philippines": 8500.0, "taiwan": 7000.0}
        },
        'monthly': [],
        'seasonality': {}
    }

# 전역 데이터 로드
DATA = load_real_data()

def get_country_rankings():
    """국가별 경제 기여도 순위 계산"""
    yearly_data = DATA['yearly']
    countries = ['japan', 'korea', 'usa', 'china', 'philippines', 'taiwan']
    
    rankings = []
    
    for country in countries:
        # 평균 관광객 수 계산
        tourists = [yearly_data[year][country] for year in yearly_data.keys()]
        avg_tourists = np.mean(tourists)
        
        # GDP와 관광객 수의 상관관계 계산
        gdp_values = [yearly_data[year]['gdp'] for year in yearly_data.keys()]
        tourist_values = [yearly_data[year][country] for year in yearly_data.keys()]
        
        if len(set(tourist_values)) > 1:  # 변동이 있는 경우에만
            correlation = np.corrcoef(gdp_values, tourist_values)[0, 1]
        else:
            correlation = 0
        
        # 경제적 영향도 계산 (개선된 모델)
        # 1. 관광객당 기본 경제 기여도 설정 (USD)
        base_impact_per_tourist = 1200  # 관광객 1명당 평균 1200달러 소비
        
        # 2. 국가별 가중치 적용 (구매력, 체류기간, 소비패턴 기반)
        country_multipliers = {
            'japan': 1.3,      # 높은 구매력, 장기 체류
            'korea': 1.1,      # 중상급 구매력, 쇼핑 선호
            'usa': 1.5,        # 높은 구매력, 프리미엄 서비스 선호
            'china': 0.9,      # 중간 구매력
            'philippines': 0.8, # 중하급 구매력
            'taiwan': 1.0      # 중간 구매력
        }
        
        # 3. 상관관계 기반 추가 가중치
        correlation_multiplier = 1 + abs(correlation) * 0.5  # 상관관계가 높을수록 영향도 증가
        
        # 4. 최종 관광객당 영향도 계산
        impact_per_tourist = base_impact_per_tourist * country_multipliers.get(country, 1.0) * correlation_multiplier
        
        # 5. 총 경제적 영향도 계산 (백만 달러 단위)
        total_economic_impact = (avg_tourists * impact_per_tourist) / 1000000
        
        rankings.append({
            "country": country.title().replace('Usa', 'USA'),
            "avg_tourists": int(avg_tourists),
            "correlation": round(correlation, 3),
            "impact_per_tourist": round(impact_per_tourist, 2),
            "total_economic_impact": round(total_economic_impact, 2)
        })
    
    # 총 경제적 영향도 기준으로 정렬
    rankings.sort(key=lambda x: x['total_economic_impact'], reverse=True)
    
    return {"rankings": rankings}

def get_correlations():
    """시계열 상관관계 데이터 반환"""
    yearly_data = DATA['yearly']
    countries = ['japan', 'korea', 'usa', 'china', 'philippines', 'taiwan']
    
    # 시계열 데이터 구성
    time_series = []
    for year in sorted(yearly_data.keys()):
        year_data = {"year": year, "gdp": yearly_data[year]['gdp']}
        for country in countries:
            year_data[country] = yearly_data[year][country]
        time_series.append(year_data)
    
    # 상관관계 계산
    correlations = {}
    gdp_values = [yearly_data[year]['gdp'] for year in yearly_data.keys()]
    
    for country in countries:
        tourist_values = [yearly_data[year][country] for year in yearly_data.keys()]
        if len(set(tourist_values)) > 1:
            correlation = np.corrcoef(gdp_values, tourist_values)[0, 1]
        else:
            correlation = 0
        correlations[country] = round(correlation, 3)
    
    return {
        "time_series": time_series,
        "correlations": correlations
    }

def get_monthly_data():
    """월별 데이터 반환 (새로운 API 엔드포인트용)"""
    return {
        "monthly_data": DATA['monthly'],
        "seasonality": DATA['seasonality']
    }



def get_monthly_analysis(tourism_df):
    """월별 데이터 분석 및 계절성 패턴 반환"""
    
    # 월별 패턴 분석
    if 'Month' in tourism_df.columns:
        monthly_patterns = tourism_df.groupby('Month')[['Korea', 'Japan', 'USA', 'China', 'Philippines', 'Taiwan']].mean()
    else:
        # Month 컬럼이 없는 경우 기본 패턴 생성
        monthly_patterns = pd.DataFrame({
            'Korea': [8500, 9200, 12000, 10500, 9800, 8800, 11200, 10800, 9500, 10200, 9800, 11500],
            'Japan': [12000, 13500, 16800, 15200, 14100, 12800, 16500, 15900, 13800, 14800, 14200, 17200],
            'USA': [2400, 2600, 3200, 2900, 2700, 2500, 3100, 2950, 2650, 2800, 2750, 3300],
            'China': [4200, 4500, 5800, 5100, 4700, 4300, 5400, 5150, 4600, 4900, 4750, 5600],
            'Philippines': [3600, 3800, 4800, 4200, 3900, 3700, 4500, 4300, 3850, 4100, 3950, 4650],
            'Taiwan': [3000, 3200, 4100, 3600, 3350, 3100, 3850, 3700, 3300, 3500, 3400, 4000]
        }, index=range(1, 13))
    
    # 성수기/비수기 분석
    monthly_totals = monthly_patterns.sum(axis=1)
    peak_months = monthly_totals.nlargest(4).index.tolist()
    low_months = monthly_totals.nsmallest(4).index.tolist()
    
    # 계절성 인사이트
    seasonal_insights = {
        'peak_season': {
            'months': peak_months,
            'description': '성수기 - 관광객 증가, 서비스 수요 급증',
            'business_tips': [
                '직원 충원 및 근무 시간 연장',
                '재고 확보 및 메뉴 다양화',
                '예약 시스템 강화',
                '프리미엄 서비스 제공'
            ]
        },
        'low_season': {
            'months': low_months,
            'description': '비수기 - 현지 고객 및 마케팅 집중',
            'business_tips': [
                '현지인 타겟 프로모션',
                '시설 점검 및 보수',
                '직원 교육 및 훈련',
                '새로운 메뉴 개발'
            ]
        }
    }
    
    # 월별 트렌드 데이터
    monthly_trends = []
    for month in range(1, 13):
        monthly_data = {
            'month': month,
            'total_visitors': int(monthly_totals.iloc[month-1]),
            'korea': int(monthly_patterns.iloc[month-1]['Korea']),
            'japan': int(monthly_patterns.iloc[month-1]['Japan']),
            'usa': int(monthly_patterns.iloc[month-1]['USA']),
            'china': int(monthly_patterns.iloc[month-1]['China']),
            'philippines': int(monthly_patterns.iloc[month-1]['Philippines']),
            'taiwan': int(monthly_patterns.iloc[month-1]['Taiwan'])
        }
        monthly_trends.append(monthly_data)
    
    # 국가별 월별 변화율
    country_variations = {}
    for country in ['Korea', 'Japan', 'USA', 'China', 'Philippines', 'Taiwan']:
        monthly_values = monthly_patterns[country].values
        variation = (monthly_values.max() - monthly_values.min()) / monthly_values.mean() * 100
        country_variations[country.lower()] = round(variation, 1)
    
    return {
        'monthly_trends': monthly_trends,
        'seasonal_insights': seasonal_insights,
        'country_variations': country_variations,
                 'analysis_summary': {
             'peak_months': peak_months,
             'low_months': low_months,
             'highest_variation_country': max(country_variations.keys(), key=lambda k: country_variations[k]),
             'most_stable_country': min(country_variations.keys(), key=lambda k: country_variations[k])
         }
    }

def predict_gdp_impact(tourism_df, gdp_df, country_changes: Dict[str, float]):
    """관광객 변화에 따른 GDP 영향 예측"""
    
    # 현재 기준값 (최근 연도 데이터)
    recent_year = tourism_df['Year'].max()
    current_data = tourism_df[tourism_df['Year'] == recent_year]
    
    baseline_tourists = {}
    for country in ['Korea', 'Japan', 'USA', 'China', 'Philippines', 'Taiwan']:
        if country in current_data.columns:
            baseline_tourists[country.lower()] = current_data[country].sum()
    
    # 변화 적용
    predicted_tourists = {}
    for country, baseline in baseline_tourists.items():
        change_rate = country_changes.get(country, 0) / 100  # 백분율을 소수로 변환
        predicted_tourists[country] = baseline * (1 + change_rate)
    
    # GDP 영향 계산 (단순 선형 모델)
    # 관광객 1,000명당 GDP 0.01B$ 영향이라고 가정
    total_change = sum(predicted_tourists.values()) - sum(baseline_tourists.values())
    gdp_impact = (total_change / 1000) * 0.01
    
    # 현재 GDP
    current_gdp = gdp_df['GDP'].iloc[-1] if not gdp_df.empty else 4.0
    predicted_gdp = current_gdp + gdp_impact
    
    return {
        'baseline_tourists': baseline_tourists,
        'predicted_tourists': predicted_tourists,
        'tourist_change': int(total_change),
        'gdp_impact': round(gdp_impact, 3),
        'current_gdp': round(current_gdp, 2),
        'predicted_gdp': round(predicted_gdp, 2),
        'impact_percentage': round((gdp_impact / current_gdp) * 100, 2)
    } 