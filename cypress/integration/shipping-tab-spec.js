describe( 'Test Shipping Tab', function() {
    // TODO: Figure out why we have to run this before each. update_checkout returns 403 when this is chagned to before
    beforeEach( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
        cy.fill_customer_information_tab_and_advance();
    } );

    it( 'Ground shipping costs correct amount', function() {
        cy.get( 'input[name="shipping_method[0]"]' ).first().check();
        cy.get( '#cfw-cart-shipping-total .amount' ).should( 'contain', '10.00' );
    } );

    it( 'Free shipping costs the correct amount', function() {
        cy.get( 'input[name="shipping_method[0]"]' ).last().check();
        cy.get( '#cfw-cart-shipping-total .amount' ).should( 'contain', 'Free' );
    } );
});