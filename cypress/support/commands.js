// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import dataScaffolding from "../data_scaffolding/data-scaffolding";

let fields = dataScaffolding.fields;
let general = fields.general;
let accountFields = fields.account;
let tabs = fields.tabElements;

Cypress.Commands.add("add_item_to_cart", (quantity = 1) => {
	let dataMap = { product_sku: "sku", product_id: "id", quantity: "quantity" };

	let product = Cypress.env("product");
	product.quantity = quantity;

	let requestKey = "addToCart";

	let addToCartRequest = dataScaffolding.combineRequestWithData(requestKey, product, dataMap);

	cy.request(addToCartRequest)
});

Cypress.Commands.add("clear_info_fields", (type, ignore) => {
	fields.customerInfoMapSingle(type, "", cy, ignore)
});

Cypress.Commands.add("fill_customer_information_tab_and_advance", () => {
	let account = Cypress.env("account");
	let userShippingValues = Cypress.env("shipping").default;
	let updateCheckoutRequest = dataScaffolding.getRequest("updateCheckout");

	cy.server();
	cy.route(updateCheckoutRequest.method, updateCheckoutRequest.url).as("updateCheckout");

	// Set the email
	cy.get( accountFields.email ).then( ($input) => $input.val( account.email ).change());

	// Map the cypress env customer info details to the customer info field id's
	fields.customerInfoMapMultiple('shipping', userShippingValues, cy);

	cy.get( general.ctnToShipMethodBtn ).click();

	cy.wait("@updateCheckout");

	cy.hash().should( 'eq', tabs.shippingMethod );
});