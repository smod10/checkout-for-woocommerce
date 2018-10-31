class Product {
	constructor(id, sku, quantity) {
		this.id = id;
		this.sku = sku;
		this.quantity = quantity;
	}
}

class ProductFactory {}

ProductFactory.create = (product) => {
	return new Product(product.id, product.sku, product.quantity);
};

ProductFactory.createAll = (products) => {
	return products.map(product => ProductFactory.create(product));
};

module.exports = {
	Product,
	ProductFactory
};