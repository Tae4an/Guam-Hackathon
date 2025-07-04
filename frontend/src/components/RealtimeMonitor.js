import React from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Alert,
  Avatar
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  TrendingFlat,
  People,
  AttachMoney,
  FlightLand
} from '@mui/icons-material';

const RealtimeMonitor = ({ data }) => {
  if (!data || !data.time_series) return null;

  // 현재 월 데이터 (최신 데이터 사용)
  const currentData = data.time_series[data.time_series.length - 1];
  const previousData = data.time_series[data.time_series.length - 2];

  const countries = [
    { key: 'japan', name: '일본', flag: '🇯🇵', color: '#1976d2' },
    { key: 'korea', name: '한국', flag: '🇰🇷', color: '#2e7d32' },
    { key: 'usa', name: '미국', flag: '🇺🇸', color: '#d32f2f' },
    { key: 'china', name: '중국', flag: '🇨🇳', color: '#ed6c02' }
  ];

  const calculateChange = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const getTrendIcon = (change) => {
    const changeValue = parseFloat(change);
    if (changeValue > 5) return <TrendingUp color="success" />;
    if (changeValue < -5) return <TrendingDown color="error" />;
    return <TrendingFlat color="warning" />;
  };

  const getTrendColor = (change) => {
    const changeValue = parseFloat(change);
    if (changeValue > 5) return 'success';
    if (changeValue < -5) return 'error';
    return 'warning';
  };

  const totalTourists = countries.reduce((sum, country) => 
    sum + (currentData[country.key] || 0), 0
  );

  const totalChange = calculateChange(
    totalTourists,
    countries.reduce((sum, country) => sum + (previousData[country.key] || 0), 0)
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">
        📊 실시간 관광객 모니터링 - {currentData.year}년 현재
      </Typography>
      
      {/* 전체 현황 요약 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: '#1976d2', mr: 2 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">총 관광객</Typography>
                  <Typography variant="h4">{(totalTourists / 1000).toFixed(0)}K</Typography>
                  <Box display="flex" alignItems="center">
                    {getTrendIcon(totalChange)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      전월 대비 {totalChange > 0 ? '+' : ''}{totalChange}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#e8f5e8' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: '#2e7d32', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">GDP 영향</Typography>
                  <Typography variant="h4">${currentData.gdp}B</Typography>
                  <Typography variant="body2" color="success.main">
                    관광업 기여도 높음
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: '#ed6c02', mr: 2 }}>
                  <FlightLand />
                </Avatar>
                <Box>
                  <Typography variant="h6">입국 추세</Typography>
                  <Typography variant="h4">
                    {parseFloat(totalChange) > 0 ? '증가' : '감소'}
                  </Typography>
                  <Typography variant="body2" color="warning.main">
                    지난달 대비
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 국가별 상세 현황 */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>
        국가별 상세 현황
      </Typography>
      
      <Grid container spacing={2}>
        {countries.map((country) => {
          const current = currentData[country.key] || 0;
          const previous = previousData[country.key] || 0;
          const change = calculateChange(current, previous);
          
          return (
            <Grid item xs={12} sm={6} md={3} key={country.key}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Typography variant="h6" sx={{ mr: 1 }}>
                        {country.flag}
                      </Typography>
                      <Typography variant="subtitle1">
                        {country.name}
                      </Typography>
                    </Box>
                    <Chip 
                      icon={getTrendIcon(change)}
                      label={`${change > 0 ? '+' : ''}${change}%`}
                      color={getTrendColor(change)}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="h5" sx={{ mt: 1, color: country.color }}>
                    {(current / 1000).toFixed(0)}K명
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    전월: {(previous / 1000).toFixed(0)}K명
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 알림 및 인사이트 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          🚨 주요 알림
        </Typography>
        
        {parseFloat(totalChange) > 10 && (
          <Alert severity="success" sx={{ mb: 1 }}>
            관광객 급증 감지! 현지 비즈니스 준비 권장
          </Alert>
        )}
        
        {countries.map((country) => {
          const change = calculateChange(
            currentData[country.key], 
            previousData[country.key]
          );
          
          if (parseFloat(change) > 15) {
            return (
              <Alert key={country.key} severity="info" sx={{ mb: 1 }}>
                {country.flag} {country.name} 관광객 급증 (+{change}%) - 
                {country.name === '한국' && ' 한글 메뉴판 및 K-Food 준비 권장'}
                {country.name === '일본' && ' 일본어 서비스 및 정갈한 서비스 준비'}
                {country.name === '미국' && ' 영어 서비스 및 프리미엄 옵션 준비'}
                {country.name === '중국' && ' 중국어 안내 및 단체 할인 준비'}
              </Alert>
            );
          }
          return null;
        })}
      </Box>
    </Box>
  );
};

export default RealtimeMonitor; 