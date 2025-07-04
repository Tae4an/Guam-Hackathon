import React from 'react';
import { Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CountryRankingChart = ({ data }) => {
  if (!data || !data.rankings) return null;

  const chartData = data.rankings.map(item => ({
    country: item.country,
    경제기여도: item.total_economic_impact,
    평균관광객수: Math.round(item.avg_tourists / 1000), // 천명 단위
    상관관계: item.correlation * 100 // 백분율
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
          <Typography variant="h6" gutterBottom>{label}</Typography>
          <Typography variant="body2">경제 기여도: ${payload[0].value}M</Typography>
          <Typography variant="body2">평균 관광객: {data.평균관광객수}천명</Typography>
          <Typography variant="body2">상관관계: {data.상관관계.toFixed(1)}%</Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h5" gutterBottom color="primary">
        🏆 국가별 경제 기여도 순위
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        연평균 경제적 영향 (백만 달러)
      </Typography>
      
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="country" 
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis 
            label={{ value: '경제 기여도 ($M)', angle: -90, position: 'insideLeft' }}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="경제기여도" 
            fill="#1976d2"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CountryRankingChart; 