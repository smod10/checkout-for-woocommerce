export abstract class Action {

    /**
     *
     */
    private _id: string;

    /**
     *
     */
    private _url: URL;

    /**
     *
     */
    private _data: Object;

    /**
     *
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
     *
     */
    load(): void {
        $.post(this.url.href, this.data, this.response.bind(this));
    }

    /**
     *
     * @param resp
     */
    abstract response(resp: Object);

    /**
     *
     * @returns {string}
     */
    get id(): string {
        return this._id;
    }

    /**
     *
     * @param value
     */
    set id(value: string) {
        this._id = value;
    }

    /**
     *
     * @returns {URL}
     */
    get url(): URL {
        return this._url;
    }

    /**
     *
     * @param value
     */
    set url(value: URL) {
        this._url = value;
    }

    /**
     *
     * @returns {Object}
     */
    get data(): Object {
        return this._data;
    }

    /**
     *
     * @param value
     */
    set data(value: Object) {
        this._data = value;
    }
}