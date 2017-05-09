import { Action }                       from "./Action";
import { LogInResponse }                from "../Types/Types";
import { LogInData }                    from "../Types/Types";
import { AjaxInfo }                     from "../Types/Types";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";

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
        if(resp.logged_in) {
            location.reload();
        }
    }
}