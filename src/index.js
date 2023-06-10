import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import Error from './pages/Error';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary fallback={<Error/>}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

