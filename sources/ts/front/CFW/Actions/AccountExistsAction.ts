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
     * @type {boolean}
     * @private
     */
    private static _checkBox: boolean = true;

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
        let login_slide: any = $("#cfw-login-slide");
        let register_user_checkbox: any = $("#cfw-acc-register-chk")[0];
        let register_container: any = $("#cfw-login-details .cfw-check-input");

        // If account exists slide down the password field, uncheck the register box, and hide the container for the checkbox
        if(resp.account_exists) {
            login_slide.slideDown(300);
            register_user_checkbox.checked = false;
            register_container.css("display", "none");

            AccountExistsAction.checkBox = true;

        // If account does not exist, reverse
        } else {
            login_slide.slideUp(300);

            if(AccountExistsAction.checkBox) {
                register_user_checkbox.checked = true;
                AccountExistsAction.checkBox = false;
            }

            register_container.css("display", "block");
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

    static get checkBox(): boolean {
        return AccountExistsAction._checkBox;
    }

    static set checkBox(value: boolean) {
        AccountExistsAction._checkBox = value;
    }
}