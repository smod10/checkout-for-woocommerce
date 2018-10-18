describe( 'Zip Autocomplete', function() {
    before( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Autocompletes domestic city and state', function() {
        cy.get( '#shipping_postcode').type( Cypress.env( "shipping_postcode" ) );
        cy.get( '#shipping_state' ).should( 'have.value', 'VA' );
        cy.get( '#shipping_city' ).should( 'have.value', 'Lynchburg' );
    } );
});