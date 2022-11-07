describe('Navigation items testing', () => {

  const navItemsUrls = [
    {
      name: 'Liquidity',
      url: '/liquidity'
    },
    {
      name: 'Assets',
      url: '/assets'
    },
    // {
    //   name: 'Activity',
    //   url: '/activity'
    // },
    {
      name: 'Swap',
      url: '/swap'
    }
  ]

  const dotsMenu = [
    {
      socialMedia: 'Twitter',
      socialMediaUrl: 'twitter.com/sonic_ooo',
      socialIndexValue: 0,
    }, {
      socialMedia: 'Discord',
      socialMediaUrl: 'discord.com/invite/EkmnRd99h6',
      socialIndexValue: 1,
    }, {
      socialMedia: 'Medium',
      socialMediaUrl: 'sonic-ooo.medium.com',
      socialIndexValue: 2,
    }, {
      socialMedia: 'Documentation',
      socialMediaUrl: 'docs.sonic.ooo',
      socialIndexValue: 3,
    }, {
      socialMedia: 'API',
      socialMediaUrl: '/dev/swaps-api',
      socialIndexValue: 4,
    }
  ]

  beforeEach(() => {
    cy.visit('/')
  })

  it('Validates Sonic logo', () => {
    //Sonic Logo
    cy.get('[class="chakra-icon css-17fwxks"]')
      .should('be.visible')
      .should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')
    cy.contains('Sonic')
      .should('have.css', 'color', 'rgba(255, 255, 255, 0.92)')
      .should('have.css', 'font-family', '"Nunito Sans"')
      .should('have.css', 'font-weight', '700')
  })

  it('Validates navigation items, checks user can navigate through taps execpt for Analytics ', () => {
    navItemsUrls.forEach((items) => {
      cy.contains(items.name).click()
      cy.url().should('include', items.url)
    })
  })

  it('Validates navigation to Analytics', () => {
    cy.contains('Analytics')
      .invoke('removeAttr', 'target')
      .click()
    cy.url().should('oneOf', [Cypress.env('sonicAnalytics'),Cypress.env('sonicAnalyticsProd')])
  })

  it('Validates default color is background', () => {
    cy.get('body')
      .should('have.css', 'background', 'rgb(21, 21, 21) none repeat scroll 0% 0% / auto padding-box border-box')
  })

  it('Connect plug button style when plug is not in the installed', () => {
    cy.contains(Cypress.env('plugTextButton'))
      .should('be.visible')
      .should('have.css', 'font-family', '"Nunito Sans"')
      .should('have.css', 'font-weight', '600')
  })

  it('Validates Hamburger menu', () => {
    //Click on the dots menu
    cy.get('[id="menu-button-9"]')
      .click()

    //dropdown icons are visible
    cy.get('[class="chakra-menu__icon-wrapper css-15v20fh"]')
      .should('be.visible')

    dotsMenu.forEach((items) => {
      cy.contains(items.socialMedia)
        .should('be.visible')
      cy.get('[role="menu"] a').then(($items) => {
        cy.wrap($items).eq(items.socialIndexValue)
          .invoke('removeAttr', 'target')
          .click()
        cy.url().should('contain', items.socialMediaUrl)
        cy.go('back')
        cy.get('[id="menu-button-9"]')
          .click()
      })
    })
  })

  it('Validates Light Mode functionality', () => {
    //Click on the dots menu
    cy.get('[id="menu-button-9"]')
      .click()
    cy.contains('Light mode')
      .click()
    cy.get('body')
      .should('have.css', 'background', 'rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box border-box')
  })
})
