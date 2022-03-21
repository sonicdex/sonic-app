/// <reference types="cypress" />


describe('Liquidity Tab', () => {
    beforeEach(() => {
        cy.viewport('macbook-16')
        cy.visit('/')
        cy.get('[href="/liquidity"]').click();
        cy.contains('Create Position')
            .click()
    })
    it('Validates default valeus for Create Position screen', () => {

        //Click on back button
        cy.get('[class="chakra-button css-1mn89nx"]')
            .should('be.visible')
            .trigger('mouseover')
        cy.contains('Back')
            .should('be.visible')

        //Check text for Add Liquidity text    
        cy.checkTextStyling('Add Liquidity')

        //Check slippage tooltip
        cy.get('[class="chakra-button chakra-menu__menu-button css-amln7a"]').trigger('mouseover')
        cy.contains('Adjust the slippage').should('be.visible')

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

        //Check slippage tooltip
        cy.get('[class="chakra-button chakra-menu__menu-button css-amln7a"]').trigger('mouseover')
        cy.contains('Adjust the slippage').should('be.visible')
    })

    it('Validates back button', () => {
        //Click on Back button
        cy.get('[class="chakra-button css-1mn89nx"]')
            .click()
        cy.url().should('include', '/liquidity')
    })

    it('Validates Slippage Tolerance Popup', () => {
        //Check Slippage popup
        cy.get('[class="chakra-button chakra-menu__menu-button css-amln7a"]')
            .click()
        cy.get('[class="chakra-stack css-477b2e"]')
            .should('be.visible')

        cy.checkTextStyling('Transaction Settings')
        cy.checkTextStyling('Slippage tolerance')

        cy.checkTextStyling('Auto')
        cy.get('[class="chakra-input css-ew4oif"]')
            .should('have.attr', 'value', '0.50')
            .type('{BACKSPACE}')
            .type('{BACKSPACE}')
        cy.contains('Your slippage tolerance is set very low, the transaction may fail.')
            .should('be.visible')
            .should('have.css', 'color', 'rgb(214, 158, 46)')

        cy.get('[class="chakra-input css-1ukh290"]')
            .type('{BACKSPACE}')
            .type('90')
        cy.contains('Enter a valid slippage percentage (default: 0.5%)')
            .should('be.visible')
            .should('have.css', 'color', 'rgb(229, 62, 62)')
        cy.get('[class="chakra-input css-ew4oif"]')
            .type('{BACKSPACE}')
            .type('{BACKSPACE}')
            .type('{6}')

        cy.contains('Your slippage tolerance is set very high, the received amount of tokens may reduced because of it. Consider reducing it.')
            .should('be.visible')
            .should('have.css', 'color', 'rgb(214, 158, 46)')
        cy.get('[class="chakra-input css-1ukh290"]')
            .type('{BACKSPACE}')
            .type('5')
            .contains('Your slippage tolerance')
            .should('not.exist')
    })
    it('Validates Tokens fields', () => {
        //Click on the WICP token
        cy.contains('Select a Token')
            .click()
        cy.contains('XTC')
            .click()
        cy.contains('1 WICP =')
            .should('be.visible')
        cy.contains('1 XTC = 0.06 WICP')
            .should('be.visible')
        cy.get('[class="chakra-input css-t3mzb7"]').eq('0')
            .type('1')
        cy.wait(500)
        cy.get('[class="chakra-text css-0"]').eq('2').as('1WICP=XTC')
            .should('not.eq', '0.00')
            .should('be.visible')
        cy.get('[class="chakra-text css-0"]').eq('3').as('1XTC=WICP')
            .should('be.visible')
            .should('not.eq', '0.00')
        cy.get('[class="css-k008qs"]').first()
            .should('be.visible')
            .trigger('mouseover')

        cy.checkTextStyling('Transaction Details', 'rgba(255, 255, 255, 0.92)')
        cy.checkTextStyling('WICP Deposit Fee', 'rgba(255, 255, 255, 0.92)')
        cy.checkTextStyling('0 WICP', 'rgb(136, 142, 143)')
        cy.checkTextStyling('Cycles Deposit Fee', 'rgba(255, 255, 255, 0.92)')
        cy.checkTextStyling('0.004 XTC', 'rgba(255, 255, 255, 0.92)')

    })
})