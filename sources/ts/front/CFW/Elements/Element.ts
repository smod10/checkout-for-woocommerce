export class Element {
    private _jel: JQuery;

    constructor(jel: JQuery) {
        this.jel = jel;
    }

    get jel(): JQuery {
        return this._jel;
    }

    set jel(value: JQuery) {
        this._jel = value;
    }
}