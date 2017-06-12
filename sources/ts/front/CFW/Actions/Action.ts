export abstract class Action {

    private _id: string;
    private _url: URL;
    private _data: Object;

    constructor(id: string, url: URL, data: Object) {
        this.id = id;
        this.url = url;
        this.data = data;
    }

    load() {
        $.post(this.url.href, this.data, this.response.bind(this));
    }

    abstract response(resp: Object);

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get url(): URL {
        return this._url;
    }

    set url(value: URL) {
        this._url = value;
    }

    get data(): Object {
        return this._data;
    }

    set data(value: Object) {
        this._data = value;
    }
}