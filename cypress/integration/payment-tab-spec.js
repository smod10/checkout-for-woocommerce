describe( 'Test Shipping Tab', function() {
    // TODO: Figure out why we have to run this before each. update_checkout returns 403 when this is chagned to before
    beforeEach( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
        cy.fill_customer_information_tab_and_advance();
        cy.visit('checkout/#cfw-payment-method');
        cy.wait(500);
    } );

    it( 'Can complete checkout with check payments', function() {
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

        cy.get( '#payment_method_cheque' ).check();
        cy.get( '#terms' ).check();
        cy.get( '#place_order' ).click();
        cy.get('.woocommerce-notice').should( 'contain', 'Thank you. Your order has been received.' );
    } );

    it( 'Can complete checkout with stripe payments', function() {
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

        cy.get( '#payment_method_stripe' ).check();

        // Stripe Iframe
        cy.get('iframe').then($iframe => {
            const doc = $iframe.contents();
            let input = doc.find('input[name=cardnumber]')[0];
            // super weird stuff here, if you just input '4242424242424242', the value
            // that you end up seing in the input element is jumbled up a little,
            // probably because of the way how Stripe inserts spaces while you are
            // typing. By luck I found out that this issue can get worked around if
            // you just chain-call type()
            cy
                .wrap(input)
                .type('4242')
                .type('4242')
                .type('4242')
                .type('4242');
        });

        cy.get('iframe').then($iframe => {
            const doc = $iframe.contents();
            let input = doc.find('input[name=exp-date]')[0];

            cy
                .wrap(input)
                .clear()
                .type('12')
                .type('20')
        });


        cy.get('iframe').then($iframe => {
            const doc = $iframe.contents();
            let input = doc.find('input[name=cvc]')[0];

            cy
                .wrap(input)
                .type('123');
        });


        cy.get( '#terms' ).check();
	    cy.server();
	    cy.route('POST','/?wc-ajax=complete_order').as('completeOrder');
        cy.get( '#place_order' ).click();
	    cy.wait('@completeOrder');
        cy.get('.woocommerce-notice').should( 'contain', 'Thank you. Your order has been received.' );
    } );
});