import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { LanguageProvider } from './context/LanguageContext';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import DCACalculator from './pages/DCACalculator';

import InvestmentChat from './components/InvestmentChat';
import FloatingChat from './components/FloatingChat';
import './index.css';


function App() {
    return (
        <LanguageProvider>
            <PortfolioProvider>

                <Router>
                    <div className="app-layout">
                        <header className="app-header-full">
                            <Navigation />
                        </header>
                        <div className="app-container">
                            <main>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/dca" element={<DCACalculator />} />
                                    <Route path="/chat" element={<InvestmentChat />} />
                                </Routes>
                            </main>
                            <FloatingChat />
                        </div>
                    </div>
                </Router>

            </PortfolioProvider>
        </LanguageProvider>
    );
}

export default App;
