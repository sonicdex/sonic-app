/// <reference types="cypress" />


describe('UI validations for header items/Dark Mode', () => {
  before(() => {
    cy.visit('https://2aoj2-aaaaa-aaaad-qa4qq-cai.ic.fleek.co/')
  })

  it('Validates Sonic logo', () => {
    cy.get('[class="chakra-icon css-17fwxks"]')
      .should('be.visible')
      .should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')
    cy.get('[class="chakra-text css-722v25"]').should('be.visible')
      .should('have.css', 'color', 'rgba(255, 255, 255, 0.92)')
      .should('have.css', 'font-family', '"Nunito Sans"')
      .should('have.css', 'font-weight', '700')
  })
  it('Validates navigation items, checks user can navigate through taps', () => {
    cy.contains('Liquidity').click()
    cy.url().should('include', '/liquidity')

    cy.contains('Assets').click()
    cy.url().should('include', '/assets')

    cy.contains('Activity').click()
    cy.url().should('include', '/activity')

    cy.contains('Swap').click()
    cy.url().should('include', '/swap')
  })
  it('Validates CSS properties for each navigation item', () => {
    //Swap tab
    cy.contains('Swap')
      .should('have.css', 'color', 'rgb(214, 216, 218)')
      .should('have.css', 'font-family', '"Nunito Sans"')
      .should('have.css', 'font-weight', '600')
      .should('have.css', 'background', 'rgba(0, 0, 0, 0) linear-gradient(to right, rgb(61, 82, 244), rgb(49, 66, 195)) repeat scroll 0% 0% / auto padding-box border-box')
    //Liquidity tab 
    cy.checkCSSAttrs(1, "Liquidity")
    //Assets tab
    cy.checkCSSAttrs(2, "Assets")
    //Activity tab
    cy.checkCSSAttrs(3, "Activity")
  })
  it('Install plug button', () => {
    cy.contains('Install Plug')
      .should('be.visible')
      .should('have.css', 'font-family', '"Nunito Sans"')
      .should('have.css', 'font-weight', '600')
  })
  it('Validates Hamburger menu', () => {
    cy.get('[id="menu-button-9"]')
      .click()
    cy.get('[id="menu-list-9"]')
      .should('be.visible')
      .should('have.css', 'background', 'rgb(30, 30, 30) none repeat scroll 0% 0% / auto padding-box border-box')

    //Light mode validation
    cy.get('[class="chakra-menu__icon-wrapper css-15v20fh"]')
      .should('be.visible')
    cy.contains('Light mode')
      .should('be.visible')
      .should('have.css', 'font-family', '"Nunito Sans"')
      .should('have.css', 'font-size', '16px')
      .should('have.css', 'color', 'rgba(255, 255, 255, 0.92)')

    //Twitter
    cy.get('[class="chakra-link css-157cndf"]').first()
      .should('have.attr', 'href', 'https://twitter.com/sonic_ooo')
    cy.get('[class="chakra-menu__icon"]').eq(1)
      .should('be.visible')
      .should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')
    cy.contains('Twitter')
      .should('be.visible')

    //Discord
    cy.get('[class="chakra-link css-157cndf"]').eq(1)
      .should('have.attr', 'href', 'https://discord.com/invite/EkmnRd99h6')
    cy.get('[class="chakra-menu__icon"]').eq(2)
      .should('be.visible')
      .should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')

    //Medium
    cy.get('[class="chakra-link css-157cndf"]').eq(2)
      .should('have.attr', 'href', 'https://medium.com/@sonic-ooo')
    cy.get('[class="chakra-menu__icon"]').eq(3)
      .should('be.visible')
      .should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')

    //Documentation
    cy.get('[class="chakra-link css-157cndf"]').eq(3)
      .should('have.attr', 'href', 'https://docs.sonic.ooo')
    cy.get('[class="chakra-menu__icon"]').eq(4)
      .should('be.visible')
      .should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')

    //API
    cy.get('[class="chakra-link css-157cndf"]').eq(3)
      .should('have.attr', 'href', 'https://docs.sonic.ooo')
    cy.get('[class="chakra-menu__icon"]').eq(4)
      .should('be.visible')
      .should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')
  })
})

