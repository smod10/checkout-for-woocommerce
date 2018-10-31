import dataScaffolding from "../data_scaffolding/data-scaffolding";

describe( 'Login Auto Detection', function() {
    beforeEach( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Detects non-existing login email', function() {
        cy.get( dataScaffolding.fields.account.email ).type( 'fake@fake.com' );

        cy.wait(1000);

        cy.get( dataScaffolding.fields.account.password ).should( 'not.be.visible' );
        cy.get( dataScaffolding.fields.account.loginBtn ).should( 'not.be.visible' );
    } );

    it( 'Detects existing login email', function() {
        cy.get( dataScaffolding.fields.account.email ).type( Cypress.env( "account" ).email );

        cy.wait( 1000 );

        cy.get( dataScaffolding.fields.account.password ).should( 'be.visible' );
        cy.get( dataScaffolding.fields.account.loginBtn ).should( 'be.visible' );
    } );
});