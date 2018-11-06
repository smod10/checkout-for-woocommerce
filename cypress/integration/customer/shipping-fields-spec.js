import dataScaffolding from "../../data_scaffolding/data-scaffolding";

describe( 'Shipping Fields', function() {
    before( function() {
        cy.add_item_to_cart();
        // Visit checkout, then clear the shipping fields
        cy.visit('checkout');
        // Clear all fields
		cy.clear_info_fields('shipping', ["country"]);
    });

    describe('Validation', () => {
		it('Validates required shipping address fields', () => {
			// Required to test state field
			cy.get( dataScaffolding.fields.account.email ).type( Cypress.env( "account" ).email );
			cy.get( '#cfw-shipping-info input[required]').each(($input, index, $lis) => {
				cy.wrap($input).focus().blur().should( 'have.class', 'parsley-error' );
			});

			cy.get( '#cfw-shipping-info-action .cfw-primary-btn' ).click();
			cy.get( '#shipping_country' ).should( 'not.have.class', 'parsley-error' );
			cy.get( '#shipping_state' ).should( 'have.class', 'parsley-error' );
		});
    });
});