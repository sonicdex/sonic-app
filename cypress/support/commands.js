// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('openTokensPopup', (token="ICP") => { 
    cy.contains(token)
    .click()
 })


 Cypress.Commands.add('closeTokensPopup', () => {
    cy.get('[class="chakra-icon css-onkibi"]')
    .click()
 })

 Cypress.Commands.add('checkCSSAttrs', (Index,NavItem) => {
   cy.get('#tabs-1--tab-'+[Index])
   .should('be.visible')
   .should('have.text', NavItem)
   .should('have.css','color','rgba(255, 255, 255, 0.92)')
   .click()
   .should('have.css', 'color', 'rgb(214, 216, 218)')
   .should('have.css', 'font-family', '"Nunito Sans"')
   .should('have.css', 'font-weight', '600')
   .should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(to right, rgb(61, 82, 244), rgb(49, 66, 195)) repeat scroll 0% 0% / auto padding-box border-box')

})

Cypress.Commands.add('checkTextStyling', (selector) => {
   cy.contains(selector)
   .should('be.visible')
   .should('have.css', 'color', 'rgb(240, 242, 244)')
   .should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
   .should('have.css', 'font-family', '"Nunito Sans"')
   .should('have.css', 'color', 'rgb(240, 242, 244)')
})