// Classes
let Fields = require("./models/fields");
let Messages = require("./models/messages");

// Fields
let generalFields = require("../fixtures/general-fields");
let accountFields = require("../fixtures/account-fields");
let customerInfoPrefixes = require("../fixtures/customer-info-prefixes");

// Tabs
let tabElements = require("../fixtures/tab-elements");

// Messages
let accountMessages = require("../fixtures/account-messages");

// Requests
let requests = require("../fixtures/requests");

// Created objects
let fields = new Fields(
	generalFields,
	accountFields,
	{},
	customerInfoPrefixes,
	tabElements
);
let messages = new Messages({}, accountMessages, {});

// Used for mocking cy if needed
let cy = require("./mocks/cy");

class DataScaffolding {
	constructor(fields, messages, requests) {
		this.fields = fields;
		this.messages = messages;
		this.requests = requests;
	}

	random(type) {
		let size = this[type].length;

		return this[type][Math.floor(Math.random() * size)];
	}

	getRequest(key) {
		return this.requests[key];
	}

	combineRequestWithData(requestKey, data, map) {
		let combined = this.requests[requestKey];

		Object.entries(map).forEach( ([key, value]) => combined["body"][key] = data[value] );

		return combined;
	}
}

module.exports = new DataScaffolding(fields, messages, requests);