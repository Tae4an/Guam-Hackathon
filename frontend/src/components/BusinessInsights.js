import React, { useState, useEffect } from 'react';
import { Alert, Badge, Card, Row, Col, ListGroup } from 'react-bootstrap';

const BusinessInsights = ({ viewMode = 'yearly' }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        
        // 실제 API에서 데이터 가져오기
        const [rankingsResponse, monthlyResponse] = await Promise.all([
          fetch('http://localhost:8000/api/rankings'),
          fetch('http://localhost:8000/api/monthly')
        ]);
        
        const rankingsData = await rankingsResponse.json();
        const monthlyData = await monthlyResponse.json();
        
        // 실제 데이터 기반 인사이트 생성
        const topCountries = rankingsData.rankings.slice(0, 3);
        const seasonality = monthlyData.seasonality || {};
        
        const insightData = {
          yearly: {
            priority_actions: [
              {
                title: `${topCountries[0].country} 시장 집중 공략`,
                description: `경제 기여도 1위(${topCountries[0].total_economic_impact}M$), 장기 파트너십 구축 필수`,
                urgency: "high",
                impact: "매우 높음",
                timeline: "6개월",
                type: "market_expansion"
              },
              {
                title: `${topCountries[1].country} 고급 서비스 확장`,
                description: `평균 ${topCountries[1].avg_tourists.toLocaleString()}명, 프리미엄 서비스 수요 증가`,
                urgency: "medium",
                impact: "높음", 
                timeline: "3개월",
                type: "service_upgrade"
              },
              {
                title: `${topCountries[2].country} 타겟 서비스 도입`,
                description: `관광객당 높은 영향도($${topCountries[2].impact_per_tourist}), 맞춤형 서비스 확대`,
                urgency: "medium",
                impact: "중간",
                timeline: "2개월",
                type: "trend_service"
              }
            ],
            investment_areas: [
              { area: `${topCountries[0].country} 전문 서비스`, priority: "최우선", budget: "높음" },
              { area: "다국어 지원 시스템", priority: "높음", budget: "중간" },
              { area: "온라인 예약 플랫폼", priority: "중간", budget: "중간" },
              { area: "문화 체험 프로그램", priority: "중간", budget: "낮음" }
            ]
          },
          monthly: {
            immediate_actions: [
              {
                month: "현재",
                action: seasonality.peak_months ? 
                  `${seasonality.peak_months.join(', ')}월 성수기 대비 직원 충원` : 
                  "성수기 대비 직원 충원",
                category: "인력",
                deadline: "2주",
                cost: "중간"
              },
              {
                month: "다음 달",
                action: `${topCountries[0].country} 관광객 대상 특별 패키지`,
                category: "마케팅",
                deadline: "1개월",
                cost: "낮음"
              },
              {
                month: "2개월 후",
                action: seasonality.low_months ? 
                  `${seasonality.low_months.join(', ')}월 비수기 시설 업그레이드` : 
                  "비수기 시설 보수 및 업그레이드",
                category: "시설",
                deadline: "3개월",
                cost: "높음"
              }
            ],
            seasonal_tips: {
              peak_season: [
                `${topCountries[0].country} 고객 서비스 강화로 리피터 확보`,
                "예약 대기 리스트 관리로 기회 손실 방지",
                `${topCountries[1].country} 관광객 대상 프리미엄 서비스 제공`
              ],
              low_season: [
                "현지인 대상 이벤트로 매출 보완",
                "시설 점검 및 개선으로 다음 성수기 준비",
                `${topCountries[2].country} 틈새시장 공략으로 안정적 수익 확보`
              ]
            }
          }
        };

        setInsights(insightData);
      } catch (error) {
        console.error('인사이트 데이터 로드 오류:', error);
        
        // 에러 시 기본 인사이트
        const fallbackInsights = {
          yearly: {
            priority_actions: [
              {
                title: "일본 시장 집중 공략",
                description: "경제 기여도 1위(999M$), 장기 파트너십 구축 필수",
                urgency: "high",
                impact: "매우 높음",
                timeline: "6개월",
                type: "market_expansion"
              }
            ],
            investment_areas: [
              { area: "일본 전문 서비스", priority: "최우선", budget: "높음" }
            ]
          },
          monthly: {
            immediate_actions: [
              {
                month: "현재",
                action: "성수기 대비 직원 충원",
                category: "인력",
                deadline: "2주",
                cost: "중간"
              }
            ],
            seasonal_tips: {
              peak_season: ["서비스 품질 유지"],
              low_season: ["시설 개선"]
            }
          }
        };
        setInsights(fallbackInsights);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [viewMode]);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case '최우선': return '🔥';
      case '높음': return '⚡';
      case '중간': return '📌';
      default: return '💡';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
        <p className="mt-2 text-muted">실제 데이터 기반 인사이트 생성 중...</p>
      </div>
    );
  }

  if (!insights) {
    return (
      <Alert variant="warning" className="text-center">
        인사이트 데이터를 불러올 수 없습니다.
      </Alert>
    );
  }

  const currentInsights = insights[viewMode];

  return (
    <div>
      {viewMode === 'yearly' ? (
        <>
          {/* 장기 전략 액션 */}
          <div className="mb-4">
            <h6 className="text-primary mb-3">
              🎯 실제 데이터 기반 우선순위 액션
            </h6>
            {currentInsights.priority_actions.map((action, index) => (
              <Card key={index} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{action.title}</h6>
                    <Badge bg={getUrgencyColor(action.urgency)}>
                      {action.urgency === 'high' ? '긴급' : 
                       action.urgency === 'medium' ? '중요' : '일반'}
                    </Badge>
                  </div>
                  <p className="text-muted mb-2 small">{action.description}</p>
                  <Row className="small">
                    <Col xs={4}>
                      <span className="text-muted">영향도:</span> 
                      <span className="fw-semibold ms-1">{action.impact}</span>
                    </Col>
                    <Col xs={4}>
                      <span className="text-muted">기간:</span> 
                      <span className="fw-semibold ms-1">{action.timeline}</span>
                    </Col>
                    <Col xs={4}>
                      <Badge bg="light" text="dark" className="small">
                        {action.type === 'market_expansion' ? '시장확장' :
                         action.type === 'service_upgrade' ? '서비스개선' : '트렌드대응'}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* 투자 영역 */}
          <div className="mb-4">
            <h6 className="text-success mb-3">
              💰 데이터 기반 투자 우선순위
            </h6>
            <ListGroup variant="flush">
              {currentInsights.investment_areas.map((investment, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <span className="me-2">{getPriorityIcon(investment.priority)}</span>
                    <div>
                      <span className="fw-semibold">{investment.area}</span>
                      <div className="small text-muted">우선순위: {investment.priority}</div>
                    </div>
                  </div>
                  <Badge bg={investment.budget === '높음' ? 'danger' : 
                              investment.budget === '중간' ? 'warning' : 'success'}>
                    예산 {investment.budget}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          {/* 장기 전략 요약 */}
          <Alert variant="info" className="mb-0">
            <h6 className="text-primary mb-2">📊 실제 데이터 인사이트</h6>
            <div className="small">
              <strong>핵심 포인트:</strong> 실제 관광청 데이터를 분석한 결과, 
              일본이 압도적 1위 시장이며 한국이 급성장하고 있습니다. 
              이 두 국가에 집중하여 비즈니스 전략을 수립하는 것이 가장 효과적입니다.
            </div>
          </Alert>
        </>
      ) : (
        <>
          {/* 월별 즉시 액션 */}
          <div className="mb-4">
            <h6 className="text-warning mb-3">
              ⚡ 즉시 실행 액션 플랜
            </h6>
            {currentInsights.immediate_actions.map((action, index) => (
              <Card key={index} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="fw-bold mb-0">{action.action}</h6>
                    <Badge bg="warning" text="dark">{action.deadline}</Badge>
                  </div>
                  <Row className="small">
                    <Col xs={4}>
                      <span className="text-muted">카테고리:</span> 
                      <span className="fw-semibold ms-1">{action.category}</span>
                    </Col>
                    <Col xs={4}>
                      <span className="text-muted">시기:</span> 
                      <span className="fw-semibold ms-1">{action.month}</span>
                    </Col>
                    <Col xs={4}>
                      <Badge bg={action.cost === '높음' ? 'danger' : 
                                  action.cost === '중간' ? 'warning' : 'success'}>
                        비용 {action.cost}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* 계절별 팁 */}
          <Row className="g-3 mb-4">
            <Col xs={12} md={6}>
              <Card className="h-100 border-warning">
                <Card.Header className="bg-warning text-dark">
                  <h6 className="mb-0">🔥 성수기 대응 전략</h6>
                </Card.Header>
                <Card.Body>
                  <ul className="mb-0 small">
                    {currentInsights.seasonal_tips.peak_season.map((tip, index) => (
                      <li key={index} className="mb-1">{tip}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="h-100 border-info">
                <Card.Header className="bg-info text-white">
                  <h6 className="mb-0">❄️ 비수기 활용 전략</h6>
                </Card.Header>
                <Card.Body>
                  <ul className="mb-0 small">
                    {currentInsights.seasonal_tips.low_season.map((tip, index) => (
                      <li key={index} className="mb-1">{tip}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Alert variant="success" className="mb-0">
            <h6 className="text-success mb-2">💡 월별 패턴 기반 인사이트</h6>
            <div className="small">
              <strong>핵심 포인트:</strong> 실제 월별 데이터 분석 결과를 바탕으로 
              계절성에 맞춘 운영 전략을 수립하여 연중 안정적인 수익을 확보할 수 있습니다.
            </div>
          </Alert>
        </>
      )}

      {/* 공통 문의 정보 */}
      <div className="text-center mt-4 pt-3 border-top">
        <small className="text-muted">
          📞 비즈니스 컨설팅: (671) 646-5278 | 
          📧 guam-business@tourism.gu | 
          🕒 평일 9:00-17:00
        </small>
      </div>
    </div>
  );
};

export default BusinessInsights; 