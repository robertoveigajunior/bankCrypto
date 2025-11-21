export { en } from './locales/en';
export { ptBR } from './locales/pt-BR';

export type { Translation } from './locales/en';

export type Language = 'en' | 'pt-BR';

export const translations = {
    en: () => import('./locales/en').then(m => m.en),
    'pt-BR': () => import('./locales/pt-BR').then(m => m.ptBR)
};
