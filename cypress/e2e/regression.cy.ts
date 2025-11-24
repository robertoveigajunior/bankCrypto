/// <reference types="cypress" />
describe('Bank Crypto Regression Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        // Handle API Key Modal
        cy.get('input[placeholder="CG-..."]').should('be.visible').type('CG-DEMO');
        cy.contains('button', 'Salvar').click();
    });

    it('should load the application and display the title', () => {
        cy.title().should('eq', 'Bank Crypto');
        cy.contains('CryptoFolio').should('be.visible');
    });

    it('should add and remove a crypto asset', () => {
        // Add Asset
        const symbol = 'ETH';
        const quantity = '1.5';

        cy.get('input[placeholder="BTC"]').clear().type(symbol);
        cy.get('input[placeholder="0.00"]').type(quantity);
        cy.contains('button', 'Add Asset').click();

        // Verify Asset Added
        cy.contains('.holding-item', symbol).should('be.visible');
        cy.contains('.holding-item', quantity).should('be.visible');

        // Remove Asset
        cy.contains('.holding-item', symbol).find('.btn-delete').click();

        // Verify Asset Removed
        cy.contains('.holding-item', symbol).should('not.exist');
    });

    it('should switch languages', () => {
        // Initial state (assuming PT-BR or EN, let's check for one and switch)
        // The app seems to default to one. Let's try switching to EN.

        cy.get('.currency-toggle button').contains('USD').click();
        cy.get('.currency-toggle button').contains('USD').should('have.class', 'active');

        // Switch Language to EN
        cy.get('.language-selector').select('en');
        cy.contains('Investment Advisor').should('be.visible'); // Check for English text

        // Switch Language to PT-BR
        cy.get('.language-selector').select('pt-BR');
        cy.contains('Consultor de Investimentos').should('be.visible'); // Check for Portuguese text
    });

    it('should display the chat feature and allow typing', () => {
        cy.get('.investment-chat').should('be.visible');
        cy.get('.chat-input').should('be.visible').type('Hello');
        cy.get('.chat-input').should('have.value', 'Hello');
    });
});
