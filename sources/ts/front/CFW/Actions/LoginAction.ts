import { Action }                       from "./Action";
import { LogInResponse }                from "../Types/Types";
import { LogInData }                    from "../Types/Types";
import { AjaxInfo }                     from "../Types/Types";
import { Alert, AlertInfo }             from "../Elements/Alert";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";
import { Main }                         from "../Main";

declare let jQuery: any;

/**
 *
 */
export class LoginAction extends Action {

    /**
     * @type {boolean}
     * @private
     * @static
     */
    private static _loginLocked: boolean;

    /**
     *
     * @param id
     * @param ajaxInfo
     * @param email
     * @param password
     */
    constructor(id: string, ajaxInfo: AjaxInfo, email: string, password: string) {
        let data: LogInData = {
            "wc-ajax": id,
            security: ajaxInfo.nonce,
            email: email,
            password: password
        };

        super(id, ajaxInfo.url, data);
    }

    /**
     *
     * @param resp
     */
    @ResponsePrep
    public response(resp: LogInResponse): void {

        if(resp.logged_in) {
            location.reload();
        } else {
            let alertInfo: AlertInfo = {
                type: "warning",
                message: resp.message,
                cssClass: "cfw-alert-danger"
            };

            let alert: Alert = new Alert(Main.instance.alertContainer, alertInfo);
            alert.addAlert();
        }
    }
}