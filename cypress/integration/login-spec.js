import dataScaffolding from "../data_scaffolding/data-scaffolding";

let account = dataScaffolding.accounts[0];

describe( 'Test Logging In', function() {
    beforeEach( function() {
        cy.add_item_to_cart();
        cy.visit('checkout');
    } );

    it( 'Fails on invalid login', function() {
        cy.get( dataScaffolding.fields.account.email ).type( account.email );
        cy.get( dataScaffolding.fields.account.password ).type( account.badPassword );
        cy.get( dataScaffolding.fields.account.loginBtn ).click();
        cy.get( dataScaffolding.fields.general.alertContainer ).should( 'contain', dataScaffolding.messages.account.incorrectPasswordAlertMessage );
    } );

    it( 'Succeeds on valid login', function() {
        cy.get( dataScaffolding.fields.account.email ).type( account.email );
        cy.get( dataScaffolding.fields.account.password ).type( account.password );
        cy.get( dataScaffolding.fields.account.loginBtn ).click();
        cy.get( dataScaffolding.fields.account.accountText ).should( 'contain', dataScaffolding.messages.account.onLoginAccountMessage );

        // TODO: Add cookie check
    } );
});