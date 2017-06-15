import { Action }                       from "./Action";
import { AccountExistsResponse }        from "../Types/Types";
import { AccountExistsData }            from "../Types/Types";
import { AjaxInfo }                     from "../Types/Types";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";

/**
 * Ajax does the account exist action. Takes the information from email box and fires of a request to see if the account
 * exists
 */
export class AccountExistsAction extends Action {

    /**
     * @type {JQuery}
     * @private
     */
    private _ezTabContainer: JQuery;

    /**
     *
     * @param id
     * @param ajaxInfo
     * @param email
     * @param ezTabContainer
     */
    constructor(id: string, ajaxInfo: AjaxInfo, email: string, ezTabContainer: JQuery) {
        // Object prep
        let data: AccountExistsData = {
            action: id,
            security: ajaxInfo.nonce,
            email: email
        };

        // Call parent
        super(id, ajaxInfo.admin_url, data);

        // Setup our container
        this.ezTabContainer = ezTabContainer;
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: AccountExistsResponse) {
        if(resp.account_exists) {

            // If we start out on another tab, switch us back and focus
            this.ezTabContainer.bind('easytabs:after', () => {
                if(resp.account_exists) {
                    $("#cfw-login-slide").slideDown(300);
                    $("#cfw-login-slide input[type='password']").focus();
                    $("#cfw-acc-register-chk").attr('checked', null);
                }
            });

            // Slide down, focus, and un-tick the register box
            $("#cfw-login-slide").slideDown(300);
            $("#cfw-login-slide input[type='password']").focus();
            $("#cfw-acc-register-chk").attr('checked', null);

            this.ezTabContainer.easytabs('select', '#cfw-customer-info');
        } else {

            // Account doesn't exist? Slide us back up
            $("#cfw-login-slide").slideUp(300);
            $("#cfw-acc-register-chk").attr('checked', '');
        }
    }

    /**
     * @returns {JQuery}
     */
    get ezTabContainer(): JQuery {
        return this._ezTabContainer;
    }

    /**
     * @param value
     */
    set ezTabContainer(value: JQuery) {
        this._ezTabContainer = value;
    }
}