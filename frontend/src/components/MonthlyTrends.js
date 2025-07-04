import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Grid,
  Card,
  CardContent
} from '@mui/material';
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const MonthlyTrends = ({ viewMode = 'yearly' }) => {
  const [selectedCountries, setSelectedCountries] = useState(['korea', 'japan']);
  const [yearlyData, setYearlyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [seasonalityData, setSeasonalityData] = useState({});
  const [loading, setLoading] = useState(true);

  const countries = [
    { key: 'korea', name: '한국', color: '#FF6B6B' },
    { key: 'japan', name: '일본', color: '#4ECDC4' },
    { key: 'usa', name: '미국', color: '#45B7D1' },
    { key: 'philippines', name: '필리핀', color: '#96CEB4' },
    { key: 'taiwan', name: '대만', color: '#FECA57' },
    { key: 'china', name: '중국', color: '#FF9FF3' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 연별 데이터 (기존)
        const correlationsRes = await fetch('http://localhost:8000/api/correlations');
        const correlationsData = await correlationsRes.json();
        setYearlyData(correlationsData.time_series || []);

        // 월별 데이터 (새로운 API)
        if (viewMode === 'monthly') {
          const monthlyRes = await fetch('http://localhost:8000/api/monthly');
          const monthlyDataRes = await monthlyRes.json();
          setMonthlyData(monthlyDataRes.monthly_data || []);
          setSeasonalityData(monthlyDataRes.seasonality || {});
        }
      } catch (error) {
        console.error('데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [viewMode]);

  const handleCountryChange = (event) => {
    setSelectedCountries(event.target.value);
  };

  const getDisplayData = () => {
    if (viewMode === 'yearly') {
      return yearlyData;
    } else {
      // 월별 데이터를 차트용으로 변환
      const chartData = [];
      const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', 
                         '7월', '8월', '9월', '10월', '11월', '12월'];
      
      // 최근 2년 데이터만 표시
      const recentData = monthlyData.filter(item => item.year >= 2023);
      
      monthNames.forEach((monthName, index) => {
        const monthNum = index + 1;
        const monthData = { month: monthName };
        
        countries.forEach(country => {
          const countryMonthData = recentData.filter(item => 
            item.month === monthNum && selectedCountries.includes(country.key)
          );
          
          if (countryMonthData.length > 0) {
            monthData[country.key] = Math.round(countryMonthData.reduce((sum, item) => 
              sum + item[country.key], 0) / countryMonthData.length);
          }
        });
        
        chartData.push(monthData);
      });
      
      return chartData;
    }
  };

  const getSeasonalInsights = (countryKey) => {
    const seasonality = seasonalityData[countryKey];
    if (!seasonality) return null;

    const peakMonths = seasonality.peak_months || [];
    const lowMonths = seasonality.low_months || [];
    
    return {
      peak: peakMonths.map(m => `${m}월`).join(', '),
      low: lowMonths.map(m => `${m}월`).join(', ')
    };
  };

  if (loading) {
    return <Box sx={{ p: 2, textAlign: 'center' }}>데이터 로딩 중...</Box>;
  }

  const displayData = getDisplayData();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" fontWeight="bold">
          {viewMode === 'yearly' ? '연별 관광객 트렌드' : '월별 계절성 패턴'}
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>국가 선택</InputLabel>
          <Select
            multiple
            value={selectedCountries}
            onChange={handleCountryChange}
            label="국가 선택"
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const country = countries.find(c => c.key === value);
                  return (
                    <Chip 
                      key={value} 
                      label={country?.name} 
                      size="small"
                      sx={{ backgroundColor: country?.color, color: 'white' }}
                    />
                  );
                })}
              </Box>
            )}
          >
            {countries.map((country) => (
              <MenuItem key={country.key} value={country.key}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 차트 */}
      <Box sx={{ height: 400, mb: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={viewMode === 'yearly' ? 'year' : 'month'} 
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value, name) => [
                `${value?.toLocaleString()}명`,
                countries.find(c => c.key === name)?.name || name
              ]}
              labelFormatter={(label) => 
                viewMode === 'yearly' ? `${label}년` : label
              }
            />
            <Legend />
            {countries
              .filter(country => selectedCountries.includes(country.key))
              .map(country => (
                <Line
                  key={country.key}
                  type="monotone"
                  dataKey={country.key}
                  stroke={country.color}
                  strokeWidth={3}
                  dot={{ fill: country.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* 계절성 인사이트 (월별 뷰에서만 표시) */}
      {viewMode === 'monthly' && (
        <Grid container spacing={2}>
          {selectedCountries.map(countryKey => {
            const country = countries.find(c => c.key === countryKey);
            const insights = getSeasonalInsights(countryKey);
            
            if (!insights) return null;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={countryKey}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ 
                      color: country.color, 
                      fontWeight: 'bold' 
                    }}>
                      {country.name}
                    </Typography>
                    
                    {insights.peak && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TrendingUpIcon sx={{ color: 'success.main', mr: 1 }} />
                        <Typography variant="body2">
                          <strong>성수기:</strong> {insights.peak}
                        </Typography>
                      </Box>
                    )}
                    
                    {insights.low && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingDownIcon sx={{ color: 'warning.main', mr: 1 }} />
                        <Typography variant="body2">
                          <strong>비수기:</strong> {insights.low}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {viewMode === 'yearly' && (
        <Alert severity="info" sx={{ mt: 2 }}>
          💡 <strong>분석 인사이트:</strong> 연별 데이터를 통해 장기 트렌드를 파악하고, 
          코로나19와 같은 외부 요인의 영향을 분석할 수 있습니다.
        </Alert>
      )}
    </Box>
  );
};

export default MonthlyTrends; 