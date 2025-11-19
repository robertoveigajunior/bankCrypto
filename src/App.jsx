import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <PortfolioProvider>
      <div className="app-container">
        <Dashboard />
      </div>
    </PortfolioProvider>
  );
}

export default App;
