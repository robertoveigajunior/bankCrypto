import React, { createContext, useState, useContext, useEffect } from 'react';

interface ApiKeyContextType {
    geminiKey: string;
    setGeminiKey: (key: string) => void;
    hasKey: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [geminiKey, setGeminiKeyState] = useState('');

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setGeminiKeyState(storedKey);
        }
    }, []);

    const setGeminiKey = (key: string) => {
        setGeminiKeyState(key);
        if (key) {
            localStorage.setItem('gemini_api_key', key);
        } else {
            localStorage.removeItem('gemini_api_key');
        }
    };

    return (
        <ApiKeyContext.Provider value={{ geminiKey, setGeminiKey, hasKey: !!geminiKey }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = () => {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};
