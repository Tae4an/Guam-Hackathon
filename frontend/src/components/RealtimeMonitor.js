import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Alert,
  Avatar,
  LinearProgress
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  TrendingFlat,
  People,
  AttachMoney,
  FlightLand,
  FlightTakeoff
} from '@mui/icons-material';

const RealtimeMonitor = ({ viewMode = 'yearly' }) => {
  const [realtimeData, setRealtimeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        setLoading(true);
        // 실제 API 호출 (현재는 목 데이터 사용)
        const mockData = {
          current_month: '2024-11',
          total_visitors: 127890,
          monthly_change: 15.3,
          yearly_change: 8.7,
          top_countries: [
            { country: 'Japan', visitors: 45200, change: 12.5 },
            { country: 'Korea', visitors: 32100, change: 18.9 },
            { country: 'USA', visitors: 18400, change: -3.2 },
            { country: 'Philippines', visitors: 15600, change: 22.1 }
          ],
          alert_level: 'normal', // 'high', 'normal', 'low'
          economic_impact: 89.5 // 백만 달러
        };
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
        setRealtimeData(mockData);
      } catch (error) {
        console.error('실시간 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealtimeData();
    
    // 5분마다 데이터 업데이트
    const interval = setInterval(fetchRealtimeData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (change) => {
    return change > 0 ? 
      <TrendingUp sx={{ color: 'success.main' }} /> : 
      <TrendingDown sx={{ color: 'error.main' }} />;
  };

  const getTrendColor = (change) => {
    return change > 0 ? 'success.main' : 'error.main';
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'high': return 'success';
      case 'normal': return 'info';
      case 'low': return 'warning';
      default: return 'info';
    }
  };

  const getAlertMessage = (level) => {
    switch (level) {
      case 'high': return '🔥 높은 관광객 유입! 서비스 준비 강화 권장';
      case 'normal': return '✅ 정상적인 관광객 유입 상태';
      case 'low': return '⚠️ 관광객 감소 추세 - 마케팅 전략 점검 필요';
      default: return '📊 데이터 분석 중...';
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          실시간 모니터링
        </Typography>
        <LinearProgress sx={{ mt: 2 }} />
        <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
          데이터 로딩 중...
        </Typography>
      </Box>
    );
  }

  if (!realtimeData) {
    return <Box sx={{ p: 2, textAlign: 'center' }}>데이터를 불러올 수 없습니다.</Box>;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        🚀 실시간 모니터링
        <Chip 
          label={viewMode === 'yearly' ? '연간 기준' : '월간 기준'} 
          size="small" 
          color="primary" 
          sx={{ ml: 2 }} 
        />
      </Typography>

      {/* 알림 */}
      <Alert 
        severity={getAlertColor(realtimeData.alert_level)} 
        sx={{ mb: 3 }}
        icon={<FlightTakeoff />}
      >
        <strong>{getAlertMessage(realtimeData.alert_level)}</strong>
      </Alert>

      <Grid container spacing={3}>
        {/* 총 방문객 수 */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People sx={{ mr: 1 }} />
                <Typography variant="h6">
                  {viewMode === 'yearly' ? '연간 총 방문객' : '이번 달 방문객'}
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold">
                {realtimeData.total_visitors.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {viewMode === 'yearly' ? '명 (누적)' : '명'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 월별 변화 */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {getTrendIcon(realtimeData.monthly_change)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  월별 변화
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                fontWeight="bold"
                sx={{ color: getTrendColor(realtimeData.monthly_change) }}
              >
                {realtimeData.monthly_change > 0 ? '+' : ''}
                {realtimeData.monthly_change.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                전월 대비
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 연간 변화 */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {getTrendIcon(realtimeData.yearly_change)}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  연간 변화
                </Typography>
              </Box>
              <Typography 
                variant="h3" 
                fontWeight="bold"
                sx={{ color: getTrendColor(realtimeData.yearly_change) }}
              >
                {realtimeData.yearly_change > 0 ? '+' : ''}
                {realtimeData.yearly_change.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                전년 동기 대비
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 경제적 영향 */}
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 경제적 영향
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                ${realtimeData.economic_impact}M
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {viewMode === 'yearly' ? '연간 추정' : '월간 추정'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 국가별 현황 */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🌍 주요 국가별 현황
              </Typography>
              <Grid container spacing={2}>
                {realtimeData.top_countries.map((country, index) => (
                  <Grid item xs={12} sm={6} md={3} key={country.country}>
                    <Box sx={{ 
                      p: 2, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" fontWeight="bold">
                        {country.country}
                      </Typography>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {country.visitors.toLocaleString()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                        {getTrendIcon(country.change)}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            ml: 0.5,
                            color: getTrendColor(country.change),
                            fontWeight: 'bold'
                          }}
                        >
                          {country.change > 0 ? '+' : ''}{country.change.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 추가 정보 */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          📊 데이터는 5분마다 자동 업데이트됩니다 | 
          마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
        </Typography>
      </Box>
    </Box>
  );
};

export default RealtimeMonitor; 