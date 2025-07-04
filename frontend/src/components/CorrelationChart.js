import React, { useState, useEffect } from 'react';
import { Alert, Badge, Row, Col } from 'react-bootstrap';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const CorrelationChart = ({ selectedYear, filterYear }) => {
  const [correlationData, setCorrelationData] = useState([]);
  const [analysisType, setAnalysisType] = useState('yearly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCorrelations = async () => {
      try {
        setLoading(true);
        const yearParam = selectedYear === 'all' ? 'all' : selectedYear;
        const response = await fetch(`http://localhost:8000/api/correlations?year=${yearParam}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Correlation data received:', data); // 디버깅용
        
        const timeSeriesData = data.time_series || [];
        setAnalysisType(data.analysis_type || 'yearly');
        console.log('Time series data:', timeSeriesData); // 디버깅용
        
        setCorrelationData(timeSeriesData);
      } catch (error) {
        console.error('상관관계 데이터 로드 오류:', error);
        // 에러 시 빈 배열로 설정
        setCorrelationData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelations();
  }, [selectedYear, filterYear]);

  // 국가별 색상 매핑
  const countryColors = {
    'Korea': '#FF6B6B',
    'Japan': '#4ECDC4', 
    'USA': '#45B7D1',
    'Philippines': '#96CEB4',
    'Taiwan': '#FECA57',
    'China': '#FF9FF3',
    'gdp': '#333333'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // 라벨 포맷팅
      let formattedLabel;
      if (analysisType === 'monthly') {
        // 월별 데이터인 경우: "2024-01" -> "2024년 1월" 또는 month 필드 사용
        const currentData = correlationData.find(d => d.year === label || d.month === label);
        if (currentData && currentData.month) {
          formattedLabel = `${currentData.year.split('-')[0]}년 ${currentData.month}월`;
        } else {
          formattedLabel = label.includes('-') ? 
            `${label.split('-')[0]}년 ${parseInt(label.split('-')[1])}월` : 
            `${label}월`;
        }
      } else {
        // 연도별 데이터인 경우
        formattedLabel = `${label}년`;
      }

      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <h6 className="fw-bold mb-2">{formattedLabel}</h6>
          {payload.map((entry, index) => (
            <p 
              key={index} 
              className="mb-1"
              style={{ color: entry.color }}
            >
              <span className="fw-semibold">{entry.name}:</span> {
                entry.name === 'GDP' 
                  ? `${entry.value.toFixed(1)}B$` 
                  : `${entry.value.toLocaleString()}명`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">로딩 중...</span>
        </div>
        <p className="mt-2 text-muted">상관관계 데이터 로딩 중...</p>
      </div>
    );
  }

  // 데이터가 없을 때 메시지 표시
  if (!correlationData || correlationData.length === 0) {
    return (
      <Alert variant="warning" className="text-center">
        <h6>📊 데이터 없음</h6>
        <p className="mb-0">상관관계 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
      </Alert>
    );
  }

  const formatXAxisLabel = (tickItem) => {
    if (analysisType === 'monthly') {
      return `${tickItem}월`;
    } else {
      return `${tickItem}년`;
    }
  };

  // x축 데이터 키 결정
  const getXAxisDataKey = () => {
    return analysisType === 'monthly' ? 'month' : 'year';
  };

  const getHighestCorrelationCountry = () => {
    if (!correlationData.length) return null;
    
    const avgData = correlationData.reduce((acc, item) => {
      Object.keys(item).forEach(key => {
        if (key !== 'year' && key !== 'gdp') {
          acc[key] = (acc[key] || 0) + item[key];
        }
      });
      return acc;
    }, {});

    const avgCountries = Object.keys(avgData).map(country => ({
      country,
      avg: avgData[country] / correlationData.length
    }));

    return avgCountries.reduce((max, country) => 
      country.avg > max.avg ? country : max
    );
  };

  const topCountry = getHighestCorrelationCountry();

  console.log('Rendering chart with data:', correlationData); // 디버깅용

  return (
    <div>
      {/* 데이터 확인 디버깅 */}
      <div className="mb-2">
        <small className="text-muted">
          📊 데이터 포인트: {correlationData.length}개 | 
          기간: {correlationData.length > 0 ? 
            (analysisType === 'monthly' ? 
              `${selectedYear}년 월별 분석` : 
              `${Math.min(...correlationData.map(d => d.year))} - ${Math.max(...correlationData.map(d => d.year))}년`
            ) : '데이터 없음'}
        </small>
      </div>

      {/* 차트 */}
      <div style={{ height: '320px' }} className="mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={correlationData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey={getXAxisDataKey()} 
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
              stroke="#666"
              type="number"
              scale="linear"
              domain={analysisType === 'monthly' ? [1, 12] : ['dataMin', 'dataMax']}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="#666"
              label={{ value: '관광객 수', angle: -90, position: 'insideLeft' }}
              domain={[0, 'dataMax']}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="#666"
              label={{ value: 'GDP (B$)', angle: 90, position: 'insideRight' }}
              domain={[0, 'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* GDP 라인 */}
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="gdp" 
              stroke={countryColors.gdp}
              strokeWidth={3}
              name="GDP"
              dot={{ fill: countryColors.gdp, strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            
            {/* 주요 국가들 */}
            {['korea', 'japan', 'usa', 'china'].map(country => (
              <Line 
                key={country}
                yAxisId="left"
                type="monotone" 
                dataKey={country} 
                stroke={countryColors[country.charAt(0).toUpperCase() + country.slice(1)]}
                strokeWidth={2}
                name={country.charAt(0).toUpperCase() + country.slice(1)}
                dot={{ fill: countryColors[country.charAt(0).toUpperCase() + country.slice(1)], strokeWidth: 2, r: 3 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 상관관계 통계 */}
      <Row className="g-3 mb-4">
        <Col xs={12} md={6}>
          <div className="bg-light p-3 rounded">
            <h6 className="text-success mb-2">📊 최고 상관관계</h6>
            {topCountry && (
              <div>
                <Badge bg="success" className="me-2">{topCountry.country.toUpperCase()}</Badge>
                <span className="small text-muted">
                  평균 {topCountry.avg.toLocaleString()}명
                </span>
              </div>
            )}
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="bg-light p-3 rounded">
            <h6 className="text-info mb-2">📈 분석 기간</h6>
            <span className="small text-muted">
              {correlationData.length > 0 && 
                `${Math.min(...correlationData.map(d => d.year))} - ${Math.max(...correlationData.map(d => d.year))}년`
              }
            </span>
          </div>
        </Col>
      </Row>

      {/* 인사이트 요약 */}
      <div className="mb-3">
        {topCountry && (
          <Alert variant="success" className="mb-3">
            <small>
              📊 <strong>주요 상관관계:</strong> {topCountry.country.toUpperCase()}는 평균 
              {topCountry.avg.toLocaleString()}명의 관광객으로 GDP와 가장 높은 상관관계를 보입니다.
            </small>
          </Alert>
        )}
        
        {analysisType === 'yearly' ? (
          <Alert variant="info" className="mb-0">
            <small>
              💡 <strong>분석 포인트:</strong> 장기 트렌드를 통해 GDP와 관광객 수의 
              전반적인 상관관계를 파악할 수 있습니다.
            </small>
          </Alert>
        ) : (
          <Alert variant="info" className="mb-0">
            <small>
              💡 <strong>월별 패턴:</strong> 계절적 요인과 특정 이벤트가 
              관광객 유입에 미치는 영향을 분석할 수 있습니다.
            </small>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default CorrelationChart; 