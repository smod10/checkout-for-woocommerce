describe( 'Billing Fields', function() {
    beforeEach( () => {
        cy.add_item_to_cart();
        cy.visit('checkout');
		cy.fill_customer_information_tab_and_advance();
		cy.visit('checkout/#cfw-payment-method');
		cy.clear_info_fields('billing', ["country"]);
    });

    describe('Validation', () => {
		it( 'Billing address fields', () => {
			// Required to test state field
			cy.get( '#shipping_dif_from_billing' ).check();
			cy.get( '#cfw-billing-fields-container input[required]').each(($input, index, $lis) => {
				cy.wrap($input).focus().blur().should( 'have.class', 'parsley-error' );
			});

			cy.get( '#place_order' ).click();
			cy.get( '#billing_country' ).should( 'not.have.class', 'parsley-error' );
			cy.get( '#billing_state' ).should( 'have.class', 'parsley-error' );
		});
    });

    describe('Auto-complete', () => {
		it( 'Domestic city and state', () => {
			cy.get( '#shipping_dif_from_billing' ).check();
			cy.get( '#billing_postcode').type( Cypress.env( "shipping" ).default.postcode );

			cy.wait(1000);

			cy.get( '#billing_state' ).should( 'have.value', Cypress.env( "shipping" ).default.state );
			cy.get( '#billing_city' ).should( 'have.value', Cypress.env( "shipping" ).default.city );
		});
    });
});