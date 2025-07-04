import React, { useState } from 'react';
import { Container, Nav, Tab, Row, Col, Card, Form } from 'react-bootstrap';
import CountryRankingChart from './CountryRankingChart';
import CorrelationChart from './CorrelationChart';
import DataSummary from './DataSummary';
import MonthlyTrends from './MonthlyTrends';
import BusinessInsights from './BusinessInsights';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedYear, setSelectedYear] = useState('all'); // 'all' 또는 특정 연도

  // 사용 가능한 연도 목록
  const availableYears = [
    { value: 'all', label: '전체 기간 (2014-2024)' },
    { value: '2024', label: '2024년 분석' },
    { value: '2023', label: '2023년 분석' },
    { value: '2022', label: '2022년 분석' },
    { value: '2021', label: '2021년 분석' },
    { value: '2020', label: '2020년 분석' },
    { value: '2019', label: '2019년 분석' },
    { value: '2018', label: '2018년 분석' },
    { value: '2017', label: '2017년 분석' },
    { value: '2016', label: '2016년 분석' },
    { value: '2015', label: '2015년 분석' },
    { value: '2014', label: '2014년 분석' }
  ];

  return (
    <div className="bg-light min-vh-100">
      <Container fluid className="py-4">
        {/* 헤더 */}
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="display-4 fw-bold text-primary mb-2">
                🏝️ 괌 비즈니스 인사이트
              </h1>
              <p className="lead text-muted">
                데이터 기반 관광업계 맞춤 분석 서비스
              </p>
            </div>
          </Col>
        </Row>

        {/* 연도 선택 및 컨트롤 */}
        <Row className="mb-4">
          <Col xs={12} md={8}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-3">
                <Row className="align-items-center">
                  <Col xs={12} md={4}>
                    <Form.Group>
                      <Form.Label className="small fw-semibold text-muted mb-2">
                        📅 분석 기간 선택
                      </Form.Label>
                      <Form.Select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="form-select-lg"
                      >
                        {availableYears.map(year => (
                          <option key={year.value} value={year.value}>
                            {year.label}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={8}>
                    <div className="text-center mt-3 mt-md-0">
                      <small className="text-muted">
                        {selectedYear === 'all' ? (
                          <span>
                            📊 <strong>전체 트렌드 분석</strong>: 장기 패턴 및 상관관계 파악
                          </span>
                        ) : (
                          <span>
                            🔍 <strong>{selectedYear}년 집중 분석</strong>: 해당 연도 상세 인사이트
                          </span>
                        )}
                      </small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <div className="fs-5 text-primary mb-1">💼</div>
                  <small className="text-muted">
                    <strong>괌 소상공인</strong><br/>
                    맞춤 비즈니스 가이드
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 탭 네비게이션 */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-2">
                <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                  <Nav variant="pills" className="justify-content-center">
                    <Nav.Item className="mx-1">
                      <Nav.Link 
                        eventKey="summary"
                        className="px-3 py-2 rounded-pill fw-semibold"
                        style={{
                          background: activeTab === 'summary' ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' : 'transparent',
                          color: activeTab === 'summary' ? 'white' : '#6c757d',
                          border: activeTab === 'summary' ? 'none' : '1px solid #dee2e6'
                        }}
                      >
                        📊 데이터 요약
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mx-1">
                      <Nav.Link 
                        eventKey="trends"
                        className="px-3 py-2 rounded-pill fw-semibold"
                        style={{
                          background: activeTab === 'trends' ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' : 'transparent',
                          color: activeTab === 'trends' ? 'white' : '#6c757d',
                          border: activeTab === 'trends' ? 'none' : '1px solid #dee2e6'
                        }}
                      >
                        📈 트렌드 분석
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mx-1">
                      <Nav.Link 
                        eventKey="rankings"
                        className="px-3 py-2 rounded-pill fw-semibold"
                        style={{
                          background: activeTab === 'rankings' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                          color: activeTab === 'rankings' ? 'white' : '#6c757d',
                          border: activeTab === 'rankings' ? 'none' : '1px solid #dee2e6'
                        }}
                      >
                        🏆 국가별 순위
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mx-1">
                      <Nav.Link 
                        eventKey="correlations"
                        className="px-3 py-2 rounded-pill fw-semibold"
                        style={{
                          background: activeTab === 'correlations' ? 'linear-gradient(135deg, #96fbc4 0%, #f9f586 100%)' : 'transparent',
                          color: activeTab === 'correlations' ? 'white' : '#6c757d',
                          border: activeTab === 'correlations' ? 'none' : '1px solid #dee2e6'
                        }}
                      >
                        📊 GDP 상관관계
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mx-1">
                      <Nav.Link 
                        eventKey="insights"
                        className="px-3 py-2 rounded-pill fw-semibold"
                        style={{
                          background: activeTab === 'insights' ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' : 'transparent',
                          color: activeTab === 'insights' ? 'white' : '#6c757d',
                          border: activeTab === 'insights' ? 'none' : '1px solid #dee2e6'
                        }}
                      >
                        💡 비즈니스 인사이트
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Tab.Container>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 컨텐츠 영역 */}
        <Row>
          <Col>
            <Card className="shadow-sm border-0" style={{ minHeight: '600px' }}>
              <Card.Header className="bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 text-secondary">
                    {getTabTitle(activeTab, selectedYear)}
                  </h5>
                  <small className="text-muted">
                    {selectedYear === 'all' ? '전체 기간 데이터' : `${selectedYear}년 데이터`}
                  </small>
                </div>
              </Card.Header>
              <Card.Body>
                {renderTabContent(activeTab, selectedYear)}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 푸터 정보 */}
        <div className="text-center mt-4">
          <small className="text-muted">
            📊 괌 관광청 공식 데이터 기반 분석 | 
            💼 소상공인 맞춤 비즈니스 인사이트 서비스 | 
            🔄 실시간 업데이트: 2024년 11월
          </small>
        </div>
      </Container>
    </div>
  );

  // 탭 제목 반환
  function getTabTitle(tab, year) {
    const yearText = year === 'all' ? '전체 기간' : `${year}년`;
    const titles = {
      summary: `📊 ${yearText} 데이터 요약 대시보드`,
      trends: `📈 ${yearText} 트렌드 분석`,
      rankings: `🏆 ${yearText} 국가별 경제 기여도 순위`,
      correlations: `📈 ${yearText} GDP vs 관광객 상관관계`,
      insights: `💡 ${yearText} 비즈니스 인사이트 & 액션 가이드`
    };
    return titles[tab] || '분석 대시보드';
  }

  // 탭 컨텐츠 렌더링
  function renderTabContent(tab, year) {
    // viewMode를 년도 선택에 따라 결정
    const viewMode = year === 'all' ? 'yearly' : 'specific';
    
    // 컴포넌트에 selectedYear prop 추가
    const props = { 
      viewMode, 
      selectedYear: year,
      filterYear: year !== 'all' ? parseInt(year) : null
    };

    switch (tab) {
      case 'summary':
        return <DataSummary {...props} />;
      
      case 'trends':
        return <MonthlyTrends {...props} />;
      
      case 'rankings':
        return (
          <Row>
            <Col xs={12} lg={8}>
              <CountryRankingChart {...props} />
            </Col>
            <Col xs={12} lg={4}>
              <div className="bg-light p-4 rounded h-100">
                <h6 className="text-primary mb-3">🎯 활용 가이드</h6>
                {year === 'all' ? (
                  <div>
                    <p className="small mb-2"><strong>전체 기간 전략:</strong></p>
                    <ul className="small text-muted">
                      <li>일본 시장 우선순위 전략</li>
                      <li>한국 관광객 증가 대응</li>
                      <li>미국 니치 마켓 공략</li>
                      <li>신흥 시장 진출 계획</li>
                    </ul>
                  </div>
                ) : (
                  <div>
                    <p className="small mb-2"><strong>{year}년 맞춤 전략:</strong></p>
                    <ul className="small text-muted">
                      <li>해당 연도 트렌드 분석</li>
                      <li>계절별 운영 최적화</li>
                      <li>국가별 서비스 특화</li>
                      <li>투자 우선순위 결정</li>
                    </ul>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        );
      
      case 'correlations':
        return <CorrelationChart {...props} />;
      
      case 'insights':
        return <BusinessInsights {...props} />;
      
      default:
        return <DataSummary {...props} />;
    }
  }
}

export default Dashboard; 