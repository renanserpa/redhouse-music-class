import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './contexts/AppContext';

// Cache Reset Logic
const APP_VERSION = '1.1.0';
const savedVersion = localStorage.getItem('rh_app_version');

if (!savedVersion || savedVersion < APP_VERSION) {
  localStorage.removeItem('rh_nav_config');
  localStorage.removeItem('rh_feature_toggles');
  localStorage.setItem('rh_app_version', APP_VERSION);
  // Reload once to apply changes
  window.location.reload();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
);
