import { CompatibilityFactory } from "./front/CFW/Factories/CompatibilityFactory";
import { AmazonPay } from "./front/CFW/Compatibility/AmazonPay";
import { BlueCheck } from "./front/CFW/Compatibility/BlueCheck";
import { Braintree } from "./front/CFW/Compatibility/Braintree";
import { EUVatNumber } from "./front/CFW/Compatibility/EUVatNumber";
import { KlarnaCheckout } from "./front/CFW/Compatibility/KlarnaCheckout";
import { NLPostcodeChecker } from "./front/CFW/Compatibility/NLPostcodeChecker";
import { PayPalCheckout } from "./front/CFW/Compatibility/PayPalCheckout";
import { PayPalForWooCommerce } from "./front/CFW/Compatibility/PayPalForWooCommerce";
import { Square } from "./front/CFW/Compatibility/Square";
import { Webshipper } from "./front/CFW/Compatibility/Webshipper";

export let CompatibilityClasses: any = {};

CompatibilityClasses.CompatibilityFactory = CompatibilityFactory;
CompatibilityClasses.AmazonPay = AmazonPay;
CompatibilityClasses.BlueCheck = BlueCheck;
CompatibilityClasses.Braintree = Braintree;
CompatibilityClasses.EUVatNumber = EUVatNumber;
CompatibilityClasses.KlarnaCheckout = KlarnaCheckout;
CompatibilityClasses.NLPostcodeChecker = NLPostcodeChecker;
CompatibilityClasses.PayPalCheckout = PayPalCheckout;
CompatibilityClasses.PayPalForWooCommerce = PayPalForWooCommerce;
CompatibilityClasses.Square = Square;
CompatibilityClasses.Webshipper = Webshipper;