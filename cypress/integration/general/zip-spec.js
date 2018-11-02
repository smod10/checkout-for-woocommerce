describe( 'Zip Autocomplete', function() {
    before( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Autocompletes domestic city and state', function() {
        let shipping = Cypress.env("shipping").default;

        cy.get( '#shipping_postcode').type( shipping.postcode );
        cy.get( '#shipping_state' ).should( 'have.value', shipping.state );
        cy.get( '#shipping_city' ).should( 'have.value', shipping.city );
    } );
});