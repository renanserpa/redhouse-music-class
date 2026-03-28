import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Router from './Router';
import './index.css';
import { AppProvider } from './contexts/AppContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <Router />
    </AppProvider>
  </StrictMode>,
);
