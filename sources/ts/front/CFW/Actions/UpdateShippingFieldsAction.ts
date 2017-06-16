import { Action }                                   from "./Action";
import { AjaxInfo }                                 from "../Types/Types";
import { UpdateShippingFieldsData }                 from "../Types/Types";
import { UpdateShippingFieldsResponse }             from "../Types/Types";
import { CustomerDataInfo }                         from "../Types/Types";
import { ResponsePrep }                             from "../Decorators/ResponsePrep";

/**
 *
 */
export class UpdateShippingFieldsAction extends Action {

    /**
     *
     */
    private _shipping_details_fields: Array<JQuery>;

    /**
     *
     * @param id
     * @param ajaxInfo
     * @param shipping_fields_info
     * @param shipping_details_fields
     */
    constructor(id:string, ajaxInfo: AjaxInfo, shipping_fields_info: Array<CustomerDataInfo>, shipping_details_fields: Array<JQuery>) {
        let data: UpdateShippingFieldsData = {
            action: id,
            security: ajaxInfo.nonce,
            shipping_fields_info: shipping_fields_info
        };

        super(id, ajaxInfo.admin_url, data);

        this.shipping_details_fields = shipping_details_fields;
    }

    /**
     *
     * @param resp
     */
    @ResponsePrep
    public response(resp: UpdateShippingFieldsResponse) {
        if(!resp.error) {
            let ufi_arr: Array<CustomerDataInfo> = [];

            if(resp.updated_fields_info) {
                Object.keys(resp.updated_fields_info).forEach((key) => {
                    ufi_arr.push(<CustomerDataInfo>resp.updated_fields_info[key]);
                });
                ufi_arr.sort();

                ufi_arr.forEach((ufi: CustomerDataInfo) => {
                    let ft: string = ufi.field_type;
                    let fv: any = ufi.field_value;

                    this.shipping_details_fields.forEach((field: JQuery) => {
                        if (field.attr("field_type") == ft) {
                            field.children(".field_value").text(fv);
                        }
                    });
                });

                $("#cfw-cart-shipping-total .amount").html(resp.new_shipping_total);
            } else {
                console.log(resp);
            }
        }
    }

    get shipping_details_fields(): Array<JQuery> {
        return this._shipping_details_fields;
    }

    set shipping_details_fields(value: Array<JQuery>) {
        this._shipping_details_fields = value;
    }
}