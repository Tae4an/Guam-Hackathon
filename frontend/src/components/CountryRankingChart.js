import React, { useState, useEffect } from 'react';
import { Typography, Box, Alert } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';

const CountryRankingChart = ({ viewMode = 'yearly' }) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/rankings');
        const data = await response.json();
        setRankings(data.rankings || []);
      } catch (error) {
        console.error('순위 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // 국가별 색상 매핑
  const countryColors = {
    'Korea': '#FF6B6B',
    'Japan': '#4ECDC4', 
    'USA': '#45B7D1',
    'Philippines': '#96CEB4',
    'Taiwan': '#FECA57',
    'China': '#FF9FF3'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box sx={{ 
          backgroundColor: 'white', 
          p: 2, 
          border: '1px solid #ccc',
          borderRadius: 1,
          boxShadow: 2 
        }}>
          <Typography variant="h6" gutterBottom>{label}</Typography>
          <Typography variant="body2">
            평균 관광객: {data.avg_tourists?.toLocaleString()}명
          </Typography>
          <Typography variant="body2">
            상관관계: {(data.correlation * 100).toFixed(1)}%
          </Typography>
          <Typography variant="body2">
            관광객당 영향: ${data.impact_per_tourist}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            총 경제 영향: ${data.total_economic_impact}M
          </Typography>
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return <Box sx={{ p: 2, textAlign: 'center' }}>데이터 로딩 중...</Box>;
  }

  const topCountries = rankings.slice(0, 6);

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        {viewMode === 'yearly' ? '국가별 경제 기여도 순위' : '주요 국가 현황'}
      </Typography>
      
      <Box sx={{ height: 350, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topCountries}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="country" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="total_economic_impact" 
              name="경제 영향 (백만$)"
              radius={[4, 4, 0, 0]}
            >
              {topCountries.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={countryColors[entry.country] || '#8884d8'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* 상위 3개국 하이라이트 */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          🏆 TOP 3 기여 국가
        </Typography>
        {topCountries.slice(0, 3).map((country, index) => (
          <Box 
            key={country.country} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 1,
              mb: 1,
              backgroundColor: index === 0 ? 'primary.50' : 'grey.50',
              borderRadius: 1,
              border: index === 0 ? '2px solid' : '1px solid',
              borderColor: index === 0 ? 'primary.main' : 'grey.300'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ 
                mr: 1, 
                color: countryColors[country.country],
                fontWeight: 'bold'
              }}>
                #{index + 1}
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {country.country}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              ${country.total_economic_impact}M
            </Typography>
          </Box>
        ))}
      </Box>

      {viewMode === 'yearly' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          💡 <strong>분석 기준:</strong> 평균 관광객 수, GDP 상관관계, 
          관광객당 경제적 영향을 종합하여 산출한 순위입니다.
        </Alert>
      )}
    </Box>
  );
};

export default CountryRankingChart; 