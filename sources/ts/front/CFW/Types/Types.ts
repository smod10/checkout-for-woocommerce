import { LabelType }                from "../Enums/LabelType";

export type EventCallback = { eventName: string, func: Function, target: JQuery };
export type InputLabelType = { type: LabelType, cssClass: string };

export type AjaxInfo = { admin_url: URL, nonce: string };

export type AccountExistsResponse = { account_exists: boolean };
export type AccountExistsData = { action: string, security: string, email: string };

export type LogInResponse = { logged_in: boolean, message: string };
export type LogInData = { action: string, security: string, email: string, password: string };