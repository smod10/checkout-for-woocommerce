import dataScaffolding from "../../data_scaffolding/data-scaffolding";

describe( 'Zip Autocomplete', function() {
	let shipping = Cypress.env("shipping").default;
	let fields = dataScaffolding.fields;
	let shipFields = fields.customerInfo("shipping");

    before(() => {
        cy.add_item_to_cart();
        cy.visit('checkout');
    });

    beforeEach(() => {
		let zipAutoRequest = dataScaffolding.getRequest("zipAuto");
		let zipAutoRequestUrl = `${shipping.postcode}`;

		cy.server();
		cy.route(zipAutoRequest.method, zipAutoRequestUrl).as("zipAuto");
	});

    it( 'Autocompletes domestic city and state', () => {
        cy.get( shipFields.postcode ).type( shipping.postcode );

		cy.wait("@zipAuto");

        cy.get( shipFields.state ).should( 'have.value', shipping.state );
        cy.get( shipFields.city ).should( 'have.value', shipping.city );
    });
});