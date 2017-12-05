import {Action} from "./Action";
import {AjaxInfo} from "../Types/Types";
import {Main} from "../Main";

export class UpdateCheckoutAction extends Action {

    constructor(id: string, ajaxInfo: AjaxInfo, fields: any) {
        super(id, ajaxInfo.admin_url, Action.prep(id, ajaxInfo, fields));
    }

    public response(resp: any): void {
        Main.instance.updating = false;


    }
}