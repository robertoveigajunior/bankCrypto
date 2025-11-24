import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { LanguageProvider } from './context/LanguageContext';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import DCACalculator from './pages/DCACalculator';
import InvestmentChat from './components/InvestmentChat';
import './index.css';

import { ApiKeyProvider } from './context/ApiKeyContext'; // Added import for ApiKeyProvider

function App() {
    return (
        <LanguageProvider>
            <PortfolioProvider>
                <ApiKeyProvider>
                    <Router>
                        <div className="app-container">
                            <header className="app-header">
                                <div className="hacker-banner">
                                    <div className="logo">BANK CRYPTO VAULT</div>
                                </div>
                                <Navigation />
                            </header>

                            <main>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/dca" element={<DCACalculator />} />
                                    <Route path="/chat" element={<InvestmentChat />} />
                                </Routes>
                            </main>
                        </div>
                    </Router>
                </ApiKeyProvider>
            </PortfolioProvider>
        </LanguageProvider>
    );
}

export default App;
