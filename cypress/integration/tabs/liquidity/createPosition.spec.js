/// <reference types="cypress" />


describe('Liquidity Tab', () => {
    beforeEach(() => {
        cy.visit('https://2aoj2-aaaaa-aaaad-qa4qq-cai.ic.fleek.co/')
        cy.get('[href="/liquidity"]').click();
        cy.contains('Create Position')
            .click()
    })
    it('Validates default screen', () => {
        //Check text for Add Liquidity text    
        cy.checkTextStyling('Add Liquidity')

        cy.contains('WICP')
            .should('be.visible')
        cy.contains('Balance: 0 WICP')
            .should('be.visible')

        //Check placeholder
        cy.get('[class="chakra-skeleton css-2si88d"] input').then((list) => {
            expect(list[0]).to.have.property('placeholder').eq('0.00')
            expect(list[1]).to.have.property('placeholder').eq('0.00')
        })
        //Check text for Select a Token    
        cy.checkTextStyling('Select a Token')
    })



    it('Validates buttons', () => {
        //Click on back button
        cy.get('[class="chakra-button css-1mn89nx"]')
            .click()
        cy.url().should('include', 'liquidity')
        cy.contains('Create Position')
            .click()
        // //Click on Slippage button
        // cy.get('[class="chakra-button chakra-menu__menu-button css-amln7a"]')
        //     .click()
        // cy.get('[class="chakra-stack css-477b2e"]')
        //     .should('be.visible')
    })
})