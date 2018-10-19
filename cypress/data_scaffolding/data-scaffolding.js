// Classes
let Fields = require("./models/fields");
let Messages = require("./models/messages");

// Factories
let AccountFactory = require("./models/account").AccountFactory;
let ProductFactory = require("./models/product").ProductFactory;

// Fields
let generalFields = require("../fixtures/general-fields");
let accountFields = require("../fixtures/account-fields");

// Messages
let accountMessages = require("../fixtures/account-messages");

// Requests
let requests = require("../fixtures/requests");

// Data
let accountData = require("../data/accounts");
let productData = require("../data/products");

let fields = new Fields(generalFields, accountFields, {});
let messages = new Messages({}, accountMessages, {});
let products = ProductFactory.createAll(productData);
let accounts = AccountFactory.createAll(accountData);

class DataScaffolding {
	constructor(accounts, products, fields, messages, requests) {
		this.accounts = accounts;
		this.products = products;
		this.fields = fields;
		this.messages = messages;
		this.requests = requests;
	}

	random(type) {
		let size = this[type].length;

		return this[type][Math.floor(Math.random() * size)];
	}

	combineRequestWithData(requestKey, data, map) {
		let combined = this.requests[requestKey];

		Object.entries(map).forEach( ([key, value]) => combined["body"][key] = data[value] );

		return combined;
	}
}

module.exports = new DataScaffolding(accounts, products, fields, messages, requests);