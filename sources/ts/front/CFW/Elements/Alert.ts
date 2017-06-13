import { Element }              from "Element";
import { AlertInfo }            from "../Types/Types";

/**
 *
 */
export class Alert extends Element {

    /**
     *
     */
    private _alertInfo: AlertInfo;

    /**
     *
     * @param alertContainer
     * @param alertInfo
     */
    constructor(alertContainer: JQuery, alertInfo: AlertInfo) {
        super(alertContainer);

        this.alertInfo = alertInfo;
    }

    /**
     *
     */
    addAlert(): void {
        this.jel.find(".message").html(this.alertInfo.message);
        this.jel.addClass(this.alertInfo.cssClass);
        this.jel.slideDown(300);
    }

    /**
     *
     * @returns {AlertInfo}
     */
    get alertInfo(): AlertInfo {
        return this._alertInfo;
    }

    /**
     *
     * @param value
     */
    set alertInfo(value: AlertInfo) {
        this._alertInfo = value;
    }
}