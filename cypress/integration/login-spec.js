describe( 'Test Logging In', function() {
    beforeEach( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Fails on invalid login', function() {
        cy.get( '#billing_email' ).type( 'clifgriffin@gmail.com' );
        cy.get( '#cfw-password' ).type( 'wrong password' );
        cy.get( '#cfw-login-btn' ).click();
        cy.get( '#cfw-content' ).find( '#cfw-alert-container .message' ).should( 'contain', 'The password you entered for the email address' );
    } );

    it( 'Succeeds on valid login', function() {
        cy.get( '#billing_email' ).type( 'clifgriffin@gmail.com' );
        cy.get( '#cfw-password' ).type( 'test123' );
        cy.get( '#cfw-login-btn' ).click();
        cy.get( '#cfw-login-details .cfw-have-acc-text' ).should( 'contain', 'Welcome' );

        // TODO: Add cookie check
    } );
});