import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, Translation, en, ptBR } from '../i18n';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translation;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'bankcrypto-language';

const getTranslation = (lang: Language): Translation => {
    switch (lang) {
        case 'pt-BR':
            return ptBR;
        default:
            return en;
    }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        // Try to get language from localStorage
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored && (stored === 'en' || stored === 'pt-BR')) {
            return stored as Language;
        }

        // Try to detect browser language
        const browserLang = navigator.language;
        if (browserLang.startsWith('pt')) return 'pt-BR';
        return 'en';
    });

    const [t, setT] = useState<Translation>(() => getTranslation(language));

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        setT(getTranslation(lang));
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    };

    useEffect(() => {
        setT(getTranslation(language));
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
