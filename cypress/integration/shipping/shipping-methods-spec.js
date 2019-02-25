import dataScaffolding from "../../data_scaffolding/data-scaffolding";

describe( 'Test Shipping Tab', function() {
	let updateCheckoutRequest = dataScaffolding.getRequest("updateCheckout");

	describe('Test USA shipping with product amount over 100$ for free / flat rate shipping', () => {
		// TODO: Figure out why we have to run this before each. update_checkout returns 403 when this is chagned to before
		beforeEach( function() {
			cy.add_item_to_cart(6);

			cy.visit('checkout');

			cy.fill_customer_information_tab_and_advance();

			cy.wait(500);

			cy.server();
			cy.route(updateCheckoutRequest.method, updateCheckoutRequest.url).as("updateCheckout");
		});

		// TODO: This test is very configuration specific. Please refactor
		it( 'Ground shipping costs correct amount', () => {
			// The first shipping option should always be checked
			// So using .check() isn't going to fire updateCheckout
			// Thus, we work with what should be true
			cy.get( 'input[name="shipping_method[0]"]' ).first().should('be.checked');

			cy.get( '#cfw-cart-shipping-total .amount' ).should( 'contain', '10.00' );
		});

		it( 'Free shipping costs the correct amount', () => {
			cy.get( 'input[name="shipping_method[0]"]' ).last().check();

			cy.wait("@updateCheckout", { timeout: 10000} );

			cy.get( '#cfw-cart-shipping-total .amount' ).should( 'contain', 'Free' );
		});
	});
});