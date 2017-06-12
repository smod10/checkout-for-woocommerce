import { Element }              from "Element";
import { AlertInfo }            from "../Types/Types";

export class Alert extends Element {

    private _alertInfo: AlertInfo;

    constructor(alertContainer: JQuery, alertInfo: AlertInfo) {
        super(alertContainer);

        this.alertInfo = alertInfo;
    }

    addAlert() {
        this.jel.find(".message").html(this.alertInfo.message);
        this.jel.addClass(this.alertInfo.cssClass);
        this.jel.slideDown(300);
    }

    get alertInfo(): AlertInfo {
        return this._alertInfo;
    }

    set alertInfo(value: AlertInfo) {
        this._alertInfo = value;
    }
}