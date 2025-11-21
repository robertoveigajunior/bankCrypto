import React, { useState, useEffect, useRef } from 'react';
import { generateChatResponse, createMessage, ChatMessage } from '../services/chatService';
import { fetchFearGreedIndex, getSentimentInfo, fetchFearGreedHistory } from '../services/marketSentiment';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InvestmentChat: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sentiment, setSentiment] = useState<{ value: number; label: string; color: string; emoji: string } | null>(null);
    const [fearGreedHistory, setFearGreedHistory] = useState<number[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
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

    useEffect(() => {
        if (messages[messages.length-1]?.text.includes('Medo Extremo')) {
            setHistoryLoading(true);
            fetchFearGreedHistory().then(data => {
                setFearGreedHistory(data);
                setHistoryLoading(false);
            });
        }
    }, [messages]);

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

    // Função para analisar se há oportunidade de compra baseada no histórico do índice
    function getBuyOpportunity(history: number[]): string | null {
        if (history.length < 3) return null;
        // Se os últimos 3 dias estão em "medo" ou "medo extremo", sugere oportunidade
        const last3 = history.slice(-3);
        const isFear = last3.every(v => v <= 40);
        if (isFear) {
            return 'O mercado está em medo ou medo extremo há vários dias. Isso pode indicar uma boa oportunidade de compra para quem pensa em alta no longo prazo (estratégia de acumulação). Considere estudar aportes regulares (DCA) enquanto o sentimento permanece negativo.';
        }
        return null;
    }

    const handleNewChat = () => {
        const welcomeMessage = createMessage(
            t.responses.welcome,
            'bot'
        );
        setMessages([welcomeMessage]);
    };

    return (
        <div className="investment-chat glass-panel">
            <div className="chat-header">
                <div className="chat-title">
                    <span className="chat-icon">💬</span>
                    <h3>{t.chat.title}</h3>
                </div>
                <button onClick={handleNewChat} style={{marginLeft: 'auto', marginRight: 10, background: '#222', color: '#00ff88', border: '1px solid #00ff88', borderRadius: 6, padding: '4px 16px', cursor: 'pointer', fontWeight: 600, fontSize: 14}}>
                    Novo Chat
                </button>
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

                {messages[messages.length-1]?.text.includes('Medo Extremo') && fearGreedHistory.length > 0 && (
                    <div style={{margin: '24px 0'}}>
                        <h4>Histórico do Índice de Medo & Ganância</h4>
                        <div style={{display: 'flex', gap: 4, alignItems: 'flex-end', height: 40, margin: '12px 0'}}>
                            {fearGreedHistory.map((val, i) => {
                                let color = '';
                                if (val <= 20) color = '#ff4444';
                                else if (val <= 40) color = '#ffbb44';
                                else if (val <= 60) color = '#ffee44';
                                else if (val <= 80) color = '#88ff44';
                                else color = '#22cc44';
                                return (
                                    <div key={i} style={{
                                        width: 32,
                                        height: 32,
                                        background: color,
                                        borderRadius: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        color: '#222',
                                        fontSize: 14,
                                        boxShadow: '0 1px 4px #0002',
                                        border: '1px solid #fff3',
                                        flexDirection: 'column',
                                        transition: 'background 0.3s'
                                    }} title={`Índice: ${val}`}>
                                        {val}
                                    </div>
                                );
                            })}
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:12, color:'#aaa'}}>
                            <span>Mín: {Math.min(...fearGreedHistory)}</span>
                            <span>Máx: {Math.max(...fearGreedHistory)}</span>
                        </div>
                        <div style={{fontSize:12, marginTop:4, color:'#888'}}>
                            <span style={{color:'#22cc44'}}>Verde = Bom momento para comprar</span> &nbsp;|&nbsp; <span style={{color:'#ff4444'}}>Vermelho = Não é um bom momento</span>
                        </div>
                        {/* Oportunidade de compra baseada no histórico */}
                        {getBuyOpportunity(fearGreedHistory) && (
                            <div style={{marginTop:12, background:'#222', color:'#fff', padding:12, borderRadius:8, fontSize:14, border:'1px solid #00ff88'}}>
                                <b>Oportunidade de Compra:</b> {getBuyOpportunity(fearGreedHistory)}
                            </div>
                        )}
                    </div>
                )}

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
