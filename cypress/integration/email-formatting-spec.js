import dataScaffolding from "../data_scaffolding/data-scaffolding";

describe( 'Email Address Validation', function() {
    beforeEach( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Validates incorrectly formatted email address', function() {
        cy.get( dataScaffolding.fields.account.email ).type( 'someone' );
        cy.get( '#cfw-email-wrap .parsley-errors-list').should( 'be.visible' );
    } );

    it( 'Validates correctly formatted email address', function() {
        cy.get( dataScaffolding.fields.account.email ).type( Cypress.env( "account" ).email );
        cy.get( '#cfw-email-wrap .parsley-errors-list').should( 'not.be.visible' );
    } );
});