requirejs.config({
	baseUrl : window.siteBase + 'assets/front/js/',
	bundles: {
		'checkout-woocommerce-front': window.requiredFiles
	}
});

require(requiredFiles,
	function(Main, TabContainer, TabContainerBreadcrumb, TabContainerSection, Cart){

		// Require wraps objects for some reason in bundles
		Main = Main.Main;
		TabContainer = TabContainer.TabContainer;
		TabContainerBreadcrumb = TabContainerBreadcrumb.TabContainerBreadcrumb;
		TabContainerSection = TabContainerSection.TabContainerSection;
		Cart = Cart.Cart;

		var breadCrumbEl = $(cfwElements.breadCrumbElId);
		var customerInfoEl = $(cfwElements.customerInfoElId);
		var shippingMethodEl = $(cfwElements.shippingMethodElId);
		var paymentMethodEl = $(cfwElements.paymentMethodElId);
		var tabContainerEl = $(cfwElements.tabContainerElId);
		var cartContainer = $(cfwElements.cartContainerId);
		var cartSubtotal = $(cfwElements.cartSubtotalId);
		var cartShipping = $(cfwElements.cartShippingId);
		var cartTaxes = $(cfwElements.cartTaxesId);
		var cartTotal = $(cfwElements.cartTotalId);

		var tabContainerBreadcrumb = new TabContainerBreadcrumb(breadCrumbEl);
		var tabContainerSections = [
			new TabContainerSection(customerInfoEl, "customer_info"),
			new TabContainerSection(shippingMethodEl, "shipping_method"),
			new TabContainerSection(paymentMethodEl, "payment_method")
		];
		var tabContainer = new TabContainer(tabContainerEl, tabContainerBreadcrumb, tabContainerSections);

		var cart = new Cart(cartContainer, cartSubtotal, cartShipping, cartTaxes, cartTotal);

		var main = new Main( tabContainer, ajaxInfo, cart );
		main.setup();
	});