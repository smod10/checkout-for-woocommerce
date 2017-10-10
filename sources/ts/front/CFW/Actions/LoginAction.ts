import { Action }                       from "./Action";
import { LogInResponse }                from "../Types/Types";
import { LogInData }                    from "../Types/Types";
import { AjaxInfo }                     from "../Types/Types";
import { Alert, AlertInfo }             from "../Elements/Alert";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";

/**
 *
 */
export class LoginAction extends Action {

    /**
     *
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
            action: id,
            security: ajaxInfo.nonce,
            email: email,
            password: password
        };

        super(id, ajaxInfo.admin_url, data);
    }

    /**
     *
     * @param resp
     */
    @ResponsePrep
    public response(resp: LogInResponse) {

        if(resp.logged_in) {
            location.reload();
        } else {
            let alertInfo: AlertInfo = {
                type: "LoginFailBadAccInfo",
                message: resp.message,
                cssClass: "cfw-alert-danger"
            };

            let alert: Alert = new Alert($("#cfw-alert-container"), alertInfo);
            alert.addAlert();
        }
    }
}