describe( 'Billing Field Validation + Billing Zip Autocomplete', function() {
    before( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
        cy.fill_customer_information_tab_and_advance();
        cy.visit('checkout/#cfw-payment-method');
        cy.wait(500);
    } );

    it( 'Validates required billing address fields', function() {
        // Required to test state field
        cy.get( '#shipping_dif_from_billing' ).check();
        cy.get( '#cfw-billing-fields-container input[required]').each(($input, index, $lis) => {
            cy.wrap($input).focus().blur().should( 'have.class', 'parsley-error' );
        });

        cy.get( '#place_order' ).click();
        cy.get( '#billing_country' ).should( 'not.have.class', 'parsley-error' );
        cy.get( '#billing_state' ).should( 'have.class', 'parsley-error' );
    } );

    it( 'Autocompletes domestic city and state', function() {
        cy.get( '#billing_postcode').type( Cypress.env( "shipping_postcode" ) );

        cy.wait(1000);

        cy.get( '#billing_state' ).should( 'have.value', 'VA' );
        cy.get( '#billing_city' ).should( 'have.value', 'Lynchburg' );
    } );
});