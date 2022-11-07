/// <reference types="cypress" />

describe('Swap screen: Select Tokens popup', () => {

    const tokenList = [
        'XTC',
        'WICP',
        'OGY',
        'NDP',
        'BOX',
        'XCANIC'
    ]

    beforeEach(() => {
        cy.visit('/')
    })

    it('Validates UI for Token popup', () => {

        cy.openTokensPopup('ICP')
        cy.closeTokensPopup()
        cy.openTokensPopup('ICP')

        //Select Token dialog
        cy.contains('Select Token')
            .should('be.visible')
            .should('have.css', 'font-family', '"Nunito Sans"')
            .should('have.css', 'color', 'rgba(255, 255, 255, 0.92)')
  
        //Search bar & placeholder
        cy.get('[placeholder="Search by name or canister id"]')
            .should('be.visible')

    
        tokenList.forEach((items) => () =>{
            cy.contains(items)
              .should('be.visible')
            })

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
        cy.openTokensPopup('ICP')
        cy.contains('Request')
            .should('have.attr', 'rel', 'noopener noreferrer')
            .invoke('removeAttr', 'target')
            .click()
        cy.url().should('contain', 'typeform.com/to/YnSyAUn0')
    })
    
    it('Validates Search bar in the Select Token popup', () => {
        cy.openTokensPopup('ICP')
        //Type ICP in the search bar
        cy.get('[class="css-1mb7zhh"]')
            .type('ICP')
        cy.get('[class="chakra-text css-5qgpmt"]').then((list) => {
            expect(list[0]).to.contain('ICP')
            expect(list[1]).to.contain('WICP')
        })
        cy.get('[class="css-1mb7zhh"]')
            .type('CTRL')
            .type('A')
            .type('ICPTEST')
        cy.contains("Can't see your token? Request it to be added to Sonic using the button below.")
            .should('be.visible')
            .should('have.css', 'color', 'rgb(158, 165, 172)')
        cy.closeTokensPopup()
    })
})