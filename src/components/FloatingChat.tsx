import React, { useState } from 'react';
import InvestmentChat from './InvestmentChat';
import { useLanguage } from '../context/LanguageContext';

const FloatingChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="floating-chat-container">
            {isOpen && (
                <div className="chat-window glass-panel">
                    <div className="chat-window-header">
                        <button className="close-chat-btn" onClick={toggleChat}>
                            ✕
                        </button>
                    </div>
                    <InvestmentChat />
                </div>
            )}

            {!isOpen && (
                <div className="chat-fab-wrapper">
                    <div className="chat-label">Start Chat</div>
                    <button className="chat-fab" onClick={toggleChat} title={t.chat.title}>
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        </svg>
                        <span className="notification-dot"></span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default FloatingChat;
