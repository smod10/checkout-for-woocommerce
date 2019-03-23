import { CompatibilityFactory } from "./front/CFW/Factories/CompatibilityFactory";
import { AmazonPay } from "./front/CFW/Compatibility/AmazonPay";
import { Braintree } from "./front/CFW/Compatibility/Braintree";
import { EUVatNumber } from "./front/CFW/Compatibility/EUVatNumber";
import { KlarnaCheckout } from "./front/CFW/Compatibility/KlarnaCheckout";
import { PayPalCheckout } from "./front/CFW/Compatibility/PayPalCheckout";
import { PayPalForWooCommerce } from "./front/CFW/Compatibility/PayPalForWooCommerce";
import { Square } from "./front/CFW/Compatibility/Square";
import { Webshipper } from "./front/CFW/Compatibility/Webshipper";

export let CompatibilityClasses: any = {};

CompatibilityClasses.CompatibilityFactory = CompatibilityFactory;
CompatibilityClasses.AmazonPay = AmazonPay;
CompatibilityClasses.Braintree = Braintree;
CompatibilityClasses.EUVatNumber = EUVatNumber;
CompatibilityClasses.KlarnaCheckout = KlarnaCheckout;
CompatibilityClasses.PayPalCheckout = PayPalCheckout;
CompatibilityClasses.PayPalForWooCommerce = PayPalForWooCommerce;
CompatibilityClasses.Square = Square;
CompatibilityClasses.Webshipper = Webshipper;