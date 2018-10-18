describe( 'Shipping Field Validation', function() {
    before( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Validates required shipping address fields', function() {
        // Required to test state field
        cy.get( '#billing_email' ).type( Cypress.env( "billing_email" ) );
        cy.get( '#cfw-shipping-info input[required]').each(($input, index, $lis) => {
            cy.wrap($input).focus().blur().should( 'have.class', 'parsley-error' );
        });

        cy.get( '#cfw-shipping-info-action .cfw-primary-btn' ).click();
        cy.get( '#shipping_country' ).should( 'not.have.class', 'parsley-error' );
        cy.get( '#shipping_state' ).should( 'have.class', 'parsley-error' );
    } );
});