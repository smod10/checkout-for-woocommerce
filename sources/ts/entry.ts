import { Main }                             from "./front/CFW/Main";
import { TabContainer }                     from "./front/CFW/Elements/TabContainer";
import { TabContainerBreadcrumb }           from "./front/CFW/Elements/TabContainerBreadcrumb";
import { TabContainerSection }              from "./front/CFW/Elements/TabContainerSection";
import { Cart }                             from "./front/CFW/Elements/Cart";

/**
 * This is our main kick off file. We used to do this in a require block in the Redirect file but since we've moved to
 * webpack this is the new lay of the land (commonjs). In order to make this work in a non node setup (wordpress) we need
 * a reliable way to quick off the code hidden behind commonjs module loading. In comes our custom event.
 *
 * Basically we take all our code we have access to and need to run on start up and pass it the variables via a custom
 * event in the Redirect file. This allows us to get all our PHP needed variables, and lets us keep our kick off file
 * as a typescript file
 *
 * @type {Window}
 */

let w: any = window;
w.addEventListener("cfw-initialize", (eventData) => {
    let data = eventData.detail;

    let breadCrumbEl = $(data.elements.breadCrumbElId);
    let customerInfoEl = $(data.elements.customerInfoElId);
    let shippingMethodEl = $(data.elements.shippingMethodElId);
    let paymentMethodEl = $(data.elements.paymentMethodElId);
    let tabContainerEl = $(data.elements.tabContainerElId);
    let cartContainer = $(data.elements.cartContainerId);
    let cartSubtotal = $(data.elements.cartSubtotalId);
    let cartShipping = $(data.elements.cartShippingId);
    let cartTaxes = $(data.elements.cartTaxesId);
    let cartTotal = $(data.elements.cartTotalId);
    let cartCoupons = $(data.elements.cartCouponsId);
    let cartReviewBar = $(data.elements.cartReviewBarId);

    let tabContainerBreadcrumb = new TabContainerBreadcrumb(breadCrumbEl);
    let tabContainerSections = [
        new TabContainerSection(customerInfoEl, "customer_info"),
        new TabContainerSection(shippingMethodEl, "shipping_method"),
        new TabContainerSection(paymentMethodEl, "payment_method")
    ];
    let tabContainer = new TabContainer(tabContainerEl, tabContainerBreadcrumb, tabContainerSections);

    let cart = new Cart(cartContainer, cartSubtotal, cartShipping, cartTaxes, cartTotal, cartCoupons, cartReviewBar);

    let main = new Main( tabContainer, data.ajaxInfo, cart, data.settings );
    main.setup();
}, { once: true });