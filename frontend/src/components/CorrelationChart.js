import React, { useState, useEffect } from 'react';
import { Typography, Box, FormControl, FormControlLabel, Switch, Alert } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CorrelationChart = ({ viewMode = 'yearly' }) => {
  const [showGDP, setShowGDP] = useState(true);
  const [showCountries, setShowCountries] = useState({
    japan: true,
    korea: true,
    usa: false,
    china: false
  });
  const [correlationData, setCorrelationData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCorrelations = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/correlations');
        const data = await response.json();
        setCorrelationData(data.time_series || []);
      } catch (error) {
        console.error('상관관계 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelations();
  }, []);

  if (!correlationData || !correlationData.length) return null;

  const chartData = correlationData.map(item => ({
    year: item.year,
    GDP: item.gdp,
    일본: item.japan / 1000, // 천명 단위
    한국: item.korea / 1000,
    미국: item.usa / 1000,
    중국: item.china / 1000
  }));

  const handleCountryToggle = (country) => {
    setShowCountries(prev => ({
      ...prev,
      [country]: !prev[country]
    }));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box 
          sx={{ 
            backgroundColor: 'white', 
            p: 2, 
            border: '1px solid #ccc',
            borderRadius: 1,
            boxShadow: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            {viewMode === 'yearly' ? `${label}년` : `${label}월`}
          </Typography>
          {payload.map((entry, index) => (
            <Typography 
              key={index} 
              variant="body2" 
              sx={{ color: entry.color }}
            >
              {entry.name}: {entry.name === 'GDP' 
                ? `${entry.value.toFixed(1)}B$` 
                : `${entry.value.toLocaleString()}명`
              }
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return <Box sx={{ p: 2, textAlign: 'center' }}>데이터 로딩 중...</Box>;
  }

  const formatXAxisLabel = (tickItem) => {
    return viewMode === 'yearly' ? tickItem : `${tickItem}월`;
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

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        {viewMode === 'yearly' ? 'GDP vs 관광객 트렌드' : '월별 상관관계 패턴'}
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showGDP}
              onChange={(e) => setShowGDP(e.target.checked)}
              size="small"
            />
          }
          label="GDP"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showCountries.japan}
              onChange={() => handleCountryToggle('japan')}
              size="small"
            />
          }
          label="일본"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showCountries.korea}
              onChange={() => handleCountryToggle('korea')}
              size="small"
            />
          }
          label="한국"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showCountries.usa}
              onChange={() => handleCountryToggle('usa')}
              size="small"
            />
          }
          label="미국"
        />
        <FormControlLabel
          control={
            <Switch
              checked={showCountries.china}
              onChange={() => handleCountryToggle('china')}
              size="small"
            />
          }
          label="중국"
        />
      </Box>
      
      <Box sx={{ height: 350, mb: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year" 
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              label={{ value: '관광객 수', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tick={{ fontSize: 12 }}
              label={{ value: 'GDP (B$)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {showGDP && (
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="GDP" 
                stroke="#ff7300"
                strokeWidth={3}
                name="GDP"
                dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
              />
            )}
            
            {showCountries.japan && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="일본" 
                stroke="#8884d8"
                strokeWidth={2}
                name="일본"
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 3 }}
              />
            )}
            
            {showCountries.korea && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="한국" 
                stroke="#82ca9d"
                strokeWidth={2}
                name="한국"
                dot={{ fill: '#82ca9d', strokeWidth: 2, r: 3 }}
              />
            )}
            
            {showCountries.usa && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="미국" 
                stroke="#ffc658"
                strokeWidth={2}
                name="미국"
                dot={{ fill: '#ffc658', strokeWidth: 2, r: 3 }}
              />
            )}
            
            {showCountries.china && (
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="중국" 
                stroke="#ff7c7c"
                strokeWidth={2}
                name="중국"
                dot={{ fill: '#ff7c7c', strokeWidth: 2, r: 3 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* 인사이트 요약 */}
      <Box sx={{ mt: 2 }}>
        {topCountry && (
          <Alert severity="success" sx={{ mb: 2 }}>
            📊 <strong>주요 상관관계:</strong> {topCountry.country}는 평균 
            {topCountry.avg.toLocaleString()}명의 관광객으로 GDP와 가장 높은 상관관계를 보입니다.
          </Alert>
        )}
        
        {viewMode === 'yearly' ? (
          <Alert severity="info">
            💡 <strong>분석 포인트:</strong> 장기 트렌드를 통해 GDP와 관광객 수의 
            전반적인 상관관계를 파악할 수 있습니다.
          </Alert>
        ) : (
          <Alert severity="info">
            💡 <strong>월별 패턴:</strong> 계절적 요인과 특정 이벤트가 
            관광객 유입에 미치는 영향을 분석할 수 있습니다.
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default CorrelationChart; 