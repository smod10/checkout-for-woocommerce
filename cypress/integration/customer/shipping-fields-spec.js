import dataScaffolding from "../../data_scaffolding/data-scaffolding";

describe( 'Shipping Fields', function() {
	let fields = dataScaffolding.fields;
	let shipFields = fields.customerInfo("shipping");

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
			cy.get( fields.account.email ).type( Cypress.env( "account" ).email );
			cy.get( '#cfw-shipping-info input[required]').each($input => {
				cy.wrap($input).focus().blur().should( 'have.class', 'parsley-error' );
			});

			cy.get( fields.general.ctnToShipMethodBtn ).click();

			cy.get( shipFields.country ).should( 'not.have.class', 'parsley-error' );
			cy.get( shipFields.state ).should( 'have.class', 'parsley-error' );
		});
    });
});