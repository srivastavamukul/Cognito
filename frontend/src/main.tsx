import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const domain = import.meta.env.VITE_AUTH0_DOMAIN || 'dev-q42vneml3qho4xpf.us.auth0.com';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '0cUXfIspLNeFB1n7ChCwemjzdLo9jXSI';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container not found');
}

createRoot(container).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin + '/dashboard',
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
