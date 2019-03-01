import { Action }                       from "./Action";
import { AccountExistsResponse }        from "../Types/Types";
import { AccountExistsData }            from "../Types/Types";
import { AjaxInfo }                     from "../Types/Types";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";

declare let jQuery: any;
let w: any = window;

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
        let login_slide: any = jQuery("#cfw-login-slide");
        let $create_account = jQuery("#createaccount");
        let register_user_checkbox: any = ($create_account.length > 0) ? $create_account : null;
        let register_container: any = jQuery("#cfw-login-details .cfw-check-input");

        // If account exists slide down the password field, uncheck the register box, and hide the container for the checkbox
        if ( resp.account_exists ) {
            if( ! login_slide.hasClass("stay-open") ) {
                login_slide.slideDown(300);
            }

            if ( register_user_checkbox && register_user_checkbox.is(':checkbox') ) {
                register_user_checkbox.prop('checked', false);
                register_user_checkbox.trigger('change');
                register_user_checkbox.prop('disabled', true);
            }

            register_container.css("display", "none");

            AccountExistsAction.checkBox = true;
            // If account does not exist, reverse
        } else {
            if( ! login_slide.hasClass("stay-open") ) {
                login_slide.slideUp(300);
            }

            register_container.css("display", "block");

            if (AccountExistsAction.checkBox) {
                if ( register_user_checkbox && register_user_checkbox.is(':checkbox') ) {
                    if ( w.cfwEventData.settings.check_create_account_by_default == true ) {
                        register_user_checkbox.prop('checked', true);
                    }

                    register_user_checkbox.trigger('change');
                    register_user_checkbox.prop('disabled', false);
                }

                AccountExistsAction.checkBox = false;
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