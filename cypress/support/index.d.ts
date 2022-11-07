declare namespace Cypress {
    interface Chainable {
      checkCSSAttrs( 
        index: number,
        NavItem: string,
        fontColor: string
      ): Chainable<Element>
      closeTokensPopup(): Chainable<Element>
      openTokensPopup(
        token: string
      ): Chainable<Element>
      checkCSSAttrsWithPlug(
        Index: string,
        NavItem: string
      ): Chainable<Element>
      checkTextStyling(
        selector: string,
        color: string
      )
    }
  }