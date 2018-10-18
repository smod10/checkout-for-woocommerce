describe( 'Breadcrumbs', function() {
    before( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Has correct breadcrumbs', function() {
        // Cart link
        cy.get("#cfw-breadcrumb li:nth-child(1) a")
            .should('have.attr', 'href').and('eq', '/cart/#cart');

        // Customer information link
        cy.get("#cfw-breadcrumb li:nth-child(2) a")
            .should('have.attr', 'href').and('eq', '#cfw-customer-info');

        // Shipping method link
        cy.get("#cfw-breadcrumb li:nth-child(3) a")
            .should('have.attr', 'href').and('eq', '#cfw-shipping-method');

        // Payment info link
        cy.get("#cfw-breadcrumb li:nth-child(4) a")
            .should('have.attr', 'href').and('eq', '#cfw-payment-method');
    } );
});