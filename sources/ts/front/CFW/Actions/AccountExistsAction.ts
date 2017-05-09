import { Action }                       from "./Action";
import { AccountExistsResponse }        from "../Types/Types";
import { AccountExistsData }            from "../Types/Types";
import { AjaxInfo }                     from "../Types/Types";
import { ResponsePrep }                 from "../Decorators/ResponsePrep";

export class AccountExistsAction extends Action {
    constructor(id: string, ajaxInfo: AjaxInfo, email: string) {
        let data: AccountExistsData = {
            action: id,
            security: ajaxInfo.nonce,
            email: email
        };

        super(id, ajaxInfo.admin_url, data);
    }

    @ResponsePrep
    public response(resp: AccountExistsResponse) {
        if(resp.account_exists) {
            $("#cfw-login-slide").slideDown(300);
            $("#cfw-login-slide input[type='password']").focus();
            $("#cfw-acc-register-chk").attr('checked', null);
        } else {
            $("#cfw-login-slide").slideUp(300);
            $("#cfw-acc-register-chk").attr('checked', '');
        }
    }
}