import { LabelType }                from "../Enums/LabelType";
import { AlertType }                from "../Enums/AlertType";

export type EventCallback = { eventName: string, func: Function, target: JQuery };
export type InputLabelType = { type: LabelType, cssClass: string };

export type AjaxInfo = { admin_url: URL, nonce: string };
export type AlertInfo = { type: AlertType, message: string, cssClass: string };

export type AccountExistsResponse = { account_exists: boolean };
export type AccountExistsData = { action: string, security: string, email: string };

export type LogInResponse = { logged_in: boolean, message: string };
export type LogInData = { action: string, security: string, email: string, password: string };

export type UpdateShippingFieldsResponse = { error: boolean, updated_fields_info: Array<CustomerDataInfo>, new_shipping_total: string }
export type UpdateShippingFieldsData = { action: string, security: string, shipping_fields_info: Array<CustomerDataInfo> };
export type UpdateShippingFieldsRI = {action: string, shipping_details_fields: Array<JQuery>};

export type CustomerDataInfo = { field_type: string, field_value: any };

