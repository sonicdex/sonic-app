/// <reference types="cypress" />

describe('Swap screen', () => {

    const color = 'rgb(240, 242, 244)'
    beforeEach(() => {
        cy.visit('/')
    })

    it('Validates default values for Swap screen', () => {

        //Tokens Balance
        cy.contains('Balance: 0 ICP')
            .should('be.visible')
        //Token value-A
        cy.get('[placeholder="0.00"]').eq(1)
            .should('have.attr', 'placeholder', '0.00')
            .should('be.visible')
        //Token B 
        cy.checkTextStyling('Select a Token', color)

        //Token value-A
        cy.get('[placeholder="0.00"]').eq(2)
            .should('have.attr', 'placeholder', '0.00')
            .should('be.visible')
    })

    it('Validates "i" text message in the Swap screen', () => {
        //"i" of information
        cy.get('[aria-haspopup="dialog"]').last()
            .trigger('mouseover')
        cy.contains('Keeping tokens in Sonic (instead of withdrawing to Plug) is good for high frequency trading where a few extra seconds matter a lot. By doing this, you can skip the deposit step on your next trades and save 2-3 seconds each time. Learn More.')
            .should('be.visible')
            .should('have.css', 'color', 'rgba(255, 255, 255, 0.92)')
        cy.contains('Learn More')
            .invoke('removeAttr', 'target')
            .click()

        cy.fixture('/urls.json').then((url) => {
            cy.url().should('contain', url.swapLearnMode)
        })

    })

})