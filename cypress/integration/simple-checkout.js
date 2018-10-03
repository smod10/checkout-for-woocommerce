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

        cy.get( 'a.added_to_cart' ).click({ force: true });
        cy.wait( 1000 );

        cy.get( 'a.checkout-button' ).click();
    } );

    it( 'Can finish checkout', function() {
        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include("Cannot read property 'elements'");

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done();

            // return false to prevent the error from
            // failing this test
            return false
        } );

        cy.get( '#billing_email' ).type( Cypress.env( "billing_email" ) );
        cy.get( '#shipping_first_name' ).type( Cypress.env( "shipping_first_name" ) );
        cy.get( '#shipping_last_name' ).type( Cypress.env( "shipping_last_name" ) );
        cy.get( '#shipping_address_1' ).type( Cypress.env( "shipping_address_1" ) );
        cy.get( '#shipping_company' ).type( Cypress.env( "shipping_company" ) );
        cy.get( '#shipping_country' ).select( Cypress.env( "shipping_country" ) );
        cy.get( '#shipping_postcode' ).type( Cypress.env( "shipping_postcode" ) );

        cy.wait( 1000 );

        cy.get( '#shipping_state' ).should( 'have.value', 'VA' );
        cy.get( '#shipping_city' ).should( 'have.value', 'Lynchburg' );

        cy.wait( 1000 );

        cy.get( '#cfw-shipping-info-action .cfw-primary-btn' ).click();

        cy.wait( 1000 );

        cy.get( 'input[name="shipping_method[0]"]' ).last().check();

        cy.get('#cfw-shipping-action .cfw-primary-btn').click();

        cy.wait( 1000 );

        cy.get( '#terms' ).check();

        cy.wait( 1000 );

        cy.get( '#place_order' ).click();

        cy.wait( 3000 );

        cy.get('.woocommerce-notice').should( 'to.contain', 'Thank you. Your order has been received.' );

    } );
});