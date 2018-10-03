describe( 'Add Item to Cart', function() {
    const baseURL = Cypress.env( "site" ).url;

    beforeEach( function() {
        /**
         * Add Product to the Cart and Proceed to Checkout
         */
        cy.visit( baseURL + '/shop' );
        cy.wait( 1000 );

        cy.get( 'li.product:first-child a.button' ).click();
        cy.wait( 1000 );

        cy.get( 'a.added_to_cart' ).click();
        cy.wait( 1000 );

        cy.get( 'a.checkout-button' ).click();
    } );

    it( 'Can finish checkout', function() {
        cy.get( '#user_login' ).type( Cypress.env( "wp_user" ) );
        cy.get( '#user_pass' ).type( Cypress.env( "wp_pass" ) );
    } );
}