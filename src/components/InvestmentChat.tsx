import React, { useState, useEffect, useRef } from 'react';
import { generateChatResponse, createMessage, ChatMessage } from '../services/chatService';
import { fetchFearGreedIndex, getSentimentInfo } from '../services/marketSentiment';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n';

const InvestmentChat: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sentiment, setSentiment] = useState<{ value: number; label: string; color: string; emoji: string } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch sentiment on mount and when language changes
    useEffect(() => {
        const loadSentiment = async () => {
            try {
                const data = await fetchFearGreedIndex();
                const info = getSentimentInfo(data.value, t);
                setSentiment({
                    value: data.value,
                    label: info.label,
                    color: info.color,
                    emoji: info.emoji
                });
            } catch (error) {
                console.error('Error loading sentiment:', error);
            }
        };

        loadSentiment();
        // Update sentiment every 5 minutes
        const interval = setInterval(loadSentiment, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [t]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send welcome message on mount and when language changes
    useEffect(() => {
        const welcomeMessage = createMessage(
            t.responses.welcome,
            'bot'
        );
        setMessages([welcomeMessage]);
    }, [t]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        // Add user message
        const userMessage = createMessage(inputValue, 'user');
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            // Generate bot response
            const responseText = await generateChatResponse(inputValue, t);

            // Simulate typing delay
            setTimeout(() => {
                const botMessage = createMessage(responseText, 'bot');
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
            }, 800);
        } catch (error) {
            console.error('Error generating response:', error);
            const errorMessage = createMessage(
                t.responses.chatError,
                'bot'
            );
            setMessages(prev => [...prev, errorMessage]);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="investment-chat glass-panel">
            <div className="chat-header">
                <div className="chat-title">
                    <span className="chat-icon">💬</span>
                    <h3>{t.chat.title}</h3>
                    <span className="ai-model-badge">GPT-4</span>
                </div>
                <div className="chat-header-right">
                    <select
                        className="language-selector"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                    >
                        <option value="en">{t.languages.en}</option>
                        <option value="pt-BR">{t.languages['pt-BR']}</option>
                    </select>
                    {sentiment && (
                        <div className="sentiment-badge" style={{ backgroundColor: sentiment.color }}>
                            <span>{sentiment.emoji}</span>
                            <span className="sentiment-label">{sentiment.label}</span>
                            <span className="sentiment-value">{sentiment.value}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
                    >
                        <div className="message-content">
                            <div className="message-text">
                                {message.text.split('\n').map((line, i) => {
                                    // Parse markdown-style bold
                                    const parts = line.split(/(\*\*.*?\*\*)/g);
                                    return (
                                        <p key={i}>
                                            {parts.map((part, j) => {
                                                if (part.startsWith('**') && part.endsWith('**')) {
                                                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                                                }
                                                return <span key={j}>{part}</span>;
                                            })}
                                        </p>
                                    );
                                })}
                            </div>
                            <div className="message-time">{formatTime(message.timestamp)}</div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="chat-message bot-message">
                        <div className="message-content">
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
                <input
                    type="text"
                    className="chat-input"
                    placeholder={t.chat.placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isTyping}
                />
                <button
                    className="chat-send-button"
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                >
                    <span>📤</span>
                </button>
            </div>
        </div>
    );
};

export default InvestmentChat;
