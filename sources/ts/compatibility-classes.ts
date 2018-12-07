import { CompatibilityFactory } from "./front/CFW/Factories/CompatibilityFactory";
import { AmazonPay } from "./front/CFW/Compatibility/AmazonPay";
import { Braintree } from "./front/CFW/Compatibility/Braintree";
import { KlarnaCheckout } from "./front/CFW/Compatibility/KlarnaCheckout";
import { KlarnaPayment } from "./front/CFW/Compatibility/KlarnaPayment";
import { PayPalForWooCommerce } from "./front/CFW/Compatibility/PayPalForWooCommerce";

export let CompatibilityClasses: any = {};

CompatibilityClasses.CompatibilityFactory = CompatibilityFactory;
CompatibilityClasses.AmazonPay = AmazonPay;
CompatibilityClasses.Braintree = Braintree;
CompatibilityClasses.KlarnaCheckout = KlarnaCheckout;
CompatibilityClasses.KlarnaPayment = KlarnaPayment;
CompatibilityClasses.PayPalForWooCommerce = PayPalForWooCommerce;