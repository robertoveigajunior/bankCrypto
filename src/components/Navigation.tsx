import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { usePortfolio } from '../context/PortfolioContext';
import AnimatedLogo from './AnimatedLogo';
import SettingsModal from './SettingsModal';

const Navigation: React.FC = () => {
    const { t } = useLanguage();
    const { currency, setCurrency } = usePortfolio();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            <nav className="navigation glass-panel">
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
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        style={{
                            background: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#888',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Settings"
                    >
                        ⚙️
                    </button>
                </div>
            </nav>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
};

export default Navigation;
