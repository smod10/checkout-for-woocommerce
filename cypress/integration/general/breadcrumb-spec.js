import dataScaffolding from "../../data_scaffolding/data-scaffolding";

let fields = dataScaffolding.fields;
let tabs = fields.tabElements;

describe( 'Breadcrumbs', function() {
    before( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Has correct breadcrumbs', function() {
        // Cart link
        cy.get(`${tabs.breadcrumb} li:nth-child(1) a`)
            .should('have.attr', 'href').and('contains', '/cart/#cart');

        // Customer information link
        cy.get(`${tabs.breadcrumb} li:nth-child(2) a`)
            .should('have.attr', 'href').and('contains', tabs.customerInfo);

        // Shipping method link
        cy.get(`${tabs.breadcrumb} li:nth-child(3) a`)
            .should('have.attr', 'href').and('contains', tabs.shippingMethod);

        // Payment info link
        cy.get(`${tabs.breadcrumb} li:nth-child(4) a`)
            .should('have.attr', 'href').and('contains', tabs.paymentMethod);
    } );
});