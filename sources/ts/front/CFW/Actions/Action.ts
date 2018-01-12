import {AjaxInfo} from "../Types/Types";

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

    private static _underlyingRequest: any;

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
     * Automatically assign the items to the data
     *
     * @param {string} id
     * @param {AjaxInfo} ajaxInfo
     * @param items
     * @returns {any}
     */
    public static prep(id: string, ajaxInfo: AjaxInfo, items: any) {
        let data: any = {
            action: id,
            security: ajaxInfo.nonce,
        };

        (<any>Object).assign(data, items);

        return data;
    }

    /**
     * Fire ze ajax
     */
    load(): void {
        Action.underlyingRequest = $.post(this.url.href, this.data, this.response.bind(this));
    }

    /**
     * Our ajax response handler. Overridden in child classes
     * @param resp
     */
    abstract response(resp: Object): void;

    static get underlyingRequest(): any {
        return this._underlyingRequest;
    }

    static set underlyingRequest(value: any) {
        this._underlyingRequest = value;
    }

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