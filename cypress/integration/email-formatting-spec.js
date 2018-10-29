describe( 'Email Address Validation', function() {
    beforeEach( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Validates incorrectly formatted email address', function() {
        cy.get( '#billing_email' ).type( 'clifgriffin' );
        cy.get( '#cfw-email-wrap .parsley-errors-list').should( 'be.visible' );
    } );

    it( 'Validates correctly formatted email address', function() {
        cy.get( '#billing_email' ).type( Cypress.env( "billing_email" ) );
        cy.get( '#cfw-email-wrap .parsley-errors-list').should( 'not.be.visible' );
    } );
});