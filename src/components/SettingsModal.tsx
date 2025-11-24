import React, { useState, useEffect } from 'react';
import { useApiKey } from '../context/ApiKeyContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { geminiKey, setGeminiKey } = useApiKey();
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (isOpen) {
            setInputValue(geminiKey);
        }
    }, [isOpen, geminiKey]);

    if (!isOpen) return null;

    const handleSave = () => {
        setGeminiKey(inputValue);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass-panel" style={{ width: '400px', maxWidth: '90%' }}>
                <h2 style={{ marginTop: 0, color: '#00ff88' }}>Settings</h2>

                <div className="form-group">
                    <label>Gemini API Key (Optional)</label>
                    <input
                        type="password"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter your Gemini API Key"
                    />
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        Leave empty to use the default rule-based chat.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '10px',
                            background: 'transparent',
                            border: '1px solid #444',
                            color: '#fff',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn-primary"
                        style={{ flex: 1 }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
