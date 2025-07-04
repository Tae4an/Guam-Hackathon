import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, CircularProgress } from '@mui/material';
import CountryRankingChart from './CountryRankingChart';
import CorrelationChart from './CorrelationChart';
import MonthlyTrends from './MonthlyTrends';
import BusinessInsights from './BusinessInsights';
import RealtimeMonitor from './RealtimeMonitor';
import axios from 'axios';

const Dashboard = () => {
  const [rankings, setRankings] = useState(null);
  const [correlations, setCorrelations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rankingsRes, correlationsRes] = await Promise.all([
        axios.get('/api/rankings'),
        axios.get('/api/correlations')
      ]);
      
      setRankings(rankingsRes.data);
      setCorrelations(correlationsRes.data);
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
      // 개발용 샘플 데이터
      setRankings({
        rankings: [
          { country: "Japan", avg_tourists: 150000, correlation: 0.85, impact_per_tourist: 800, total_economic_impact: 120 },
          { country: "Korea", avg_tourists: 105000, correlation: 0.75, impact_per_tourist: 600, total_economic_impact: 63 },
          { country: "USA", avg_tourists: 30000, correlation: 0.65, impact_per_tourist: 1200, total_economic_impact: 36 },
          { country: "Philippines", avg_tourists: 45000, correlation: 0.55, impact_per_tourist: 500, total_economic_impact: 22.5 },
          { country: "China", avg_tourists: 52000, correlation: 0.45, impact_per_tourist: 400, total_economic_impact: 20.8 },
          { country: "Taiwan", avg_tourists: 37000, correlation: 0.70, impact_per_tourist: 550, total_economic_impact: 20.4 }
        ]
      });
      
      setCorrelations({
        time_series: [
          { year: 2014, gdp: 3.2, japan: 120000, korea: 80000, usa: 25000, china: 45000 },
          { year: 2015, gdp: 3.5, japan: 130000, korea: 85000, usa: 26000, china: 50000 },
          { year: 2016, gdp: 3.3, japan: 125000, korea: 90000, usa: 27000, china: 48000 },
          { year: 2017, gdp: 3.8, japan: 140000, korea: 95000, usa: 28000, china: 55000 },
          { year: 2018, gdp: 4.1, japan: 150000, korea: 100000, usa: 30000, china: 60000 },
          { year: 2019, gdp: 4.3, japan: 160000, korea: 110000, usa: 32000, china: 58000 },
          { year: 2020, gdp: 4.0, japan: 155000, korea: 105000, usa: 31000, china: 55000 },
          { year: 2021, gdp: 4.5, japan: 170000, korea: 120000, usa: 35000, china: 52000 },
          { year: 2022, gdp: 4.2, japan: 165000, korea: 115000, usa: 33000, china: 50000 },
          { year: 2023, gdp: 4.7, japan: 180000, korea: 130000, usa: 38000, china: 48000 },
          { year: 2024, gdp: 4.5, japan: 175000, korea: 125000, usa: 36000, china: 45000 }
        ],
        correlations: { japan: 0.85, korea: 0.75, usa: 0.65, china: 0.45 }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* 실시간 모니터링 */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <RealtimeMonitor data={correlations} />
        </Paper>
      </Grid>

      {/* 국가별 기여도 순위 */}
      <Grid item xs={12} lg={6}>
        <Paper elevation={3} sx={{ p: 3, height: '500px' }}>
          <CountryRankingChart data={rankings} />
        </Paper>
      </Grid>

      {/* 월별 트렌드 분석 */}
      <Grid item xs={12} lg={6}>
        <Paper elevation={3} sx={{ p: 3, height: '500px' }}>
          <MonthlyTrends data={correlations} />
        </Paper>
      </Grid>

      {/* 비즈니스 인사이트 */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <BusinessInsights rankings={rankings} correlations={correlations} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Dashboard; 