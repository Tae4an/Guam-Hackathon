# 괌 비즈니스 인사이트 - 관광객 GDP 상관관계 분석 서비스

## 프로젝트 개요

해커톤 진행 시간: 09:00 - 14:00 (5시간)

국가별 관광객 증감 패턴과 GDP 상관관계 분석을 통해 괌 현지 중소상공인들이 언제, 어느 국가 관광객을 타겟으로, 어떤 전략을 세워야 하는지에 대한 데이터 기반 비즈니스 인사이트를 제공하는 웹 서비스입니다.

## 타겟 사용자

- 괌 현지 중소상공인 및 독립 사업자
- 소규모 호텔/펜션 운영자
- 레스토랑, 카페, 쇼핑몰 사장
- 투어 가이드, 렌터카 업체
- 스파, 마사지샵 등 서비스업 종사자

## 기술 스택

- **Backend**: FastAPI + pandas + numpy + scikit-learn
- **Frontend**: React + Bootstrap + Recharts
- **Data**: 실제 괌 관광청 CSV 데이터 (2014-2024)
- **Development**: Python 3.8+, Node.js 18+

## 데이터 소스

### 실제 데이터
- `data/Gual_Tourism(arrival)_10Y.csv`: 괌 관광청 월별 관광객 데이터 (2014-2024)
- `data/Guam_GDP_10Y.csv`: 괌 연별 GDP 데이터 (2002-2022)
- 분석 대상 국가: 한국, 일본, 미국, 중국, 필리핀, 대만 (6개국)

### 모델링 데이터 (향후 실제 데이터로 교체 예정)
- 관광객당 경제 기여도 ($1,200/명)
- 국가별 소비 패턴 가중치
- 연도별 경제 파급효과 계수

## 주요 기능

### 5개 핵심 분석 탭
1. **데이터 요약**: 핵심 지표 및 통계 대시보드
2. **트렌드 분석**: 월별/연별 관광객 패턴 분석
3. **국가별 순위**: 경제 기여도 기준 국가 랭킹
4. **GDP 상관관계**: 관광객-GDP 상관관계 시각화
5. **비즈니스 인사이트**: 소상공인 맞춤 실무 가이드

### 핵심 특징
- 동적 연도 필터링 (전체 vs 특정 연도)
- 실시간 데이터 업데이트
- 반응형 UI 디자인
- 국가별/연도별 맞춤 인사이트

## 프로젝트 구조

```
Guam-GDP/
├── frontend/                 # React 웹 애플리케이션
│   ├── src/
│   │   ├── components/      # 5개 주요 컴포넌트
│   │   ├── App.js           # 메인 애플리케이션
│   │   └── index.js         # 진입점
│   └── package.json
├── backend/                 # FastAPI 서버
│   ├── app.py              # 메인 서버
│   ├── analysis.py         # 데이터 분석 로직
│   └── requirements.txt
├── data/                   # 실제 CSV 데이터
│   ├── Gual_Tourism(arrival)_10Y.csv
│   └── Guam_GDP_10Y.csv
└── README.md
```

## 실행 방법

### 1. 저장소 클론
```bash
git clone <repository-url>
cd Guam-GDP
```

### 2. 백엔드 서버 실행
```bash
cd backend
pip install -r requirements.txt
python app.py
```
서버가 `http://localhost:8000`에서 시작됩니다.

### 3. 프론트엔드 실행
```bash
cd frontend
npm install
npm start
```
React 앱이 `http://localhost:3000`에서 시작됩니다.

## API 엔드포인트

- `GET /api/rankings?year={year}`: 국가별 경제 기여도 순위
- `GET /api/correlations?year={year}`: GDP-관광객 상관관계 데이터
- `GET /api/monthly?year={year}`: 월별 트렌드 및 계절성 분석
- `GET /api/predict`: GDP 영향 예측 (향후 구현)

## 주요 분석 결과

### 코로나 영향 분석
- 2020-2021: 관광객 90% 이상 급감
- 2022-2024: 점진적 회복, 한국·필리핀 관광객 급증

### 국가별 특성
- 일본: 높은 경제 기여도, 장기 체류 선호
- 한국: 빠른 회복세, 쇼핑 중심 소비 패턴
- 미국: 프리미엄 서비스 선호, 높은 1인당 소비
- 필리핀: 가장 빠른 성장률, 신흥 주요 시장

### 계절성 패턴
- 성수기: 12월-2월 (겨울휴가), 7월-8월 (여름휴가)
- 비수기: 4월-5월, 9월-10월
- 국가별 상이한 휴가철 패턴 반영

## 향후 발전 계획

### 1단계: 데이터 정밀화
- 괌 관광청, 경제부 공식 데이터 확보
- 실제 관광객 소비액 및 경제 파급효과 데이터 적용

### 2단계: 서비스 고도화
- AI 기반 예측 모델링 추가
- 실시간 알림 및 맞춤 추천 기능
- 모바일 앱 개발

### 3단계: 상용화
- 괌 현지 상공회의소 협력
- 구독형 비즈니스 모델 적용
- 다른 태평양 관광지로 확장

