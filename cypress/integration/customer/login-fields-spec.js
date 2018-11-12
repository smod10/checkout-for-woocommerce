import dataScaffolding from "../../data_scaffolding/data-scaffolding";

describe('Login Fields', () => {
	let fields = dataScaffolding.fields;
	let messages = dataScaffolding.messages;
	let account = Cypress.env("account");
	let accountFields = fields.account;
	let general = fields.general;

    beforeEach(() => {
        cy.add_item_to_cart();
        cy.visit('checkout');
    });

    describe('Email', () => {

    	describe('Formatting', () => {
			it( 'Validates incorrectly formatted email address', function() {
				cy.get( accountFields.email ).type( 'someone' );
				cy.get( general.emailErrorList).should( 'be.visible' );
			});

			it( 'Validates correctly formatted email address', function() {
				cy.get( accountFields.email ).type( Cypress.env( "account" ).email );
				cy.get( general.emailErrorList).should( 'not.be.visible' );
			});
		});

    	describe('User Existance', () => {
    		beforeEach(() => {
    			// Get the account exists request
				let accountExistsRequest = dataScaffolding.getRequest("accountExists");

				// Set up the route watcher
				cy.server();
				cy.route(accountExistsRequest.method, accountExistsRequest.url).as("accountExists");
			});

			it('Detects non-existing login email', () => {
				cy.get( accountFields.email ).type( 'fake@fake.com' );

				cy.wait('@accountExists');

				cy.get( accountFields.password ).should( 'not.be.visible' );
				cy.get( accountFields.loginBtn ).should( 'not.be.visible' );
			});

			it('Detects existing login email', () => {
				// Input the email
				cy.get( accountFields.email ).type( Cypress.env( "account" ).email );

				cy.wait('@accountExists');

				cy.get( accountFields.password ).should( 'be.visible' );
				cy.get( accountFields.loginBtn ).should( 'be.visible' );
			});
		});

	});

    describe('Login / Logout', () => {

		it( 'Fails on invalid login', function() {
			cy.get( accountFields.email ).type( account.email );
			cy.get( accountFields.password ).type( "fasfsadf" );
			cy.get( accountFields.loginBtn ).click();
			cy.get( general.alertContainer ).should( 'contain', messages.account.incorrectPasswordAlertMessage );
		});

		it( 'Succeeds on valid login', function() {
			cy.get( accountFields.email ).type( account.email );
			cy.get( accountFields.password ).type( account.password );
			cy.get( accountFields.loginBtn ).click();
			cy.get( accountFields.accountText ).should( 'contain', messages.account.onLoginAccountMessage );

			// TODO: Add cookie check
		});

	});
});