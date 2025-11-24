/// <reference types="cypress" />

describe('Dashboard Tests', () => {
    beforeEach(() => {
        // Bypass API Key Modal
        cy.visit('/');
        cy.get('body').then(($body) => {
            if ($body.find('input[placeholder="CG-..."]').length > 0) {
                cy.get('input[placeholder="CG-..."]').type('demo');
                cy.contains('Salvar').click();
            }
        });
    });

    it('should display Market News', () => {
        cy.contains('Dashboard').should('be.visible');
        // Check for "Market News" or "Notícias do Mercado" depending on language
        // Since default is likely English or we can check for the container
        cy.get('.glass-panel').contains(/Market News|Notícias do Mercado/i).should('be.visible');
    });

    it('should scroll to top when navigating', () => {
        // Ensure we are on Dashboard
        cy.contains('Dashboard').should('be.visible');

        // Force a very large height on the app container to ensure scrollability
        cy.get('.app-container').invoke('css', 'height', '3000px');

        // Scroll to bottom of window
        cy.scrollTo('bottom');

        // Verify we are not at the top
        cy.window().its('scrollY').should('be.gt', 0);

        // Navigate to DCA Calculator
        cy.contains('DCA Calculator').click();
        cy.contains('Calculadora DCA').should('be.visible');

        // Verify we are back at the top
        cy.window().its('scrollY').should('equal', 0);

        // Now test the return trip
        // Force height again on DCA page
        cy.get('.app-container').invoke('css', 'height', '3000px');
        cy.scrollTo('bottom');
        cy.window().its('scrollY').should('be.gt', 0);

        // Navigate back to Dashboard
        cy.contains('Dashboard').click();

        // Verify we are back at the top
        cy.window().its('scrollY').should('equal', 0);
    });
});
