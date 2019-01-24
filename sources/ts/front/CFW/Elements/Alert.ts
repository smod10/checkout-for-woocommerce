import { Element }              from "./Element";
import { Main }                 from "../Main";

export type AlertInfo = {
    type: "error" | "warning" | "success",
    message: any,
    cssClass: string
};

declare let jQuery: any;

/**
 *
 */
export class Alert extends Element {

    /**
     * @type {AlertInfo}
     * @private
     */
    private _alertInfo: AlertInfo;

    /**
     * @type {string}
     * @private
     * @static
     */
    private static _previousClass: string;

    /**
     *
     * @param alertContainer
     * @param alertInfo
     */
    constructor(alertContainer: any, alertInfo: AlertInfo) {
		super(alertContainer);

		this.alertInfo = alertInfo;
	}

    /**
     *
     */
    addAlert(): void {
        // If error, trigger checkout_error event
        if(this.alertInfo.type === "error") {
			jQuery(document.body).trigger('checkout_error');
		}

        if(Alert.previousClass) {
            this.jel.removeClass(Alert.previousClass);
        }

        Main.removeOverlay();

        this.jel.find(".message").html(this.alertInfo.message);
        this.jel.addClass(this.alertInfo.cssClass);
        this.jel.slideDown(300);

        // We don't really need this once other alerts are showing up.
        jQuery('#cfw-wc-print-notices').slideUp(300);

        window.scrollTo(0,0);

        Alert.previousClass = this.alertInfo.cssClass;

        window.dispatchEvent(new CustomEvent("cfw-add-alert-event", { detail: { alertInfo: this.alertInfo } }));
    }

    /**
     * @param {any} alertContainer
     */
    static removeAlerts(alertContainer: any): void {
        alertContainer.find(".message").html("");
        alertContainer.attr("class", "cfw-alert");
        alertContainer.css("display", "none");
    }

    /**
     * @returns {AlertInfo}
     */
    get alertInfo(): AlertInfo {
        return this._alertInfo;
    }

    /**
     * @param value
     */
    set alertInfo(value: AlertInfo) {
        this._alertInfo = value;
    }

    /**
     * @returns {string}
     */
    static get previousClass(): string {
        return this._previousClass;
    }

    /**
     * @param {string} value
     */
    static set previousClass(value: string) {
        this._previousClass = value;
    }
}