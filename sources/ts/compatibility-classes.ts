import { AmazonPay } from "./front/CFW/Compatibility/AmazonPay";
import { Braintree } from "./front/CFW/Compatibility/Braintree";
import { Klarna } from "./front/CFW/Compatibility/Klarna";
import { PayPalForWooCommerce } from "./front/CFW/Compatibility/PayPalForWooCommerce";

export let CompatibilityClasses: any = {};

CompatibilityClasses.AmazonPay = AmazonPay;
CompatibilityClasses.Braintree = Braintree;
CompatibilityClasses.Klarna = Klarna;
CompatibilityClasses.PayPalForWooCommerce = PayPalForWooCommerce;