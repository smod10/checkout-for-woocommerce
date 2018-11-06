module.exports = new Cy();

function Cy (prev = null) {
	this.id = null;
	this.value = null;

	if(prev) {
		this.id = prev.id;
		this.value = prev.value;
	}
}

Cy.prototype.get = function(id) {
	return new Promise((resolve) => {
		setTimeout(() => {
			this.id = id;
			resolve(new Cy.prototype.constructor(this));
		}, 200);
	})
};

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