import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';
import AnimatedLogo from './AnimatedLogo';

const Navigation: React.FC = () => {
    const { t } = useLanguage();
    const { currency, setCurrency } = usePortfolio();

    return (
        <nav className="navigation">
            <div className="nav-logo">
                <AnimatedLogo />
            </div>
            <div className="nav-links">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">📊</span>
                    {t.nav.dashboard}
                </NavLink>
                <NavLink to="/dca" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">💰</span>
                    {t.nav.dca}
                </NavLink>
                <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">💬</span>
                    {t.nav.chat}
                </NavLink>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div className="currency-toggle" style={{ position: 'static', margin: 0 }}>
                    <button
                        className={currency === 'USD' ? 'active' : ''}
                        onClick={() => setCurrency('USD')}
                    >
                        USD
                    </button>
                    <button
                        className={currency === 'BRL' ? 'active' : ''}
                        onClick={() => setCurrency('BRL')}
                    >
                        BRL
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
