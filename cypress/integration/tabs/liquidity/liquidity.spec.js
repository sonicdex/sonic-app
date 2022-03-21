/// <reference types="cypress" />

describe('Liquidity Tab', () => {
    before(() => {
        cy.visit('/')
        cy.get('[href="/liquidity"]').click();
    })
    it('Validates info message', () => {
        cy.contains('Liquidity Provider Rewards')
            .should('be.visible')
        cy.contains('Liquidity providers earn a 0.3% ')
            .should('be.visible')
        cy.get('[class="chakra-icon css-onkibi"]')
            .should('be.visible')
            .click()
        cy.contains('Liquidity Provider Rewards')
            .should('not.exist')
    })
    it('Validates liquidity default screen - Header', () => {
        cy.checkTextStyling('Your Liquidity Position')
        cy.checkTextStyling('Create Position')
    })
    it('Validates liquidity default body - Header', () => {
        cy.get('[class="css-1ppz6m1"]')
            .should('be.visible')
        cy.contains('Your liquidity positions will appear here.')
            .should('be.visible')
            .should('have.css', 'color', 'rgb(104, 114, 125)')
            .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(104, 114, 125)')
        cy.get('[class="chakra-button css-107hr65"]')
            .should('be.visible')
    })

})

describe('Liquidity-redirection', () => {
    before(() => {
        cy.visit('/')
        cy.get('[href="/liquidity"]').click();
    })

    it('Validates redirection', () => {
        cy.contains('review our documentation')
            .click()
        cy.url().should('include', 'https://docs.sonic.ooo/product/adding-liquidity/claiming-your-rewards')
    })

})