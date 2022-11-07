

describe('Liquidity: Liquidity Screen', () => {

    const color = 'rgb(240, 242, 244)'

    const buttonsValidations = [
        'Your Liquidity Position',
        'Create Position'
    ]

    beforeEach(() => {
        cy.visit('/')
        cy.get('[href="/liquidity"]').click()
    })

    it('Validates info message', () => {
        cy.contains('Liquidity Provider Rewards')
            .should('be.visible')
        cy.contains('Liquidity providers earn a 0.3% ')
            .should('be.visible')
        //Close button
        cy.get('[class="chakra-icon css-onkibi"]')
            .should('be.visible')
            .click()
        cy.contains('Liquidity Provider Rewards')
            .should('not.exist')
    })

    it('Validates button css values in Liquidity default screen', () => {
        for (let i = 0; i <= 1; i++) {
            cy.checkTextStyling(buttonsValidations[i], color)
        }
    })

    it('Validates liquidity default body - Header', () => {
        cy.contains('Your liquidity positions will appear here.')
            .should('be.visible')
            .should('have.css', 'color', 'rgb(104, 114, 125)')
            .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(104, 114, 125)')
    })

    it('Validates redirection for Review our Document hyperlink', () => {
        cy.contains('review our documentation')
            .click()
        cy.contains('While you are providing liquidity to a Sonic pool, you earn your share of the 0.3% that users pay for each swap that they make.', { timeout: 120000 })
            .should('be.visible')
    })

})
