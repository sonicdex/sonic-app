


describe('Liquidity: Create Liquidity Screen', () => {

    const color = 'rgb(240, 242, 244)'

    const buttonsValidations = [
        'Add Liquidity',
        'Select a Token',
        'Transaction Settings',
        'Slippage tolerance',
        'Auto'
    ]

    beforeEach(() => {
        cy.viewport('macbook-16')
        cy.visit('/')
        cy.get('[href="/liquidity"]').click();
        cy.contains('Create Position')
            .click()
    })

    it('Validates default values for Create Position screen', () => {

        for (let i = 0; i <= 1; i++) {
            cy.checkTextStyling(buttonsValidations[i], color)
        }

        //Click on back button
        cy.get('[class="chakra-button css-1mn89nx"]')
            .should('be.visible')
            .trigger('mouseover')
        cy.contains('Back')
            .should('be.visible')

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

    it('Validates Slippage Tolerance Popup and error and warning messages', () => {

        //Click on Slippage popup
        cy.get('[class="chakra-button chakra-menu__menu-button css-amln7a"]')
            .click()

        for (let i = 2; i <= 4; i++) {
            cy.checkTextStyling(buttonsValidations[i], color)
        }

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

    it('Validates Tokens selection', () => {
        //Click on the WICP token
        cy.contains('Select a Token')
            .click()
        cy.contains('XTC')
            .click()
        cy.get('[placeholder="0.00"]').eq(1)
            .type('1')
            .type('{BACKSPACE}')
            .type('2')
        cy.get('[placeholder="0.00"]').eq(2)
            .should('not.have.value', '0.00')
    })
})