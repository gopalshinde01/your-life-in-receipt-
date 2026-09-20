import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import './styles/index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to locate root HTML container element');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary
      fallbackTitle="Application Initialization Error"
      fallbackMessage="An unexpected error occurred while loading the application. Click below to reload or reset state safely."
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
