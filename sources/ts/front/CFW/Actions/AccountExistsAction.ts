import { Action }                       from "./Action";
import { AccountExistsResponse }        from "../Types/Types";
import { AccountExistsData }            from "../Types/Types";
import { AjaxInfo }                     from "../Types/Types";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";
import { AlertInfo, Alert }             from "../Elements/Alert";

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
        let accontExistsActions = () => {
            $("#cfw-login-slide").slideDown(300);
            $("#cfw-login-slide input[type='password']").focus();
            $("#cfw-acc-register-chk").attr('checked', null);
            $("#cfw-login-btn").css('display', 'block');
        };

        if(resp.account_exists) {

            // If we start out on another tab, switch us back and focus
            this.ezTabContainer.bind('easytabs:after', () => {
                if(resp.account_exists) {
                    accontExistsActions();
                }
            });

            // Slide down, focus, and un-tick the register box
            accontExistsActions();

            this.ezTabContainer.easytabs('select', '#cfw-customer-info');
        } else {
            if($("#cfw-acc-register-chk:checked").length > 0) {
                $("#cfw-login-slide").slideDown(300);
                $("#cfw-login-btn").css('display', 'none');
            } else {
                if($("#cfw-acc-register-chk").length > 0) {
                    $("#cfw-login-slide").slideUp(300);
                } else {
                    $("#cfw-login-slide").css('display', 'block');
                    $("#cfw-login-btn").css('display', 'none');
                }
                // Account doesn't exist and dont want to make an account? Slide us back up
                $("#cfw-login-slide input[type='password']").val('');
            }
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