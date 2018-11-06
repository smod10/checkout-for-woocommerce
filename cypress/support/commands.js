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

let dataMap = { product_sku: "sku", product_id: "id", quantity: "quantity" };
let product = Cypress.env("product");
let requestKey = "addToCart";

let addToCartRequest = dataScaffolding.combineRequestWithData(requestKey, product, dataMap);
let fields = dataScaffolding.fields;

Cypress.Commands.add("add_item_to_cart", () => cy.request(addToCartRequest));

Cypress.Commands.add("clear_info_fields", (type, ignore) => {
    fields.customerInfoMapSingle(type, "", cy, ignore)
});

Cypress.Commands.add("fill_customer_information_tab_and_advance", () => {
    let account = Cypress.env("account");
    let userShippingValues = Cypress.env("shipping").default;

    // Set the email
    cy.get( '#billing_email' ).then( ($input) => $input.val( account.email ).change());

    // Map the cypress env customer info details to the customer info field id's
    fields.customerInfoMapMultiple('shipping', userShippingValues, cy);

    cy.get( '#cfw-shipping-info-action .cfw-primary-btn' ).click();

    cy.wait(500); // If we don't do this, it tries the tests before the tab is loaded

    cy.hash().should( 'eq', '#cfw-shipping-method' );
} );