import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box } from '@mui/material';
import Dashboard from './components/Dashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            align="center"
            color="primary"
          >
            🏪 괌 비즈니스 인사이트
          </Typography>
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom 
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            관광객 데이터 기반 현지 소상공인 맞춤 비즈니스 가이드
          </Typography>
          <Dashboard />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 