import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { PageTransition } from './components/transitions/PageTransition';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { NotificationSystem } from './components/notifications/NotificationSystem';
import { useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/config';

// Type fix for I18nextProvider
const I18nextProviderFixed = I18nextProvider as any;

const App: React.FC = () => {
  const location = useLocation();

  return (
    <Provider store={store}>
      <Suspense fallback={<div>Loading...</div>}>
        <I18nextProviderFixed i18n={i18n}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <NotificationSystem />
            <Box sx={{ display: 'flex', minHeight: '100vh' }}>
              <PageTransition location={location.pathname}>
                <Routes>
                  <Route path="/admin/*" element={<AdminDashboard />} />
                  {/* Add more routes here */}
                </Routes>
              </PageTransition>
            </Box>
          </ThemeProvider>
        </I18nextProviderFixed>
      </Suspense>
    </Provider>
  );
};

export default App;
