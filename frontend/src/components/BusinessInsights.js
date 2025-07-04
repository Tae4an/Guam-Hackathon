import React, { useState } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  RestaurantMenu,
  ShoppingBag,
  Hotel,
  DirectionsCar,
  Language,
  Payment,
  TrendingUp,
  Warning,
  Lightbulb,
  ExpandMore,
  LocalOffer,
  Business
} from '@mui/icons-material';

const BusinessInsights = ({ rankings, correlations }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  if (!rankings || !correlations) return null;

  const countries = [
    { 
      key: 'Japan', 
      name: '일본', 
      flag: '🇯🇵', 
      traits: ['정갈함 선호', '품질 중시', '예약 문화', '현금 결제'],
      spending: 'middle-high',
      preferences: ['일본 음식', '온천/스파', '문화 체험', '쇼핑']
    },
    { 
      key: 'Korea', 
      name: '한국', 
      flag: '🇰🇷', 
      traits: ['SNS 활용', '한류 관심', '모바일 결제', '단체 여행'],
      spending: 'middle',
      preferences: ['K-Food', 'SNS 명소', '쇼핑', '액티비티']
    },
    { 
      key: 'USA', 
      name: '미국', 
      flag: '🇺🇸', 
      traits: ['개인주의', '편의성 중시', '카드 결제', '팁 문화'],
      spending: 'high',
      preferences: ['다양한 음식', '럭셔리 서비스', '프라이버시', '편의시설']
    },
    { 
      key: 'China', 
      name: '중국', 
      flag: '🇨🇳', 
      traits: ['단체 관광', '가성비 중시', '위챗페이', '중국어 선호'],
      spending: 'low-middle',
      preferences: ['중국 음식', '단체 할인', '가이드 투어', '기념품']
    }
  ];

  const businessTypes = [
    { 
      type: 'restaurant', 
      name: '식당/카페', 
      icon: <RestaurantMenu />,
      color: '#f44336'
    },
    { 
      type: 'retail', 
      name: '소매/쇼핑', 
      icon: <ShoppingBag />,
      color: '#2196f3'
    },
    { 
      type: 'accommodation', 
      name: '숙박업', 
      icon: <Hotel />,
      color: '#4caf50'
    },
    { 
      type: 'transport', 
      name: '교통/투어', 
      icon: <DirectionsCar />,
      color: '#ff9800'
    }
  ];

  const getTopCountries = () => {
    return rankings.rankings
      .sort((a, b) => b.total_economic_impact - a.total_economic_impact)
      .slice(0, 3);
  };

  const getCountryRecommendations = (countryKey, businessType) => {
    const recommendations = {
      Japan: {
        restaurant: [
          '일본어 메뉴판 준비 (로마자 병기)',
          '정갈하고 깔끔한 플레이팅',
          '예약 시스템 도입',
          '일본식 서비스 매너 교육'
        ],
        retail: [
          '일본 브랜드 상품 진열',
          '포장 서비스 강화',
          '신용카드 결제 시스템',
          '일본어 안내문 비치'
        ],
        accommodation: [
          '일본식 실내화 제공',
          '온천/목욕 시설 강조',
          '조용한 환경 유지',
          '일본 TV 채널 제공'
        ],
        transport: [
          '시간 준수 철저',
          '깔끔한 차량 관리',
          '일본어 가이드 배치',
          '문화재 투어 상품'
        ]
      },
      Korea: {
        restaurant: [
          '한글 메뉴판 및 K-Food 메뉴',
          'SNS 촬영 스팟 마련',
          '카카오페이 결제 지원',
          '한류 관련 BGM 재생'
        ],
        retail: [
          'K-POP/드라마 굿즈 판매',
          '한국 화장품 브랜드 입고',
          '포토존 설치',
          '모바일 결제 시스템'
        ],
        accommodation: [
          '한국 드라마 시청 가능',
          '한국식 어메니티 제공',
          'WiFi 속도 최적화',
          '늦은 체크인 허용'
        ],
        transport: [
          'SNS 명소 투어',
          '한국어 가이드 서비스',
          '셀카/인증샷 도움',
          'K-POP 관련 장소 투어'
        ]
      },
      USA: {
        restaurant: [
          '영어 메뉴 및 직원 교육',
          '다양한 식단 옵션 제공',
          '신용카드 결제 필수',
          '팁 시스템 안내'
        ],
        retail: [
          '고급 브랜드 상품 진열',
          '개별 맞춤 서비스',
          '환불/교환 정책 명시',
          '면세 쇼핑 안내'
        ],
        accommodation: [
          '개인 프라이버시 보장',
          '24시간 서비스',
          '고급 어메니티 제공',
          '컨시어지 서비스'
        ],
        transport: [
          '개인 맞춤 투어',
          '럭셔리 차량 서비스',
          '유연한 일정 조정',
          '프리미엄 패키지'
        ]
      },
      China: {
        restaurant: [
          '중국어 메뉴판 준비',
          '단체 할인 메뉴 제공',
          '위챗페이 결제 지원',
          '중국식 차 서비스'
        ],
        retail: [
          '단체 구매 할인',
          '중국어 안내 서비스',
          '대량 구매 포장',
          '중국 전통 선물 상품'
        ],
        accommodation: [
          '단체 예약 시스템',
          '중국 TV 채널',
          '중국어 안내 서비스',
          '그룹 활동 공간'
        ],
        transport: [
          '단체 투어 패키지',
          '중국어 가이드',
          '쇼핑몰 위주 투어',
          '사진 촬영 서비스'
        ]
      }
    };

    return recommendations[countryKey]?.[businessType] || [];
  };

  const getCurrentAlerts = () => {
    const currentData = correlations.time_series[correlations.time_series.length - 1];
    const previousData = correlations.time_series[correlations.time_series.length - 2];
    
    const alerts = [];
    
    ['japan', 'korea', 'usa', 'china'].forEach(country => {
      const current = currentData[country];
      const previous = previousData[country];
      const change = ((current - previous) / previous * 100).toFixed(1);
      
      if (Math.abs(change) > 10) {
        alerts.push({
          country: country,
          change: change,
          type: change > 0 ? 'increase' : 'decrease'
        });
      }
    });
    
    return alerts;
  };

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom color="primary">
        💼 비즈니스 인사이트 & 액션 가이드
      </Typography>

      {/* 즉시 대응 알림 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🚨 즉시 대응 필요
        </Typography>
        {getCurrentAlerts().map((alert, index) => {
          const country = countries.find(c => c.key.toLowerCase() === alert.country);
          return (
            <Alert 
              key={index}
              severity={alert.type === 'increase' ? 'success' : 'warning'}
              sx={{ mb: 1 }}
            >
              {country?.flag} {country?.name} 관광객 {alert.type === 'increase' ? '급증' : '급감'} 
              ({alert.change > 0 ? '+' : ''}{alert.change}%) - 
              {alert.type === 'increase' ? '재고 확보 및 서비스 준비 필요' : '마케팅 강화 및 할인 이벤트 고려'}
            </Alert>
          );
        })}
      </Box>

      {/* TOP 3 국가 포커스 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🎯 집중 타겟 국가 (GDP 기여도 기준)
        </Typography>
        <Grid container spacing={2}>
          {getTopCountries().map((country, index) => {
            const countryInfo = countries.find(c => c.key === country.country);
            return (
              <Grid item xs={12} md={4} key={country.country}>
                <Card sx={{ height: '100%', bgcolor: index === 0 ? '#fff3e0' : 'inherit' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6">
                        {countryInfo?.flag} {countryInfo?.name}
                      </Typography>
                      {index === 0 && <Chip label="최우선" color="warning" size="small" />}
                    </Box>
                    
                    <Typography variant="h5" color="primary" sx={{ my: 1 }}>
                      ${country.total_economic_impact}M
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      관광객: {(country.avg_tourists / 1000).toFixed(0)}K명
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      {countryInfo?.traits.map((trait, i) => (
                        <Chip key={i} label={trait} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* 업종별 가이드 */}
      <Box>
        <Typography variant="h6" gutterBottom>
          🏪 업종별 맞춤 가이드
        </Typography>
        
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)} sx={{ mb: 2 }}>
          {businessTypes.map((type, index) => (
            <Tab 
              key={type.type} 
              label={
                <Box display="flex" alignItems="center">
                  {type.icon}
                  <Typography sx={{ ml: 1 }}>{type.name}</Typography>
                </Box>
              }
            />
          ))}
        </Tabs>

        {businessTypes.map((businessType, index) => (
          <TabPanel key={businessType.type} value={selectedTab} index={index}>
            <Grid container spacing={3}>
              {getTopCountries().map((country) => {
                const countryInfo = countries.find(c => c.key === country.country);
                const recommendations = getCountryRecommendations(country.country, businessType.type);
                
                return (
                  <Grid item xs={12} md={6} key={country.country}>
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box display="flex" alignItems="center">
                          <Typography variant="h6" sx={{ mr: 1 }}>
                            {countryInfo?.flag}
                          </Typography>
                          <Typography variant="h6">
                            {countryInfo?.name} 타겟 전략
                          </Typography>
                          <Chip 
                            label={`$${country.total_economic_impact}M`} 
                            size="small" 
                            sx={{ ml: 'auto' }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List dense>
                          {recommendations.map((rec, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <Lightbulb color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={rec} />
                            </ListItem>
                          ))}
                        </List>
                        
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            선호 서비스:
                          </Typography>
                          <Box>
                            {countryInfo?.preferences.map((pref, i) => (
                              <Chip 
                                key={i} 
                                label={pref} 
                                size="small" 
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                );
              })}
            </Grid>
          </TabPanel>
        ))}
      </Box>
    </Box>
  );
};

export default BusinessInsights; 