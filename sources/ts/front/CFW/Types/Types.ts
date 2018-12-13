import { LabelType }                from "../Enums/LabelType";

export type EventCallback = { eventName: string, func: Function, target: any };
export type InputLabelType = { type: LabelType, cssClass: string };

export type AjaxInfo = { url: string, nonce: string };

export type AccountExistsResponse = { account_exists: boolean };
export type AccountExistsData = { "wc-ajax": string, security: string, email: string };

export type LogInResponse = { logged_in: boolean, message: string };
export type LogInData = { "wc-ajax": string, security: string, email: string, password: string };
export type PaymentMethodData = { "wc-ajax": string, security: string, "payment_method": string };

export type CompleteOrderResponse = { response: any };

export type CompleteOrderCheckoutData = {
	billing_first_name: string,
	billing_last_name: string,
	billing_company: string,
	billing_country: string,
	billing_address_1: string,
	billing_address_2: string,
	billing_city: string,
	billing_state: string,
	billing_postcode: string,
	billing_phone: number,
	billing_email: string,
	ship_to_different_address: number,
	shipping_first_name: string,
	shipping_last_name: string,
	shipping_company: string,
	shipping_country: string,
	shipping_address_1: string,
	shipping_address_2: string,
	shipping_city: string,
	shipping_state: string,
	shipping_postcode: number,
	order_comments: string,
	"shipping_method[0]": string,
	payment_method: string,
	"wc-stripe-payment-token": string,
	_wpnonce: string,
	_wp_http_referer: string
}

export type StripeServiceCallbacks = { success: Function, noData: Function, badData: Function };

export type StripeResponse = {
	code: 400 | 402 | 200,
	resp: StripeValidResponse | StripeNoDataResponse | StripeBadDataResponse,
	requestId: number
}

export type StripeValidResponse = {
	card: StripeCard,
	client_ip: string,
	created: number,
	id: string,
	livemode: boolean,
	object: string,
	type: string,
	used: boolean
}

export type StripeCard = {
	address_city: string,
	address_country: string,
	address_line1: string,
	address_line1_check: string,
	address_line2: string,
	address_state: string,
	address_zip: string,
	address_zip_check: string,
	brand: string,
	country: string,
	cvc_check: string,
	dynamic_last4: any,
	exp_month: number,
	exp_year: number,
	funding: string,
	id: string,
	last4: string,
	metadata: any,
	name: string,
	object: "card",
	tokenization_method: any
}

export type CompatibilityClassOptions = {
	class: string,
	params: any,
	event: CompatibilityClassOptionsEvent,
	fireLoad: boolean
}

export type CompatibilityClassOptionsEvent = "before-setup" | "after-setup";

export type StripeNoDataResponse = {
	error: {type: string, message: string}
}

export type StripeBadDataResponse = {
	error: {message: string, type: string, param: string, code: string}
}

export type FieldTypeInfo = { field_type: string, field_value: any };
