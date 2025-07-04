# 🌏 TourismGDP Analyzer

## 프로젝트 개요
괌의 국가별 관광객 증감이 GDP에 미치는 영향을 분석하고 예측하는 해커톤 프로젝트

## 핵심 기능
- 🏆 국가별 경제 기여도 랭킹
- 📈 관광객 수 vs GDP 상관관계 분석  
- 🔮 관광객 변화에 따른 GDP 영향 예측

## 기술 스택
- **Frontend**: React + Recharts + Material-UI
- **Backend**: Python Flask + pandas + numpy
- **Data**: JSON 파일 기반

## 프로젝트 구조
```
Guam-GDP/
├── frontend/          # React 대시보드
├── backend/           # Flask API 서버
├── data-processing/   # 데이터 전처리 스크립트
└── README.md
```

## 🚀 실행 방법

### 1. Backend 실행
```bash
cd backend
pip install -r requirements.txt
python app.py
```
서버가 `http://localhost:8000`에서 시작됩니다.
FastAPI 자동 문서는 `http://localhost:8000/docs`에서 확인할 수 있습니다.

### 2. Frontend 실행  
```bash
cd frontend
npm install
npm start
```
React 앱이 `http://localhost:3000`에서 시작됩니다.

### 3. 데이터 전처리 (선택사항)
```bash
cd data-processing
python process_data.py
```
실제 CSV 데이터가 있다면 이 스크립트로 전처리할 수 있습니다.

## 개발 진행 상황
- [x] 프로젝트 구조 설정
- [x] 데이터 전처리 (샘플 데이터)
- [x] 분석 로직 구현 
- [x] React 대시보드 개발
- [x] FastAPI 백엔드 구현

## 구현된 기능
- 🏆 **국가별 경제 기여도 순위**: 막대차트로 TOP 6 국가 표시
- 📈 **상관관계 시계열 차트**: 관광객 수 vs GDP 트렌드 (토글 가능)
- 🔮 **예측 시뮬레이터**: 슬라이더로 관광객 증감률 조정 → GDP 영향 예측

## 기술적 특징
- **반응형 디자인**: Material-UI 기반
- **인터랙티브 차트**: Recharts 라이브러리 사용
- **실시간 예측**: FastAPI를 통한 백엔드 계산
- **클라이언트 사이드 백업**: API 오류 시 프론트엔드에서 계산

## 팀 정보
해커톤 프로젝트 - TourismGDP Analyzer Team 