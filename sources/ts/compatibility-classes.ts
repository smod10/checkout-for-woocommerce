import { Braintree } from "./front/CFW/Compatibility/Braintree";
import { PayPalForWooCommerce } from "./front/CFW/Compatibility/PayPalForWooCommerce";

export let CompatibilityClasses: any = {};

CompatibilityClasses.Braintree = Braintree;
CompatibilityClasses.PayPalForWooCommerce = PayPalForWooCommerce;