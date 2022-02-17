/// <reference types="cypress" />

describe('Swap screen', () => {
    beforeEach(() => {
        cy.visit('https://2aoj2-aaaaa-aaaad-qa4qq-cai.ic.fleek.co/')
    })
    it('Validates default values for Swap screen', () => {
        //Swap header
        cy.get('[class="css-10lj575"]')
            .should('be.visible')
            .should('have.text', 'Swap')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(240, 242, 244)')
        //Slippage Tolerance    
        cy.get('[id="menu-button-31"]')
            .should('be.visible')
        //Tokens Balance
        cy.contains('Balance: 0 ICP')
            .should('be.visible')
        //Token value-A
        cy.get('[class="chakra-skeleton css-2si88d"] input').first()
            .should('have.attr', 'placeholder', '0.00')
            .should('be.visible')
        //Token B 
        cy.contains('Select a Token')
            .should('be.visible')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(240, 242, 244)')
            .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        cy.get('[class="chakra-skeleton css-2si88d"] input').last()
            .should('have.attr', 'placeholder', '0.00')
            .should('be.visible')
        cy.contains('(0%)')
            .should('be.visible')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(158, 165, 172)')
        cy.contains('Keep tokens in Sonic after swap')
            .should('be.visible')
            .should('have.css', 'color', 'rgb(255, 255, 255)')
        //Install Plug    
        cy.contains('Install Plug').last()
            .should('be.visible')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(255, 255, 255)')
        //"i" of information
        cy.get('[class="chakra-icon css-a8cgcw"]').trigger('mouseover')
        cy.contains('Keeping tokens in Sonic (instead of withdrawing to Plug) is good for high frequency trading where a few extra seconds matter a lot. By doing this, you can skip the deposit step on your next trades and save 2-3 seconds each time. Learn More.')
            .should('be.visible')
            .should('have.css', 'color', 'rgba(255, 255, 255, 0.92)')
        cy.contains('Learn More')
            .click()
        cy.url().should('eq', 'https://docs.sonic.ooo/product/assets#keeping-assets-in-sonic-after-a-swap')
    })

    it('Validates Token A is not listed in Token B options ', () => {
        //For ICP
        cy.contains('Select a Token')
            .click()
        cy.get('[class="chakra-text css-5qgpmt"]').then((list) => {
            expect(list[0]).to.contain('WICP')
            expect(list[1]).to.contain('XTC')
        })
        cy.get('ICP').should('not.exist')
        cy.closeTokensPopup()
        //For XTC
        cy.openTokensPopup()
        cy.contains('XTC')
            .click()
        cy.contains('Select a Token')
            .click()
        cy.contains('WICP')
            .should('be.visible')
        cy.get('ICP').should('not.exist')
        cy.get('XTC').should('not.exist')
        cy.closeTokensPopup()
        //For WICP
        cy.openTokensPopup('XTC')
        cy.contains('WICP')
            .click()
        cy.contains('Select a Token')
            .click()
        cy.get('[class="chakra-text css-5qgpmt"]').then((list) => {
            expect(list[0]).to.contain('ICP')
            expect(list[1]).to.contain('XTC')
        })
        cy.get('WICP').should('not.exist')
        cy.closeTokensPopup()
    })
})