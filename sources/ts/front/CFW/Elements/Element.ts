/**
 *
 */
export class Element {

    /**
     * @type {JQuery}
     * @protected
     */
    protected _jel: JQuery;

    /**
     * @param jel
     */
    constructor(jel: JQuery) {
        this.jel = jel;
    }

    /**
     * @returns {JQuery}
     */
    get jel(): JQuery {
        return this._jel;
    }

    /**
     * @param value
     */
    set jel(value: JQuery) {
        this._jel = value;
    }
}