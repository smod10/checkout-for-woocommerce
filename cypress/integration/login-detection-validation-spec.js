describe( 'Login Auto Detection', function() {
    before( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Detects non-existing login email', function() {
        cy.get( '#billing_email' ).type( 'fake@fake.com' );
        cy.get( '#cfw-password' ).should( 'not.be.visible' );
        cy.get('#cfw-login-btn').should( 'not.be.visible' );
    } );

    it( 'Detects existing login email', function() {
        cy.get( '#billing_email' ).clear(); // Saves a round trip
        cy.get( '#billing_email' ).type( Cypress.env( "billing_email" ) );

        cy.wait( 1000 );

        cy.get( '#cfw-password' ).should( 'be.visible' );
        cy.get('#cfw-login-btn').should( 'be.visible' );
    } );
});