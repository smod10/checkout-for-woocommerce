import { Compatibility } 			from "./Compatibility";
import { Main } 					from "../Main";

declare let jQuery: any;

export class KlarnaCheckout extends Compatibility {

	protected klarna_button_id = "#klarna-pay-button";

	protected show_easy_tabs = false;

	/**
	 * @param params
	 * @param load
	 */
	constructor(params: any[], load: boolean = true) {
		super(params, load);
	}

	load(main: Main, params: any): void {

		this.show_easy_tabs = params.showEasyTabs;

		// Do not initialize easy tabs service
		main.easyTabService.isDisplayed = this.show_easy_tabs;

		if(!this.show_easy_tabs) {
			this.hideWooCouponNotification();
		}

		jQuery(document).on("ready", () => {
			let pay_btn = jQuery(this.klarna_button_id);
			pay_btn.on('click', (evt) => {
                evt.preventDefault();

                window.location.href = "?payment_method=kco";
            });

            jQuery(document).on('click', '#payment_method_kco', (evt) => {
                window.location.href = "?payment_method=kco";
            });
		})
	}

	hideWooCouponNotification() {
		jQuery(".woocommerce-form-coupon-toggle").remove();
		jQuery(".checkout_coupon.woocommerce-form-coupon").remove();
	}
}