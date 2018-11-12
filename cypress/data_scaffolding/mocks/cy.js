/**
 * Class used for testing certain methods in data-scaffolding
 *
 * @type {Cy}
 */
module.exports = new Cy();

/**
 * @param {Cy} prev
 *
 * @constructor
 */
function Cy (prev = null) {
	this.id = null;
	this.value = null;

	if(prev) {
		this.id = prev.id;
		this.value = prev.value;
	}
}

/**
 * @param {string} id
 *
 * @returns {Promise}
 */
Cy.prototype.get = function(id) {
	return new Promise((resolve) => {
		setTimeout(() => {
			this.id = id;
			resolve(new Cy.prototype.constructor(this));
		}, 200);
	})
};

/**
 * @param {string} value
 *
 * @returns {Promise}
 */
Cy.prototype.val = function(value) {
	return new Promise( (resolve, error) => {
		setTimeout(() => {
			if(!this.id) {
				error("Needs a id - call get");
			}

			this.value = value;
			resolve(new Cy.prototype.constructor(this));
		}, 200)
	})
};