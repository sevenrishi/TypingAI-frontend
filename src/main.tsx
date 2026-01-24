import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { store } from './store';
import SocketProvider from './providers/SocketProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { loadUser } from './features/auth/authSlice';
import { fetchProfile } from './features/user/profileSlice';

// on startup, if token exists, attempt to load user and profile
const token = localStorage.getItem('token');
if (token) {
  store.dispatch(loadUser() as any).then(() => {
    store.dispatch(fetchProfile() as any);
  }).catch(() => {
    // ignore
  });
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <SocketProvider>
            <App />
          </SocketProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
