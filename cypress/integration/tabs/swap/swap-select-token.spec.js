/// <reference types="cypress" />

describe('Swap screen: Select Tokens popup', () => {
    beforeEach(() => {
        cy.visit('https://2aoj2-aaaaa-aaaad-qa4qq-cai.ic.fleek.co/')
    })

    it('Validates UI for Token popup', () => {
        cy.wait(10000)
        //Swap banner at the top 
        cy.get('[class="css-10lj575"]')
            .should('be.visible')

        cy.wait(10000)
        cy.openTokensPopup()
        cy.closeTokensPopup()
        cy.openTokensPopup()

        //Select Token dialog
        cy.contains('Select Token')
            .should('be.visible')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgba(255, 255, 255, 0.92)')
        //Search icon 
        cy.fixture('tokensLogo.json').then((tokensLogo) => {
            cy.get('[class="chakra-image css-bpd39n"]')
                .should('have.attr', 'src', tokensLogo.ICPSwapScreen)
        })   
        //Search bar & placeholder
        cy.get('[placeholder="Search by name or canister id"]')
            .should('be.visible')
        //List of tokens
        //ICP
        cy.fixture('tokensLogo.json').then((tokensLogo) => {
            cy.get('[class="chakra-image css-gtqh5z"]').first()
                .should('have.attr', 'src', tokensLogo.ICP)
        })
        cy.contains('ICP')
            .should('be.visible')
        cy.contains('Internet Computer Protocol')
            .should('be.visible')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(158, 165, 172)')
        cy.get('[class="chakra-text css-1hjrn45"]')
            .should('be.visible')
        //XTC
        cy.fixture('tokensLogo.json').then((tokensLogo) => {
            cy.get('[class="chakra-image css-gtqh5z"]').eq(1)
                .should('have.attr', 'src', tokensLogo.XTC)
        })
        cy.contains('XTC')
            .should('be.visible')
        cy.contains('Cycles')
            .should('be.visible')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(158, 165, 172)')
        cy.get('[class="chakra-text css-1hjrn45"]')
            .should('be.visible')
        //WICP
        cy.fixture('tokensLogo.json').then((tokensLogo) => {
            cy.get('[class="chakra-image css-gtqh5z"]').eq(2)
                .should('have.attr', 'src', tokensLogo.WICP)
        })
        cy.contains('WICP')
            .should('be.visible')
        cy.contains('Cycles')
            .should('be.visible')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(158, 165, 172)')
        cy.get('[class="chakra-text css-1hjrn45"]')
            .should('be.visible')
        //Request button
        cy.contains('Request Token (Soon)')
            .should('be.visible')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgb(240, 242, 244)')
            .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
        //close popup
        cy.get('[class="chakra-icon css-onkibi"]').as('closeButton')
            .click()
    })

    it('Validates Request Token button redirection', () => {
        cy.openTokensPopup()
        //Remove target to not take the user to a second tab and validate redirection to proper URL
        cy.contains('Request')
            .should('have.attr', 'rel', 'noopener noreferrer')
            .invoke('removeAttr', 'target')
            .click()
        cy.url().should('eq', 'https://form.typeform.com/to/YnSyAUn0')
    })
    it('Validates Search bar in the Select Token popup', () => {
        cy.openTokensPopup()
        //Type ICP in the search bar
        cy.get('[class="css-1mb7zhh"]')
            .type('ICP')
        cy.get('[class="chakra-text css-5qgpmt"]').then((list) => {
            expect(list[0]).to.contain('ICP')
            expect(list[1]).to.contain('WICP')
        })
        cy.get('[class="css-1mb7zhh"]')
            .type('CTRL', 'A', 'ICPTEST')
        cy.contains("Can't see your token? Request it to be added to Sonic using the button below.")
            .should('be.visible')
            .should('have.css', 'color', 'rgb(158, 165, 172)')
        cy.closeTokensPopup()
    })
})