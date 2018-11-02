import dataScaffolding from "../../data_scaffolding/data-scaffolding";

let account = Cypress.env("account");

describe('Login Fields', () => {
    beforeEach(() => {
        cy.add_item_to_cart();
        cy.visit('checkout');
    });

    describe('Email', () => {

    	describe('Formatting', () => {
			it( 'Validates incorrectly formatted email address', function() {
				cy.get( dataScaffolding.fields.account.email ).type( 'someone' );
				cy.get( '#cfw-email-wrap .parsley-errors-list').should( 'be.visible' );
			});

			it( 'Validates correctly formatted email address', function() {
				cy.get( dataScaffolding.fields.account.email ).type( Cypress.env( "account" ).email );
				cy.get( '#cfw-email-wrap .parsley-errors-list').should( 'not.be.visible' );
			});
		});

    	describe('User Existance', () => {
			it('Detects non-existing login email', () => {
				cy.get( dataScaffolding.fields.account.email ).type( 'fake@fake.com' );

				cy.wait(1000);

				cy.get( dataScaffolding.fields.account.password ).should( 'not.be.visible' );
				cy.get( dataScaffolding.fields.account.loginBtn ).should( 'not.be.visible' );
			});

			it('Detects existing login email', () => {
				cy.get( dataScaffolding.fields.account.email ).type( Cypress.env( "account" ).email );

				cy.wait( 1000 );

				cy.get( dataScaffolding.fields.account.password ).should( 'be.visible' );
				cy.get( dataScaffolding.fields.account.loginBtn ).should( 'be.visible' );
			});
		});

	});

    describe('Login / Logout', () => {

		it( 'Fails on invalid login', function() {
			cy.get( dataScaffolding.fields.account.email ).type( account.email );
			cy.get( dataScaffolding.fields.account.password ).type( "fasfsadf" );
			cy.get( dataScaffolding.fields.account.loginBtn ).click();
			cy.get( dataScaffolding.fields.general.alertContainer ).should( 'contain', dataScaffolding.messages.account.incorrectPasswordAlertMessage );
		});

		it( 'Succeeds on valid login', function() {
			cy.get( dataScaffolding.fields.account.email ).type( account.email );
			cy.get( dataScaffolding.fields.account.password ).type( account.password );
			cy.get( dataScaffolding.fields.account.loginBtn ).click();
			cy.get( dataScaffolding.fields.account.accountText ).should( 'contain', dataScaffolding.messages.account.onLoginAccountMessage );

			// TODO: Add cookie check
		});

	});
});