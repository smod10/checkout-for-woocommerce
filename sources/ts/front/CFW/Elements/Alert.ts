import { Element }              from "./Element";
import { AlertType }            from "../Enums/AlertType";

export type AlertInfo = { type: string, message: string, cssClass: string };

/**
 *
 */
export class Alert extends Element {

    /**
     *
     */
    private _alertInfo: AlertInfo;

    private static _previousClass: string;

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
        if(Alert.previousClass) {
            this.jel.removeClass(Alert.previousClass);
        }

        $("#cfw-content").removeClass("show-overlay");

        this.jel.find(".message").html(this.alertInfo.message);
        this.jel.addClass(this.alertInfo.cssClass);
        this.jel.slideDown(300);

        window.scrollTo(0,0);

        Alert.previousClass = this.alertInfo.cssClass;
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

    static get previousClass(): string {
        return this._previousClass;
    }

    static set previousClass(value: string) {
        this._previousClass = value;
    }
}