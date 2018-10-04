import { Action }                               from "./Action";
import { AjaxInfo }                             from "../Types/Types";
import { AlertInfo }                            from "../Elements/Alert";
import { Alert }                                from "../Elements/Alert";
import { ValidationService }                    from "../Services/ValidationService";
import { EValidationSections }                  from "../Services/ValidationService";
import { Main }                                 from "../Main";
import { TabContainer }                         from "../Elements/TabContainer";

declare let $: any;

export class CompleteOrderAction extends Action {

    /**
     * @type {boolean}
     * @static
     * @private
     */
    private static _preppingOrder: boolean = false;

    /**
     *
     * @param id
     * @param ajaxInfo
     * @param checkoutData
     */
    constructor(id: string, ajaxInfo: AjaxInfo, checkoutData: any) {
        super(id, ajaxInfo.url, Action.prep(id, ajaxInfo, checkoutData));

        Main.addOverlay();

        this.setup();
    }

    /**
     * The setup function which mainly determines if we need a stripe token to continue
     */
    setup(): void {
        Main.instance.checkoutForm.off('form:validate');

        this.load();
    }

    /**
     * @param resp
     */
    public response(resp: any): void {

        let tabContainer: TabContainer = Main.instance.tabContainer;

        if(resp.result === "success") {
            // Destroy all the cache!
            $('.garlic-auto-save').each((index: number, elem: Element) => $(elem).garlic('destroy'));

            // Destroy all the parsley!
            Main.instance.checkoutForm.parsley().destroy();

            // Redirect all the browsers! (well just the 1)
            window.location.href = resp.redirect;
        }

        if(resp.result === "failure") {
            let alertInfo: AlertInfo = {
                type: "AccPassRequiredField",
                message: resp.messages,
                cssClass: "cfw-alert-danger"
            };

            let alert: Alert = new Alert($("#cfw-alert-container"), alertInfo);
            alert.addAlert();

            if(tabContainer.errorObserver !== undefined && tabContainer.errorObserver !== null) {
                tabContainer.errorObserver.disconnect();
                tabContainer.errorObserver = null;
            }
        }
    }

    /**
     * @returns {boolean}
     */
    static get preppingOrder(): boolean {
        return this._preppingOrder;
    }

    /**
     * @param {boolean} value
     */
    static set preppingOrder(value: boolean) {
        this._preppingOrder = value;
    }
}