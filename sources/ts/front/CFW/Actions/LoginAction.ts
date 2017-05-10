import { Action }                       from "./Action";
import { LogInResponse }                from "../Types/Types";
import { LogInData }                    from "../Types/Types";
import { AjaxInfo }                     from "../Types/Types";
import { AlertInfo }                    from "../Types/Types";
import { Alert }                        from "../Elements/Alert";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";
import { AlertType }                    from "../Enums/AlertType";

export class LoginAction extends Action {
    constructor(id: string, ajaxInfo: AjaxInfo, email: string, password: string) {
        let data: LogInData = {
            action: id,
            security: ajaxInfo.nonce,
            email: email,
            password: password
        };

        super(id, ajaxInfo.admin_url, data);
    }

    @ResponsePrep
    public response(resp: LogInResponse) {
        console.log(resp);
        if(resp.logged_in) {
            location.reload();
        } else {
            let alertInfo: AlertInfo = {
                type: AlertType.LoginFailBadAccInfo,
                message: "Incorrect username or password",
                cssClass: "cfw-alert-danger"
            };
            let alert: Alert = new Alert($("#cfw-alert-container"), alertInfo);
            alert.addAlert();

            console.log(alert);
        }
    }
}