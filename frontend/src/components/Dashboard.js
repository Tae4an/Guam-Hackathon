import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box,
  FormControlLabel,
  Switch,
  Chip
} from '@mui/material';
import CountryRankingChart from './CountryRankingChart';
import CorrelationChart from './CorrelationChart';
import RealtimeMonitor from './RealtimeMonitor';
import MonthlyTrends from './MonthlyTrends';
import BusinessInsights from './BusinessInsights';

function Dashboard() {
  const [viewMode, setViewMode] = useState('yearly'); // 'yearly' or 'monthly'

  const handleViewModeChange = (event) => {
    setViewMode(event.target.checked ? 'monthly' : 'yearly');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* 헤더 */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          괌 비즈니스 인사이트
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          실시간 관광객 데이터 기반 소상공인 맞춤 가이드
        </Typography>
        
        {/* 뷰 모드 토글 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
          <Chip 
            label="연별 트렌드" 
            color={viewMode === 'yearly' ? 'primary' : 'default'} 
            variant={viewMode === 'yearly' ? 'filled' : 'outlined'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={viewMode === 'monthly'}
                onChange={handleViewModeChange}
                color="primary"
              />
            }
            label=""
          />
          <Chip 
            label="월별 패턴" 
            color={viewMode === 'monthly' ? 'secondary' : 'default'} 
            variant={viewMode === 'monthly' ? 'filled' : 'outlined'}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {viewMode === 'yearly' ? '장기 트렌드 및 전체 상관관계 분석' : '계절성 패턴 및 월별 세부 인사이트'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 실시간 모니터링 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <RealtimeMonitor viewMode={viewMode} />
          </Paper>
        </Grid>

        {/* 월별 트렌드 */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <MonthlyTrends viewMode={viewMode} />
          </Paper>
        </Grid>

        {/* 국가별 순위 */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <CountryRankingChart viewMode={viewMode} />
          </Paper>
        </Grid>

        {/* 상관관계 차트 */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <CorrelationChart viewMode={viewMode} />
          </Paper>
        </Grid>

        {/* 비즈니스 인사이트 */}
        <Grid item xs={12} lg={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <BusinessInsights viewMode={viewMode} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard; 