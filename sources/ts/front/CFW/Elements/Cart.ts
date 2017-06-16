import { Element }                      from "./Element";
import {UpdateCartTotalsData} from "../Types/Types";

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
     * @type {Element}
     * @private
     */
    private _total: Element;

    /**
     * @param cartContainer
     * @param subTotal
     * @param shipping
     * @param taxes
     * @param total
     */
    constructor(cartContainer: JQuery, subTotal: JQuery, shipping: JQuery, taxes: JQuery, total: JQuery) {
        super(cartContainer);

        this.subTotal = new Element(subTotal);
        this.shipping = new Element(shipping);
        this.taxes = new Element(taxes);
        this.total = new Element(total);
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
    }

    /**
     *
     * @param cartLineItem
     * @param value
     * @param childClass
     */
    static outputValue(cartLineItem: Element, value: string, childClass: string = ".amount") {
        if(cartLineItem.jel.length > 0) {
            cartLineItem.jel.children(childClass).html(value);
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
}