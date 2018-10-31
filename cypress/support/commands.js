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
let account = Cypress.env("account");

Cypress.Commands.add("login_admin", () => {
    cy.visit("wp-admin");
    cy.get("#user_login").type(account.username);
    cy.get("#user_pass").type(account.password);
    cy.get("#wp-submit").click();
});

Cypress.Commands.add("add_item_to_cart", () => cy.request(addToCartRequest));

Cypress.Commands.add("fill_customer_information_tab_and_advance", () => {
    let account = Cypress.env("account");
    let shipping = Cypress.env("shipping").default;

    cy.get( '#billing_email' ).then( ($input) => {
        $input.val( account.email ).change();
    } );
    cy.get( '#shipping_first_name' ).then( ($input) => {
        $input.val( shipping.first_name )
    } );
    cy.get( '#shipping_last_name' ).then( ($input) => {
        $input.val( shipping.last_name )
    } );
    cy.get( '#shipping_address_1' ).then( ($input) => {
        $input.val( shipping.address_1 )
    } );
    cy.get( '#shipping_address_2' ).then( ($input) => {
        $input.val( shipping.address_2 )
    } );
    cy.get( '#shipping_company' ).then( ($input) => {
        $input.val( shipping.company )
    } );
    cy.get( '#shipping_country' ).then( ($input) => {
        $input.val( shipping.country )
    } );
    cy.get( '#shipping_postcode' ).then( ($input) => {
        $input.val( shipping.postcode )
    } );
    cy.get( '#shipping_state' ).then( ($input) => {
        $input.val( shipping.state )
    } );
    cy.get( '#shipping_city' ).then( ($input) => {
        $input.val( shipping.city )
    } );

    cy.get( '#cfw-shipping-info-action .cfw-primary-btn' ).click();

    cy.wait(500); // If we don't do this, it tries the tests before the tab is loaded

    cy.hash().should( 'eq', '#cfw-shipping-method' );
} );