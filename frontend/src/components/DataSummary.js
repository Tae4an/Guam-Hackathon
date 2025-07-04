import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Alert, Badge } from 'react-bootstrap';

const DataSummary = ({ selectedYear, filterYear }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedYear, filterYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const yearParam = selectedYear === 'all' ? 'all' : selectedYear;
      const response = await fetch(`http://localhost:8000/api/rankings?year=${yearParam}`);
      const data = await response.json();
      
      if (response.ok) {
        // 연도별 필터링된 데이터로 요약 정보 생성
        setSummaryData(generateSummary(data, selectedYear));
      } else {
        setError('데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = (data, year) => {
    const rankings = data.rankings || [];
    const summary = data.summary || {};
    
    // 백엔드에서 제공하는 summary 정보 사용
    const totalTourists = year === 'all' ? summary.total_cumulative : summary.total_annual_average;
    const totalEconomicImpact = rankings.reduce((sum, country) => sum + country.total_economic_impact, 0);
    
    // 상위 3개국
    const topCountries = rankings.slice(0, 3);
    
    // 연도별 맞춤 정보
    const yearInfo = getYearSpecificInfo(year);
    
    return {
      period: summary.period || (year === 'all' ? '2014-2024년 전체' : `${year}년`),
      totalTourists: Math.round(totalTourists || 0),
      totalEconomicImpact: Math.round(totalEconomicImpact * 10) / 10,
      annualAverage: year === 'all' ? Math.round(summary.total_annual_average || 0) : null,
      yearsCount: summary.years_count || 1,
      topCountries,
      marketLeader: topCountries[0],
      emergingMarket: rankings[rankings.length - 1],
      yearInfo
    };
  };

  const getYearSpecificInfo = (year) => {
    if (year === 'all') {
      return {
        trend: '장기 성장 추세',
        keyInsight: '일본 시장 의존도 높음, 한국 시장 급성장',
        recommendation: '시장 다변화 전략 필요',
        riskFactor: 'COVID-19 영향으로 2020-2021년 급감'
      };
    }
    
    // 연도별 특화 정보
    const yearlyInsights = {
      '2024': {
        trend: '회복기 성장',
        keyInsight: '포스트 코로나 관광 회복세',
        recommendation: '서비스 품질 향상에 집중',
        riskFactor: '물가 상승 및 경쟁 심화'
      },
      '2023': {
        trend: '본격 회복',
        keyInsight: '코로나 이전 수준 회복',
        recommendation: '신규 서비스 론칭 적기',
        riskFactor: '인플레이션 및 환율 변동성'
      },
      '2022': {
        trend: '점진적 회복',
        keyInsight: '여행 제한 완화로 관광객 증가',
        recommendation: '안전 프로토콜 강화',
        riskFactor: '변이 바이러스 확산 우려'
      },
      '2021': {
        trend: '최저점',
        keyInsight: '팬데믹으로 역대 최저 관광객',
        recommendation: '비용 절감 및 현지 고객 확보',
        riskFactor: '장기간 국경 폐쇄'
      },
      '2020': {
        trend: '급락',
        keyInsight: 'COVID-19 첫 타격으로 급감',
        recommendation: '위기 관리 및 생존 전략',
        riskFactor: '불확실성 극대화'
      },
      '2019': {
        trend: '최고점',
        keyInsight: '역대 최고 관광객 수 기록',
        recommendation: '확장 투자 및 서비스 고도화',
        riskFactor: '과열 우려 및 지속가능성'
      }
    };
    
    return yearlyInsights[year] || {
      trend: '안정적 성장',
      keyInsight: '꾸준한 관광객 증가',
      recommendation: '기본 서비스 품질 유지',
      riskFactor: '경쟁 심화'
    };
  };

  const getTrendIcon = (rate) => {
    return rate > 0 ? '📈' : '📉';
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
        <p className="mt-2 text-muted">데이터 분석 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        <h6>⚠️ 데이터 로드 실패</h6>
        <p className="mb-0">{error}</p>
      </Alert>
    );
  }

  if (!summaryData) {
    return (
      <Alert variant="warning" className="text-center">
        <h6>📊 데이터 없음</h6>
        <p className="mb-0">표시할 데이터가 없습니다.</p>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          📊 데이터 요약 대시보드
        </h4>
        <small className="text-muted">
          {summaryData.period} 기준
        </small>
      </div>

      <Row className="g-4 mb-4">
        {/* 총 방문객 수 */}
        <Col xs={12} md={6} lg={3}>
          <Card className="text-white h-100" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
            <Card.Body className="text-center">
              <div className="fs-1 mb-2">👥</div>
              <h3 className="fw-bold mb-1">
                {summaryData.totalTourists.toLocaleString()}
              </h3>
              <p className="mb-0 opacity-75">
                {selectedYear === 'all' ? '총 누적 관광객' : '총 관광객 수'}
              </p>
              {summaryData.annualAverage && (
                <small className="opacity-75">
                  (연평균: {summaryData.annualAverage.toLocaleString()}명)
                </small>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* 성장률 */}
        <Col xs={12} md={6} lg={3}>
          <Card className="text-white h-100" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
          }}>
            <Card.Body className="text-center">
              <div className="fs-1 mb-2">{getTrendIcon(summaryData.yearInfo.trend)}</div>
              <h3 className="fw-bold mb-1">
                {summaryData.yearInfo.trend}
              </h3>
              <p className="mb-0 opacity-75">
                전체 트렌드
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* 1위 국가 */}
        <Col xs={12} md={6} lg={3}>
          <Card className="text-white h-100" style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
          }}>
            <Card.Body className="text-center">
              <div className="fs-1 mb-2">🏆</div>
              <h5 className="fw-bold mb-1">{summaryData.marketLeader?.country}</h5>
              <p className="mb-0 opacity-75">
                시장 리더
              </p>
              <small className="opacity-75">최고 기여국</small>
            </Card.Body>
          </Card>
        </Col>

        {/* 경제적 영향 */}
        <Col xs={12} md={6} lg={3}>
          <Card className="text-white h-100" style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
          }}>
            <Card.Body className="text-center">
              <div className="fs-1 mb-2">💰</div>
              <h3 className="fw-bold mb-1">${summaryData.totalEconomicImpact}M</h3>
              <p className="mb-0 opacity-75">
                총 경제적 영향
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 주요 인사이트 */}
      <Row>
        <Col>
          <Card className="border-0 bg-light">
            <Card.Body>
              <h6 className="text-primary mb-3">
                💡 {summaryData.period} 주요 인사이트
              </h6>
              <div className="mb-3">
                <h6 className="text-success">
                  ✅ 핵심 발견
                </h6>
                <p className="text-muted mb-0">
                  {summaryData.yearInfo.keyInsight}
                </p>
              </div>
              <div className="mb-3">
                <h6 className="text-primary">
                  🎯 권장 전략
                </h6>
                <p className="text-muted mb-0">
                  {summaryData.yearInfo.recommendation}
                </p>
              </div>
              <div>
                <h6 className="text-warning">
                  ⚠️ 주요 리스크
                </h6>
                <p className="text-muted mb-0">
                  {summaryData.yearInfo.riskFactor}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 상위 국가 순위 */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 text-primary">
                🏆 상위 3개국 경제 기여도 ({summaryData.period})
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {summaryData.topCountries.map((country, index) => (
                  <Col xs={12} md={4} key={country.country} className="mb-3">
                    <Card 
                      className="h-100 border-0"
                      style={{
                        background: index === 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                                   index === 1 ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                                   'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        color: 'white'
                      }}
                    >
                      <Card.Body className="text-center">
                        <div className="display-4 mb-2">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <h5 className="mb-2">{country.country}</h5>
                        <div className="mb-2">
                          <strong>${country.total_economic_impact}M</strong>
                          <br />
                          <small className="opacity-75">
                            평균 {country.avg_tourists.toLocaleString()}명
                          </small>
                        </div>
                        <small className="opacity-75">
                          상관계수: {country.correlation}
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 시장 구조 */}
      <Row className="mb-4">
        <Col xs={12} md={8}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 text-primary">
                📊 시장 구조
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold">시장 집중도</span>
                  <span className="badge bg-primary">높음</span>
                </div>
                <small className="text-muted">
                  상위 3개국이 전체 시장의 80% 이상 차지
                </small>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold">시장 다변화</span>
                  <span className="badge bg-warning">보통</span>
                </div>
                <small className="text-muted">
                  일본 의존도 감소, 다양한 시장 개발 필요
                </small>
              </div>
              
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold">성장 잠재력</span>
                  <span className="badge bg-success">높음</span>
                </div>
                <small className="text-muted">
                  신흥 시장 확대 및 회복 트렌드 지속
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0 text-primary">
                📊 시장 구조
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold">시장 집중도</span>
                  <span className="badge bg-primary">높음</span>
                </div>
                <small className="text-muted">
                  상위 3개국이 전체 시장의 80% 이상 차지
                </small>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold">시장 다변화</span>
                  <span className="badge bg-warning">보통</span>
                </div>
                <small className="text-muted">
                  일본 의존도 감소, 다양한 시장 개발 필요
                </small>
              </div>
              
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-semibold">성장 잠재력</span>
                  <span className="badge bg-success">높음</span>
                </div>
                <small className="text-muted">
                  신흥 시장 확대 및 회복 트렌드 지속
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 액션 아이템 */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0 text-primary">
                🚀 즉시 실행 가능한 액션 아이템
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={12} md={6}>
                  <h6 className="text-success mb-3">
                    ✅ 단기 전략 (1-3개월)
                  </h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <span className="badge bg-success me-2">1</span>
                      {summaryData.marketLeader?.country} 고객 서비스 특화
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-success me-2">2</span>
                      계절별 프로모션 기획
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-success me-2">3</span>
                      현지인 추천 프로그램 강화
                    </li>
                  </ul>
                </Col>
                <Col xs={12} md={6}>
                  <h6 className="text-primary mb-3">
                    🎯 장기 전략 (6개월-1년)
                  </h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <span className="badge bg-primary me-2">1</span>
                      신흥 시장 진출 계획 수립
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-primary me-2">2</span>
                      디지털 마케팅 채널 확대
                    </li>
                    <li className="mb-2">
                      <span className="badge bg-primary me-2">3</span>
                      지속가능한 관광 상품 개발
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 데이터 정보 */}
      <div className="text-center mt-4">
        <small className="text-muted">
          📊 괌 관광청 공식 데이터 기반 분석 | 
          최종 업데이트: 2024년 11월 | 
          💼 비즈니스 활용을 위한 데이터 분석
        </small>
      </div>
    </div>
  );
};

export default DataSummary; 