import dataScaffolding from "../../data_scaffolding/data-scaffolding";

describe( 'Billing Fields', function() {
	let shipping = Cypress.env( "shipping" ).default;
	let fields = dataScaffolding.fields;
	let tabs = fields.tabElements;
	let general = fields.general;
	let billFields = fields.customerInfo("billing");

    beforeEach( () => {
		let zipAutoRequest = dataScaffolding.getRequest("zipAuto");
		let zipAutoRequestUrl = `${shipping.postcode}`;

        cy.add_item_to_cart();
        cy.visit('checkout');
		cy.fill_customer_information_tab_and_advance();
		cy.visit(`checkout/${tabs.paymentMethod}`);
		cy.clear_info_fields('billing', ["country"]);

		cy.server();
		cy.route(zipAutoRequest.method, zipAutoRequestUrl).as("zipAuto");
    });

    describe('Validation', () => {
		it( 'Billing address fields', () => {
			// Required to test state field
			cy.get( general.shipDifBilling ).check();
			cy.get( '#cfw-billing-fields-container input[required]').each($input => {
				cy.wrap($input).focus().blur().should( 'have.class', 'parsley-error' );
			});

			cy.get( general.placeOrderBtn ).click();

			cy.get( billFields.country ).should( 'not.have.class', 'parsley-error' );
			cy.get( billFields.state ).should( 'have.class', 'parsley-error' );
		});
    });

    describe('Auto-complete', () => {
		it( 'Domestic city and state', () => {
			cy.get( '#shipping_dif_from_billing' ).check();
			cy.get( billFields.postcode ).type( shipping.postcode );

			cy.wait("@zipAuto");

			cy.get( billFields.state ).should( 'have.value', shipping.state );
			cy.get( billFields.city ).should( 'have.value', shipping.city );
		});
    });
});