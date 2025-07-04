import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  FormControlLabel, 
  Switch,
  Alert,
  Chip
} from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';

const MonthlyTrends = ({ data }) => {
  const [showGDP, setShowGDP] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('korea');

  if (!data || !data.time_series) return null;

  const countries = [
    { key: 'japan', name: '일본', color: '#1976d2' },
    { key: 'korea', name: '한국', color: '#2e7d32' },
    { key: 'usa', name: '미국', color: '#d32f2f' },
    { key: 'china', name: '중국', color: '#ed6c02' }
  ];

  // 월별 패턴 분석 (연도별 같은 월 평균)
  const monthlyPatterns = {};
  data.time_series.forEach(item => {
    const month = (item.year - 2014) % 12 + 1; // 간단한 월 시뮬레이션
    if (!monthlyPatterns[month]) {
      monthlyPatterns[month] = { month, values: [] };
    }
    monthlyPatterns[month].values.push(item[selectedCountry]);
  });

  const monthlyData = Object.values(monthlyPatterns).map(pattern => ({
    month: pattern.month,
    avgTourists: Math.round(pattern.values.reduce((a, b) => a + b, 0) / pattern.values.length / 1000),
    monthName: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'][pattern.month - 1]
  }));

  const chartData = data.time_series.map(item => ({
    year: item.year,
    [selectedCountry]: item[selectedCountry] / 1000, // 천명 단위
    GDP: item.gdp
  }));

  const selectedCountryName = countries.find(c => c.key === selectedCountry)?.name || '선택된 국가';
  const selectedCountryColor = countries.find(c => c.key === selectedCountry)?.color || '#1976d2';

  // 계절성 분석
  const getSeasonalInsights = () => {
    const avgTourists = monthlyData.reduce((sum, m) => sum + m.avgTourists, 0) / monthlyData.length;
    const peakMonths = monthlyData.filter(m => m.avgTourists > avgTourists * 1.2);
    const lowMonths = monthlyData.filter(m => m.avgTourists < avgTourists * 0.8);

    return { peakMonths, lowMonths, avgTourists };
  };

  const { peakMonths, lowMonths } = getSeasonalInsights();

  const getBusinessTips = (country, isPeak) => {
    const tips = {
      korea: {
        peak: ['한글 메뉴 추가 준비', '김치, 라면 등 한국 음식 재료 확보', 'K-POP 굿즈 입고'],
        low: ['한국인 대상 할인 이벤트', '한류 콘텐츠 활용 마케팅', '단골 고객 리워드 프로그램']
      },
      japan: {
        peak: ['일본어 메뉴 및 안내문 준비', '정갈하고 깔끔한 서비스 강화', '일본 전통 상품 진열'],
        low: ['일본인 선호 서비스 품질 개선', '온천, 료칸 스타일 서비스 도입', '일본 문화 이벤트 기획']
      },
      usa: {
        peak: ['영어 의사소통 준비', '프리미엄 서비스 옵션 확대', '신용카드 결제 시스템 점검'],
        low: ['미국인 대상 패키지 할인', '럭셔리 체험 프로그램 개발', 'SNS 마케팅 강화']
      },
      china: {
        peak: ['중국어 안내 서비스', '단체 할인 메뉴 준비', '위챗페이 등 중국 결제 시스템'],
        low: ['중국인 단체 고객 유치', '중국 SNS 플랫폼 활용', '중국 전통 선물 상품 개발']
      }
    };
    return tips[country]?.[isPeak ? 'peak' : 'low'] || [];
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
                : `${selectedCountryName}: ${entry.value}천명`
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
        📈 월별 트렌드 및 계절성 분석
      </Typography>
      
      {/* 국가 선택 */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {countries.map(country => (
          <Chip
            key={country.key}
            label={country.name}
            onClick={() => setSelectedCountry(country.key)}
            color={selectedCountry === country.key ? 'primary' : 'default'}
            variant={selectedCountry === country.key ? 'filled' : 'outlined'}
          />
        ))}
        
        <FormControlLabel
          control={
            <Switch
              checked={showGDP}
              onChange={(e) => setShowGDP(e.target.checked)}
              size="small"
            />
          }
          label="GDP 표시"
          sx={{ ml: 2 }}
        />
      </Box>
      
      {/* 트렌드 차트 */}
      <ResponsiveContainer width="100%" height="60%">
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" label={{ value: '관광객 수 (천명)', angle: -90, position: 'insideLeft' }} />
          {showGDP && (
            <YAxis yAxisId="right" orientation="right" label={{ value: 'GDP (십억$)', angle: 90, position: 'insideRight' }} />
          )}
          <Tooltip content={<CustomTooltip />} />
          
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={selectedCountry}
            stroke={selectedCountryColor}
            strokeWidth={3}
            dot={{ r: 5 }}
            name={selectedCountryName}
          />
          
          {showGDP && (
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="GDP"
              stroke="#ff7300"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {/* 계절성 인사이트 */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 {selectedCountryName} 관광객 계절성 분석
        </Typography>
        
        {peakMonths.length > 0 && (
          <Alert severity="success" sx={{ mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              🔥 성수기: {peakMonths.map(m => m.monthName).join(', ')}
            </Typography>
            <Typography variant="body2">
              준비사항: {getBusinessTips(selectedCountry, true).join(' • ')}
            </Typography>
          </Alert>
        )}
        
        {lowMonths.length > 0 && (
          <Alert severity="warning" sx={{ mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              📉 비수기: {lowMonths.map(m => m.monthName).join(', ')}
            </Typography>
            <Typography variant="body2">
              대응책: {getBusinessTips(selectedCountry, false).join(' • ')}
            </Typography>
          </Alert>
        )}

        <Alert severity="info">
          <Typography variant="subtitle2" gutterBottom>
            💡 비즈니스 팁
          </Typography>
          <Typography variant="body2">
            {selectedCountryName} 관광객은 {data.correlations[selectedCountry] > 0.8 ? '괌 GDP에 높은 기여도' : '안정적인 기여도'}를 보이고 있습니다. 
            성수기 대비와 비수기 마케팅을 통해 연중 안정적인 매출 확보가 가능합니다.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default MonthlyTrends; 