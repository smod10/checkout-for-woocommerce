import { Element }                      from "./Element";
import { UpdateCartTotalsData }         from "../Types/Types";

export class Cart extends Element {

    /**
     * @type {Element}
     * @private
     */
    private _subTotal: Element;

    /**
     * @type {Element}
     * @private
     */
    private _shipping: Element;

    /**
     * @type {Element}
     * @private
     */
    private _taxes: Element;

    /**
     * @type Array<Element>
     * @private
     */
    private _coupons: Element;

    /**
     * @type {Element}
     * @private
     */
    private _total: Element;

    /**
     * @type {Element}
     * @private
     */
    private _reviewBarTotal: Element;

    /**
     * @param cartContainer
     * @param subTotal
     * @param shipping
     * @param taxes
     * @param total
     * @param coupons
     * @param reviewBarTotal
     */
    constructor(cartContainer: JQuery, subTotal: JQuery, shipping: JQuery, taxes: JQuery, total: JQuery, coupons: JQuery, reviewBarTotal: JQuery) {
        super(cartContainer);

        this.subTotal = new Element(subTotal);
        this.shipping = new Element(shipping);
        this.taxes = new Element(taxes);
        this.total = new Element(total);
        this.coupons = new Element(coupons);
        this.reviewBarTotal = new Element(reviewBarTotal);
    }

    /**
     * @param cart
     * @param values
     */
    static outputValues(cart: Cart, values: UpdateCartTotalsData) {
        Cart.outputValue(cart.subTotal, values.new_subtotal);
        Cart.outputValue(cart.shipping, values.new_shipping_total);
        Cart.outputValue(cart.taxes, values.new_taxes_total);
        Cart.outputValue(cart.total, values.new_total);
        Cart.outputValue(cart.reviewBarTotal, values.new_total);
    }

    static outputCoupons(cartLineItem: Element, coupons: any) {
        cartLineItem.jel.html("");

        if(cartLineItem.jel.length > 0) {
            coupons.forEach((coupon: any) => {
                let wrap = $('<div class="cfw-cart-coupon cfw-flex-row cfw-flex-justify">');
                let type = $('<span class="type"></span>').html(coupon.label);
                let amount = $('<span class="amount"></span>').html(coupon.amount);

                wrap.append(type);
                wrap.append(amount);

                cartLineItem.jel.append(wrap);
            })
        }
    }

    /**
     *
     * @param cartLineItem
     * @param value
     * @param childClass
     */
    static outputValue(cartLineItem: Element, value: string, childClass: string = ".amount") {
        if(cartLineItem.jel.length > 0) {
            cartLineItem.jel.find(childClass).html(value);
        }
    }

    /**
     * @returns {Element}
     */
    get subTotal(): Element {
        return this._subTotal;
    }

    /**
     * @param value
     */
    set subTotal(value: Element) {
        this._subTotal = value;
    }

    /**
     * @returns {Element}
     */
    get shipping(): Element {
        return this._shipping;
    }

    /**
     * @param value
     */
    set shipping(value: Element) {
        this._shipping = value;
    }

    /**
     * @returns {Element}
     */
    get taxes(): Element {
        return this._taxes;
    }

    /**
     * @param value
     */
    set taxes(value: Element) {
        this._taxes = value;
    }

    /**
     * @returns {Element}
     */
    get total(): Element {
        return this._total;
    }

    /**
     * @param value
     */
    set total(value: Element) {
        this._total = value;
    }

    /**
     * @returns {Element}
     */
    get coupons(): Element {
        return this._coupons;
    }

    /**
     * @param {Element} value
     */
    set coupons(value: Element) {
        this._coupons = value;
    }

    /**
     * @returns {Element}
     */
    get reviewBarTotal(): Element {
        return this._reviewBarTotal;
    }

    /**
     * @param {Element} value
     */
    set reviewBarTotal(value: Element) {
        this._reviewBarTotal = value;
    }
}