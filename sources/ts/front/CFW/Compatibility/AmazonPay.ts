import { Compatibility } from "./Compatibility";
import {Main} from "../Main";
import {Alert, AlertInfo} from "../Elements/Alert";

declare let OffAmazonPayments: any;
declare let amazon_payments_advanced_params: any;
declare let woocommerce_params: any;

export class AmazonPay extends Compatibility {
	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	/**
	 * Run the compatibility
	 *
	 * @param main
	 */
	load(main: Main): void {
		const errorKey = 'cfw_amazon_redirect_error';
		let easyTabsWrap: any = main.easyTabService.easyTabsWrap;
		let getParams = this.getUrlParamsMap();

		$(window.document).on("wc_amazon_pa_widget_ready", () => {
			$("#cfw-first-for-plugins, #cfw-last-for-plugins, #cfw-email-wrap").addClass("cfw-floating-label");
		});

		if(getParams[errorKey] !== undefined) {
			let alertInfo: AlertInfo = {
				type: "AccPassRequiredField",
				message: $(".woocommerce-error").html(),
				cssClass: "cfw-alert-danger"
			};

			$(".woocommerce-error").remove();

			let alert: Alert = new Alert(Main.instance.alertContainer, alertInfo);
			alert.addAlert();

			$("#checkout").addClass("has-overlay");
			$("#cfw-deductors-list").addClass("has-overlay");
			$("#checkout").append("<div class='amazon-pay-overlay'></div>");
			$("#cfw-deductors-list").append("<div class='amazon-pay-overlay'></div>");

			if(amazon_payments_advanced_params !== undefined &&
				amazon_payments_advanced_params.declined_code !== undefined &&
				amazon_payments_advanced_params.declined_code === "InvalidPaymentMethod") {

				setTimeout(() => {
					location.href = location.href = location.href.replace(`${errorKey}=1`, '');
				}, 3000);
			}

			return;
		}

		/**
		 * If the OffAmazonPayments and amazon_payments_advanced_params exist we can then check to see if there is a reference
		 * id set. If not we are not logged in. If there is we are logged in.
		 */
		try {
			if (OffAmazonPayments !== undefined &&
				amazon_payments_advanced_params !== undefined &&
				(amazon_payments_advanced_params.reference_id !== "" || amazon_payments_advanced_params.access_token !== "")
			) {
				$("#cfw-billing-methods .create-account").remove();
				$("#payment-info-separator-wrap").hide();
				$("#cfw-shipping-same-billing").hide();
				$("#cfw-billing-methods > .cfw-module-title").hide();
				$("#cfw-shipping-info > .cfw-module-title").hide();

				console.log("Fired amazon pay class actions");

				easyTabsWrap.bind('easytabs:after', (event, clicked, target) => this.amazonRefresh());

				(<any>window).addEventListener("cfw-checkout-failed-before-error-message", ({detail}) => {
					let response = detail.response;

					if (response.reload) {
						let errorParam = `&${errorKey}=1`;

						location.href = amazon_payments_advanced_params.redirect + errorParam;
					}
				});
			}
		}catch(error) {
			console.log(error);
		}
	}

	getUrlParamsMap() {
		let map = {};
		let urlGetParams = location.href.split("&").splice(1).map(paramSet => {
			let keyValue = paramSet.split("=");
			let key = keyValue[0];
			let value = keyValue[1];

			map[key] = value;
		});

		return map;
	}

	/**
	 * Refreshes and loads the split amazon setup
	 */
	amazonRefresh() {
		OffAmazonPayments.Widgets.Utilities.setup();
	}
}