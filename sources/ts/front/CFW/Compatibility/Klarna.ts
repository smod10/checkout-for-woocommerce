import { Compatibility } 			from "./Compatibility";
import { Main } 					from "../Main";

export class Klarna extends Compatibility {

	protected klarna_button_id = "#klarna-pay-button";

	protected is_klarna_selected = false;

	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	load(main: Main, params: any): void {

		this.is_klarna_selected = params.showEasyTabs;

		// Do not initialize easy tabs service
		main.easyTabService.isDisplayed = params.showEasyTabs;

		$(document).on("ready", () => {
			let pay_btn = $(this.klarna_button_id);
			pay_btn.on('click', (evt) => {
				evt.preventDefault();

				window.location.href = "?payment_method=klarna"
			})
		})
	}

	hideWooCouponNotification() {
		$(".woocommerce-form-coupon-toggle").hide();
	}
}