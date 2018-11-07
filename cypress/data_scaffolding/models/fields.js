class Fields {
	/**
	 * @param {object} general
	 * @param {object} account
	 * @param {object} product
	 * @param {object} customerInfoPrefixes
	 * @param {object} tabElements
	 */
	constructor(general, account, product, customerInfoPrefixes, tabElements) {
		this.general = general;
		this.account = account;
		this.product = product;
		this.customerInfoPrefixes = customerInfoPrefixes;
		this.tabElements = tabElements;
	}

	/**
	 * Maps the type to the id and adds a hashtag. Example #billing_first_name
	 *
	 * @param {string} type The type of field to map (billing|shipping)
	 */
	customerInfo(type) {
		let typedCustomerInfo = {};

		for(const [key, value] of Object.entries(this.customerInfoPrefixes)) {
			typedCustomerInfo[key] = `#${type}_${value}`;
		}

		return typedCustomerInfo;
	}

	/**
	 * Map multiple values via object/array to the customer info fields
	 *
	 * @param {string} type The type of field to map (billing|shipping)
	 * @param {object|[]} input Pass in an array or object with customer info keys and values to map
	 * @param {Cypress} cy The cypress object
	 *
	 * @returns {{
	 * 		first_name: Promise,
	 * 		last_name: Promise,
	 * 		address1: Promise,
	 * 		address2: Promise,
	 * 		company: Promise,
	 * 		postcode: Promise,
	 * 		country: Promise,
	 * 		state: Promise,
	 * 		city: Promise
	 * }}
	 */
	customerInfoMapMultiple(type, input, cy) {
		let ciFields = this.customerInfo(type);
		let mappedValues = {};

		for(const [key, value] of Object.entries(input)) {
			mappedValues[key] = cy.get( ciFields[key] ).then( ($input) => $input.val( value ) );
		}

		return mappedValues;
	}

	/**
	 * The single version of the customerInfoMapMultiple. Allows for mapping a single value to all keys minus the
	 * ones in ignore
	 *
	 * @param {string} type The type of field to map (billing|shipping)
	 * @param {string} input Pass in a value to be mapped to all keys (excluding any in ignore)
	 * @param {Cypress} cy The Cypress object
	 * @param {string|[]} ignore Keys to ignore for the mapping
	 *
	 * @returns {{
	 * 		first_name: Promise,
	 * 		last_name: Promise,
	 * 		address1: Promise,
	 * 		address2: Promise,
	 * 		company: Promise,
	 * 		postcode: Promise,
	 * 		country: Promise,
	 * 		state: Promise,
	 * 		city: Promise
	 * }}
	 */
	customerInfoMapSingle(type, input, cy, ignore = []) {
		let ciFields = this.customerInfo(type);
		let mappedValues = {};

		for(const [key, value] of Object.entries(ciFields)) {
			if( key === ignore || (Array.isArray(ignore) && ignore.indexOf(key) !== -1) )
				continue;

			mappedValues[key] = cy.get( value ).then( $input => $input.val( input ) );
		}

		return mappedValues;
	}
}

module.exports = Fields;