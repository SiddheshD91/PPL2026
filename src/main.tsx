import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import SetupCheck from './components/SetupCheck/SetupCheck'

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <ErrorBoundary>
      <SetupCheck>
        <App />
      </SetupCheck>
    </ErrorBoundary>
  </StrictMode>,
)
