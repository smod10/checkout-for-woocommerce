import {AjaxInfo} from "../Types/Types";

declare let jQuery: any;

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
     * @type {string}
     * @private
     */
    private _url: string;

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
    constructor(id: string, url: string, data: Object) {
        this.id = id;
        this.url = url + '?' + 'wc-ajax=' + id;
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
            "wc-ajax": id,
            security: ajaxInfo.nonce,
        };

        (<any>Object).assign(data, items);

        return data;
    }

    /**
     * Fire ze ajax
     */
    load(): void {
        jQuery.post(this.url, this.data, this.response.bind(this));
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
     * @returns {string}
     */
    get url(): string {
        return this._url;
    }

    /**
     * @param value
     */
    set url(value: string) {
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