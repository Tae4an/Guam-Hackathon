import React, { useState } from 'react';
import { Typography, Box, FormControl, FormControlLabel, Switch } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CorrelationChart = ({ data }) => {
  const [showGDP, setShowGDP] = useState(true);
  const [showCountries, setShowCountries] = useState({
    japan: true,
    korea: true,
    usa: false,
    china: false
  });

  if (!data || !data.time_series) return null;

  const chartData = data.time_series.map(item => ({
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
          <Typography variant="h6" gutterBottom>{label}년</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" style={{ color: entry.color }}>
              {entry.dataKey === 'GDP' 
                ? `GDP: $${entry.value}B`
                : `${entry.dataKey}: ${entry.value}천명`
              }
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="h5" gutterBottom color="primary">
        📈 관광객 수 vs GDP 트렌드
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
      
      <ResponsiveContainer width="100%" height="75%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" label={{ value: '관광객 수 (천명)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'GDP (십억$)', angle: 90, position: 'insideRight' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          
          {showGDP && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="GDP"
              stroke="#ff7300"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          )}
          
          {showCountries.japan && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="일본"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}
          
          {showCountries.korea && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="한국"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}
          
          {showCountries.usa && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="미국"
              stroke="#ffc658"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}
          
          {showCountries.china && (
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="중국"
              stroke="#ff7c7c"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default CorrelationChart; 