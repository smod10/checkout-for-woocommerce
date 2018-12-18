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
     * @type {any}
     * @private
     */
    private _ezTabContainer: any;

    /**
     * @type {boolean}
     * @private
     */
    private static _checkBox: boolean = true;

    /**
     * @param id
     * @param ajaxInfo
     * @param email
     * @param ezTabContainer
     */
    constructor(id: string, ajaxInfo: AjaxInfo, email: string, ezTabContainer: any) {
        // Object prep
        let data: AccountExistsData = {
            "wc-ajax": id,
            security: ajaxInfo.nonce,
            email: email
        };

        // Call parent
        super(id, ajaxInfo.url, data);

        // Setup our container
        this.ezTabContainer = ezTabContainer;
    }

    /**
     * @param resp
     */
    @ResponsePrep
    public response(resp: AccountExistsResponse): void {
        let login_slide: any = $("#cfw-login-slide");
        let $create_account = $("#createaccount");
        let register_user_checkbox: any = ($create_account.length > 0) ? $create_account : null;
        let register_container: any = $("#cfw-login-details .cfw-check-input");

        if( ! login_slide.hasClass("stay-open") ) {
			// If account exists slide down the password field, uncheck the register box, and hide the container for the checkbox
			if ( resp.account_exists ) {
				login_slide.slideDown(300);

                if ( register_user_checkbox && register_user_checkbox.is(':checkbox') ) {
                    register_user_checkbox.checked = false;
                    $(register_user_checkbox).trigger('change');
                }

                $create_account.prop('checked', false);

				AccountExistsAction.checkBox = true;
				// If account does not exist, reverse
			} else {
				login_slide.slideUp(300);

				if (AccountExistsAction.checkBox) {
				    if ( register_user_checkbox && register_user_checkbox.is(':checkbox') ) {
                        register_user_checkbox.checked = true;
                        $(register_user_checkbox).trigger('change');
                    }

					AccountExistsAction.checkBox = false;
				}
				
                $create_account.prop('checked', true);
			}
		}
    }

    /**
     * @returns {any}
     */
    get ezTabContainer(): any {
        return this._ezTabContainer;
    }

    /**
     * @param value
     */
    set ezTabContainer(value: any) {
        this._ezTabContainer = value;
    }

    /**
     * @returns {boolean}
     */
    static get checkBox(): boolean {
        return AccountExistsAction._checkBox;
    }

    /**
     * @param {boolean} value
     */
    static set checkBox(value: boolean) {
        AccountExistsAction._checkBox = value;
    }
}