import React, { useState, useEffect } from 'react';
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

const BusinessInsights = ({ viewMode = 'yearly' }) => {
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        // 실제 API 호출 대신 모의 데이터 사용
        const mockData = {
          yearly: {
            trending_countries: ['Japan', 'Korea', 'Philippines'],
            peak_months: ['March', 'July', 'December'],
            business_opportunities: [
              {
                category: 'restaurant',
                priority: 'high',
                title: '일식 & 한식 레스토랑 수요 증가',
                description: '일본과 한국 관광객 급증으로 현지 음식 수요 급상승',
                actions: ['일본어/한국어 메뉴 준비', '현지 음식 메뉴 추가', '할랄 옵션 검토']
              },
              {
                category: 'accommodation',
                priority: 'high',
                title: '중급 호텔/펜션 예약 급증',
                description: '가족 단위 여행객 증가로 중간 가격대 숙박 시설 선호',
                actions: ['패밀리룸 준비', '조식 서비스 강화', '픽업 서비스 제공']
              },
              {
                category: 'retail',
                priority: 'medium',
                title: '기념품 & 현지 특산품 판매 기회',
                description: '관광객들의 쇼핑 패턴 분석 결과 현지 특산품 선호도 높음',
                actions: ['괌 특산품 진열', '면세점 연계', '온라인 배송 서비스']
              }
            ]
          },
          monthly: {
            current_trends: ['성수기 준비', '계절성 메뉴', '프로모션 기획'],
            seasonal_tips: [
              '3월: 봄 휴가 시즌 - 가족 여행객 타겟',
              '7월: 여름 성수기 - 액티비티 상품 강화',
              '12월: 연말 휴가 - 커플 및 허니문 타겟'
            ],
            immediate_actions: [
              '이번 주 예약 현황 점검',
              '직원 교육 및 서비스 점검',
              '재고 및 메뉴 최적화'
            ]
          }
        };
        
        await new Promise(resolve => setTimeout(resolve, 800));
        setInsightsData(mockData);
      } catch (error) {
        console.error('인사이트 데이터 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [viewMode]);

  const getBusinessIcon = (category) => {
    switch (category) {
      case 'restaurant': return <RestaurantMenu />;
      case 'accommodation': return <Hotel />;
      case 'retail': return <ShoppingBag />;
      case 'transport': return <DirectionsCar />;
      default: return <Business />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return <Box sx={{ p: 2, textAlign: 'center' }}>인사이트 분석 중...</Box>;
  }

  if (!insightsData) {
    return <Box sx={{ p: 2, textAlign: 'center' }}>데이터를 불러올 수 없습니다.</Box>;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
        💡 비즈니스 인사이트
        <Chip 
          label={viewMode === 'yearly' ? '장기 전략' : '단기 액션'} 
          size="small" 
          color="secondary" 
          sx={{ ml: 2 }} 
        />
      </Typography>

      {viewMode === 'yearly' ? (
        <Box>
          {/* 연간 트렌드 요약 */}
          <Alert severity="info" sx={{ mb: 3 }}>
            📈 <strong>2024년 주요 트렌드:</strong> {insightsData.yearly.trending_countries.join(', ')} 
            관광객 증가, 성수기는 {insightsData.yearly.peak_months.join(', ')}
          </Alert>

          {/* 비즈니스 기회 */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            🎯 주요 비즈니스 기회
          </Typography>

          {insightsData.yearly.business_opportunities.map((opportunity, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {getBusinessIcon(opportunity.category)}
                  <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>
                    {opportunity.title}
                  </Typography>
                  <Chip 
                    label={opportunity.priority.toUpperCase()} 
                    color={getPriorityColor(opportunity.priority)}
                    size="small"
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {opportunity.description}
                </Typography>
                
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                  추천 액션 플랜:
                </Typography>
                
                <List dense>
                  {opportunity.actions.map((action, actionIndex) => (
                    <ListItem key={actionIndex} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <TrendingUp />
                      </ListItemIcon>
                      <ListItemText primary={action} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ) : (
        <Box>
          {/* 월별 현황 */}
          <Grid container spacing={3}>
            {/* 이번 달 주요 트렌드 */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📊 이번 달 주요 트렌드
                  </Typography>
                  {insightsData.monthly.current_trends.map((trend, index) => (
                    <Chip 
                      key={index}
                      label={trend} 
                      variant="outlined" 
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* 계절별 팁 */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🌟 계절별 마케팅 팁
                  </Typography>
                  <List dense>
                    {insightsData.monthly.seasonal_tips.map((tip, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <Language />
                        </ListItemIcon>
                        <ListItemText 
                          primary={tip}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* 즉시 실행 가능한 액션 */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ⚡ 이번 주 즉시 실행 액션
                  </Typography>
                  <Grid container spacing={2}>
                    {insightsData.monthly.immediate_actions.map((action, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Box sx={{ 
                          p: 2, 
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: 1,
                          textAlign: 'center',
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }}>
                          <Typography variant="body1" fontWeight="bold">
                            {action}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* 월별 특별 알림 */}
          <Alert severity="warning" sx={{ mt: 3 }}>
            🔔 <strong>이번 달 특별 주의사항:</strong> 성수기 진입으로 인한 예약 증가 예상. 
            직원 스케줄 및 재고 관리에 특별한 주의가 필요합니다.
          </Alert>
        </Box>
      )}

      {/* 공통 하단 정보 */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          📞 추가 지원 서비스
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • 관광청 비즈니스 상담: (671) 646-5278<br/>
          • 마케팅 지원 프로그램: visitguam.com/business<br/>
          • 언어 서비스 지원: translate.guam.gov
        </Typography>
      </Box>
    </Box>
  );
};

export default BusinessInsights; 