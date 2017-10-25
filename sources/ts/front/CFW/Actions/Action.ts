/**
 * Base class for our ajax handling. Child classes will extend this and override the response function and implement their
 * own custom solutions for the php side of actions
 */
export abstract class Action {

    /**
     * @type {string}
     * @private
     */
    private _id: string;

    /**
     * @type {URL}
     * @private
     */
    private _url: URL;

    /**
     * @type {Object}
     * @private
     */
    private _data: any;

    /**
     * @param id
     * @param url
     * @param data
     */
    constructor(id: string, url: URL, data: Object) {
        this.id = id;
        this.url = url;
        this.data = data;
    }

    /**
     * Fire ze ajax
     */
    load(): void {
        $.post(this.url.href, this.data, this.response.bind(this));
    }

    /**
     * Our ajax response handler. Overridden in child classes
     * @param resp
     */
    abstract response(resp: Object): void;

    /**
     * @returns {string}
     */
    get id(): string {
        return this._id;
    }

    /**
     * @param value
     */
    set id(value: string) {
        this._id = value;
    }

    /**
     * @returns {URL}
     */
    get url(): URL {
        return this._url;
    }

    /**
     * @param value
     */
    set url(value: URL) {
        this._url = value;
    }

    /**
     * @returns {Object}
     */
    get data(): any {
        return this._data;
    }

    /**
     * @param value
     */
    set data(value: any) {
        this._data = value;
    }
}