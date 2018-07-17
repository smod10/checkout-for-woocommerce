/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../../../../typings/index.d.ts" />
/// <reference path="Definitions/ArrayFind.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationService_1 = __webpack_require__(7);
var EasyTabService_1 = __webpack_require__(3);
var ParsleyService_1 = __webpack_require__(34);
var LocalizationService_1 = __webpack_require__(35);
/**
 * The main class of the front end checkout system
 */
var Main = /** @class */ (function () {
    /**
     * @param checkoutFormEl
     * @param tabContainer
     * @param ajaxInfo
     * @param cart
     * @param settings
     */
    function Main(checkoutFormEl, tabContainer, ajaxInfo, cart, settings) {
        Main.instance = this;
        checkoutFormEl.garlic({
            events: ['textInput', 'input', 'change', 'click', 'keypress', 'paste', 'focus'],
            destroy: false,
            excluded: 'input[type="file"], input[type="hidden"], input[type="submit"], input[type="reset"], input[name="paypal_pro-card-number"], input[name="paypal_pro-card-cvc"], input[name="wc-authorize-net-aim-account-number"], input[name="wc-authorize-net-aim-csc"], input[name="paypal_pro_payflow-card-number"], input[name="paypal_pro_payflow-card-cvc"], input[name="paytrace-card-number"], input[name="paytrace-card-cvc"], input[id="stripe-card-number"], input[id="stripe-card-cvc"], input[name="creditCard"], input[name="cvv"], input.wc-credit-card-form-card-number, input[name="wc-authorize-net-cim-credit-card-account-number"], input[name="wc-authorize-net-cim-credit-card-csc"], input.wc-credit-card-form-card-cvc, input.js-sv-wc-payment-gateway-credit-card-form-account-number, input.js-sv-wc-payment-gateway-credit-card-form-csc, input.shipping_method'
        });
        this.checkoutForm = checkoutFormEl;
        this.tabContainer = tabContainer;
        this.ajaxInfo = ajaxInfo;
        this.cart = cart;
        this.settings = settings;
        this.parsleyService = new ParsleyService_1.ParsleyService();
        this.easyTabService = new EasyTabService_1.EasyTabService();
        this.validationService = new ValidationService_1.ValidationService();
        this.localizationService = new LocalizationService_1.LocalizationService();
        // Handle Stripe gateway UI blocking function
        // Otherwise we throw errors
        // Also discard our overlay when the modal is closed on desktop and mobile
        $.fn.block = function (item) {
            Main.addOverlay();
        };
        $.fn.unblock = function (item) {
            Main.removeOverlay();
        };
        $.fn.blockUI = function (item) {
            Main.addOverlay();
        };
        $.fn.unblockUI = function (item) {
            Main.removeOverlay();
        };
    }
    /**
     * Sets up the tab container by running easy tabs, setting up animation listeners, and setting up events and on load
     * functionality
     */
    Main.prototype.setup = function () {
        // Setup easy tabs
        this.tabContainer.easyTabs();
        // Setup animation listeners
        this.setupAnimationListeners();
        // Set up credit card fields if there. Needs to happen before wrap
        this.tabContainer.setUpCreditCardFields();
        // Fix floating labels
        this.tabContainer.setFloatLabelOnGarlicRetrieve();
        /**
         * NOTE: If you are doing any DOM manipulation (adding and removing classes specifically). Do it before the setWraps
         * call on the tab container sections. Once this is called all the setup of the different areas will have completed and
         * wont be run again until next page load
         */
        // Loop through and set up the wraps on the tab container sections
        this.tabContainer.tabContainerSections.forEach(function (tcs) { return tcs.setWraps(); });
        // Set up event handlers
        this.tabContainer.setAccountCheckListener();
        this.tabContainer.setLogInListener();
        this.tabContainer.setUpdateAllShippingFieldsListener();
        this.tabContainer.setShippingPaymentUpdate();
        this.tabContainer.setUpPaymentTabRadioButtons();
        this.tabContainer.setUpCreditCardRadioReveal();
        this.tabContainer.setUpMobileCartDetailsReveal();
        this.tabContainer.setCompleteOrderHandlers();
        this.tabContainer.setApplyCouponListener();
        this.tabContainer.setTermsAndConditions();
        this.tabContainer.setUpdateCheckout();
        // Localization
        this.localizationService.setCountryChangeHandlers();
        // Handles the shipping fields on load if the user happens to land on the shipping method page.
        this.tabContainer.setShippingFieldsOnLoad();
    };
    /**
     * Adds a visual indicator that the checkout is doing something
     */
    Main.addOverlay = function () {
        $("body").addClass("show-overlay");
    };
    Main.removeOverlay = function () {
        $("body").removeClass("show-overlay");
    };
    /**
     * @returns {boolean}
     */
    Main.isPaymentRequired = function () {
        return !$("#cfw-content").hasClass("cfw-payment-false");
    };
    /**
     * @param {boolean} isPaymentRequired
     */
    Main.togglePaymentRequired = function (isPaymentRequired) {
        var $cfw = $("#cfw-content");
        var noPaymentCssClass = "cfw-payment-false";
        if (!isPaymentRequired) {
            if (!$cfw.hasClass(noPaymentCssClass)) {
                $cfw.addClass(noPaymentCssClass);
            }
            if (EasyTabService_1.EasyTabService.isThereAShippingTab()) {
                this.toggleBillingFieldsAbility(true);
            }
            // Always uncheck the payment method if order does not require payment
            $('[name="payment_method"]:checked').prop("checked", false);
        }
        else {
            if (EasyTabService_1.EasyTabService.isThereAShippingTab()) {
                this.toggleBillingFieldsAbility(false);
            }
            $cfw.removeClass(noPaymentCssClass);
        }
    };
    Main.toggleBillingFieldsAbility = function (enabled) {
        Main.instance.settings.default_address_fields.forEach(function (field_name) {
            $("[name=\"billing_" + field_name + "\"]").prop('disabled', enabled);
        });
        if (enabled) {
            $("#ship_to_different_address_as_billing").prop("checked", true);
        }
    };
    /**
     * Sets up animation listeners
     */
    Main.prototype.setupAnimationListeners = function () {
        $("#cfw-ci-login").on("click", function () {
            $("#cfw-login-slide").slideDown(300);
        });
    };
    Object.defineProperty(Main.prototype, "updating", {
        /**
         * @returns {boolean}
         */
        get: function () {
            return this._updating;
        },
        /**
         * @param {boolean} value
         */
        set: function (value) {
            this._updating = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "checkoutForm", {
        /**
         * @returns {JQuery}
         */
        get: function () {
            return this._checkoutForm;
        },
        /**
         * @param {JQuery} value
         */
        set: function (value) {
            this._checkoutForm = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "tabContainer", {
        /**
         * @returns {TabContainer}
         */
        get: function () {
            return this._tabContainer;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._tabContainer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "ajaxInfo", {
        /**
         * @returns {AjaxInfo}
         */
        get: function () {
            return this._ajaxInfo;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._ajaxInfo = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "cart", {
        /**
         * @returns {Cart}
         */
        get: function () {
            return this._cart;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._cart = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "settings", {
        /**
         * @returns {any}
         */
        get: function () {
            return this._settings;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._settings = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "parsleyService", {
        /**
         * @returns {ParsleyService}
         */
        get: function () {
            return this._parsleyService;
        },
        /**
         * @param {ParsleyService} value
         */
        set: function (value) {
            this._parsleyService = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "easyTabService", {
        /**
         * @returns {EasyTabService}
         */
        get: function () {
            return this._easyTabService;
        },
        /**
         * @param {EasyTabService} value
         */
        set: function (value) {
            this._easyTabService = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "validationService", {
        /**
         * @returns {ValidationService}
         */
        get: function () {
            return this._validationService;
        },
        /**
         * @param {ValidationService} value
         */
        set: function (value) {
            this._validationService = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "localizationService", {
        /**
         * @returns {LocalizationService}
         */
        get: function () {
            return this._localizationService;
        },
        /**
         * @param {LocalizationService} value
         */
        set: function (value) {
            this._localizationService = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main, "instance", {
        /**
         * @returns {Main}
         */
        get: function () {
            return Main._instance;
        },
        /**
         * @param {Main} value
         */
        set: function (value) {
            if (!Main._instance) {
                Main._instance = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    return Main;
}());
exports.Main = Main;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(src) {
	function log(error) {
		(typeof console !== "undefined")
		&& (console.error || console.log)("[Script Loader]", error);
	}

	// Check for IE =< 8
	function isIE() {
		return typeof attachEvent !== "undefined" && typeof addEventListener === "undefined";
	}

	try {
		if (typeof execScript !== "undefined" && isIE()) {
			execScript(src);
		} else if (typeof eval !== "undefined") {
			eval.call(null, src);
		} else {
			log("EvalError: No eval function available");
		}
	} catch (error) {
		log(error);
	}
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var Element = /** @class */ (function () {
    /**
     * @param jel
     */
    function Element(jel) {
        this.jel = jel;
    }
    Object.defineProperty(Element.prototype, "jel", {
        /**
         * @returns {JQuery}
         */
        get: function () {
            return this._jel;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._jel = value;
        },
        enumerable: true,
        configurable: true
    });
    return Element;
}());
exports.Element = Element;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Main_1 = __webpack_require__(0);
/**
 * EzTab Enum
 */
var EasyTab;
(function (EasyTab) {
    EasyTab[EasyTab["CUSTOMER"] = 0] = "CUSTOMER";
    EasyTab[EasyTab["SHIPPING"] = 1] = "SHIPPING";
    EasyTab[EasyTab["PAYMENT"] = 2] = "PAYMENT";
})(EasyTab = exports.EasyTab || (exports.EasyTab = {}));
/**
 *
 */
var EasyTabService = /** @class */ (function () {
    function EasyTabService() {
    }
    /**
     * Returns the current and target tab indexes
     *
     * @param target
     * @returns {EasyTabDirection}
     */
    EasyTabService.getTabDirection = function (target) {
        var currentTabIndex = 0;
        var targetTabIndex = 0;
        Main_1.Main.instance.tabContainer.tabContainerSections.forEach(function (tab, index) {
            var $tab = tab.jel;
            if ($tab.filter(":visible").length !== 0) {
                currentTabIndex = index;
            }
            if ($tab.is($(target))) {
                targetTabIndex = index;
            }
        });
        return { current: currentTabIndex, target: targetTabIndex };
    };
    /**
     * @param {EasyTab} tab
     */
    EasyTabService.go = function (tab) {
        Main_1.Main.instance.tabContainer.jel.easytabs("select", EasyTabService.getTabId(tab));
    };
    /**
     * Returns the id of the tab passed in
     *
     * @param {EasyTab} tab
     * @returns {string}
     */
    EasyTabService.getTabId = function (tab) {
        var tabContainer = Main_1.Main.instance.tabContainer;
        var easyTabs = tabContainer.tabContainerSections;
        return easyTabs[tab].jel.attr("id");
    };
    /**
     * Is there a shipping easy tab present?
     *
     * @returns {boolean}
     */
    EasyTabService.isThereAShippingTab = function () {
        return Main_1.Main.instance.tabContainer.jel.find('.etabs > li.tab').length !== 2;
    };
    return EasyTabService;
}());
exports.EasyTabService = EasyTabService;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Base class for our ajax handling. Child classes will extend this and override the response function and implement their
 * own custom solutions for the php side of actions
 */
var Action = /** @class */ (function () {
    /**
     * @param id
     * @param url
     * @param data
     */
    function Action(id, url, data) {
        this.id = id;
        this.url = url + '?' + 'wc-ajax=' + id;
        this.data = data;
    }
    /**
     * Automatically assign the items to the data
     *
     * @param {string} id
     * @param {AjaxInfo} ajaxInfo
     * @param items
     * @returns {any}
     */
    Action.prep = function (id, ajaxInfo, items) {
        var data = {
            "wc-ajax": id,
            security: ajaxInfo.nonce,
        };
        Object.assign(data, items);
        return data;
    };
    /**
     * Fire ze ajax
     */
    Action.prototype.load = function () {
        $.post(this.url, this.data, this.response.bind(this));
    };
    Object.defineProperty(Action.prototype, "id", {
        /**
         * @returns {string}
         */
        get: function () {
            return this._id;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._id = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "url", {
        /**
         * @returns {string}
         */
        get: function () {
            return this._url;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._url = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "data", {
        /**
         * @returns {Object}
         */
        get: function () {
            return this._data;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._data = value;
        },
        enumerable: true,
        configurable: true
    });
    return Action;
}());
exports.Action = Action;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(2);
var Main_1 = __webpack_require__(0);
/**
 *
 */
var Alert = /** @class */ (function (_super) {
    __extends(Alert, _super);
    /**
     *
     * @param alertContainer
     * @param alertInfo
     */
    function Alert(alertContainer, alertInfo) {
        var _this = _super.call(this, alertContainer) || this;
        _this.alertInfo = alertInfo;
        return _this;
    }
    /**
     *
     */
    Alert.prototype.addAlert = function () {
        $(document.body).trigger('checkout_error');
        if (Alert.previousClass) {
            this.jel.removeClass(Alert.previousClass);
        }
        Main_1.Main.removeOverlay();
        this.jel.find(".message").html(this.alertInfo.message);
        this.jel.addClass(this.alertInfo.cssClass);
        this.jel.slideDown(300);
        window.scrollTo(0, 0);
        Alert.previousClass = this.alertInfo.cssClass;
    };
    Alert.removeAlerts = function () {
        $("#cfw-alert-container").find(".message").html("");
        $("#cfw-alert-container").attr("class", "cfw-alert");
        $("#cfw-alert-container").css("display", "none");
    };
    Object.defineProperty(Alert.prototype, "alertInfo", {
        /**
         * @returns {AlertInfo}
         */
        get: function () {
            return this._alertInfo;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._alertInfo = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Alert, "previousClass", {
        /**
         * @returns {string}
         */
        get: function () {
            return this._previousClass;
        },
        /**
         * @param {string} value
         */
        set: function (value) {
            this._previousClass = value;
        },
        enumerable: true,
        configurable: true
    });
    return Alert;
}(Element_1.Element));
exports.Alert = Alert;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * First argument of success response is the data object. What we do since on the PHP side it's prepped as a json object
 * we intercept the argument and parse the JSON. On the overloaded function side we specify the object type.
 *
 * @param target {Object}
 * @param propertyKey {string}
 * @param descriptor {PropertyDescriptor}
 * @returns {PropertyDescriptor}
 * @constructor
 */
function ResponsePrep(target, propertyKey, descriptor) {
    // save a reference to the original method this way we keep the values currently in the
    // descriptor and don't overwrite what another decorator might have done to the descriptor.
    if (descriptor === undefined) {
        descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    }
    var originalMethod = descriptor.value;
    //editing the descriptor/value parameter
    descriptor.value = function () {
        arguments[0] = JSON.parse(arguments[0]);
        return originalMethod.apply(this, arguments);
    };
    // return edited descriptor as opposed to overwriting the descriptor
    return descriptor;
}
exports.ResponsePrep = ResponsePrep;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Main_1 = __webpack_require__(0);
var EasyTabService_1 = __webpack_require__(3);
var EasyTabService_2 = __webpack_require__(3);
var CompleteOrderAction_1 = __webpack_require__(11);
var UpdateCheckoutAction_1 = __webpack_require__(8);
/**
 * Validation Sections Enum
 */
var EValidationSections;
(function (EValidationSections) {
    EValidationSections[EValidationSections["SHIPPING"] = 0] = "SHIPPING";
    EValidationSections[EValidationSections["BILLING"] = 1] = "BILLING";
    EValidationSections[EValidationSections["ACCOUNT"] = 2] = "ACCOUNT";
})(EValidationSections = exports.EValidationSections || (exports.EValidationSections = {}));
/**
 *
 */
var ValidationService = /** @class */ (function () {
    /**
     *
     */
    function ValidationService() {
        this.validateSectionsBeforeSwitch();
        ValidationService.validateShippingOnLoadIfNotCustomerTab();
    }
    /**
     * Execute validation checks before each easy tab easy tab switch.
     */
    ValidationService.prototype.validateSectionsBeforeSwitch = function () {
        Main_1.Main.instance.tabContainer.jel.bind('easytabs:before', function (event, clicked, target) {
            // Where are we going?
            var easyTabDirection = EasyTabService_1.EasyTabService.getTabDirection(target);
            // If we are moving forward in the checkout process and we are currently on the customer tab
            if (easyTabDirection.current === EasyTabService_2.EasyTab.CUSTOMER && easyTabDirection.target > easyTabDirection.current) {
                var validated = ValidationService.validateSectionsForCustomerTab(false);
                var tabId = EasyTabService_1.EasyTabService.getTabId(easyTabDirection.current);
                // Has to be done with the window.location.hash. Reason being is on false validation it somehow ignores
                // the continue button going forward. This prevents that by "resetting" the page so to speak.
                if (!validated) {
                    window.location.hash = "#" + tabId;
                }
                // Return the validation
                return validated;
            }
            if (EasyTabService_1.EasyTabService.isThereAShippingTab()) {
                UpdateCheckoutAction_1.UpdateCheckoutAction.updateShippingDetails();
            }
            // If we are moving forward / backwards, have a shipping easy tab, and are not on the customer tab then allow
            // the tab switch
            return true;
        }.bind(this));
    };
    /**
     * Kick off the order process and register it's event listener.
     *
     * @param {boolean} difBilling
     * @param {AjaxInfo} ajaxInfo
     * @param orderDetails
     */
    ValidationService.createOrder = function (difBilling, ajaxInfo, orderDetails) {
        if (difBilling === void 0) { difBilling = false; }
        if (difBilling) {
            // Check the normal validation and kick off the ajax ones
            var validationResult_1 = true;
            CompleteOrderAction_1.CompleteOrderAction.preppingOrder = true;
            window.addEventListener("cfw:checkout-validated", function () {
                CompleteOrderAction_1.CompleteOrderAction.preppingOrder = false;
                if (validationResult_1) {
                    new CompleteOrderAction_1.CompleteOrderAction('complete_order', ajaxInfo, orderDetails);
                }
                else {
                    Main_1.Main.removeOverlay();
                }
            }, { once: true });
            window.addEventListener("cfw:state-zip-failure", function () { return CompleteOrderAction_1.CompleteOrderAction.preppingOrder = false; });
            validationResult_1 = ValidationService.validate(EValidationSections.BILLING);
        }
        else {
            new CompleteOrderAction_1.CompleteOrderAction('complete_order', ajaxInfo, orderDetails);
        }
    };
    /**
     *
     * @param {boolean} validateZip
     * @returns {boolean}
     */
    ValidationService.validateSectionsForCustomerTab = function (validateZip) {
        if (validateZip === void 0) { validateZip = true; }
        var validated = false;
        ValidationService.validateZip = validateZip;
        if (!EasyTabService_1.EasyTabService.isThereAShippingTab()) {
            validated = ValidationService.validate(EValidationSections.ACCOUNT) && ValidationService.validate(EValidationSections.BILLING);
        }
        else {
            validated = ValidationService.validate(EValidationSections.ACCOUNT) && ValidationService.validate(EValidationSections.SHIPPING);
        }
        return validated;
    };
    /**
     * @param {EValidationSections} section
     * @returns {any}
     */
    ValidationService.validate = function (section) {
        var validated;
        var checkoutForm = Main_1.Main.instance.checkoutForm;
        switch (section) {
            case EValidationSections.SHIPPING:
                validated = checkoutForm.parsley().validate("shipping");
                break;
            case EValidationSections.BILLING:
                validated = checkoutForm.parsley().validate("billing");
                break;
            case EValidationSections.ACCOUNT:
                validated = checkoutForm.parsley().validate("account");
                break;
        }
        if (validated == null) {
            validated = true;
        }
        return validated;
    };
    /**
     * Handles non ajax cases
     */
    ValidationService.validateShippingOnLoadIfNotCustomerTab = function () {
        var hash = window.location.hash;
        var customerInfoId = "#cfw-customer-info";
        var sectionToValidate = (EasyTabService_1.EasyTabService.isThereAShippingTab()) ? EValidationSections.SHIPPING : EValidationSections.BILLING;
        if (hash != customerInfoId && hash != "") {
            if (!ValidationService.validate(sectionToValidate)) {
                EasyTabService_1.EasyTabService.go(EasyTabService_2.EasyTab.CUSTOMER);
            }
        }
    };
    Object.defineProperty(ValidationService, "validateZip", {
        /**
         * @returns {boolean}
         */
        get: function () {
            return this._validateZip;
        },
        /**
         * @param {boolean} value
         */
        set: function (value) {
            this._validateZip = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @type {boolean}
     * @private
     */
    ValidationService._validateZip = true;
    return ValidationService;
}());
exports.ValidationService = ValidationService;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __webpack_require__(4);
var Main_1 = __webpack_require__(0);
var Cart_1 = __webpack_require__(9);
var ResponsePrep_1 = __webpack_require__(6);
var UpdateCheckoutAction = /** @class */ (function (_super) {
    __extends(UpdateCheckoutAction, _super);
    /**
     * @param {string} id
     * @param {AjaxInfo} ajaxInfo
     * @param fields
     */
    function UpdateCheckoutAction(id, ajaxInfo, fields) {
        return _super.call(this, id, ajaxInfo.url, Action_1.Action.prep(id, ajaxInfo, fields)) || this;
    }
    UpdateCheckoutAction.prototype.load = function () {
        if (UpdateCheckoutAction.underlyingRequest !== null) {
            UpdateCheckoutAction.underlyingRequest.abort();
        }
        UpdateCheckoutAction.underlyingRequest = $.post(this.url, this.data, this.response.bind(this));
    };
    /**
     * @param resp
     */
    UpdateCheckoutAction.prototype.response = function (resp) {
        var main = Main_1.Main.instance;
        main.updating = false;
        console.log(resp);
        if (resp.fees) {
            var fees = $.map(resp.fees, function (value) { return [value]; });
            Cart_1.Cart.outputFees(main.cart.fees, fees);
        }
        if (resp.coupons) {
            var coupons = $.map(resp.coupons, function (value, index) {
                return [value];
            });
            Cart_1.Cart.outputCoupons(main.cart.coupons, coupons);
        }
        // Update shipping methods
        var shipping_method_container = $("#shipping_method");
        shipping_method_container.html("");
        shipping_method_container.append("" + resp.updated_ship_methods);
        Main_1.Main.togglePaymentRequired(resp.needs_payment);
        Cart_1.Cart.outputValues(main.cart, resp.new_totals);
        UpdateCheckoutAction.updateShippingDetails();
        Main_1.Main.instance.tabContainer.setShippingPaymentUpdate();
        $(document.body).trigger('updated_checkout');
    };
    Object.defineProperty(UpdateCheckoutAction, "underlyingRequest", {
        /**
         * @returns {any}
         */
        get: function () {
            return this._underlyingRequest;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._underlyingRequest = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Update the shipping details on the shipping panel
     */
    UpdateCheckoutAction.updateShippingDetails = function () {
        var customer_info_tab = Main_1.Main.instance.tabContainer.tabContainerSectionBy("name", "customer_info");
        customer_info_tab.getInputsFromSection(", select").forEach(function (item) {
            var value = item.jel.val();
            var key = item.jel.attr("field_key");
            $(".cfw-shipping-details-field[field_type=\"" + key + "\"] .field_value").text(value);
        });
    };
    /**
     *
     */
    UpdateCheckoutAction._underlyingRequest = null;
    __decorate([
        ResponsePrep_1.ResponsePrep
    ], UpdateCheckoutAction.prototype, "response", null);
    return UpdateCheckoutAction;
}(Action_1.Action));
exports.UpdateCheckoutAction = UpdateCheckoutAction;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(2);
var Cart = /** @class */ (function (_super) {
    __extends(Cart, _super);
    /**
     * @param cartContainer
     * @param subTotal
     * @param shipping
     * @param taxes
     * @param fees
     * @param total
     * @param coupons
     * @param reviewBarTotal
     */
    function Cart(cartContainer, subTotal, shipping, taxes, fees, total, coupons, reviewBarTotal) {
        var _this = _super.call(this, cartContainer) || this;
        _this.subTotal = new Element_1.Element(subTotal);
        _this.shipping = new Element_1.Element(shipping);
        _this.taxes = new Element_1.Element(taxes);
        _this.fees = new Element_1.Element(fees);
        _this.total = new Element_1.Element(total);
        _this.coupons = new Element_1.Element(coupons);
        _this.reviewBarTotal = new Element_1.Element(reviewBarTotal);
        return _this;
    }
    /**
     * @param cart
     * @param values
     */
    Cart.outputValues = function (cart, values) {
        Cart.outputValue(cart.subTotal, values.new_subtotal);
        Cart.outputValue(cart.taxes, values.new_taxes_total);
        Cart.outputValue(cart.shipping, values.new_shipping_total);
        Cart.outputValue(cart.fees, values.new_fees_total);
        Cart.outputValue(cart.total, values.new_total);
        Cart.outputValue(cart.reviewBarTotal, values.new_total);
    };
    /**
     * @param {Element} cartLineItem
     * @param coupons
     */
    Cart.outputCoupons = function (cartLineItem, coupons) {
        cartLineItem.jel.html("");
        if (cartLineItem.jel.length > 0) {
            coupons.forEach(function (coupon) {
                var wrap = $('<div class="cfw-cart-coupon cfw-flex-row cfw-flex-justify">');
                var type = $('<span class="type"></span>').html(coupon.label);
                var amount = $('<span class="amount"></span>').html(coupon.amount);
                wrap.append(type);
                wrap.append(amount);
                cartLineItem.jel.append(wrap);
            });
        }
    };
    /**
     * @param {Element} cartLineItem
     * @param fees
     */
    Cart.outputFees = function (cartLineItem, fees) {
        cartLineItem.jel.html("");
        if (cartLineItem.jel.length > 0) {
            fees.forEach(function (fee) {
                var wrap = $('<div class="cfw-cart-fee cfw-flex-row cfw-flex-justify">');
                var type = $('<span class="type"></span>').html(fee.name);
                var amount = $('<span class="amount"></span>').html(fee.amount);
                wrap.append(type);
                wrap.append(amount);
                cartLineItem.jel.append(wrap);
            });
        }
    };
    /**
     *
     * @param cartLineItem
     * @param value
     * @param childClass
     */
    Cart.outputValue = function (cartLineItem, value, childClass) {
        if (childClass === void 0) { childClass = ".amount"; }
        if (cartLineItem.jel.length > 0) {
            cartLineItem.jel.find(childClass).html(value);
        }
    };
    Object.defineProperty(Cart.prototype, "fees", {
        /**
         * @returns {Element}
         */
        get: function () {
            return this._fees;
        },
        /**
         * @param {Element} value
         */
        set: function (value) {
            this._fees = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cart.prototype, "subTotal", {
        /**
         * @returns {Element}
         */
        get: function () {
            return this._subTotal;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._subTotal = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cart.prototype, "shipping", {
        /**
         * @returns {Element}
         */
        get: function () {
            return this._shipping;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._shipping = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cart.prototype, "taxes", {
        /**
         * @returns {Element}
         */
        get: function () {
            return this._taxes;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._taxes = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cart.prototype, "total", {
        /**
         * @returns {Element}
         */
        get: function () {
            return this._total;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._total = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cart.prototype, "coupons", {
        /**
         * @returns {Element}
         */
        get: function () {
            return this._coupons;
        },
        /**
         * @param {Element} value
         */
        set: function (value) {
            this._coupons = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cart.prototype, "reviewBarTotal", {
        /**
         * @returns {Element}
         */
        get: function () {
            return this._reviewBarTotal;
        },
        /**
         * @param {Element} value
         */
        set: function (value) {
            this._reviewBarTotal = value;
        },
        enumerable: true,
        configurable: true
    });
    return Cart;
}(Element_1.Element));
exports.Cart = Cart;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(2);
var LabelType_1 = __webpack_require__(13);
/**
 *
 */
var FormElement = /** @class */ (function (_super) {
    __extends(FormElement, _super);
    /**
     * @param jel
     */
    function FormElement(jel) {
        var _this = _super.call(this, jel) || this;
        /**
         * @type {Array}
         * @private
         */
        _this._eventCallbacks = [];
        _this.moduleContainer = _this.jel.parents(".cfw-module");
        return _this;
    }
    /**
     * @returns {any}
     */
    FormElement.getLabelTypes = function () {
        return $.map(LabelType_1.LabelType, function (value, index) {
            return [value];
        });
    };
    /**
     *
     */
    FormElement.prototype.regAndWrap = function () {
        this.registerEventCallbacks();
        this.wrapClassSwap(this.holder.jel.val());
    };
    /**
     * @param tjel
     * @param useType
     */
    FormElement.prototype.setHolderAndLabel = function (tjel, useType) {
        if (useType === void 0) { useType = false; }
        var lt = FormElement.getLabelTypes();
        // Note: Length is divided by 2 because of ENUM implementation. Read TS docs
        for (var i = 0; i < lt.length / 2; i++) {
            var jqTjel = tjel;
            if (useType && typeof tjel === 'string') {
                var type = lt[i].toLowerCase();
                jqTjel = this.jel.find(tjel.replace("%s", type));
            }
            if (jqTjel.length > 0) {
                this.holder = new Element_1.Element(jqTjel);
            }
        }
    };
    /**
     * @param value
     */
    FormElement.prototype.wrapClassSwap = function (value) {
        if (value !== "" && !this.jel.hasClass(FormElement.labelClass)) {
            this.jel.addClass(FormElement.labelClass);
        }
        if (value === "" && this.jel.hasClass(FormElement.labelClass)) {
            this.jel.removeClass(FormElement.labelClass);
        }
    };
    /**
     *
     */
    FormElement.prototype.registerEventCallbacks = function () {
        var _this = this;
        if (this.holder) {
            this.eventCallbacks.forEach(function (eventCb) {
                var eventName = eventCb.eventName;
                var cb = eventCb.func;
                var target = eventCb.target;
                if (!target) {
                    target = _this.holder.jel;
                }
                target.on(eventName, cb);
            });
        }
    };
    Object.defineProperty(FormElement, "labelClass", {
        /**
         * @returns {string}
         */
        get: function () {
            return FormElement._labelClass;
        },
        /**
         * @param value
         */
        set: function (value) {
            FormElement._labelClass = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormElement.prototype, "eventCallbacks", {
        /**
         * @returns {Array<EventCallback>}
         */
        get: function () {
            return this._eventCallbacks;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._eventCallbacks = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormElement.prototype, "moduleContainer", {
        /**
         * @returns {JQuery}
         */
        get: function () {
            return this._moduleContainer;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._moduleContainer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormElement.prototype, "holder", {
        /**
         * @returns {Element}
         */
        get: function () {
            return this._holder;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._holder = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @type {string}
     * @private
     */
    FormElement._labelClass = "cfw-floating-label";
    return FormElement;
}(Element_1.Element));
exports.FormElement = FormElement;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __webpack_require__(4);
var Alert_1 = __webpack_require__(5);
var Main_1 = __webpack_require__(0);
var CompleteOrderAction = /** @class */ (function (_super) {
    __extends(CompleteOrderAction, _super);
    /**
     *
     * @param id
     * @param ajaxInfo
     * @param checkoutData
     */
    function CompleteOrderAction(id, ajaxInfo, checkoutData) {
        var _this = _super.call(this, id, ajaxInfo.url, Action_1.Action.prep(id, ajaxInfo, checkoutData)) || this;
        Main_1.Main.addOverlay();
        _this.setup();
        return _this;
    }
    /**
     * The setup function which mainly determines if we need a stripe token to continue
     */
    CompleteOrderAction.prototype.setup = function () {
        Main_1.Main.instance.checkoutForm.off('form:validate');
        this.load();
    };
    /**
     * @param resp
     */
    CompleteOrderAction.prototype.response = function (resp) {
        var tabContainer = Main_1.Main.instance.tabContainer;
        if (resp.result === "success") {
            // Destroy all the cache!
            $('.garlic-auto-save').each(function (index, elem) { return $(elem).garlic('destroy'); });
            // Destroy all the parsley!
            Main_1.Main.instance.checkoutForm.parsley().destroy();
            // Redirect all the browsers! (well just the 1)
            window.location.href = resp.redirect;
        }
        if (resp.result === "failure") {
            var alertInfo = {
                type: "AccPassRequiredField",
                message: resp.messages,
                cssClass: "cfw-alert-danger"
            };
            var alert_1 = new Alert_1.Alert($("#cfw-alert-container"), alertInfo);
            alert_1.addAlert();
            if (tabContainer.errorObserver !== undefined && tabContainer.errorObserver !== null) {
                tabContainer.errorObserver.disconnect();
                tabContainer.errorObserver = null;
            }
        }
    };
    Object.defineProperty(CompleteOrderAction, "preppingOrder", {
        /**
         * @returns {boolean}
         */
        get: function () {
            return this._preppingOrder;
        },
        /**
         * @param {boolean} value
         */
        set: function (value) {
            this._preppingOrder = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @type {boolean}
     * @static
     * @private
     */
    CompleteOrderAction._preppingOrder = false;
    return CompleteOrderAction;
}(Action_1.Action));
exports.CompleteOrderAction = CompleteOrderAction;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FormElement_1 = __webpack_require__(10);
/**
 *
 */
var InputLabelWrap = /** @class */ (function (_super) {
    __extends(InputLabelWrap, _super);
    /**
     * @param jel
     */
    function InputLabelWrap(jel) {
        var _this = _super.call(this, jel) || this;
        _this.setHolderAndLabel('input[type="%s"]', true);
        if (_this.holder) {
            _this.eventCallbacks = [
                {
                    eventName: "keyup", func: function () {
                        this.wrapClassSwap(this.holder.jel.val());
                    }.bind(_this), target: null
                }
            ];
            _this.regAndWrap();
        }
        return _this;
    }
    return InputLabelWrap;
}(FormElement_1.FormElement));
exports.InputLabelWrap = InputLabelWrap;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var LabelType;
(function (LabelType) {
    LabelType[LabelType["TEXT"] = 0] = "TEXT";
    LabelType[LabelType["TEL"] = 1] = "TEL";
    LabelType[LabelType["EMAIL"] = 2] = "EMAIL";
    LabelType[LabelType["PASSWORD"] = 3] = "PASSWORD";
    LabelType[LabelType["SELECT"] = 4] = "SELECT";
})(LabelType = exports.LabelType || (exports.LabelType = {}));


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FormElement_1 = __webpack_require__(10);
/**
 *
 */
var SelectLabelWrap = /** @class */ (function (_super) {
    __extends(SelectLabelWrap, _super);
    /**
     * @param jel
     */
    function SelectLabelWrap(jel) {
        var _this = _super.call(this, jel) || this;
        _this.setHolderAndLabel(_this.jel.find('select'));
        if (_this.holder) {
            _this.eventCallbacks = [
                {
                    eventName: "change", func: function () {
                        this.wrapClassSwap(this.holder.jel.val());
                    }.bind(_this), target: null
                },
                {
                    eventName: "keyup", func: function () {
                        this.wrapClassSwap(this.holder.jel.val());
                    }.bind(_this), target: null
                }
            ];
            _this.regAndWrap();
        }
        return _this;
    }
    return SelectLabelWrap;
}(FormElement_1.FormElement));
exports.SelectLabelWrap = SelectLabelWrap;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
module.exports = __webpack_require__(33);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(17);
__webpack_require__(18);

__webpack_require__(19);
__webpack_require__(21);
__webpack_require__(23);
__webpack_require__(25);
__webpack_require__(27);
__webpack_require__(29);
__webpack_require__(31);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 18 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(20))

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "/*\n * jQuery hashchange event - v1.3 - 7/21/2010\n * http://benalman.com/projects/jquery-hashchange-plugin/\n * \n * Copyright (c) 2010 \"Cowboy\" Ben Alman\n * Dual licensed under the MIT and GPL licenses.\n * http://benalman.com/about/license/\n */\n(function($,e,b){var c=\"hashchange\",h=document,f,g=$.event.special,i=h.documentMode,d=\"on\"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return\"#\"+j.replace(/^[^#]*#?(.*)$/,\"$1\")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,\"\")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex=\"-1\" title=\"empty\"/>').hide().one(\"load\",function(){r||l(a());n()}).attr(\"src\",r||\"javascript:0\").insertAfter(\"body\")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName===\"title\"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain=\"'+t+'\"<\\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);"

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(22))

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "/*\n * jQuery EasyTabs plugin 3.2.0\n *\n * Copyright (c) 2010-2011 Steve Schwartz (JangoSteve)\n *\n * Dual licensed under the MIT and GPL licenses:\n *   http://www.opensource.org/licenses/mit-license.php\n *   http://www.gnu.org/licenses/gpl.html\n *\n * Date: Thu May 09 17:30:00 2013 -0500\n */\n(function(a){a.easytabs=function(j,e){var f=this,q=a(j),i={animate:true,panelActiveClass:\"active\",tabActiveClass:\"active\",defaultTab:\"li:first-child\",animationSpeed:\"normal\",tabs:\"> ul > li\",updateHash:true,cycle:false,collapsible:false,collapsedClass:\"collapsed\",collapsedByDefault:true,uiTabs:false,transitionIn:\"fadeIn\",transitionOut:\"fadeOut\",transitionInEasing:\"swing\",transitionOutEasing:\"swing\",transitionCollapse:\"slideUp\",transitionUncollapse:\"slideDown\",transitionCollapseEasing:\"swing\",transitionUncollapseEasing:\"swing\",containerClass:\"\",tabsClass:\"\",tabClass:\"\",panelClass:\"\",cache:true,event:\"click\",panelContext:q},h,l,v,m,d,t={fast:200,normal:400,slow:600},r;f.init=function(){f.settings=r=a.extend({},i,e);r.bind_str=r.event+\".easytabs\";if(r.uiTabs){r.tabActiveClass=\"ui-tabs-selected\";r.containerClass=\"ui-tabs ui-widget ui-widget-content ui-corner-all\";r.tabsClass=\"ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all\";r.tabClass=\"ui-state-default ui-corner-top\";r.panelClass=\"ui-tabs-panel ui-widget-content ui-corner-bottom\"}if(r.collapsible&&e.defaultTab!==undefined&&e.collpasedByDefault===undefined){r.collapsedByDefault=false}if(typeof(r.animationSpeed)===\"string\"){r.animationSpeed=t[r.animationSpeed]}a(\"a.anchor\").remove().prependTo(\"body\");q.data(\"easytabs\",{});f.setTransitions();f.getTabs();b();g();w();n();c();q.attr(\"data-easytabs\",true)};f.setTransitions=function(){v=(r.animate)?{show:r.transitionIn,hide:r.transitionOut,speed:r.animationSpeed,collapse:r.transitionCollapse,uncollapse:r.transitionUncollapse,halfSpeed:r.animationSpeed/2}:{show:\"show\",hide:\"hide\",speed:0,collapse:\"hide\",uncollapse:\"show\",halfSpeed:0}};f.getTabs=function(){var x;f.tabs=q.find(r.tabs),f.panels=a(),f.tabs.each(function(){var A=a(this),z=A.children(\"a\"),y=A.children(\"a\").data(\"target\");A.data(\"easytabs\",{});if(y!==undefined&&y!==null){A.data(\"easytabs\").ajax=z.attr(\"href\")}else{y=z.attr(\"href\")}y=y.match(/#([^\\?]+)/)[1];x=r.panelContext.find(\"#\"+y);if(x.length){x.data(\"easytabs\",{position:x.css(\"position\"),visibility:x.css(\"visibility\")});x.not(r.panelActiveClass).hide();f.panels=f.panels.add(x);A.data(\"easytabs\").panel=x}else{f.tabs=f.tabs.not(A);if(\"console\" in window){console.warn(\"Warning: tab without matching panel for selector '#\"+y+\"' removed from set\")}}})};f.selectTab=function(x,C){var y=window.location,B=y.hash.match(/^[^\\?]*/)[0],z=x.parent().data(\"easytabs\").panel,A=x.parent().data(\"easytabs\").ajax;if(r.collapsible&&!d&&(x.hasClass(r.tabActiveClass)||x.hasClass(r.collapsedClass))){f.toggleTabCollapse(x,z,A,C)}else{if(!x.hasClass(r.tabActiveClass)||!z.hasClass(r.panelActiveClass)){o(x,z,A,C)}else{if(!r.cache){o(x,z,A,C)}}}};f.toggleTabCollapse=function(x,y,z,A){f.panels.stop(true,true);if(u(q,\"easytabs:before\",[x,y,r])){f.tabs.filter(\".\"+r.tabActiveClass).removeClass(r.tabActiveClass).children().removeClass(r.tabActiveClass);if(x.hasClass(r.collapsedClass)){if(z&&(!r.cache||!x.parent().data(\"easytabs\").cached)){q.trigger(\"easytabs:ajax:beforeSend\",[x,y]);y.load(z,function(C,B,D){x.parent().data(\"easytabs\").cached=true;q.trigger(\"easytabs:ajax:complete\",[x,y,C,B,D])})}x.parent().removeClass(r.collapsedClass).addClass(r.tabActiveClass).children().removeClass(r.collapsedClass).addClass(r.tabActiveClass);y.addClass(r.panelActiveClass)[v.uncollapse](v.speed,r.transitionUncollapseEasing,function(){q.trigger(\"easytabs:midTransition\",[x,y,r]);if(typeof A==\"function\"){A()}})}else{x.addClass(r.collapsedClass).parent().addClass(r.collapsedClass);y.removeClass(r.panelActiveClass)[v.collapse](v.speed,r.transitionCollapseEasing,function(){q.trigger(\"easytabs:midTransition\",[x,y,r]);if(typeof A==\"function\"){A()}})}}};f.matchTab=function(x){return f.tabs.find(\"[href='\"+x+\"'],[data-target='\"+x+\"']\").first()};f.matchInPanel=function(x){return(x&&f.validId(x)?f.panels.filter(\":has(\"+x+\")\").first():[])};f.validId=function(x){return x.substr(1).match(/^[A-Za-z]+[A-Za-z0-9\\-_:\\.].$/)};f.selectTabFromHashChange=function(){var y=window.location.hash.match(/^[^\\?]*/)[0],x=f.matchTab(y),z;if(r.updateHash){if(x.length){d=true;f.selectTab(x)}else{z=f.matchInPanel(y);if(z.length){y=\"#\"+z.attr(\"id\");x=f.matchTab(y);d=true;f.selectTab(x)}else{if(!h.hasClass(r.tabActiveClass)&&!r.cycle){if(y===\"\"||f.matchTab(m).length||q.closest(y).length){d=true;f.selectTab(l)}}}}}};f.cycleTabs=function(x){if(r.cycle){x=x%f.tabs.length;$tab=a(f.tabs[x]).children(\"a\").first();d=true;f.selectTab($tab,function(){setTimeout(function(){f.cycleTabs(x+1)},r.cycle)})}};f.publicMethods={select:function(x){var y;if((y=f.tabs.filter(x)).length===0){if((y=f.tabs.find(\"a[href='\"+x+\"']\")).length===0){if((y=f.tabs.find(\"a\"+x)).length===0){if((y=f.tabs.find(\"[data-target='\"+x+\"']\")).length===0){if((y=f.tabs.find(\"a[href$='\"+x+\"']\")).length===0){a.error(\"Tab '\"+x+\"' does not exist in tab set\")}}}}}else{y=y.children(\"a\").first()}f.selectTab(y)}};var u=function(A,x,z){var y=a.Event(x);A.trigger(y,z);return y.result!==false};var b=function(){q.addClass(r.containerClass);f.tabs.parent().addClass(r.tabsClass);f.tabs.addClass(r.tabClass);f.panels.addClass(r.panelClass)};var g=function(){var y=window.location.hash.match(/^[^\\?]*/)[0],x=f.matchTab(y).parent(),z;if(x.length===1){h=x;r.cycle=false}else{z=f.matchInPanel(y);if(z.length){y=\"#\"+z.attr(\"id\");h=f.matchTab(y).parent()}else{h=f.tabs.parent().find(r.defaultTab);if(h.length===0){a.error(\"The specified default tab ('\"+r.defaultTab+\"') could not be found in the tab set ('\"+r.tabs+\"') out of \"+f.tabs.length+\" tabs.\")}}}l=h.children(\"a\").first();p(x)};var p=function(z){var y,x;if(r.collapsible&&z.length===0&&r.collapsedByDefault){h.addClass(r.collapsedClass).children().addClass(r.collapsedClass)}else{y=a(h.data(\"easytabs\").panel);x=h.data(\"easytabs\").ajax;if(x&&(!r.cache||!h.data(\"easytabs\").cached)){q.trigger(\"easytabs:ajax:beforeSend\",[l,y]);y.load(x,function(B,A,C){h.data(\"easytabs\").cached=true;q.trigger(\"easytabs:ajax:complete\",[l,y,B,A,C])})}h.data(\"easytabs\").panel.show().addClass(r.panelActiveClass);h.addClass(r.tabActiveClass).children().addClass(r.tabActiveClass)}q.trigger(\"easytabs:initialised\",[l,y])};var w=function(){f.tabs.children(\"a\").bind(r.bind_str,function(x){r.cycle=false;d=false;f.selectTab(a(this));x.preventDefault?x.preventDefault():x.returnValue=false})};var o=function(z,D,E,H){f.panels.stop(true,true);if(u(q,\"easytabs:before\",[z,D,r])){var A=f.panels.filter(\":visible\"),y=D.parent(),F,x,C,G,B=window.location.hash.match(/^[^\\?]*/)[0];if(r.animate){F=s(D);x=A.length?k(A):0;C=F-x}m=B;G=function(){q.trigger(\"easytabs:midTransition\",[z,D,r]);if(r.animate&&r.transitionIn==\"fadeIn\"){if(C<0){y.animate({height:y.height()+C},v.halfSpeed).css({\"min-height\":\"\"})}}if(r.updateHash&&!d){window.location.hash=\"#\"+D.attr(\"id\")}else{d=false}D[v.show](v.speed,r.transitionInEasing,function(){y.css({height:\"\",\"min-height\":\"\"});q.trigger(\"easytabs:after\",[z,D,r]);if(typeof H==\"function\"){H()}})};if(E&&(!r.cache||!z.parent().data(\"easytabs\").cached)){q.trigger(\"easytabs:ajax:beforeSend\",[z,D]);D.load(E,function(J,I,K){z.parent().data(\"easytabs\").cached=true;q.trigger(\"easytabs:ajax:complete\",[z,D,J,I,K])})}if(r.animate&&r.transitionOut==\"fadeOut\"){if(C>0){y.animate({height:(y.height()+C)},v.halfSpeed)}else{y.css({\"min-height\":y.height()})}}f.tabs.filter(\".\"+r.tabActiveClass).removeClass(r.tabActiveClass).children().removeClass(r.tabActiveClass);f.tabs.filter(\".\"+r.collapsedClass).removeClass(r.collapsedClass).children().removeClass(r.collapsedClass);z.parent().addClass(r.tabActiveClass).children().addClass(r.tabActiveClass);f.panels.filter(\".\"+r.panelActiveClass).removeClass(r.panelActiveClass);D.addClass(r.panelActiveClass);if(A.length){A[v.hide](v.speed,r.transitionOutEasing,G)}else{D[v.uncollapse](v.speed,r.transitionUncollapseEasing,G)}}};var s=function(z){if(z.data(\"easytabs\")&&z.data(\"easytabs\").lastHeight){return z.data(\"easytabs\").lastHeight}var B=z.css(\"display\"),y,x;try{y=a(\"<div></div>\",{position:\"absolute\",visibility:\"hidden\",overflow:\"hidden\"})}catch(A){y=a(\"<div></div>\",{visibility:\"hidden\",overflow:\"hidden\"})}x=z.wrap(y).css({position:\"relative\",visibility:\"hidden\",display:\"block\"}).outerHeight();z.unwrap();z.css({position:z.data(\"easytabs\").position,visibility:z.data(\"easytabs\").visibility,display:B});z.data(\"easytabs\").lastHeight=x;return x};var k=function(y){var x=y.outerHeight();if(y.data(\"easytabs\")){y.data(\"easytabs\").lastHeight=x}else{y.data(\"easytabs\",{lastHeight:x})}return x};var n=function(){if(typeof a(window).hashchange===\"function\"){a(window).hashchange(function(){f.selectTabFromHashChange()})}else{if(a.address&&typeof a.address.change===\"function\"){a.address.change(function(){f.selectTabFromHashChange()})}}};var c=function(){var x;if(r.cycle){x=f.tabs.index(h);setTimeout(function(){f.cycleTabs(x+1)},r.cycle)}};f.init()};a.fn.easytabs=function(c){var b=arguments;return this.each(function(){var e=a(this),d=e.data(\"easytabs\");if(undefined===d){d=new a.easytabs(this,c);e.data(\"easytabs\",d)}if(d.publicMethods[c]){return d.publicMethods[c](Array.prototype.slice.call(b,1))}})}})(jQuery);\n"

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(24))

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "!function(t){function e(n){if(i[n])return i[n].exports;var s=i[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var i={};e.m=t,e.c=i,e.d=function(t,i,n){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,\"a\",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p=\"\",e(e.s=0)}([function(t,e){!function(t){\"use strict\";var e=function(t){this.defined=\"undefined\"!=typeof localStorage;var e=\"garlic:\"+document.domain+\">test\";try{localStorage.setItem(e,e),localStorage.removeItem(e)}catch(t){this.defined=!1}};e.prototype={constructor:e,get:function(t,e){var i=localStorage.getItem(t);if(i){try{i=JSON.parse(i)}catch(t){}return i}return void 0!==e?e:null},has:function(t){return!!localStorage.getItem(t)},set:function(t,e,i){return\"\"===e||e instanceof Array&&0===e.length?this.destroy(t):(e=JSON.stringify(e),localStorage.setItem(t,e)),\"function\"!=typeof i||i()},destroy:function(t,e){return localStorage.removeItem(t),\"function\"!=typeof e||e()},clean:function(t){for(var e=localStorage.length-1;e>=0;e--)void 0===Array.indexOf&&-1!==localStorage.key(e).indexOf(\"garlic:\")&&localStorage.removeItem(localStorage.key(e));return\"function\"!=typeof t||t()},clear:function(t){return localStorage.clear(),\"function\"!=typeof t||t()}};var i=function(t,e,i){this.init(\"garlic\",t,e,i)};i.prototype={constructor:i,init:function(e,i,n,s){this.type=e,this.$element=t(i),this.options=this.getOptions(s),this.storage=n,this.path=this.options.getPath(this.$element)||this.getPath(),this.parentForm=this.$element.closest(\"form\"),this.$element.addClass(\"garlic-auto-save\"),this.expiresFlag=!!this.options.expires&&(this.$element.data(\"expires\")?this.path:this.getPath(this.parentForm))+\"_flag\",this.$element.on(this.options.events.join(\".\"+this.type+\" \"),!1,t.proxy(this.persist,this)),this.options.destroy&&t(this.parentForm).on(\"submit reset\",!1,t.proxy(this.remove,this)),this.retrieve()},getOptions:function(e){return t.extend({},t.fn[this.type].defaults,e,this.$element.data())},persist:function(){if(this.$element.is(\"input[type=radio], input[type=checkbox]\")||this.val!==this.getVal()){this.val=this.getVal(),this.options.expires&&this.storage.set(this.expiresFlag,((new Date).getTime()+1e3*this.options.expires).toString());var t=this.options.prePersist(this.$element,this.val);\"string\"==typeof t&&(this.val=t),this.storage.set(this.path,this.val),this.options.onPersist(this.$element,this.val)}},getVal:function(){return this.$element.is(\"input[type=checkbox]\")?this.$element.prop(\"checked\")?\"checked\":\"unchecked\":this.$element.val()},retrieve:function(){if(this.storage.has(this.path)){if(this.options.expires){var t=(new Date).getTime();if(this.storage.get(this.expiresFlag)<t.toString())return void this.storage.destroy(this.path);this.$element.attr(\"expires-in\",Math.floor((parseInt(this.storage.get(this.expiresFlag))-t)/1e3))}var e=this.$element.val(),i=this.storage.get(this.path),i=this.options.preRetrieve(this.$element,e,i);if(\"boolean\"==typeof i&&0==i)return;return this.options.conflictManager.enabled&&this.detectConflict()?this.conflictManager():this.$element.is(\"input[type=radio], input[type=checkbox]\")?\"checked\"===i||this.$element.val()===i?this.$element.prop(\"checked\",!0):void(\"unchecked\"===i&&this.$element.prop(\"checked\",!1)):(this.$element.val(i),this.$element.trigger(\"input\"),void this.options.onRetrieve(this.$element,i))}},detectConflict:function(){var e=this;if(this.$element.is(\"input[type=checkbox], input[type=radio]\"))return!1;if(this.$element.val()&&this.storage.get(this.path)!==this.$element.val()){if(this.$element.is(\"select\")){var i=!1;return this.$element.find(\"option\").each(function(){if(0!==t(this).index()&&t(this).attr(\"selected\")&&t(this).val()!==e.storage.get(this.path))return void(i=!0)}),i}return!0}return!1},conflictManager:function(){if(\"function\"==typeof this.options.conflictManager.onConflictDetected&&!this.options.conflictManager.onConflictDetected(this.$element,this.storage.get(this.path)))return!1;this.options.conflictManager.garlicPriority?(this.$element.data(\"swap-data\",this.$element.val()),this.$element.data(\"swap-state\",\"garlic\"),this.$element.val(this.storage.get(this.path))):(this.$element.data(\"swap-data\",this.storage.get(this.path)),this.$element.data(\"swap-state\",\"default\")),this.swapHandler(),this.$element.addClass(\"garlic-conflict-detected\"),this.$element.closest(\"input[type=submit]\").attr(\"disabled\",!0)},swapHandler:function(){var e=t(this.options.conflictManager.template);this.$element.after(e.text(this.options.conflictManager.message)),e.on(\"click\",!1,t.proxy(this.swap,this))},swap:function(){var e=this.$element.data(\"swap-data\");this.$element.data(\"swap-state\",\"garlic\"===this.$element.data(\"swap-state\")?\"default\":\"garlic\"),this.$element.data(\"swap-data\",this.$element.val()),t(this.$element).val(e),this.options.onSwap(this.$element,this.$element.data(\"swap-data\"),e)},destroy:function(){this.storage.destroy(this.path)},remove:function(){if(this.destroy(),this.$element.is(\"input[type=radio], input[type=checkbox]\"))return void t(this.$element).attr(\"checked\",!1);this.$element.val(\"\")},getPath:function(e){if(void 0===e&&(e=this.$element),this.options.getPath(e))return this.options.getPath(e);if(1!=e.length)return!1;for(var i=\"\",n=e.is(\"input[type=checkbox]\"),s=e;s.length;){var a=s[0],o=a.nodeName;if(!o)break;o=o.toLowerCase();var r=s.parent(),h=r.children(o);if(t(a).is(\"form, input, select, textarea\")||n){if(o+=t(a).attr(\"name\")?\".\"+t(a).attr(\"name\"):\"\",h.length>1&&!t(a).is(\"input[type=radio]\")&&(o+=\":eq(\"+h.index(a)+\")\"),i=o+(i?\">\"+i:\"\"),\"form\"==a.nodeName.toLowerCase())break;s=r}else s=r}return\"garlic:\"+document.domain+(this.options.domain?\"*\":window.location.pathname)+\">\"+i},getStorage:function(){return this.storage}},t.fn.garlic=function(n,s){function a(e){var s=t(e),a=s.data(\"garlic\"),h=t.extend({},o,s.data());if((void 0===h.storage||h.storage)&&\"password\"!==t(e).attr(\"type\"))return a||s.data(\"garlic\",a=new i(e,r,h)),\"string\"==typeof n&&\"function\"==typeof a[n]?a[n]():void 0}var o=t.extend(!0,{},t.fn.garlic.defaults,n,this.data()),r=new e,h=!1;return!!r.defined&&(this.each(function(){if(t(this).is(\"form\"))t(this).find(o.inputs).each(function(){t(this).is(o.excluded)||(h=a(t(this)))});else if(t(this).is(o.inputs)){if(t(this).is(o.excluded))return;h=a(t(this))}}),\"function\"==typeof s?s():h)},t.fn.garlic.Constructor=i,t.fn.garlic.defaults={destroy:!0,inputs:\"input, textarea, select\",excluded:'input[type=\"file\"], input[type=\"hidden\"], input[type=\"submit\"], input[type=\"reset\"], [data-persist=\"false\"]',events:[\"DOMAttrModified\",\"textInput\",\"input\",\"change\",\"click\",\"keypress\",\"paste\",\"focus\"],domain:!1,expires:!1,conflictManager:{enabled:!1,garlicPriority:!0,template:'<span class=\"garlic-swap\"></span>',message:\"This is your saved data. Click here to see default one\",onConflictDetected:function(t,e){return!0}},getPath:function(t){},preRetrieve:function(t,e,i){return i},onRetrieve:function(t,e){},prePersist:function(t,e){return!1},onPersist:function(t,e){},onSwap:function(t,e,i){}},t(window).on(\"load\",function(){t('[data-persist=\"garlic\"]').each(function(){t(this).garlic()})})}(window.jQuery||window.Zepto)}]);"

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(26))

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = "/**\n@license @nocompile\nCopyright (c) 2018 The Polymer Project Authors. All rights reserved.\nThis code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\nThe complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\nThe complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\nCode distributed by Google as part of the polymer project is also\nsubject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n*/\n(function(){/*\n\n Copyright (c) 2016 The Polymer Project Authors. All rights reserved.\n This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\n The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\n The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\n Code distributed by Google as part of the polymer project is also\n subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n*/\n'use strict';var p,q=\"undefined\"!=typeof window&&window===this?this:\"undefined\"!=typeof global&&null!=global?global:this,da=\"function\"==typeof Object.defineProperties?Object.defineProperty:function(a,b,c){a!=Array.prototype&&a!=Object.prototype&&(a[b]=c.value)};function ea(){ea=function(){};q.Symbol||(q.Symbol=fa)}var fa=function(){var a=0;return function(b){return\"jscomp_symbol_\"+(b||\"\")+a++}}();\nfunction ha(){ea();var a=q.Symbol.iterator;a||(a=q.Symbol.iterator=q.Symbol(\"iterator\"));\"function\"!=typeof Array.prototype[a]&&da(Array.prototype,a,{configurable:!0,writable:!0,value:function(){return ia(this)}});ha=function(){}}function ia(a){var b=0;return la(function(){return b<a.length?{done:!1,value:a[b++]}:{done:!0}})}function la(a){ha();a={next:a};a[q.Symbol.iterator]=function(){return this};return a}function ma(a){ha();var b=a[Symbol.iterator];return b?b.call(a):ia(a)}\nfunction na(a){for(var b,c=[];!(b=a.next()).done;)c.push(b.value);return c}\n(function(){if(!function(){var a=document.createEvent(\"Event\");a.initEvent(\"foo\",!0,!0);a.preventDefault();return a.defaultPrevented}()){var a=Event.prototype.preventDefault;Event.prototype.preventDefault=function(){this.cancelable&&(a.call(this),Object.defineProperty(this,\"defaultPrevented\",{get:function(){return!0},configurable:!0}))}}var b=/Trident/.test(navigator.userAgent);if(!window.CustomEvent||b&&\"function\"!==typeof window.CustomEvent)window.CustomEvent=function(a,b){b=b||{};var c=document.createEvent(\"CustomEvent\");\nc.initCustomEvent(a,!!b.bubbles,!!b.cancelable,b.detail);return c},window.CustomEvent.prototype=window.Event.prototype;if(!window.Event||b&&\"function\"!==typeof window.Event){var c=window.Event;window.Event=function(a,b){b=b||{};var c=document.createEvent(\"Event\");c.initEvent(a,!!b.bubbles,!!b.cancelable);return c};if(c)for(var d in c)window.Event[d]=c[d];window.Event.prototype=c.prototype}if(!window.MouseEvent||b&&\"function\"!==typeof window.MouseEvent){b=window.MouseEvent;window.MouseEvent=function(a,\nb){b=b||{};var c=document.createEvent(\"MouseEvent\");c.initMouseEvent(a,!!b.bubbles,!!b.cancelable,b.view||window,b.detail,b.screenX,b.screenY,b.clientX,b.clientY,b.ctrlKey,b.altKey,b.shiftKey,b.metaKey,b.button,b.relatedTarget);return c};if(b)for(d in b)window.MouseEvent[d]=b[d];window.MouseEvent.prototype=b.prototype}Array.from||(Array.from=function(a){return[].slice.call(a)});Object.assign||(Object.assign=function(a,b){for(var c=[].slice.call(arguments,1),d=0,e;d<c.length;d++)if(e=c[d])for(var f=\na,m=e,n=Object.getOwnPropertyNames(m),t=0;t<n.length;t++)e=n[t],f[e]=m[e];return a})})(window.WebComponents);(function(){function a(){}function b(a,b){if(!a.childNodes.length)return[];switch(a.nodeType){case Node.DOCUMENT_NODE:return t.call(a,b);case Node.DOCUMENT_FRAGMENT_NODE:return C.call(a,b);default:return n.call(a,b)}}var c=\"undefined\"===typeof HTMLTemplateElement,d=!(document.createDocumentFragment().cloneNode()instanceof DocumentFragment),e=!1;/Trident/.test(navigator.userAgent)&&function(){function a(a,b){if(a instanceof DocumentFragment)for(var d;d=a.firstChild;)c.call(this,d,b);else c.call(this,\na,b);return a}e=!0;var b=Node.prototype.cloneNode;Node.prototype.cloneNode=function(a){a=b.call(this,a);this instanceof DocumentFragment&&(a.__proto__=DocumentFragment.prototype);return a};DocumentFragment.prototype.querySelectorAll=HTMLElement.prototype.querySelectorAll;DocumentFragment.prototype.querySelector=HTMLElement.prototype.querySelector;Object.defineProperties(DocumentFragment.prototype,{nodeType:{get:function(){return Node.DOCUMENT_FRAGMENT_NODE},configurable:!0},localName:{get:function(){},\nconfigurable:!0},nodeName:{get:function(){return\"#document-fragment\"},configurable:!0}});var c=Node.prototype.insertBefore;Node.prototype.insertBefore=a;var d=Node.prototype.appendChild;Node.prototype.appendChild=function(b){b instanceof DocumentFragment?a.call(this,b,null):d.call(this,b);return b};var f=Node.prototype.removeChild,h=Node.prototype.replaceChild;Node.prototype.replaceChild=function(b,c){b instanceof DocumentFragment?(a.call(this,b,c),f.call(this,c)):h.call(this,b,c);return c};Document.prototype.createDocumentFragment=\nfunction(){var a=this.createElement(\"df\");a.__proto__=DocumentFragment.prototype;return a};var g=Document.prototype.importNode;Document.prototype.importNode=function(a,b){b=g.call(this,a,b||!1);a instanceof DocumentFragment&&(b.__proto__=DocumentFragment.prototype);return b}}();var f=Node.prototype.cloneNode,h=Document.prototype.createElement,g=Document.prototype.importNode,k=Node.prototype.removeChild,l=Node.prototype.appendChild,m=Node.prototype.replaceChild,n=Element.prototype.querySelectorAll,\nt=Document.prototype.querySelectorAll,C=DocumentFragment.prototype.querySelectorAll,aa=function(){if(!c){var a=document.createElement(\"template\"),b=document.createElement(\"template\");b.content.appendChild(document.createElement(\"div\"));a.content.appendChild(b);a=a.cloneNode(!0);return 0===a.content.childNodes.length||0===a.content.firstChild.content.childNodes.length||d}}();if(c){var P=document.implementation.createHTMLDocument(\"template\"),Ka=!0,ba=document.createElement(\"style\");ba.textContent=\"template{display:none;}\";\nvar La=document.head;La.insertBefore(ba,La.firstElementChild);a.prototype=Object.create(HTMLElement.prototype);var D=!document.createElement(\"div\").hasOwnProperty(\"innerHTML\");a.H=function(b){if(!b.content&&b.namespaceURI===document.documentElement.namespaceURI){b.content=P.createDocumentFragment();for(var c;c=b.firstChild;)l.call(b.content,c);if(D)b.__proto__=a.prototype;else if(b.cloneNode=function(b){return a.ha(this,b)},Ka)try{va(b),ja(b)}catch(rh){Ka=!1}a.M(b.content)}};var va=function(b){Object.defineProperty(b,\n\"innerHTML\",{get:function(){return nb(this)},set:function(b){P.body.innerHTML=b;for(a.M(P);this.content.firstChild;)k.call(this.content,this.content.firstChild);for(;P.body.firstChild;)l.call(this.content,P.body.firstChild)},configurable:!0})},ja=function(a){Object.defineProperty(a,\"outerHTML\",{get:function(){return\"<template>\"+this.innerHTML+\"</template>\"},set:function(a){if(this.parentNode){P.body.innerHTML=a;for(a=this.ownerDocument.createDocumentFragment();P.body.firstChild;)l.call(a,P.body.firstChild);\nm.call(this.parentNode,a,this)}else throw Error(\"Failed to set the 'outerHTML' property on 'Element': This element has no parent node.\");},configurable:!0})};va(a.prototype);ja(a.prototype);a.M=function(c){c=b(c,\"template\");for(var d=0,e=c.length,f;d<e&&(f=c[d]);d++)a.H(f)};document.addEventListener(\"DOMContentLoaded\",function(){a.M(document)});Document.prototype.createElement=function(){var b=h.apply(this,arguments);\"template\"===b.localName&&a.H(b);return b};var wa=/[&\\u00A0\"]/g,ca=/[&\\u00A0<>]/g,\nka=function(a){switch(a){case \"&\":return\"&amp;\";case \"<\":return\"&lt;\";case \">\":return\"&gt;\";case '\"':return\"&quot;\";case \"\\u00a0\":return\"&nbsp;\"}};ba=function(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b};var hf=ba(\"area base br col command embed hr img input keygen link meta param source track wbr\".split(\" \")),xa=ba(\"style script xmp iframe noembed noframes plaintext noscript\".split(\" \")),nb=function(a,b){\"template\"===a.localName&&(a=a.content);for(var c=\"\",d=b?b(a):a.childNodes,e=0,f=\nd.length,h;e<f&&(h=d[e]);e++){a:{var g=h;var k=a;var l=b;switch(g.nodeType){case Node.ELEMENT_NODE:for(var m=g.localName,n=\"<\"+m,ya=g.attributes,Ma=0;k=ya[Ma];Ma++)n+=\" \"+k.name+'=\"'+k.value.replace(wa,ka)+'\"';n+=\">\";g=hf[m]?n:n+nb(g,l)+\"</\"+m+\">\";break a;case Node.TEXT_NODE:g=g.data;g=k&&xa[k.localName]?g:g.replace(ca,ka);break a;case Node.COMMENT_NODE:g=\"\\x3c!--\"+g.data+\"--\\x3e\";break a;default:throw window.console.error(g),Error(\"not implemented\");}}c+=g}return c}}if(c||aa){a.ha=function(a,b){var c=\nf.call(a,!1);this.H&&this.H(c);b&&(l.call(c.content,f.call(a.content,!0)),ya(c.content,a.content));return c};var ya=function(c,d){if(d.querySelectorAll&&(d=b(d,\"template\"),0!==d.length)){c=b(c,\"template\");for(var e=0,f=c.length,h,g;e<f;e++)g=d[e],h=c[e],a&&a.H&&a.H(g),m.call(h.parentNode,Ma.call(g,!0),h)}},Ma=Node.prototype.cloneNode=function(b){if(!e&&d&&this instanceof DocumentFragment)if(b)var c=jf.call(this.ownerDocument,this,!0);else return this.ownerDocument.createDocumentFragment();else c=\nthis.nodeType===Node.ELEMENT_NODE&&\"template\"===this.localName&&this.namespaceURI==document.documentElement.namespaceURI?a.ha(this,b):f.call(this,b);b&&ya(c,this);return c},jf=Document.prototype.importNode=function(c,d){d=d||!1;if(\"template\"===c.localName)return a.ha(c,d);var e=g.call(this,c,d);if(d){ya(e,c);c=b(e,'script:not([type]),script[type=\"application/javascript\"],script[type=\"text/javascript\"]');for(var f,k=0;k<c.length;k++){f=c[k];d=h.call(document,\"script\");d.textContent=f.textContent;for(var l=\nf.attributes,ka=0,xa;ka<l.length;ka++)xa=l[ka],d.setAttribute(xa.name,xa.value);m.call(f.parentNode,d,f)}}return e}}c&&(window.HTMLTemplateElement=a)})();var oa=Array.isArray?Array.isArray:function(a){return\"[object Array]\"===Object.prototype.toString.call(a)};var pa=0,qa,ra=\"undefined\"!==typeof window?window:void 0,sa=ra||{},ta=sa.MutationObserver||sa.WebKitMutationObserver,ua=\"undefined\"!==typeof Uint8ClampedArray&&\"undefined\"!==typeof importScripts&&\"undefined\"!==typeof MessageChannel;function za(){return\"undefined\"!==typeof qa?function(){qa(Aa)}:Ba()}function Ca(){var a=0,b=new ta(Aa),c=document.createTextNode(\"\");b.observe(c,{characterData:!0});return function(){c.data=a=++a%2}}\nfunction Da(){var a=new MessageChannel;a.port1.onmessage=Aa;return function(){return a.port2.postMessage(0)}}function Ba(){var a=setTimeout;return function(){return a(Aa,1)}}var Ea=Array(1E3);function Aa(){for(var a=0;a<pa;a+=2)(0,Ea[a])(Ea[a+1]),Ea[a]=void 0,Ea[a+1]=void 0;pa=0}var Fa,Ga;\nif(\"undefined\"===typeof self&&\"undefined\"!==typeof process&&\"[object process]\"==={}.toString.call(process))Ga=function(){return process.ub(Aa)};else{var Ha;if(ta)Ha=Ca();else{var Ia;if(ua)Ia=Da();else{var Ja;if(void 0===ra&&\"function\"===typeof require)try{var Na=require(\"vertx\");qa=Na.wb||Na.vb;Ja=za()}catch(a){Ja=Ba()}else Ja=Ba();Ia=Ja}Ha=Ia}Ga=Ha}Fa=Ga;function Oa(a,b){Ea[pa]=a;Ea[pa+1]=b;pa+=2;2===pa&&Fa()};function Pa(a,b){var c=this,d=new this.constructor(Qa);void 0===d[Ra]&&Sa(d);var e=c.h;if(e){var f=arguments[e-1];Oa(function(){return Ta(e,d,f,c.f)})}else Ua(c,d,a,b);return d};function Va(a){if(a&&\"object\"===typeof a&&a.constructor===this)return a;var b=new this(Qa);Wa(b,a);return b};var Ra=Math.random().toString(36).substring(16);function Qa(){}var Ya=new Xa;function Za(a){try{return a.then}catch(b){return Ya.error=b,Ya}}function $a(a,b,c,d){try{a.call(b,c,d)}catch(e){return e}}function ab(a,b,c){Oa(function(a){var d=!1,f=$a(c,b,function(c){d||(d=!0,b!==c?Wa(a,c):r(a,c))},function(b){d||(d=!0,u(a,b))});!d&&f&&(d=!0,u(a,f))},a)}function bb(a,b){1===b.h?r(a,b.f):2===b.h?u(a,b.f):Ua(b,void 0,function(b){return Wa(a,b)},function(b){return u(a,b)})}\nfunction cb(a,b,c){b.constructor===a.constructor&&c===Pa&&b.constructor.resolve===Va?bb(a,b):c===Ya?(u(a,Ya.error),Ya.error=null):void 0===c?r(a,b):\"function\"===typeof c?ab(a,b,c):r(a,b)}function Wa(a,b){if(a===b)u(a,new TypeError(\"You cannot resolve a promise with itself\"));else{var c=typeof b;null===b||\"object\"!==c&&\"function\"!==c?r(a,b):cb(a,b,Za(b))}}function db(a){a.ra&&a.ra(a.f);eb(a)}function r(a,b){void 0===a.h&&(a.f=b,a.h=1,0!==a.L.length&&Oa(eb,a))}\nfunction u(a,b){void 0===a.h&&(a.h=2,a.f=b,Oa(db,a))}function Ua(a,b,c,d){var e=a.L,f=e.length;a.ra=null;e[f]=b;e[f+1]=c;e[f+2]=d;0===f&&a.h&&Oa(eb,a)}function eb(a){var b=a.L,c=a.h;if(0!==b.length){for(var d,e,f=a.f,h=0;h<b.length;h+=3)d=b[h],e=b[h+c],d?Ta(c,d,e,f):e(f);a.L.length=0}}function Xa(){this.error=null}var fb=new Xa;\nfunction Ta(a,b,c,d){var e=\"function\"===typeof c;if(e){try{var f=c(d)}catch(l){fb.error=l,f=fb}if(f===fb){var h=!0;var g=f.error;f.error=null}else var k=!0;if(b===f){u(b,new TypeError(\"A promises callback cannot return that same promise.\"));return}}else f=d,k=!0;void 0===b.h&&(e&&k?Wa(b,f):h?u(b,g):1===a?r(b,f):2===a&&u(b,f))}function gb(a,b){try{b(function(b){Wa(a,b)},function(b){u(a,b)})}catch(c){u(a,c)}}var hb=0;function Sa(a){a[Ra]=hb++;a.h=void 0;a.f=void 0;a.L=[]};function ib(a,b){this.Ia=a;this.D=new a(Qa);this.D[Ra]||Sa(this.D);if(oa(b))if(this.U=this.length=b.length,this.f=Array(this.length),0===this.length)r(this.D,this.f);else{this.length=this.length||0;for(a=0;void 0===this.h&&a<b.length;a++)jb(this,b[a],a);0===this.U&&r(this.D,this.f)}else u(this.D,Error(\"Array Methods must be provided an Array\"))}\nfunction jb(a,b,c){var d=a.Ia,e=d.resolve;e===Va?(e=Za(b),e===Pa&&void 0!==b.h?kb(a,b.h,c,b.f):\"function\"!==typeof e?(a.U--,a.f[c]=b):d===v?(d=new d(Qa),cb(d,b,e),lb(a,d,c)):lb(a,new d(function(a){return a(b)}),c)):lb(a,e(b),c)}function kb(a,b,c,d){var e=a.D;void 0===e.h&&(a.U--,2===b?u(e,d):a.f[c]=d);0===a.U&&r(e,a.f)}function lb(a,b,c){Ua(b,void 0,function(b){return kb(a,1,c,b)},function(b){return kb(a,2,c,b)})};function mb(a){return(new ib(this,a)).D};function ob(a){var b=this;return oa(a)?new b(function(c,d){for(var e=a.length,f=0;f<e;f++)b.resolve(a[f]).then(c,d)}):new b(function(a,b){return b(new TypeError(\"You must pass an array to race.\"))})};function pb(a){var b=new this(Qa);u(b,a);return b};function v(a){this[Ra]=hb++;this.f=this.h=void 0;this.L=[];if(Qa!==a){if(\"function\"!==typeof a)throw new TypeError(\"You must pass a resolver function as the first argument to the promise constructor\");if(this instanceof v)gb(this,a);else throw new TypeError(\"Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.\");}}v.prototype={constructor:v,then:Pa,a:function(a){return this.then(null,a)}};/*\n\nCopyright (c) 2017 The Polymer Project Authors. All rights reserved.\nThis code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\nThe complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\nThe complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\nCode distributed by Google as part of the polymer project is also\nsubject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n*/\nwindow.Promise||(window.Promise=v,v.prototype[\"catch\"]=v.prototype.a,v.prototype.then=v.prototype.then,v.all=mb,v.race=ob,v.resolve=Va,v.reject=pb);(function(a){function b(a,b){if(\"function\"===typeof window.CustomEvent)return new CustomEvent(a,b);var c=document.createEvent(\"CustomEvent\");c.initCustomEvent(a,!!b.bubbles,!!b.cancelable,b.detail);return c}function c(a){if(C)return a.ownerDocument!==document?a.ownerDocument:null;var b=a.__importDoc;if(!b&&a.parentNode){b=a.parentNode;if(\"function\"===typeof b.closest)b=b.closest(\"link[rel=import]\");else for(;!g(b)&&(b=b.parentNode););a.__importDoc=b}return b}function d(a){var b=m(document,\"link[rel=import]:not([import-dependency])\"),\nc=b.length;c?n(b,function(b){return h(b,function(){0===--c&&a()})}):a()}function e(a){function b(){\"loading\"!==document.readyState&&document.body&&(document.removeEventListener(\"readystatechange\",b),a())}document.addEventListener(\"readystatechange\",b);b()}function f(a){e(function(){return d(function(){return a&&a()})})}function h(a,b){if(a.__loaded)b&&b();else if(\"script\"===a.localName&&!a.src||\"style\"===a.localName&&!a.firstChild)a.__loaded=!0,b&&b();else{var c=function(d){a.removeEventListener(d.type,\nc);a.__loaded=!0;b&&b()};a.addEventListener(\"load\",c);ja&&\"style\"===a.localName||a.addEventListener(\"error\",c)}}function g(a){return a.nodeType===Node.ELEMENT_NODE&&\"link\"===a.localName&&\"import\"===a.rel}function k(){var a=this;this.a={};this.b=0;this.c=new MutationObserver(function(b){return a.Va(b)});this.c.observe(document.head,{childList:!0,subtree:!0});this.loadImports(document)}function l(a){n(m(a,\"template\"),function(a){n(m(a.content,'script:not([type]),script[type=\"application/javascript\"],script[type=\"text/javascript\"]'),\nfunction(a){var b=document.createElement(\"script\");n(a.attributes,function(a){return b.setAttribute(a.name,a.value)});b.textContent=a.textContent;a.parentNode.replaceChild(b,a)});l(a.content)})}function m(a,b){return a.childNodes.length?a.querySelectorAll(b):aa}function n(a,b,c){var d=a?a.length:0,e=c?-1:1;for(c=c?d-1:0;c<d&&0<=c;c+=e)b(a[c],c)}var t=document.createElement(\"link\"),C=\"import\"in t,aa=t.querySelectorAll(\"*\"),P=null;!1===\"currentScript\"in document&&Object.defineProperty(document,\"currentScript\",\n{get:function(){return P||(\"complete\"!==document.readyState?document.scripts[document.scripts.length-1]:null)},configurable:!0});var Ka=/(url\\()([^)]*)(\\))/g,ba=/(@import[\\s]+(?!url\\())([^;]*)(;)/g,La=/(<link[^>]*)(rel=['|\"]?stylesheet['|\"]?[^>]*>)/g,D={Pa:function(a,b){a.href&&a.setAttribute(\"href\",D.aa(a.getAttribute(\"href\"),b));a.src&&a.setAttribute(\"src\",D.aa(a.getAttribute(\"src\"),b));if(\"style\"===a.localName){var c=D.ya(a.textContent,b,Ka);a.textContent=D.ya(c,b,ba)}},ya:function(a,b,c){return a.replace(c,\nfunction(a,c,d,e){a=d.replace(/[\"']/g,\"\");b&&(a=D.aa(a,b));return c+\"'\"+a+\"'\"+e})},aa:function(a,b){if(void 0===D.ga){D.ga=!1;try{var c=new URL(\"b\",\"http://a\");c.pathname=\"c%20d\";D.ga=\"http://a/c%20d\"===c.href}catch(nb){}}if(D.ga)return(new URL(a,b)).href;c=D.Fa;c||(c=document.implementation.createHTMLDocument(\"temp\"),D.Fa=c,c.pa=c.createElement(\"base\"),c.head.appendChild(c.pa),c.oa=c.createElement(\"a\"));c.pa.href=b;c.oa.href=a;return c.oa.href||a}},va={async:!0,load:function(a,b,c){if(a)if(a.match(/^data:/)){a=\na.split(\",\");var d=a[1];d=-1<a[0].indexOf(\";base64\")?atob(d):decodeURIComponent(d);b(d)}else{var e=new XMLHttpRequest;e.open(\"GET\",a,va.async);e.onload=function(){var a=e.responseURL||e.getResponseHeader(\"Location\");a&&0===a.indexOf(\"/\")&&(a=(location.origin||location.protocol+\"//\"+location.host)+a);var d=e.response||e.responseText;304===e.status||0===e.status||200<=e.status&&300>e.status?b(d,a):c(d)};e.send()}else c(\"error: href must be specified\")}},ja=/Trident/.test(navigator.userAgent)||/Edge\\/\\d./i.test(navigator.userAgent);\nk.prototype.loadImports=function(a){var b=this;a=m(a,\"link[rel=import]\");n(a,function(a){return b.s(a)})};k.prototype.s=function(a){var b=this,c=a.href;if(void 0!==this.a[c]){var d=this.a[c];d&&d.__loaded&&(a.__import=d,this.i(a))}else this.b++,this.a[c]=\"pending\",va.load(c,function(a,d){a=b.Wa(a,d||c);b.a[c]=a;b.b--;b.loadImports(a);b.N()},function(){b.a[c]=null;b.b--;b.N()})};k.prototype.Wa=function(a,b){if(!a)return document.createDocumentFragment();ja&&(a=a.replace(La,function(a,b,c){return-1===\na.indexOf(\"type=\")?b+\" type=import-disable \"+c:a}));var c=document.createElement(\"template\");c.innerHTML=a;if(c.content)a=c.content,l(a);else for(a=document.createDocumentFragment();c.firstChild;)a.appendChild(c.firstChild);if(c=a.querySelector(\"base\"))b=D.aa(c.getAttribute(\"href\"),b),c.removeAttribute(\"href\");c=m(a,'link[rel=import],link[rel=stylesheet][href][type=import-disable],style:not([type]),link[rel=stylesheet][href]:not([type]),script:not([type]),script[type=\"application/javascript\"],script[type=\"text/javascript\"]');\nvar d=0;n(c,function(a){h(a);D.Pa(a,b);a.setAttribute(\"import-dependency\",\"\");\"script\"===a.localName&&!a.src&&a.textContent&&(a.setAttribute(\"src\",\"data:text/javascript;charset=utf-8,\"+encodeURIComponent(a.textContent+(\"\\n//# sourceURL=\"+b+(d?\"-\"+d:\"\")+\".js\\n\"))),a.textContent=\"\",d++)});return a};k.prototype.N=function(){var a=this;if(!this.b){this.c.disconnect();this.flatten(document);var b=!1,c=!1,d=function(){c&&b&&(a.loadImports(document),a.b||(a.c.observe(document.head,{childList:!0,subtree:!0}),\na.Ta()))};this.Ya(function(){c=!0;d()});this.Xa(function(){b=!0;d()})}};k.prototype.flatten=function(a){var b=this;a=m(a,\"link[rel=import]\");n(a,function(a){var c=b.a[a.href];(a.__import=c)&&c.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&(b.a[a.href]=a,a.readyState=\"loading\",a.__import=a,b.flatten(c),a.appendChild(c))})};k.prototype.Xa=function(a){function b(e){if(e<d){var f=c[e],g=document.createElement(\"script\");f.removeAttribute(\"import-dependency\");n(f.attributes,function(a){return g.setAttribute(a.name,\na.value)});P=g;f.parentNode.replaceChild(g,f);h(g,function(){P=null;b(e+1)})}else a()}var c=m(document,\"script[import-dependency]\"),d=c.length;b(0)};k.prototype.Ya=function(a){var b=m(document,\"style[import-dependency],link[rel=stylesheet][import-dependency]\"),d=b.length;if(d){var e=ja&&!!document.querySelector(\"link[rel=stylesheet][href][type=import-disable]\");n(b,function(b){h(b,function(){b.removeAttribute(\"import-dependency\");0===--d&&a()});if(e&&b.parentNode!==document.head){var f=document.createElement(b.localName);\nf.__appliedElement=b;f.setAttribute(\"type\",\"import-placeholder\");b.parentNode.insertBefore(f,b.nextSibling);for(f=c(b);f&&c(f);)f=c(f);f.parentNode!==document.head&&(f=null);document.head.insertBefore(b,f);b.removeAttribute(\"type\")}})}else a()};k.prototype.Ta=function(){var a=this,b=m(document,\"link[rel=import]\");n(b,function(b){return a.i(b)},!0)};k.prototype.i=function(a){a.__loaded||(a.__loaded=!0,a.import&&(a.import.readyState=\"complete\"),a.dispatchEvent(b(a.import?\"load\":\"error\",{bubbles:!1,\ncancelable:!1,detail:void 0})))};k.prototype.Va=function(a){var b=this;n(a,function(a){return n(a.addedNodes,function(a){a&&a.nodeType===Node.ELEMENT_NODE&&(g(a)?b.s(a):b.loadImports(a))})})};var wa=null;if(C)t=m(document,\"link[rel=import]\"),n(t,function(a){a.import&&\"loading\"===a.import.readyState||(a.__loaded=!0)}),t=function(a){a=a.target;g(a)&&(a.__loaded=!0)},document.addEventListener(\"load\",t,!0),document.addEventListener(\"error\",t,!0);else{var ca=Object.getOwnPropertyDescriptor(Node.prototype,\n\"baseURI\");Object.defineProperty((!ca||ca.configurable?Node:Element).prototype,\"baseURI\",{get:function(){var a=g(this)?this:c(this);return a?a.href:ca&&ca.get?ca.get.call(this):(document.querySelector(\"base\")||window.location).href},configurable:!0,enumerable:!0});Object.defineProperty(HTMLLinkElement.prototype,\"import\",{get:function(){return this.__import||null},configurable:!0,enumerable:!0});e(function(){wa=new k})}f(function(){return document.dispatchEvent(b(\"HTMLImportsLoaded\",{cancelable:!0,\nbubbles:!0,detail:void 0}))});a.useNative=C;a.whenReady=f;a.importForElement=c;a.loadImports=function(a){wa&&wa.loadImports(a)}})(window.HTMLImports=window.HTMLImports||{});/*\n\n Copyright (c) 2014 The Polymer Project Authors. All rights reserved.\n This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\n The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\n The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\n Code distributed by Google as part of the polymer project is also\n subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n*/\nwindow.WebComponents=window.WebComponents||{flags:{}};var qb=document.querySelector('script[src*=\"webcomponents-lite.js\"]'),rb=/wc-(.+)/,w={};if(!w.noOpts){location.search.slice(1).split(\"&\").forEach(function(a){a=a.split(\"=\");var b;a[0]&&(b=a[0].match(rb))&&(w[b[1]]=a[1]||!0)});if(qb)for(var sb=0,tb;tb=qb.attributes[sb];sb++)\"src\"!==tb.name&&(w[tb.name]=tb.value||!0);if(w.log&&w.log.split){var ub=w.log.split(\",\");w.log={};ub.forEach(function(a){w.log[a]=!0})}else w.log={}}\nwindow.WebComponents.flags=w;var vb=w.shadydom;vb&&(window.ShadyDOM=window.ShadyDOM||{},window.ShadyDOM.force=vb);var wb=w.register||w.ce;wb&&window.customElements&&(window.customElements.forcePolyfill=wb);/*\n\nCopyright (c) 2016 The Polymer Project Authors. All rights reserved.\nThis code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt\nThe complete set of authors may be found at http://polymer.github.io/AUTHORS.txt\nThe complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt\nCode distributed by Google as part of the polymer project is also\nsubject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt\n*/\nfunction xb(){this.xa=this.root=null;this.Y=!1;this.C=this.T=this.la=this.assignedSlot=this.assignedNodes=this.J=null;this.childNodes=this.nextSibling=this.previousSibling=this.lastChild=this.firstChild=this.parentNode=this.O=void 0;this.Da=this.qa=!1}xb.prototype.toJSON=function(){return{}};function x(a){a.ea||(a.ea=new xb);return a.ea}function y(a){return a&&a.ea};var z=window.ShadyDOM||{};z.Ra=!(!Element.prototype.attachShadow||!Node.prototype.getRootNode);var yb=Object.getOwnPropertyDescriptor(Node.prototype,\"firstChild\");z.w=!!(yb&&yb.configurable&&yb.get);z.va=z.force||!z.Ra;var zb=navigator.userAgent.match(\"Trident\"),Ab=navigator.userAgent.match(\"Edge\");void 0===z.Aa&&(z.Aa=z.w&&(zb||Ab));function Bb(a){return(a=y(a))&&void 0!==a.firstChild}function A(a){return\"ShadyRoot\"===a.Ja}function Cb(a){a=a.getRootNode();if(A(a))return a}\nvar Db=Element.prototype,Eb=Db.matches||Db.matchesSelector||Db.mozMatchesSelector||Db.msMatchesSelector||Db.oMatchesSelector||Db.webkitMatchesSelector;function Fb(a,b){if(a&&b)for(var c=Object.getOwnPropertyNames(b),d=0,e;d<c.length&&(e=c[d]);d++){var f=Object.getOwnPropertyDescriptor(b,e);f&&Object.defineProperty(a,e,f)}}function Gb(a,b){for(var c=[],d=1;d<arguments.length;++d)c[d-1]=arguments[d];for(d=0;d<c.length;d++)Fb(a,c[d]);return a}function Hb(a,b){for(var c in b)a[c]=b[c]}\nvar Ib=document.createTextNode(\"\"),Jb=0,Kb=[];(new MutationObserver(function(){for(;Kb.length;)try{Kb.shift()()}catch(a){throw Ib.textContent=Jb++,a;}})).observe(Ib,{characterData:!0});function Lb(a){Kb.push(a);Ib.textContent=Jb++}var Mb=!!document.contains;function Nb(a,b){for(;b;){if(b==a)return!0;b=b.parentNode}return!1};var Ob=[],Pb;function Qb(a){Pb||(Pb=!0,Lb(Rb));Ob.push(a)}function Rb(){Pb=!1;for(var a=!!Ob.length;Ob.length;)Ob.shift()();return a}Rb.list=Ob;function Sb(){this.a=!1;this.addedNodes=[];this.removedNodes=[];this.X=new Set}function Tb(a){a.a||(a.a=!0,Lb(function(){Ub(a)}))}function Ub(a){if(a.a){a.a=!1;var b=a.takeRecords();b.length&&a.X.forEach(function(a){a(b)})}}Sb.prototype.takeRecords=function(){if(this.addedNodes.length||this.removedNodes.length){var a=[{addedNodes:this.addedNodes,removedNodes:this.removedNodes}];this.addedNodes=[];this.removedNodes=[];return a}return[]};\nfunction Vb(a,b){var c=x(a);c.J||(c.J=new Sb);c.J.X.add(b);var d=c.J;return{Ga:b,G:d,Ka:a,takeRecords:function(){return d.takeRecords()}}}function Wb(a){var b=a&&a.G;b&&(b.X.delete(a.Ga),b.X.size||(x(a.Ka).J=null))}\nfunction Xb(a,b){var c=b.getRootNode();return a.map(function(a){var b=c===a.target.getRootNode();if(b&&a.addedNodes){if(b=Array.from(a.addedNodes).filter(function(a){return c===a.getRootNode()}),b.length)return a=Object.create(a),Object.defineProperty(a,\"addedNodes\",{value:b,configurable:!0}),a}else if(b)return a}).filter(function(a){return a})};var B={},Yb=Element.prototype.insertBefore,Zb=Element.prototype.replaceChild,$b=Element.prototype.removeChild,ac=Element.prototype.setAttribute,bc=Element.prototype.removeAttribute,cc=Element.prototype.cloneNode,dc=Document.prototype.importNode,ec=Element.prototype.addEventListener,fc=Element.prototype.removeEventListener,gc=Window.prototype.addEventListener,hc=Window.prototype.removeEventListener,ic=Element.prototype.dispatchEvent,jc=Node.prototype.contains||HTMLElement.prototype.contains,kc=Document.prototype.getElementById,\nlc=Element.prototype.querySelector,mc=DocumentFragment.prototype.querySelector,nc=Document.prototype.querySelector,oc=Element.prototype.querySelectorAll,pc=DocumentFragment.prototype.querySelectorAll,qc=Document.prototype.querySelectorAll;B.appendChild=Element.prototype.appendChild;B.insertBefore=Yb;B.replaceChild=Zb;B.removeChild=$b;B.setAttribute=ac;B.removeAttribute=bc;B.cloneNode=cc;B.importNode=dc;B.addEventListener=ec;B.removeEventListener=fc;B.fb=gc;B.gb=hc;B.dispatchEvent=ic;B.contains=jc;\nB.getElementById=kc;B.ob=lc;B.rb=mc;B.mb=nc;B.querySelector=function(a){switch(this.nodeType){case Node.ELEMENT_NODE:return lc.call(this,a);case Node.DOCUMENT_NODE:return nc.call(this,a);default:return mc.call(this,a)}};B.pb=oc;B.sb=pc;B.nb=qc;B.querySelectorAll=function(a){switch(this.nodeType){case Node.ELEMENT_NODE:return oc.call(this,a);case Node.DOCUMENT_NODE:return qc.call(this,a);default:return pc.call(this,a)}};var rc=/[&\\u00A0\"]/g,sc=/[&\\u00A0<>]/g;function tc(a){switch(a){case \"&\":return\"&amp;\";case \"<\":return\"&lt;\";case \">\":return\"&gt;\";case '\"':return\"&quot;\";case \"\\u00a0\":return\"&nbsp;\"}}function uc(a){for(var b={},c=0;c<a.length;c++)b[a[c]]=!0;return b}var vc=uc(\"area base br col command embed hr img input keygen link meta param source track wbr\".split(\" \")),wc=uc(\"style script xmp iframe noembed noframes plaintext noscript\".split(\" \"));\nfunction xc(a,b){\"template\"===a.localName&&(a=a.content);for(var c=\"\",d=b?b(a):a.childNodes,e=0,f=d.length,h;e<f&&(h=d[e]);e++){a:{var g=h;var k=a;var l=b;switch(g.nodeType){case Node.ELEMENT_NODE:for(var m=g.localName,n=\"<\"+m,t=g.attributes,C=0;k=t[C];C++)n+=\" \"+k.name+'=\"'+k.value.replace(rc,tc)+'\"';n+=\">\";g=vc[m]?n:n+xc(g,l)+\"</\"+m+\">\";break a;case Node.TEXT_NODE:g=g.data;g=k&&wc[k.localName]?g:g.replace(sc,tc);break a;case Node.COMMENT_NODE:g=\"\\x3c!--\"+g.data+\"--\\x3e\";break a;default:throw window.console.error(g),\nError(\"not implemented\");}}c+=g}return c};var E={},F=document.createTreeWalker(document,NodeFilter.SHOW_ALL,null,!1),G=document.createTreeWalker(document,NodeFilter.SHOW_ELEMENT,null,!1);function yc(a){var b=[];F.currentNode=a;for(a=F.firstChild();a;)b.push(a),a=F.nextSibling();return b}E.parentNode=function(a){F.currentNode=a;return F.parentNode()};E.firstChild=function(a){F.currentNode=a;return F.firstChild()};E.lastChild=function(a){F.currentNode=a;return F.lastChild()};E.previousSibling=function(a){F.currentNode=a;return F.previousSibling()};\nE.nextSibling=function(a){F.currentNode=a;return F.nextSibling()};E.childNodes=yc;E.parentElement=function(a){G.currentNode=a;return G.parentNode()};E.firstElementChild=function(a){G.currentNode=a;return G.firstChild()};E.lastElementChild=function(a){G.currentNode=a;return G.lastChild()};E.previousElementSibling=function(a){G.currentNode=a;return G.previousSibling()};E.nextElementSibling=function(a){G.currentNode=a;return G.nextSibling()};\nE.children=function(a){var b=[];G.currentNode=a;for(a=G.firstChild();a;)b.push(a),a=G.nextSibling();return b};E.innerHTML=function(a){return xc(a,function(a){return yc(a)})};E.textContent=function(a){switch(a.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:a=document.createTreeWalker(a,NodeFilter.SHOW_TEXT,null,!1);for(var b=\"\",c;c=a.nextNode();)b+=c.nodeValue;return b;default:return a.nodeValue}};var H={},zc=z.w,Ac=[Node.prototype,Element.prototype,HTMLElement.prototype];function I(a){var b;a:{for(b=0;b<Ac.length;b++){var c=Ac[b];if(c.hasOwnProperty(a)){b=c;break a}}b=void 0}if(!b)throw Error(\"Could not find descriptor for \"+a);return Object.getOwnPropertyDescriptor(b,a)}\nvar J=zc?{parentNode:I(\"parentNode\"),firstChild:I(\"firstChild\"),lastChild:I(\"lastChild\"),previousSibling:I(\"previousSibling\"),nextSibling:I(\"nextSibling\"),childNodes:I(\"childNodes\"),parentElement:I(\"parentElement\"),previousElementSibling:I(\"previousElementSibling\"),nextElementSibling:I(\"nextElementSibling\"),innerHTML:I(\"innerHTML\"),textContent:I(\"textContent\"),firstElementChild:I(\"firstElementChild\"),lastElementChild:I(\"lastElementChild\"),children:I(\"children\")}:{},Bc=zc?{firstElementChild:Object.getOwnPropertyDescriptor(DocumentFragment.prototype,\n\"firstElementChild\"),lastElementChild:Object.getOwnPropertyDescriptor(DocumentFragment.prototype,\"lastElementChild\"),children:Object.getOwnPropertyDescriptor(DocumentFragment.prototype,\"children\")}:{},Cc=zc?{firstElementChild:Object.getOwnPropertyDescriptor(Document.prototype,\"firstElementChild\"),lastElementChild:Object.getOwnPropertyDescriptor(Document.prototype,\"lastElementChild\"),children:Object.getOwnPropertyDescriptor(Document.prototype,\"children\")}:{};H.wa=J;H.qb=Bc;H.lb=Cc;H.parentNode=function(a){return J.parentNode.get.call(a)};\nH.firstChild=function(a){return J.firstChild.get.call(a)};H.lastChild=function(a){return J.lastChild.get.call(a)};H.previousSibling=function(a){return J.previousSibling.get.call(a)};H.nextSibling=function(a){return J.nextSibling.get.call(a)};H.childNodes=function(a){return Array.prototype.slice.call(J.childNodes.get.call(a))};H.parentElement=function(a){return J.parentElement.get.call(a)};H.previousElementSibling=function(a){return J.previousElementSibling.get.call(a)};H.nextElementSibling=function(a){return J.nextElementSibling.get.call(a)};\nH.innerHTML=function(a){return J.innerHTML.get.call(a)};H.textContent=function(a){return J.textContent.get.call(a)};H.children=function(a){switch(a.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:a=Bc.children.get.call(a);break;case Node.DOCUMENT_NODE:a=Cc.children.get.call(a);break;default:a=J.children.get.call(a)}return Array.prototype.slice.call(a)};\nH.firstElementChild=function(a){switch(a.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:return Bc.firstElementChild.get.call(a);case Node.DOCUMENT_NODE:return Cc.firstElementChild.get.call(a);default:return J.firstElementChild.get.call(a)}};H.lastElementChild=function(a){switch(a.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:return Bc.lastElementChild.get.call(a);case Node.DOCUMENT_NODE:return Cc.lastElementChild.get.call(a);default:return J.lastElementChild.get.call(a)}};var K=z.Aa?H:E;function Dc(a){for(;a.firstChild;)a.removeChild(a.firstChild)}\nvar Ec=z.w,Fc=document.implementation.createHTMLDocument(\"inert\"),Gc=Object.getOwnPropertyDescriptor(Node.prototype,\"isConnected\"),Hc=Gc&&Gc.get,Ic=Object.getOwnPropertyDescriptor(Document.prototype,\"activeElement\"),Jc={parentElement:{get:function(){var a=y(this);(a=a&&a.parentNode)&&a.nodeType!==Node.ELEMENT_NODE&&(a=null);return void 0!==a?a:K.parentElement(this)},configurable:!0},parentNode:{get:function(){var a=y(this);a=a&&a.parentNode;return void 0!==a?a:K.parentNode(this)},configurable:!0},\nnextSibling:{get:function(){var a=y(this);a=a&&a.nextSibling;return void 0!==a?a:K.nextSibling(this)},configurable:!0},previousSibling:{get:function(){var a=y(this);a=a&&a.previousSibling;return void 0!==a?a:K.previousSibling(this)},configurable:!0},nextElementSibling:{get:function(){var a=y(this);if(a&&void 0!==a.nextSibling){for(a=this.nextSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.nextSibling;return a}return K.nextElementSibling(this)},configurable:!0},previousElementSibling:{get:function(){var a=\ny(this);if(a&&void 0!==a.previousSibling){for(a=this.previousSibling;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.previousSibling;return a}return K.previousElementSibling(this)},configurable:!0}},Kc={className:{get:function(){return this.getAttribute(\"class\")||\"\"},set:function(a){this.setAttribute(\"class\",a)},configurable:!0}},Lc={childNodes:{get:function(){if(Bb(this)){var a=y(this);if(!a.childNodes){a.childNodes=[];for(var b=this.firstChild;b;b=b.nextSibling)a.childNodes.push(b)}var c=a.childNodes}else c=\nK.childNodes(this);c.item=function(a){return c[a]};return c},configurable:!0},childElementCount:{get:function(){return this.children.length},configurable:!0},firstChild:{get:function(){var a=y(this);a=a&&a.firstChild;return void 0!==a?a:K.firstChild(this)},configurable:!0},lastChild:{get:function(){var a=y(this);a=a&&a.lastChild;return void 0!==a?a:K.lastChild(this)},configurable:!0},textContent:{get:function(){if(Bb(this)){for(var a=[],b=0,c=this.childNodes,d;d=c[b];b++)d.nodeType!==Node.COMMENT_NODE&&\na.push(d.textContent);return a.join(\"\")}return K.textContent(this)},set:function(a){if(\"undefined\"===typeof a||null===a)a=\"\";switch(this.nodeType){case Node.ELEMENT_NODE:case Node.DOCUMENT_FRAGMENT_NODE:if(!Bb(this)&&Ec){var b=this.firstChild;(b!=this.lastChild||b&&b.nodeType!=Node.TEXT_NODE)&&Dc(this);H.wa.textContent.set.call(this,a)}else Dc(this),(0<a.length||this.nodeType===Node.ELEMENT_NODE)&&this.appendChild(document.createTextNode(a));break;default:this.nodeValue=a}},configurable:!0},firstElementChild:{get:function(){var a=\ny(this);if(a&&void 0!==a.firstChild){for(a=this.firstChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.nextSibling;return a}return K.firstElementChild(this)},configurable:!0},lastElementChild:{get:function(){var a=y(this);if(a&&void 0!==a.lastChild){for(a=this.lastChild;a&&a.nodeType!==Node.ELEMENT_NODE;)a=a.previousSibling;return a}return K.lastElementChild(this)},configurable:!0},children:{get:function(){var a=Bb(this)?Array.prototype.filter.call(this.childNodes,function(a){return a.nodeType===Node.ELEMENT_NODE}):\nK.children(this);a.item=function(b){return a[b]};return a},configurable:!0},innerHTML:{get:function(){return Bb(this)?xc(\"template\"===this.localName?this.content:this):K.innerHTML(this)},set:function(a){var b=\"template\"===this.localName?this.content:this;Dc(b);var c=this.localName;c&&\"template\"!==c||(c=\"div\");c=Fc.createElement(c);for(Ec?H.wa.innerHTML.set.call(c,a):c.innerHTML=a;c.firstChild;)b.appendChild(c.firstChild)},configurable:!0}},Mc={shadowRoot:{get:function(){var a=y(this);return a&&a.xa||\nnull},configurable:!0}},Nc={activeElement:{get:function(){var a=Ic&&Ic.get?Ic.get.call(document):z.w?void 0:document.activeElement;if(a&&a.nodeType){var b=!!A(this);if(this===document||b&&this.host!==a&&B.contains.call(this.host,a)){for(b=Cb(a);b&&b!==this;)a=b.host,b=Cb(a);a=this===document?b?null:a:b===this?a:null}else a=null}else a=null;return a},set:function(){},configurable:!0}};\nfunction L(a,b,c){for(var d in b){var e=Object.getOwnPropertyDescriptor(a,d);e&&e.configurable||!e&&c?Object.defineProperty(a,d,b[d]):c&&console.warn(\"Could not define\",d,\"on\",a)}}function Oc(a){L(a,Jc);L(a,Kc);L(a,Lc);L(a,Nc)}\nfunction Pc(){var a=Qc.prototype;a.__proto__=DocumentFragment.prototype;L(a,Jc,!0);L(a,Lc,!0);L(a,Nc,!0);Object.defineProperties(a,{nodeType:{value:Node.DOCUMENT_FRAGMENT_NODE,configurable:!0},nodeName:{value:\"#document-fragment\",configurable:!0},nodeValue:{value:null,configurable:!0}});[\"localName\",\"namespaceURI\",\"prefix\"].forEach(function(b){Object.defineProperty(a,b,{value:void 0,configurable:!0})});[\"ownerDocument\",\"baseURI\",\"isConnected\"].forEach(function(b){Object.defineProperty(a,b,{get:function(){return this.host[b]},\nconfigurable:!0})})}var Rc=z.w?function(){}:function(a){var b=x(a);b.qa||(b.qa=!0,L(a,Jc,!0),L(a,Kc,!0))},Sc=z.w?function(){}:function(a){x(a).Da||(L(a,Lc,!0),L(a,Mc,!0))};var Tc=K.childNodes;function Uc(a,b,c){Rc(a);c=c||null;var d=x(a),e=x(b),f=c?x(c):null;d.previousSibling=c?f.previousSibling:b.lastChild;if(f=y(d.previousSibling))f.nextSibling=a;if(f=y(d.nextSibling=c))f.previousSibling=a;d.parentNode=b;c?c===e.firstChild&&(e.firstChild=a):(e.lastChild=a,e.firstChild||(e.firstChild=a));e.childNodes=null}\nfunction Vc(a,b){var c=x(a);if(void 0===c.firstChild)for(b=b||Tc(a),c.firstChild=b[0]||null,c.lastChild=b[b.length-1]||null,Sc(a),c=0;c<b.length;c++){var d=b[c],e=x(d);e.parentNode=a;e.nextSibling=b[c+1]||null;e.previousSibling=b[c-1]||null;Rc(d)}};var Wc=K.parentNode;\nfunction Xc(a,b,c){if(b===a)throw Error(\"Failed to execute 'appendChild' on 'Node': The new child element contains the parent.\");if(c){var d=y(c);d=d&&d.parentNode;if(void 0!==d&&d!==a||void 0===d&&Wc(c)!==a)throw Error(\"Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.\");}if(c===b)return b;b.parentNode&&Yc(b.parentNode,b);var e,f;if(!b.__noInsertionPoint){if(f=e=Cb(a)){var h;\"slot\"===b.localName?h=[b]:b.querySelectorAll&&\n(h=b.querySelectorAll(\"slot\"));f=h&&h.length?h:void 0}f&&(h=e,d=f,h.v=h.v||[],h.g=h.g||[],h.j=h.j||{},h.v.push.apply(h.v,[].concat(d instanceof Array?d:na(ma(d)))))}(\"slot\"===a.localName||f)&&(e=e||Cb(a))&&Zc(e);if(Bb(a)){e=c;Sc(a);f=x(a);void 0!==f.firstChild&&(f.childNodes=null);if(b.nodeType===Node.DOCUMENT_FRAGMENT_NODE){f=b.childNodes;for(h=0;h<f.length;h++)Uc(f[h],a,e);e=x(b);f=void 0!==e.firstChild?null:void 0;e.firstChild=e.lastChild=f;e.childNodes=f}else Uc(b,a,e);e=y(a);if($c(a)){Zc(e.root);\nvar g=!0}else e.root&&(g=!0)}g||(g=A(a)?a.host:a,c?(c=ad(c),B.insertBefore.call(g,b,c)):B.appendChild.call(g,b));bd(a,b);return b}\nfunction Yc(a,b){if(b.parentNode!==a)throw Error(\"The node to be removed is not a child of this node: \"+b);var c=Cb(b),d=y(a);if(Bb(a)){var e=x(b),f=x(a);b===f.firstChild&&(f.firstChild=e.nextSibling);b===f.lastChild&&(f.lastChild=e.previousSibling);var h=e.previousSibling,g=e.nextSibling;h&&(x(h).nextSibling=g);g&&(x(g).previousSibling=h);e.parentNode=e.previousSibling=e.nextSibling=void 0;void 0!==f.childNodes&&(f.childNodes=null);if($c(a)){Zc(d.root);var k=!0}}cd(b);if(c){(e=a&&\"slot\"===a.localName)&&\n(k=!0);if(c.g){dd(c);f=c.j;for(aa in f)for(h=f[aa],g=0;g<h.length;g++){var l=h[g];if(Nb(b,l)){h.splice(g,1);var m=c.g.indexOf(l);0<=m&&c.g.splice(m,1);g--;m=y(l);if(l=m.C)for(var n=0;n<l.length;n++){var t=l[n],C=ed(t);C&&B.removeChild.call(C,t)}m.C=[];m.assignedNodes=[];m=!0}}var aa=m}else aa=void 0;(aa||e)&&Zc(c)}k||(k=A(a)?a.host:a,(!d.root&&\"slot\"!==b.localName||k===Wc(b))&&B.removeChild.call(k,b));bd(a,null,b);return b}\nfunction cd(a){var b=y(a);if(b&&void 0!==b.O){b=a.childNodes;for(var c=0,d=b.length,e;c<d&&(e=b[c]);c++)cd(e)}if(a=y(a))a.O=void 0}function ad(a){var b=a;a&&\"slot\"===a.localName&&(b=(b=(b=y(a))&&b.C)&&b.length?b[0]:ad(a.nextSibling));return b}function $c(a){return(a=(a=y(a))&&a.root)&&fd(a)}\nfunction gd(a,b){if(\"slot\"===b)a=a.parentNode,$c(a)&&Zc(y(a).root);else if(\"slot\"===a.localName&&\"name\"===b&&(b=Cb(a))){if(b.g){var c=a.Ea,d=hd(a);if(d!==c){c=b.j[c];var e=c.indexOf(a);0<=e&&c.splice(e,1);c=b.j[d]||(b.j[d]=[]);c.push(a);1<c.length&&(b.j[d]=id(c))}}Zc(b)}}function bd(a,b,c){if(a=(a=y(a))&&a.J)b&&a.addedNodes.push(b),c&&a.removedNodes.push(c),Tb(a)}\nfunction jd(a){if(a&&a.nodeType){var b=x(a),c=b.O;void 0===c&&(A(a)?(c=a,b.O=c):(c=(c=a.parentNode)?jd(c):a,B.contains.call(document.documentElement,a)&&(b.O=c)));return c}}function kd(a,b,c){var d=[];ld(a.childNodes,b,c,d);return d}function ld(a,b,c,d){for(var e=0,f=a.length,h;e<f&&(h=a[e]);e++){var g;if(g=h.nodeType===Node.ELEMENT_NODE){g=h;var k=b,l=c,m=d,n=k(g);n&&m.push(g);l&&l(n)?g=n:(ld(g.childNodes,k,l,m),g=void 0)}if(g)break}}var md=null;\nfunction nd(a,b,c){md||(md=window.ShadyCSS&&window.ShadyCSS.ScopingShim);md&&\"class\"===b?md.setElementClass(a,c):(B.setAttribute.call(a,b,c),gd(a,b))}function od(a,b){if(a.ownerDocument!==document)return B.importNode.call(document,a,b);var c=B.importNode.call(document,a,!1);if(b){a=a.childNodes;b=0;for(var d;b<a.length;b++)d=od(a[b],!0),c.appendChild(d)}return c};var pd=\"__eventWrappers\"+Date.now(),qd={blur:!0,focus:!0,focusin:!0,focusout:!0,click:!0,dblclick:!0,mousedown:!0,mouseenter:!0,mouseleave:!0,mousemove:!0,mouseout:!0,mouseover:!0,mouseup:!0,wheel:!0,beforeinput:!0,input:!0,keydown:!0,keyup:!0,compositionstart:!0,compositionupdate:!0,compositionend:!0,touchstart:!0,touchend:!0,touchmove:!0,touchcancel:!0,pointerover:!0,pointerenter:!0,pointerdown:!0,pointermove:!0,pointerup:!0,pointercancel:!0,pointerout:!0,pointerleave:!0,gotpointercapture:!0,lostpointercapture:!0,\ndragstart:!0,drag:!0,dragenter:!0,dragleave:!0,dragover:!0,drop:!0,dragend:!0,DOMActivate:!0,DOMFocusIn:!0,DOMFocusOut:!0,keypress:!0};function rd(a,b){var c=[],d=a;for(a=a===window?window:a.getRootNode();d;)c.push(d),d=d.assignedSlot?d.assignedSlot:d.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&d.host&&(b||d!==a)?d.host:d.parentNode;c[c.length-1]===document&&c.push(window);return c}\nfunction sd(a,b){if(!A)return a;a=rd(a,!0);for(var c=0,d,e,f,h;c<b.length;c++)if(d=b[c],f=d===window?window:d.getRootNode(),f!==e&&(h=a.indexOf(f),e=f),!A(f)||-1<h)return d}\nvar td={get composed(){!1!==this.isTrusted&&void 0===this.ca&&(this.ca=qd[this.type]);return this.ca||!1},composedPath:function(){this.b||(this.b=rd(this.__target,this.composed));return this.b},get target(){return sd(this.currentTarget,this.composedPath())},get relatedTarget(){if(!this.da)return null;this.c||(this.c=rd(this.da,!0));return sd(this.currentTarget,this.c)},stopPropagation:function(){Event.prototype.stopPropagation.call(this);this.a=!0},stopImmediatePropagation:function(){Event.prototype.stopImmediatePropagation.call(this);\nthis.a=this.i=!0}};function ud(a){function b(b,d){b=new a(b,d);b.ca=d&&!!d.composed;return b}Hb(b,a);b.prototype=a.prototype;return b}var vd={focus:!0,blur:!0};function wd(a){return a.__target!==a.target||a.da!==a.relatedTarget}function xd(a,b,c){if(c=b.__handlers&&b.__handlers[a.type]&&b.__handlers[a.type][c])for(var d=0,e;(e=c[d])&&(!wd(a)||a.target!==a.relatedTarget)&&(e.call(b,a),!a.i);d++);}\nfunction yd(a){var b=a.composedPath();Object.defineProperty(a,\"currentTarget\",{get:function(){return d},configurable:!0});for(var c=b.length-1;0<=c;c--){var d=b[c];xd(a,d,\"capture\");if(a.a)return}Object.defineProperty(a,\"eventPhase\",{get:function(){return Event.AT_TARGET}});var e;for(c=0;c<b.length;c++){d=b[c];var f=y(d);f=f&&f.root;if(0===c||f&&f===e)if(xd(a,d,\"bubble\"),d!==window&&(e=d.getRootNode()),a.a)break}}\nfunction zd(a,b,c,d,e,f){for(var h=0;h<a.length;h++){var g=a[h],k=g.type,l=g.capture,m=g.once,n=g.passive;if(b===g.node&&c===k&&d===l&&e===m&&f===n)return h}return-1}\nfunction Ad(a,b,c){if(b){var d=typeof b;if(\"function\"===d||\"object\"===d)if(\"object\"!==d||b.handleEvent&&\"function\"===typeof b.handleEvent){if(c&&\"object\"===typeof c){var e=!!c.capture;var f=!!c.once;var h=!!c.passive}else e=!!c,h=f=!1;var g=c&&c.fa||this,k=b[pd];if(k){if(-1<zd(k,g,a,e,f,h))return}else b[pd]=[];k=function(e){f&&this.removeEventListener(a,b,c);e.__target||Bd(e);if(g!==this){var h=Object.getOwnPropertyDescriptor(e,\"currentTarget\");Object.defineProperty(e,\"currentTarget\",{get:function(){return g},\nconfigurable:!0})}if(e.composed||-1<e.composedPath().indexOf(g))if(wd(e)&&e.target===e.relatedTarget)e.eventPhase===Event.BUBBLING_PHASE&&e.stopImmediatePropagation();else if(e.eventPhase===Event.CAPTURING_PHASE||e.bubbles||e.target===g||g instanceof Window){var k=\"function\"===d?b.call(g,e):b.handleEvent&&b.handleEvent(e);g!==this&&(h?(Object.defineProperty(e,\"currentTarget\",h),h=null):delete e.currentTarget);return k}};b[pd].push({node:g,type:a,capture:e,once:f,passive:h,hb:k});vd[a]?(this.__handlers=\nthis.__handlers||{},this.__handlers[a]=this.__handlers[a]||{capture:[],bubble:[]},this.__handlers[a][e?\"capture\":\"bubble\"].push(k)):(this instanceof Window?B.fb:B.addEventListener).call(this,a,k,c)}}}\nfunction Cd(a,b,c){if(b){if(c&&\"object\"===typeof c){var d=!!c.capture;var e=!!c.once;var f=!!c.passive}else d=!!c,f=e=!1;var h=c&&c.fa||this,g=void 0;var k=null;try{k=b[pd]}catch(l){}k&&(e=zd(k,h,a,d,e,f),-1<e&&(g=k.splice(e,1)[0].hb,k.length||(b[pd]=void 0)));(this instanceof Window?B.gb:B.removeEventListener).call(this,a,g||b,c);g&&vd[a]&&this.__handlers&&this.__handlers[a]&&(a=this.__handlers[a][d?\"capture\":\"bubble\"],g=a.indexOf(g),-1<g&&a.splice(g,1))}}\nfunction Dd(){for(var a in vd)window.addEventListener(a,function(a){a.__target||(Bd(a),yd(a))},!0)}function Bd(a){a.__target=a.target;a.da=a.relatedTarget;if(z.w){var b=Object.getPrototypeOf(a);if(!b.hasOwnProperty(\"__patchProto\")){var c=Object.create(b);c.jb=b;Fb(c,td);b.__patchProto=c}a.__proto__=b.__patchProto}else Fb(a,td)}var Ed=ud(window.Event),Fd=ud(window.CustomEvent),Gd=ud(window.MouseEvent);function Hd(a,b){return{index:a,P:[],W:b}}\nfunction Id(a,b,c,d){var e=0,f=0,h=0,g=0,k=Math.min(b-e,d-f);if(0==e&&0==f)a:{for(h=0;h<k;h++)if(a[h]!==c[h])break a;h=k}if(b==a.length&&d==c.length){g=a.length;for(var l=c.length,m=0;m<k-h&&Jd(a[--g],c[--l]);)m++;g=m}e+=h;f+=h;b-=g;d-=g;if(0==b-e&&0==d-f)return[];if(e==b){for(b=Hd(e,0);f<d;)b.P.push(c[f++]);return[b]}if(f==d)return[Hd(e,b-e)];k=e;h=f;d=d-h+1;g=b-k+1;b=Array(d);for(l=0;l<d;l++)b[l]=Array(g),b[l][0]=l;for(l=0;l<g;l++)b[0][l]=l;for(l=1;l<d;l++)for(m=1;m<g;m++)if(a[k+m-1]===c[h+l-1])b[l][m]=\nb[l-1][m-1];else{var n=b[l-1][m]+1,t=b[l][m-1]+1;b[l][m]=n<t?n:t}k=b.length-1;h=b[0].length-1;d=b[k][h];for(a=[];0<k||0<h;)0==k?(a.push(2),h--):0==h?(a.push(3),k--):(g=b[k-1][h-1],l=b[k-1][h],m=b[k][h-1],n=l<m?l<g?l:g:m<g?m:g,n==g?(g==d?a.push(0):(a.push(1),d=g),k--,h--):n==l?(a.push(3),k--,d=l):(a.push(2),h--,d=m));a.reverse();b=void 0;k=[];for(h=0;h<a.length;h++)switch(a[h]){case 0:b&&(k.push(b),b=void 0);e++;f++;break;case 1:b||(b=Hd(e,0));b.W++;e++;b.P.push(c[f]);f++;break;case 2:b||(b=Hd(e,0));\nb.W++;e++;break;case 3:b||(b=Hd(e,0)),b.P.push(c[f]),f++}b&&k.push(b);return k}function Jd(a,b){return a===b};var ed=K.parentNode,Kd=K.childNodes,Ld={};function Md(a){var b=[];do b.unshift(a);while(a=a.parentNode);return b}function Qc(a,b,c){if(a!==Ld)throw new TypeError(\"Illegal constructor\");this.Ja=\"ShadyRoot\";a=Kd(b);this.host=b;this.a=c&&c.mode;Vc(b,a);c=y(b);c.root=this;c.xa=\"closed\"!==this.a?this:null;c=x(this);c.firstChild=c.lastChild=c.parentNode=c.nextSibling=c.previousSibling=null;c.childNodes=[];this.V=!1;this.v=this.j=this.g=null;c=0;for(var d=a.length;c<d;c++)B.removeChild.call(b,a[c])}\nfunction Zc(a){a.V||(a.V=!0,Qb(function(){return Nd(a)}))}function Nd(a){for(var b;a;){a.V&&(b=a);a:{var c=a;a=c.host.getRootNode();if(A(a))for(var d=c.host.childNodes,e=0;e<d.length;e++)if(c=d[e],\"slot\"==c.localName)break a;a=void 0}}b&&b._renderRoot()}\nQc.prototype._renderRoot=function(){this.V=!1;if(this.g){dd(this);for(var a=0,b;a<this.g.length;a++){b=this.g[a];var c=y(b),d=c.assignedNodes;c.assignedNodes=[];c.C=[];if(c.la=d)for(c=0;c<d.length;c++){var e=y(d[c]);e.T=e.assignedSlot;e.assignedSlot===b&&(e.assignedSlot=null)}}for(b=this.host.firstChild;b;b=b.nextSibling)Od(this,b);for(a=0;a<this.g.length;a++){b=this.g[a];d=y(b);if(!d.assignedNodes.length)for(c=b.firstChild;c;c=c.nextSibling)Od(this,c,b);(c=(c=y(b.parentNode))&&c.root)&&fd(c)&&c._renderRoot();\nPd(this,d.C,d.assignedNodes);if(c=d.la){for(e=0;e<c.length;e++)y(c[e]).T=null;d.la=null;c.length>d.assignedNodes.length&&(d.Y=!0)}d.Y&&(d.Y=!1,Qd(this,b))}a=this.g;b=[];for(d=0;d<a.length;d++)c=a[d].parentNode,(e=y(c))&&e.root||!(0>b.indexOf(c))||b.push(c);for(a=0;a<b.length;a++){d=b[a];c=d===this?this.host:d;e=[];d=d.childNodes;for(var f=0;f<d.length;f++){var h=d[f];if(\"slot\"==h.localName){h=y(h).C;for(var g=0;g<h.length;g++)e.push(h[g])}else e.push(h)}d=void 0;f=Kd(c);h=Id(e,e.length,f,f.length);\nfor(var k=g=0;g<h.length&&(d=h[g]);g++){for(var l=0,m;l<d.P.length&&(m=d.P[l]);l++)ed(m)===c&&B.removeChild.call(c,m),f.splice(d.index+k,1);k-=d.W}for(k=0;k<h.length&&(d=h[k]);k++)for(g=f[d.index],l=d.index;l<d.index+d.W;l++)m=e[l],B.insertBefore.call(c,m,g),f.splice(l,0,m)}}};function Od(a,b,c){var d=x(b),e=d.T;d.T=null;c||(c=(a=a.j[b.slot||\"__catchall\"])&&a[0]);c?(x(c).assignedNodes.push(b),d.assignedSlot=c):d.assignedSlot=void 0;e!==d.assignedSlot&&d.assignedSlot&&(x(d.assignedSlot).Y=!0)}\nfunction Pd(a,b,c){for(var d=0,e;d<c.length&&(e=c[d]);d++)if(\"slot\"==e.localName){var f=y(e).assignedNodes;f&&f.length&&Pd(a,b,f)}else b.push(c[d])}function Qd(a,b){B.dispatchEvent.call(b,new Event(\"slotchange\"));b=y(b);b.assignedSlot&&Qd(a,b.assignedSlot)}function dd(a){if(a.v&&a.v.length){for(var b=a.v,c,d=0;d<b.length;d++){var e=b[d];Vc(e);Vc(e.parentNode);var f=hd(e);a.j[f]?(c=c||{},c[f]=!0,a.j[f].push(e)):a.j[f]=[e];a.g.push(e)}if(c)for(var h in c)a.j[h]=id(a.j[h]);a.v=[]}}\nfunction hd(a){var b=a.name||a.getAttribute(\"name\")||\"__catchall\";return a.Ea=b}function id(a){return a.sort(function(a,c){a=Md(a);for(var b=Md(c),e=0;e<a.length;e++){c=a[e];var f=b[e];if(c!==f)return a=Array.from(c.parentNode.childNodes),a.indexOf(c)-a.indexOf(f)}})}function fd(a){dd(a);return!(!a.g||!a.g.length)};function Rd(a){var b=a.getRootNode();A(b)&&Nd(b);return(a=y(a))&&a.assignedSlot||null}\nvar Sd={addEventListener:Ad.bind(window),removeEventListener:Cd.bind(window)},Td={addEventListener:Ad,removeEventListener:Cd,appendChild:function(a){return Xc(this,a)},insertBefore:function(a,b){return Xc(this,a,b)},removeChild:function(a){return Yc(this,a)},replaceChild:function(a,b){Xc(this,a,b);Yc(this,b);return a},cloneNode:function(a){if(\"template\"==this.localName)var b=B.cloneNode.call(this,a);else if(b=B.cloneNode.call(this,!1),a){a=this.childNodes;for(var c=0,d;c<a.length;c++)d=a[c].cloneNode(!0),\nb.appendChild(d)}return b},getRootNode:function(){return jd(this)},contains:function(a){return Nb(this,a)},dispatchEvent:function(a){Rb();return B.dispatchEvent.call(this,a)}};\nObject.defineProperties(Td,{isConnected:{get:function(){if(Hc&&Hc.call(this))return!0;if(this.nodeType==Node.DOCUMENT_FRAGMENT_NODE)return!1;var a=this.ownerDocument;if(Mb){if(B.contains.call(a,this))return!0}else if(a.documentElement&&B.contains.call(a.documentElement,this))return!0;for(a=this;a&&!(a instanceof Document);)a=a.parentNode||(A(a)?a.host:void 0);return!!(a&&a instanceof Document)},configurable:!0}});\nvar Ud={get assignedSlot(){return Rd(this)}},Vd={querySelector:function(a){return kd(this,function(b){return Eb.call(b,a)},function(a){return!!a})[0]||null},querySelectorAll:function(a,b){if(b){b=Array.prototype.slice.call(B.querySelectorAll(this,a));var c=this.getRootNode();return b.filter(function(a){return a.getRootNode()==c})}return kd(this,function(b){return Eb.call(b,a)})}},Wd={assignedNodes:function(a){if(\"slot\"===this.localName){var b=this.getRootNode();A(b)&&Nd(b);return(b=y(this))?(a&&a.flatten?\nb.C:b.assignedNodes)||[]:[]}}},Xd=Gb({setAttribute:function(a,b){nd(this,a,b)},removeAttribute:function(a){B.removeAttribute.call(this,a);gd(this,a)},attachShadow:function(a){if(!this)throw\"Must provide a host.\";if(!a)throw\"Not enough arguments.\";return new Qc(Ld,this,a)},get slot(){return this.getAttribute(\"slot\")},set slot(a){nd(this,\"slot\",a)},get assignedSlot(){return Rd(this)}},Vd,Wd);Object.defineProperties(Xd,Mc);\nvar Yd=Gb({importNode:function(a,b){return od(a,b)},getElementById:function(a){return kd(this,function(b){return b.id==a},function(a){return!!a})[0]||null}},Vd);Object.defineProperties(Yd,{_activeElement:Nc.activeElement});\nvar Zd=HTMLElement.prototype.blur,$d=Gb({blur:function(){var a=y(this);(a=(a=a&&a.root)&&a.activeElement)?a.blur():Zd.call(this)}}),ae={addEventListener:function(a,b,c){\"object\"!==typeof c&&(c={capture:!!c});c.fa=this;this.host.addEventListener(a,b,c)},removeEventListener:function(a,b,c){\"object\"!==typeof c&&(c={capture:!!c});c.fa=this;this.host.removeEventListener(a,b,c)},getElementById:function(a){return kd(this,function(b){return b.id==a},function(a){return!!a})[0]||null}};\nfunction M(a,b){for(var c=Object.getOwnPropertyNames(b),d=0;d<c.length;d++){var e=c[d],f=Object.getOwnPropertyDescriptor(b,e);f.value?a[e]=f.value:Object.defineProperty(a,e,f)}};if(z.va){var ShadyDOM={inUse:z.va,patch:function(a){Sc(a);Rc(a);return a},isShadyRoot:A,enqueue:Qb,flush:Rb,settings:z,filterMutations:Xb,observeChildren:Vb,unobserveChildren:Wb,nativeMethods:B,nativeTree:K};window.ShadyDOM=ShadyDOM;window.Event=Ed;window.CustomEvent=Fd;window.MouseEvent=Gd;Dd();var be=window.customElements&&window.customElements.nativeHTMLElement||HTMLElement;M(Qc.prototype,ae);M(window.Node.prototype,Td);M(window.Window.prototype,Sd);M(window.Text.prototype,Ud);M(window.DocumentFragment.prototype,\nVd);M(window.Element.prototype,Xd);M(window.Document.prototype,Yd);window.HTMLSlotElement&&M(window.HTMLSlotElement.prototype,Wd);M(be.prototype,$d);z.w&&(Oc(window.Node.prototype),Oc(window.Text.prototype),Oc(window.DocumentFragment.prototype),Oc(window.Element.prototype),Oc(be.prototype),Oc(window.Document.prototype),window.HTMLSlotElement&&Oc(window.HTMLSlotElement.prototype));Pc();window.ShadowRoot=Qc};var ce=new Set(\"annotation-xml color-profile font-face font-face-src font-face-uri font-face-format font-face-name missing-glyph\".split(\" \"));function de(a){var b=ce.has(a);a=/^[a-z][.0-9_a-z]*-[\\-.0-9_a-z]*$/.test(a);return!b&&a}function N(a){var b=a.isConnected;if(void 0!==b)return b;for(;a&&!(a.__CE_isImportDocument||a instanceof Document);)a=a.parentNode||(window.ShadowRoot&&a instanceof ShadowRoot?a.host:void 0);return!(!a||!(a.__CE_isImportDocument||a instanceof Document))}\nfunction ee(a,b){for(;b&&b!==a&&!b.nextSibling;)b=b.parentNode;return b&&b!==a?b.nextSibling:null}\nfunction fe(a,b,c){c=void 0===c?new Set:c;for(var d=a;d;){if(d.nodeType===Node.ELEMENT_NODE){var e=d;b(e);var f=e.localName;if(\"link\"===f&&\"import\"===e.getAttribute(\"rel\")){d=e.import;if(d instanceof Node&&!c.has(d))for(c.add(d),d=d.firstChild;d;d=d.nextSibling)fe(d,b,c);d=ee(a,e);continue}else if(\"template\"===f){d=ee(a,e);continue}if(e=e.__CE_shadowRoot)for(e=e.firstChild;e;e=e.nextSibling)fe(e,b,c)}d=d.firstChild?d.firstChild:ee(a,d)}}function O(a,b,c){a[b]=c};function ge(){this.a=new Map;this.s=new Map;this.i=[];this.c=!1}function he(a,b,c){a.a.set(b,c);a.s.set(c.constructor,c)}function ie(a,b){a.c=!0;a.i.push(b)}function je(a,b){a.c&&fe(b,function(b){return a.b(b)})}ge.prototype.b=function(a){if(this.c&&!a.__CE_patched){a.__CE_patched=!0;for(var b=0;b<this.i.length;b++)this.i[b](a)}};function Q(a,b){var c=[];fe(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state?a.connectedCallback(d):ke(a,d)}}\nfunction R(a,b){var c=[];fe(b,function(a){return c.push(a)});for(b=0;b<c.length;b++){var d=c[b];1===d.__CE_state&&a.disconnectedCallback(d)}}\nfunction S(a,b,c){c=void 0===c?{}:c;var d=c.eb||new Set,e=c.ba||function(b){return ke(a,b)},f=[];fe(b,function(b){if(\"link\"===b.localName&&\"import\"===b.getAttribute(\"rel\")){var c=b.import;c instanceof Node&&(c.__CE_isImportDocument=!0,c.__CE_hasRegistry=!0);c&&\"complete\"===c.readyState?c.__CE_documentLoadHandled=!0:b.addEventListener(\"load\",function(){var c=b.import;if(!c.__CE_documentLoadHandled){c.__CE_documentLoadHandled=!0;var f=new Set(d);f.delete(c);S(a,c,{eb:f,ba:e})}})}else f.push(b)},d);\nif(a.c)for(b=0;b<f.length;b++)a.b(f[b]);for(b=0;b<f.length;b++)e(f[b])}\nfunction ke(a,b){if(void 0===b.__CE_state){var c=b.ownerDocument;if(c.defaultView||c.__CE_isImportDocument&&c.__CE_hasRegistry)if(c=a.a.get(b.localName)){c.constructionStack.push(b);var d=c.constructor;try{try{if(new d!==b)throw Error(\"The custom element constructor did not produce the element being upgraded.\");}finally{c.constructionStack.pop()}}catch(h){throw b.__CE_state=2,h;}b.__CE_state=1;b.__CE_definition=c;if(c.attributeChangedCallback)for(c=c.observedAttributes,d=0;d<c.length;d++){var e=c[d],\nf=b.getAttribute(e);null!==f&&a.attributeChangedCallback(b,e,null,f,null)}N(b)&&a.connectedCallback(b)}}}ge.prototype.connectedCallback=function(a){var b=a.__CE_definition;b.connectedCallback&&b.connectedCallback.call(a)};ge.prototype.disconnectedCallback=function(a){var b=a.__CE_definition;b.disconnectedCallback&&b.disconnectedCallback.call(a)};\nge.prototype.attributeChangedCallback=function(a,b,c,d,e){var f=a.__CE_definition;f.attributeChangedCallback&&-1<f.observedAttributes.indexOf(b)&&f.attributeChangedCallback.call(a,b,c,d,e)};function le(a){var b=document;this.l=a;this.a=b;this.G=void 0;S(this.l,this.a);\"loading\"===this.a.readyState&&(this.G=new MutationObserver(this.b.bind(this)),this.G.observe(this.a,{childList:!0,subtree:!0}))}le.prototype.disconnect=function(){this.G&&this.G.disconnect()};le.prototype.b=function(a){var b=this.a.readyState;\"interactive\"!==b&&\"complete\"!==b||this.disconnect();for(b=0;b<a.length;b++)for(var c=a[b].addedNodes,d=0;d<c.length;d++)S(this.l,c[d])};function me(){var a=this;this.b=this.a=void 0;this.c=new Promise(function(b){a.b=b;a.a&&b(a.a)})}me.prototype.resolve=function(a){if(this.a)throw Error(\"Already resolved.\");this.a=a;this.b&&this.b(a)};function T(a){this.ia=!1;this.l=a;this.ma=new Map;this.ja=function(a){return a()};this.S=!1;this.ka=[];this.Ha=new le(a)}p=T.prototype;\np.define=function(a,b){var c=this;if(!(b instanceof Function))throw new TypeError(\"Custom element constructors must be functions.\");if(!de(a))throw new SyntaxError(\"The element name '\"+a+\"' is not valid.\");if(this.l.a.get(a))throw Error(\"A custom element with name '\"+a+\"' has already been defined.\");if(this.ia)throw Error(\"A custom element is already being defined.\");this.ia=!0;try{var d=function(a){var b=e[a];if(void 0!==b&&!(b instanceof Function))throw Error(\"The '\"+a+\"' callback must be a function.\");\nreturn b},e=b.prototype;if(!(e instanceof Object))throw new TypeError(\"The custom element constructor's prototype is not an object.\");var f=d(\"connectedCallback\");var h=d(\"disconnectedCallback\");var g=d(\"adoptedCallback\");var k=d(\"attributeChangedCallback\");var l=b.observedAttributes||[]}catch(m){return}finally{this.ia=!1}b={localName:a,constructor:b,connectedCallback:f,disconnectedCallback:h,adoptedCallback:g,attributeChangedCallback:k,observedAttributes:l,constructionStack:[]};he(this.l,a,b);this.ka.push(b);\nthis.S||(this.S=!0,this.ja(function(){return ne(c)}))};p.ba=function(a){S(this.l,a)};\nfunction ne(a){if(!1!==a.S){a.S=!1;for(var b=a.ka,c=[],d=new Map,e=0;e<b.length;e++)d.set(b[e].localName,[]);S(a.l,document,{ba:function(b){if(void 0===b.__CE_state){var e=b.localName,f=d.get(e);f?f.push(b):a.l.a.get(e)&&c.push(b)}}});for(e=0;e<c.length;e++)ke(a.l,c[e]);for(;0<b.length;){var f=b.shift();e=f.localName;f=d.get(f.localName);for(var h=0;h<f.length;h++)ke(a.l,f[h]);(e=a.ma.get(e))&&e.resolve(void 0)}}}p.get=function(a){if(a=this.l.a.get(a))return a.constructor};\np.Ba=function(a){if(!de(a))return Promise.reject(new SyntaxError(\"'\"+a+\"' is not a valid custom element name.\"));var b=this.ma.get(a);if(b)return b.c;b=new me;this.ma.set(a,b);this.l.a.get(a)&&!this.ka.some(function(b){return b.localName===a})&&b.resolve(void 0);return b.c};p.Za=function(a){this.Ha.disconnect();var b=this.ja;this.ja=function(c){return a(function(){return b(c)})}};window.CustomElementRegistry=T;T.prototype.define=T.prototype.define;T.prototype.upgrade=T.prototype.ba;\nT.prototype.get=T.prototype.get;T.prototype.whenDefined=T.prototype.Ba;T.prototype.polyfillWrapFlushCallback=T.prototype.Za;var oe=window.Document.prototype.createElement,pe=window.Document.prototype.createElementNS,qe=window.Document.prototype.importNode,re=window.Document.prototype.prepend,se=window.Document.prototype.append,te=window.DocumentFragment.prototype.prepend,ue=window.DocumentFragment.prototype.append,ve=window.Node.prototype.cloneNode,we=window.Node.prototype.appendChild,xe=window.Node.prototype.insertBefore,ye=window.Node.prototype.removeChild,ze=window.Node.prototype.replaceChild,Ae=Object.getOwnPropertyDescriptor(window.Node.prototype,\n\"textContent\"),Be=window.Element.prototype.attachShadow,Ce=Object.getOwnPropertyDescriptor(window.Element.prototype,\"innerHTML\"),De=window.Element.prototype.getAttribute,Ee=window.Element.prototype.setAttribute,Fe=window.Element.prototype.removeAttribute,Ge=window.Element.prototype.getAttributeNS,He=window.Element.prototype.setAttributeNS,Ie=window.Element.prototype.removeAttributeNS,Je=window.Element.prototype.insertAdjacentElement,Ke=window.Element.prototype.insertAdjacentHTML,Le=window.Element.prototype.prepend,\nMe=window.Element.prototype.append,Ne=window.Element.prototype.before,Oe=window.Element.prototype.after,Pe=window.Element.prototype.replaceWith,Qe=window.Element.prototype.remove,Re=window.HTMLElement,Se=Object.getOwnPropertyDescriptor(window.HTMLElement.prototype,\"innerHTML\"),Te=window.HTMLElement.prototype.insertAdjacentElement,Ue=window.HTMLElement.prototype.insertAdjacentHTML;var Ve=new function(){};function We(){var a=Xe;window.HTMLElement=function(){function b(){var b=this.constructor,d=a.s.get(b);if(!d)throw Error(\"The custom element being constructed was not registered with `customElements`.\");var e=d.constructionStack;if(0===e.length)return e=oe.call(document,d.localName),Object.setPrototypeOf(e,b.prototype),e.__CE_state=1,e.__CE_definition=d,a.b(e),e;d=e.length-1;var f=e[d];if(f===Ve)throw Error(\"The HTMLElement constructor was either called reentrantly for this constructor or called multiple times.\");\ne[d]=Ve;Object.setPrototypeOf(f,b.prototype);a.b(f);return f}b.prototype=Re.prototype;return b}()};function Ye(a,b,c){function d(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e-0]=arguments[e];e=[];for(var f=[],l=0;l<d.length;l++){var m=d[l];m instanceof Element&&N(m)&&f.push(m);if(m instanceof DocumentFragment)for(m=m.firstChild;m;m=m.nextSibling)e.push(m);else e.push(m)}b.apply(this,d);for(d=0;d<f.length;d++)R(a,f[d]);if(N(this))for(d=0;d<e.length;d++)f=e[d],f instanceof Element&&Q(a,f)}}void 0!==c.$&&(b.prepend=d(c.$));void 0!==c.append&&(b.append=d(c.append))};function Ze(){var a=Xe;O(Document.prototype,\"createElement\",function(b){if(this.__CE_hasRegistry){var c=a.a.get(b);if(c)return new c.constructor}b=oe.call(this,b);a.b(b);return b});O(Document.prototype,\"importNode\",function(b,c){b=qe.call(this,b,c);this.__CE_hasRegistry?S(a,b):je(a,b);return b});O(Document.prototype,\"createElementNS\",function(b,c){if(this.__CE_hasRegistry&&(null===b||\"http://www.w3.org/1999/xhtml\"===b)){var d=a.a.get(c);if(d)return new d.constructor}b=pe.call(this,b,c);a.b(b);return b});\nYe(a,Document.prototype,{$:re,append:se})};function $e(){var a=Xe;function b(b,d){Object.defineProperty(b,\"textContent\",{enumerable:d.enumerable,configurable:!0,get:d.get,set:function(b){if(this.nodeType===Node.TEXT_NODE)d.set.call(this,b);else{var c=void 0;if(this.firstChild){var e=this.childNodes,g=e.length;if(0<g&&N(this)){c=Array(g);for(var k=0;k<g;k++)c[k]=e[k]}}d.set.call(this,b);if(c)for(b=0;b<c.length;b++)R(a,c[b])}}})}O(Node.prototype,\"insertBefore\",function(b,d){if(b instanceof DocumentFragment){var c=Array.prototype.slice.apply(b.childNodes);\nb=xe.call(this,b,d);if(N(this))for(d=0;d<c.length;d++)Q(a,c[d]);return b}c=N(b);d=xe.call(this,b,d);c&&R(a,b);N(this)&&Q(a,b);return d});O(Node.prototype,\"appendChild\",function(b){if(b instanceof DocumentFragment){var c=Array.prototype.slice.apply(b.childNodes);b=we.call(this,b);if(N(this))for(var e=0;e<c.length;e++)Q(a,c[e]);return b}c=N(b);e=we.call(this,b);c&&R(a,b);N(this)&&Q(a,b);return e});O(Node.prototype,\"cloneNode\",function(b){b=ve.call(this,b);this.ownerDocument.__CE_hasRegistry?S(a,b):\nje(a,b);return b});O(Node.prototype,\"removeChild\",function(b){var c=N(b),e=ye.call(this,b);c&&R(a,b);return e});O(Node.prototype,\"replaceChild\",function(b,d){if(b instanceof DocumentFragment){var c=Array.prototype.slice.apply(b.childNodes);b=ze.call(this,b,d);if(N(this))for(R(a,d),d=0;d<c.length;d++)Q(a,c[d]);return b}c=N(b);var f=ze.call(this,b,d),h=N(this);h&&R(a,d);c&&R(a,b);h&&Q(a,b);return f});Ae&&Ae.get?b(Node.prototype,Ae):ie(a,function(a){b(a,{enumerable:!0,configurable:!0,get:function(){for(var a=\n[],b=0;b<this.childNodes.length;b++)a.push(this.childNodes[b].textContent);return a.join(\"\")},set:function(a){for(;this.firstChild;)ye.call(this,this.firstChild);we.call(this,document.createTextNode(a))}})})};function af(a){var b=Element.prototype;function c(b){return function(c){for(var d=[],e=0;e<arguments.length;++e)d[e-0]=arguments[e];e=[];for(var g=[],k=0;k<d.length;k++){var l=d[k];l instanceof Element&&N(l)&&g.push(l);if(l instanceof DocumentFragment)for(l=l.firstChild;l;l=l.nextSibling)e.push(l);else e.push(l)}b.apply(this,d);for(d=0;d<g.length;d++)R(a,g[d]);if(N(this))for(d=0;d<e.length;d++)g=e[d],g instanceof Element&&Q(a,g)}}void 0!==Ne&&(b.before=c(Ne));void 0!==Ne&&(b.after=c(Oe));void 0!==\nPe&&O(b,\"replaceWith\",function(b){for(var c=[],d=0;d<arguments.length;++d)c[d-0]=arguments[d];d=[];for(var h=[],g=0;g<c.length;g++){var k=c[g];k instanceof Element&&N(k)&&h.push(k);if(k instanceof DocumentFragment)for(k=k.firstChild;k;k=k.nextSibling)d.push(k);else d.push(k)}g=N(this);Pe.apply(this,c);for(c=0;c<h.length;c++)R(a,h[c]);if(g)for(R(a,this),c=0;c<d.length;c++)h=d[c],h instanceof Element&&Q(a,h)});void 0!==Qe&&O(b,\"remove\",function(){var b=N(this);Qe.call(this);b&&R(a,this)})};function bf(){var a=Xe;function b(b,c){Object.defineProperty(b,\"innerHTML\",{enumerable:c.enumerable,configurable:!0,get:c.get,set:function(b){var d=this,e=void 0;N(this)&&(e=[],fe(this,function(a){a!==d&&e.push(a)}));c.set.call(this,b);if(e)for(var f=0;f<e.length;f++){var h=e[f];1===h.__CE_state&&a.disconnectedCallback(h)}this.ownerDocument.__CE_hasRegistry?S(a,this):je(a,this);return b}})}function c(b,c){O(b,\"insertAdjacentElement\",function(b,d){var e=N(d);b=c.call(this,b,d);e&&R(a,d);N(b)&&Q(a,\nd);return b})}function d(b,c){function d(b,c){for(var d=[];b!==c;b=b.nextSibling)d.push(b);for(c=0;c<d.length;c++)S(a,d[c])}O(b,\"insertAdjacentHTML\",function(a,b){a=a.toLowerCase();if(\"beforebegin\"===a){var e=this.previousSibling;c.call(this,a,b);d(e||this.parentNode.firstChild,this)}else if(\"afterbegin\"===a)e=this.firstChild,c.call(this,a,b),d(this.firstChild,e);else if(\"beforeend\"===a)e=this.lastChild,c.call(this,a,b),d(e||this.firstChild,null);else if(\"afterend\"===a)e=this.nextSibling,c.call(this,\na,b),d(this.nextSibling,e);else throw new SyntaxError(\"The value provided (\"+String(a)+\") is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'.\");})}Be&&O(Element.prototype,\"attachShadow\",function(a){return this.__CE_shadowRoot=a=Be.call(this,a)});Ce&&Ce.get?b(Element.prototype,Ce):Se&&Se.get?b(HTMLElement.prototype,Se):ie(a,function(a){b(a,{enumerable:!0,configurable:!0,get:function(){return ve.call(this,!0).innerHTML},set:function(a){var b=\"template\"===this.localName,c=b?this.content:\nthis,d=oe.call(document,this.localName);for(d.innerHTML=a;0<c.childNodes.length;)ye.call(c,c.childNodes[0]);for(a=b?d.content:d;0<a.childNodes.length;)we.call(c,a.childNodes[0])}})});O(Element.prototype,\"setAttribute\",function(b,c){if(1!==this.__CE_state)return Ee.call(this,b,c);var d=De.call(this,b);Ee.call(this,b,c);c=De.call(this,b);a.attributeChangedCallback(this,b,d,c,null)});O(Element.prototype,\"setAttributeNS\",function(b,c,d){if(1!==this.__CE_state)return He.call(this,b,c,d);var e=Ge.call(this,\nb,c);He.call(this,b,c,d);d=Ge.call(this,b,c);a.attributeChangedCallback(this,c,e,d,b)});O(Element.prototype,\"removeAttribute\",function(b){if(1!==this.__CE_state)return Fe.call(this,b);var c=De.call(this,b);Fe.call(this,b);null!==c&&a.attributeChangedCallback(this,b,c,null,null)});O(Element.prototype,\"removeAttributeNS\",function(b,c){if(1!==this.__CE_state)return Ie.call(this,b,c);var d=Ge.call(this,b,c);Ie.call(this,b,c);var e=Ge.call(this,b,c);d!==e&&a.attributeChangedCallback(this,c,d,e,b)});Te?\nc(HTMLElement.prototype,Te):Je?c(Element.prototype,Je):console.warn(\"Custom Elements: `Element#insertAdjacentElement` was not patched.\");Ue?d(HTMLElement.prototype,Ue):Ke?d(Element.prototype,Ke):console.warn(\"Custom Elements: `Element#insertAdjacentHTML` was not patched.\");Ye(a,Element.prototype,{$:Le,append:Me});af(a)};var cf=window.customElements;if(!cf||cf.forcePolyfill||\"function\"!=typeof cf.define||\"function\"!=typeof cf.get){var Xe=new ge;We();Ze();Ye(Xe,DocumentFragment.prototype,{$:te,append:ue});$e();bf();document.__CE_hasRegistry=!0;var customElements=new T(Xe);Object.defineProperty(window,\"customElements\",{configurable:!0,enumerable:!0,value:customElements})};function df(){this.end=this.start=0;this.rules=this.parent=this.previous=null;this.cssText=this.parsedCssText=\"\";this.atRule=!1;this.type=0;this.parsedSelector=this.selector=this.keyframesName=\"\"}\nfunction ef(a){a=a.replace(ff,\"\").replace(gf,\"\");var b=kf,c=a,d=new df;d.start=0;d.end=c.length;for(var e=d,f=0,h=c.length;f<h;f++)if(\"{\"===c[f]){e.rules||(e.rules=[]);var g=e,k=g.rules[g.rules.length-1]||null;e=new df;e.start=f+1;e.parent=g;e.previous=k;g.rules.push(e)}else\"}\"===c[f]&&(e.end=f+1,e=e.parent||d);return b(d,a)}\nfunction kf(a,b){var c=b.substring(a.start,a.end-1);a.parsedCssText=a.cssText=c.trim();a.parent&&(c=b.substring(a.previous?a.previous.end:a.parent.start,a.start-1),c=lf(c),c=c.replace(mf,\" \"),c=c.substring(c.lastIndexOf(\";\")+1),c=a.parsedSelector=a.selector=c.trim(),a.atRule=0===c.indexOf(\"@\"),a.atRule?0===c.indexOf(\"@media\")?a.type=nf:c.match(of)&&(a.type=pf,a.keyframesName=a.selector.split(mf).pop()):a.type=0===c.indexOf(\"--\")?qf:rf);if(c=a.rules)for(var d=0,e=c.length,f;d<e&&(f=c[d]);d++)kf(f,\nb);return a}function lf(a){return a.replace(/\\\\([0-9a-f]{1,6})\\s/gi,function(a,c){a=c;for(c=6-a.length;c--;)a=\"0\"+a;return\"\\\\\"+a})}\nfunction sf(a,b,c){c=void 0===c?\"\":c;var d=\"\";if(a.cssText||a.rules){var e=a.rules,f;if(f=e)f=e[0],f=!(f&&f.selector&&0===f.selector.indexOf(\"--\"));if(f){f=0;for(var h=e.length,g;f<h&&(g=e[f]);f++)d=sf(g,b,d)}else b?b=a.cssText:(b=a.cssText,b=b.replace(tf,\"\").replace(uf,\"\"),b=b.replace(vf,\"\").replace(wf,\"\")),(d=b.trim())&&(d=\"  \"+d+\"\\n\")}d&&(a.selector&&(c+=a.selector+\" {\\n\"),c+=d,a.selector&&(c+=\"}\\n\\n\"));return c}\nvar rf=1,pf=7,nf=4,qf=1E3,ff=/\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\//gim,gf=/@import[^;]*;/gim,tf=/(?:^[^;\\-\\s}]+)?--[^;{}]*?:[^{};]*?(?:[;\\n]|$)/gim,uf=/(?:^[^;\\-\\s}]+)?--[^;{}]*?:[^{};]*?{[^}]*?}(?:[;\\n]|$)?/gim,vf=/@apply\\s*\\(?[^);]*\\)?\\s*(?:[;\\n]|$)?/gim,wf=/[^;:]*?:[^;]*?var\\([^;]*\\)(?:[;\\n]|$)?/gim,of=/^@[^\\s]*keyframes/,mf=/\\s+/g;var U=!(window.ShadyDOM&&window.ShadyDOM.inUse),xf;function yf(a){xf=a&&a.shimcssproperties?!1:U||!(navigator.userAgent.match(/AppleWebKit\\/601|Edge\\/15/)||!window.CSS||!CSS.supports||!CSS.supports(\"box-shadow\",\"0 0 0 var(--foo)\"))}window.ShadyCSS&&void 0!==window.ShadyCSS.nativeCss?xf=window.ShadyCSS.nativeCss:window.ShadyCSS?(yf(window.ShadyCSS),window.ShadyCSS=void 0):yf(window.WebComponents&&window.WebComponents.flags);var V=xf;var zf=/(?:^|[;\\s{]\\s*)(--[\\w-]*?)\\s*:\\s*(?:((?:'(?:\\\\'|.)*?'|\"(?:\\\\\"|.)*?\"|\\([^)]*?\\)|[^};{])+)|\\{([^}]*)\\}(?:(?=[;\\s}])|$))/gi,Af=/(?:^|\\W+)@apply\\s*\\(?([^);\\n]*)\\)?/gi,Bf=/(--[\\w-]+)\\s*([:,;)]|$)/gi,Cf=/(animation\\s*:)|(animation-name\\s*:)/,Df=/@media\\s(.*)/,Ef=/\\{[^}]*\\}/g;var Ff=new Set;function Gf(a,b){if(!a)return\"\";\"string\"===typeof a&&(a=ef(a));b&&Hf(a,b);return sf(a,V)}function If(a){!a.__cssRules&&a.textContent&&(a.__cssRules=ef(a.textContent));return a.__cssRules||null}function Jf(a){return!!a.parent&&a.parent.type===pf}function Hf(a,b,c,d){if(a){var e=!1,f=a.type;if(d&&f===nf){var h=a.selector.match(Df);h&&(window.matchMedia(h[1]).matches||(e=!0))}f===rf?b(a):c&&f===pf?c(a):f===qf&&(e=!0);if((a=a.rules)&&!e){e=0;f=a.length;for(var g;e<f&&(g=a[e]);e++)Hf(g,b,c,d)}}}\nfunction Kf(a,b,c,d){var e=document.createElement(\"style\");b&&e.setAttribute(\"scope\",b);e.textContent=a;Lf(e,c,d);return e}var Mf=null;function Lf(a,b,c){b=b||document.head;b.insertBefore(a,c&&c.nextSibling||b.firstChild);Mf?a.compareDocumentPosition(Mf)===Node.DOCUMENT_POSITION_PRECEDING&&(Mf=a):Mf=a}\nfunction Nf(a,b){var c=a.indexOf(\"var(\");if(-1===c)return b(a,\"\",\"\",\"\");a:{var d=0;var e=c+3;for(var f=a.length;e<f;e++)if(\"(\"===a[e])d++;else if(\")\"===a[e]&&0===--d)break a;e=-1}d=a.substring(c+4,e);c=a.substring(0,c);a=Nf(a.substring(e+1),b);e=d.indexOf(\",\");return-1===e?b(c,d.trim(),\"\",a):b(c,d.substring(0,e).trim(),d.substring(e+1).trim(),a)}function Of(a,b){U?a.setAttribute(\"class\",b):window.ShadyDOM.nativeMethods.setAttribute.call(a,\"class\",b)}\nfunction Pf(a){var b=a.localName,c=\"\";b?-1<b.indexOf(\"-\")||(c=b,b=a.getAttribute&&a.getAttribute(\"is\")||\"\"):(b=a.is,c=a.extends);return{is:b,R:c}};function Qf(){}function Rf(a,b,c){var d=W;a.__styleScoped?a.__styleScoped=null:Sf(d,a,b||\"\",c)}function Sf(a,b,c,d){b.nodeType===Node.ELEMENT_NODE&&Tf(b,c,d);if(b=\"template\"===b.localName?(b.content||b.kb).childNodes:b.children||b.childNodes)for(var e=0;e<b.length;e++)Sf(a,b[e],c,d)}\nfunction Tf(a,b,c){if(b)if(a.classList)c?(a.classList.remove(\"style-scope\"),a.classList.remove(b)):(a.classList.add(\"style-scope\"),a.classList.add(b));else if(a.getAttribute){var d=a.getAttribute(Uf);c?d&&(b=d.replace(\"style-scope\",\"\").replace(b,\"\"),Of(a,b)):Of(a,(d?d+\" \":\"\")+\"style-scope \"+b)}}function Vf(a,b,c){var d=W,e=a.__cssBuild;U||\"shady\"===e?b=Gf(b,c):(a=Pf(a),b=Wf(d,b,a.is,a.R,c)+\"\\n\\n\");return b.trim()}\nfunction Wf(a,b,c,d,e){var f=Xf(c,d);c=c?Yf+c:\"\";return Gf(b,function(b){b.c||(b.selector=b.o=Zf(a,b,a.b,c,f),b.c=!0);e&&e(b,c,f)})}function Xf(a,b){return b?\"[is=\"+a+\"]\":a}function Zf(a,b,c,d,e){var f=b.selector.split($f);if(!Jf(b)){b=0;for(var h=f.length,g;b<h&&(g=f[b]);b++)f[b]=c.call(a,g,d,e)}return f.join($f)}function ag(a){return a.replace(bg,function(a,c,d){-1<d.indexOf(\"+\")?d=d.replace(/\\+/g,\"___\"):-1<d.indexOf(\"___\")&&(d=d.replace(/___/g,\"+\"));return\":\"+c+\"(\"+d+\")\"})}\nQf.prototype.b=function(a,b,c){var d=!1;a=a.trim();var e=bg.test(a);e&&(a=a.replace(bg,function(a,b,c){return\":\"+b+\"(\"+c.replace(/\\s/g,\"\")+\")\"}),a=ag(a));a=a.replace(cg,dg+\" $1\");a=a.replace(eg,function(a,e,g){d||(a=fg(g,e,b,c),d=d||a.stop,e=a.Oa,g=a.value);return e+g});e&&(a=ag(a));return a};\nfunction fg(a,b,c,d){var e=a.indexOf(gg);0<=a.indexOf(dg)?a=hg(a,d):0!==e&&(a=c?ig(a,c):a);c=!1;0<=e&&(b=\"\",c=!0);if(c){var f=!0;c&&(a=a.replace(jg,function(a,b){return\" > \"+b}))}a=a.replace(kg,function(a,b,c){return'[dir=\"'+c+'\"] '+b+\", \"+b+'[dir=\"'+c+'\"]'});return{value:a,Oa:b,stop:f}}function ig(a,b){a=a.split(lg);a[0]+=b;return a.join(lg)}\nfunction hg(a,b){var c=a.match(mg);return(c=c&&c[2].trim()||\"\")?c[0].match(ng)?a.replace(mg,function(a,c,f){return b+f}):c.split(ng)[0]===b?c:og:a.replace(dg,b)}function pg(a){a.selector===qg&&(a.selector=\"html\")}Qf.prototype.c=function(a){return a.match(gg)?this.b(a,rg):ig(a.trim(),rg)};q.Object.defineProperties(Qf.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return\"style-scope\"}}});\nvar bg=/:(nth[-\\w]+)\\(([^)]+)\\)/,rg=\":not(.style-scope)\",$f=\",\",eg=/(^|[\\s>+~]+)((?:\\[.+?\\]|[^\\s>+~=[])+)/g,ng=/[[.:#*]/,dg=\":host\",qg=\":root\",gg=\"::slotted\",cg=new RegExp(\"^(\"+gg+\")\"),mg=/(:host)(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))/,jg=/(?:::slotted)(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))/,kg=/(.*):dir\\((?:(ltr|rtl))\\)/,Yf=\".\",lg=\":\",Uf=\"class\",og=\"should_not_match\",W=new Qf;function sg(a,b,c,d){this.B=a||null;this.b=b||null;this.na=c||[];this.K=null;this.R=d||\"\";this.a=this.u=this.F=null}function X(a){return a?a.__styleInfo:null}function tg(a,b){return a.__styleInfo=b}sg.prototype.c=function(){return this.B};sg.prototype._getStyleRules=sg.prototype.c;function ug(a){var b=this.matches||this.matchesSelector||this.mozMatchesSelector||this.msMatchesSelector||this.oMatchesSelector||this.webkitMatchesSelector;return b&&b.call(this,a)}var vg=navigator.userAgent.match(\"Trident\");function wg(){}function xg(a){var b={},c=[],d=0;Hf(a,function(a){yg(a);a.index=d++;a=a.m.cssText;for(var c;c=Bf.exec(a);){var e=c[1];\":\"!==c[2]&&(b[e]=!0)}},function(a){c.push(a)});a.b=c;a=[];for(var e in b)a.push(e);return a}\nfunction yg(a){if(!a.m){var b={},c={};zg(a,c)&&(b.A=c,a.rules=null);b.cssText=a.parsedCssText.replace(Ef,\"\").replace(zf,\"\");a.m=b}}function zg(a,b){var c=a.m;if(c){if(c.A)return Object.assign(b,c.A),!0}else{c=a.parsedCssText;for(var d;a=zf.exec(c);){d=(a[2]||a[3]).trim();if(\"inherit\"!==d||\"unset\"!==d)b[a[1].trim()]=d;d=!0}return d}}\nfunction Ag(a,b,c){b&&(b=0<=b.indexOf(\";\")?Bg(a,b,c):Nf(b,function(b,e,f,h){if(!e)return b+h;(e=Ag(a,c[e],c))&&\"initial\"!==e?\"apply-shim-inherit\"===e&&(e=\"inherit\"):e=Ag(a,c[f]||f,c)||f;return b+(e||\"\")+h}));return b&&b.trim()||\"\"}\nfunction Bg(a,b,c){b=b.split(\";\");for(var d=0,e,f;d<b.length;d++)if(e=b[d]){Af.lastIndex=0;if(f=Af.exec(e))e=Ag(a,c[f[1]],c);else if(f=e.indexOf(\":\"),-1!==f){var h=e.substring(f);h=h.trim();h=Ag(a,h,c)||h;e=e.substring(0,f)+h}b[d]=e&&e.lastIndexOf(\";\")===e.length-1?e.slice(0,-1):e||\"\"}return b.join(\";\")}\nfunction Cg(a,b){var c={},d=[];Hf(a,function(a){a.m||yg(a);var e=a.o||a.parsedSelector;b&&a.m.A&&e&&ug.call(b,e)&&(zg(a,c),a=a.index,e=parseInt(a/32,10),d[e]=(d[e]||0)|1<<a%32)},null,!0);return{A:c,key:d}}\nfunction Dg(a,b,c,d){b.m||yg(b);if(b.m.A){var e=Pf(a);a=e.is;e=e.R;e=a?Xf(a,e):\"html\";var f=b.parsedSelector,h=\":host > *\"===f||\"html\"===f,g=0===f.indexOf(\":host\")&&!h;\"shady\"===c&&(h=f===e+\" > *.\"+e||-1!==f.indexOf(\"html\"),g=!h&&0===f.indexOf(e));\"shadow\"===c&&(h=\":host > *\"===f||\"html\"===f,g=g&&!h);if(h||g)c=e,g&&(b.o||(b.o=Zf(W,b,W.b,a?Yf+a:\"\",e)),c=b.o||e),d({ab:c,Ua:g,tb:h})}}\nfunction Eg(a,b){var c={},d={},e=b&&b.__cssBuild;Hf(b,function(b){Dg(a,b,e,function(e){ug.call(a.b||a,e.ab)&&(e.Ua?zg(b,c):zg(b,d))})},null,!0);return{$a:d,Sa:c}}\nfunction Fg(a,b,c,d){var e=Pf(b),f=Xf(e.is,e.R),h=new RegExp(\"(?:^|[^.#[:])\"+(b.extends?\"\\\\\"+f.slice(0,-1)+\"\\\\]\":f)+\"($|[.:[\\\\s>+~])\");e=X(b).B;var g=Gg(e,d);return Vf(b,e,function(b){var e=\"\";b.m||yg(b);b.m.cssText&&(e=Bg(a,b.m.cssText,c));b.cssText=e;if(!U&&!Jf(b)&&b.cssText){var k=e=b.cssText;null==b.ua&&(b.ua=Cf.test(e));if(b.ua)if(null==b.Z){b.Z=[];for(var n in g)k=g[n],k=k(e),e!==k&&(e=k,b.Z.push(n))}else{for(n=0;n<b.Z.length;++n)k=g[b.Z[n]],e=k(e);k=e}b.cssText=k;b.o=b.o||b.selector;e=\".\"+\nd;n=b.o.split(\",\");k=0;for(var t=n.length,C;k<t&&(C=n[k]);k++)n[k]=C.match(h)?C.replace(f,e):e+\" \"+C;b.selector=n.join(\",\")}})}function Gg(a,b){a=a.b;var c={};if(!U&&a)for(var d=0,e=a[d];d<a.length;e=a[++d]){var f=e,h=b;f.i=new RegExp(\"\\\\b\"+f.keyframesName+\"(?!\\\\B|-)\",\"g\");f.a=f.keyframesName+\"-\"+h;f.o=f.o||f.selector;f.selector=f.o.replace(f.keyframesName,f.a);c[e.keyframesName]=Hg(e)}return c}function Hg(a){return function(b){return b.replace(a.i,a.a)}}\nfunction Ig(a,b){var c=Jg,d=If(a);a.textContent=Gf(d,function(a){var d=a.cssText=a.parsedCssText;a.m&&a.m.cssText&&(d=d.replace(tf,\"\").replace(uf,\"\"),a.cssText=Bg(c,d,b))})}q.Object.defineProperties(wg.prototype,{a:{configurable:!0,enumerable:!0,get:function(){return\"x-scope\"}}});var Jg=new wg;var Kg={},Lg=window.customElements;if(Lg&&!U){var Mg=Lg.define;Lg.define=function(a,b,c){var d=document.createComment(\" Shady DOM styles for \"+a+\" \"),e=document.head;e.insertBefore(d,(Mf?Mf.nextSibling:null)||e.firstChild);Mf=d;Kg[a]=d;Mg.call(Lg,a,b,c)}};function Ng(){this.cache={}}Ng.prototype.store=function(a,b,c,d){var e=this.cache[a]||[];e.push({A:b,styleElement:c,u:d});100<e.length&&e.shift();this.cache[a]=e};Ng.prototype.fetch=function(a,b,c){if(a=this.cache[a])for(var d=a.length-1;0<=d;d--){var e=a[d],f;a:{for(f=0;f<c.length;f++){var h=c[f];if(e.A[h]!==b[h]){f=!1;break a}}f=!0}if(f)return e}};function Og(){}\nfunction Pg(a){for(var b=0;b<a.length;b++){var c=a[b];if(c.target!==document.documentElement&&c.target!==document.head)for(var d=0;d<c.addedNodes.length;d++){var e=c.addedNodes[d];if(e.nodeType===Node.ELEMENT_NODE){var f=e.getRootNode();var h=e;var g=[];h.classList?g=Array.from(h.classList):h instanceof window.SVGElement&&h.hasAttribute(\"class\")&&(g=h.getAttribute(\"class\").split(/\\s+/));h=g;g=h.indexOf(W.a);if((h=-1<g?h[g+1]:\"\")&&f===e.ownerDocument)Rf(e,h,!0);else if(f.nodeType===Node.DOCUMENT_FRAGMENT_NODE&&\n(f=f.host))if(f=Pf(f).is,h===f)for(e=window.ShadyDOM.nativeMethods.querySelectorAll.call(e,\":not(.\"+W.a+\")\"),f=0;f<e.length;f++)Tf(e[f],h);else h&&Rf(e,h,!0),Rf(e,f)}}}}\nif(!U){var Qg=new MutationObserver(Pg),Rg=function(a){Qg.observe(a,{childList:!0,subtree:!0})};if(window.customElements&&!window.customElements.polyfillWrapFlushCallback)Rg(document);else{var Sg=function(){Rg(document.body)};window.HTMLImports?window.HTMLImports.whenReady(Sg):requestAnimationFrame(function(){if(\"loading\"===document.readyState){var a=function(){Sg();document.removeEventListener(\"readystatechange\",a)};document.addEventListener(\"readystatechange\",a)}else Sg()})}Og=function(){Pg(Qg.takeRecords())}}\nvar Tg=Og;var Ug={};var Vg=Promise.resolve();function Wg(a){if(a=Ug[a])a._applyShimCurrentVersion=a._applyShimCurrentVersion||0,a._applyShimValidatingVersion=a._applyShimValidatingVersion||0,a._applyShimNextVersion=(a._applyShimNextVersion||0)+1}function Xg(a){return a._applyShimCurrentVersion===a._applyShimNextVersion}function Yg(a){a._applyShimValidatingVersion=a._applyShimNextVersion;a.ta||(a.ta=!0,Vg.then(function(){a._applyShimCurrentVersion=a._applyShimNextVersion;a.ta=!1}))};var Zg=null,$g=window.HTMLImports&&window.HTMLImports.whenReady||null,ah;function bh(a){requestAnimationFrame(function(){$g?$g(a):(Zg||(Zg=new Promise(function(a){ah=a}),\"complete\"===document.readyState?ah():document.addEventListener(\"readystatechange\",function(){\"complete\"===document.readyState&&ah()})),Zg.then(function(){a&&a()}))})};var ch=new Ng;function Y(){var a=this;this.N={};this.c=document.documentElement;var b=new df;b.rules=[];this.i=tg(this.c,new sg(b));this.s=!1;this.b=this.a=null;bh(function(){dh(a)})}p=Y.prototype;p.Ca=function(){Tg()};p.Qa=function(a){return If(a)};p.cb=function(a){return Gf(a)};\np.prepareTemplate=function(a,b,c){if(!a.Ma){a.Ma=!0;a.name=b;a.extends=c;Ug[b]=a;var d=(d=a.content.querySelector(\"style\"))?d.getAttribute(\"css-build\")||\"\":\"\";var e=[];for(var f=a.content.querySelectorAll(\"style\"),h=0;h<f.length;h++){var g=f[h];if(g.hasAttribute(\"shady-unscoped\")){if(!U){var k=g.textContent;Ff.has(k)||(Ff.add(k),k=g.cloneNode(!0),document.head.appendChild(k));g.parentNode.removeChild(g)}}else e.push(g.textContent),g.parentNode.removeChild(g)}e=e.join(\"\").trim();c={is:b,extends:c,\nib:d};U||Rf(a.content,b);dh(this);f=Af.test(e)||zf.test(e);Af.lastIndex=0;zf.lastIndex=0;e=ef(e);f&&V&&this.a&&this.a.transformRules(e,b);a._styleAst=e;a.a=d;d=[];V||(d=xg(a._styleAst));if(!d.length||V)e=U?a.content:null,b=Kg[b],f=Vf(c,a._styleAst),b=f.length?Kf(f,c.is,e,b):void 0,a.sa=b;a.La=d}};\nfunction eh(a){!a.b&&window.ShadyCSS&&window.ShadyCSS.CustomStyleInterface&&(a.b=window.ShadyCSS.CustomStyleInterface,a.b.transformCallback=function(b){a.za(b)},a.b.validateCallback=function(){requestAnimationFrame(function(){(a.b.enqueued||a.s)&&a.I()})})}function dh(a){!a.a&&window.ShadyCSS&&window.ShadyCSS.ApplyShim&&(a.a=window.ShadyCSS.ApplyShim,a.a.invalidCallback=Wg);eh(a)}\np.I=function(){dh(this);if(this.b){var a=this.b.processStyles();if(this.b.enqueued){if(V)for(var b=0;b<a.length;b++){var c=this.b.getStyleForCustomStyle(a[b]);if(c&&V&&this.a){var d=If(c);dh(this);this.a.transformRules(d);c.textContent=Gf(d)}}else for(fh(this,this.c,this.i),b=0;b<a.length;b++)(c=this.b.getStyleForCustomStyle(a[b]))&&Ig(c,this.i.F);this.b.enqueued=!1;this.s&&!V&&this.styleDocument()}}};\np.styleElement=function(a,b){var c=Pf(a).is,d=X(a);if(!d){var e=Pf(a);d=e.is;e=e.R;var f=Kg[d];d=Ug[d];if(d){var h=d._styleAst;var g=d.La}d=tg(a,new sg(h,f,g,e))}a!==this.c&&(this.s=!0);b&&(d.K=d.K||{},Object.assign(d.K,b));if(V){if(d.K){b=d.K;for(var k in b)null===k?a.style.removeProperty(k):a.style.setProperty(k,b[k])}if(((k=Ug[c])||a===this.c)&&k&&k.sa&&!Xg(k)){if(Xg(k)||k._applyShimValidatingVersion!==k._applyShimNextVersion)dh(this),this.a&&this.a.transformRules(k._styleAst,c),k.sa.textContent=\nVf(a,d.B),Yg(k);U&&(c=a.shadowRoot)&&(c.querySelector(\"style\").textContent=Vf(a,d.B));d.B=k._styleAst}}else if(fh(this,a,d),d.na&&d.na.length){c=d;k=Pf(a).is;d=(b=ch.fetch(k,c.F,c.na))?b.styleElement:null;h=c.u;(g=b&&b.u)||(g=this.N[k]=(this.N[k]||0)+1,g=k+\"-\"+g);c.u=g;g=c.u;e=Jg;e=d?d.textContent||\"\":Fg(e,a,c.F,g);f=X(a);var l=f.a;l&&!U&&l!==d&&(l._useCount--,0>=l._useCount&&l.parentNode&&l.parentNode.removeChild(l));U?f.a?(f.a.textContent=e,d=f.a):e&&(d=Kf(e,g,a.shadowRoot,f.b)):d?d.parentNode||\n(vg&&-1<e.indexOf(\"@media\")&&(d.textContent=e),Lf(d,null,f.b)):e&&(d=Kf(e,g,null,f.b));d&&(d._useCount=d._useCount||0,f.a!=d&&d._useCount++,f.a=d);g=d;U||(d=c.u,f=e=a.getAttribute(\"class\")||\"\",h&&(f=e.replace(new RegExp(\"\\\\s*x-scope\\\\s*\"+h+\"\\\\s*\",\"g\"),\" \")),f+=(f?\" \":\"\")+\"x-scope \"+d,e!==f&&Of(a,f));b||ch.store(k,c.F,g,c.u)}};function gh(a,b){return(b=b.getRootNode().host)?X(b)?b:gh(a,b):a.c}\nfunction fh(a,b,c){a=gh(a,b);var d=X(a);a=Object.create(d.F||null);var e=Eg(b,c.B);b=Cg(d.B,b).A;Object.assign(a,e.Sa,b,e.$a);b=c.K;for(var f in b)if((e=b[f])||0===e)a[f]=e;f=Jg;b=Object.getOwnPropertyNames(a);for(e=0;e<b.length;e++)d=b[e],a[d]=Ag(f,a[d],a);c.F=a}p.styleDocument=function(a){this.styleSubtree(this.c,a)};\np.styleSubtree=function(a,b){var c=a.shadowRoot;(c||a===this.c)&&this.styleElement(a,b);if(b=c&&(c.children||c.childNodes))for(a=0;a<b.length;a++)this.styleSubtree(b[a]);else if(a=a.children||a.childNodes)for(b=0;b<a.length;b++)this.styleSubtree(a[b])};p.za=function(a){var b=this,c=If(a);Hf(c,function(a){if(U)pg(a);else{var c=W;a.selector=a.parsedSelector;pg(a);a.selector=a.o=Zf(c,a,c.c,void 0,void 0)}V&&(dh(b),b.a&&b.a.transformRule(a))});V?a.textContent=Gf(c):this.i.B.rules.push(c)};\np.getComputedStyleValue=function(a,b){var c;V||(c=(X(a)||X(gh(this,a))).F[b]);return(c=c||window.getComputedStyle(a).getPropertyValue(b))?c.trim():\"\"};p.bb=function(a,b){var c=a.getRootNode();b=b?b.split(/\\s/):[];c=c.host&&c.host.localName;if(!c){var d=a.getAttribute(\"class\");if(d){d=d.split(/\\s/);for(var e=0;e<d.length;e++)if(d[e]===W.a){c=d[e+1];break}}}c&&b.push(W.a,c);V||(c=X(a))&&c.u&&b.push(Jg.a,c.u);Of(a,b.join(\" \"))};p.Na=function(a){return X(a)};Y.prototype.flush=Y.prototype.Ca;\nY.prototype.prepareTemplate=Y.prototype.prepareTemplate;Y.prototype.styleElement=Y.prototype.styleElement;Y.prototype.styleDocument=Y.prototype.styleDocument;Y.prototype.styleSubtree=Y.prototype.styleSubtree;Y.prototype.getComputedStyleValue=Y.prototype.getComputedStyleValue;Y.prototype.setElementClass=Y.prototype.bb;Y.prototype._styleInfoForNode=Y.prototype.Na;Y.prototype.transformCustomStyleForDocument=Y.prototype.za;Y.prototype.getStyleAst=Y.prototype.Qa;Y.prototype.styleAstToString=Y.prototype.cb;\nY.prototype.flushCustomStyles=Y.prototype.I;Object.defineProperties(Y.prototype,{nativeShadow:{get:function(){return U}},nativeCss:{get:function(){return V}}});var Z=new Y,hh,ih;window.ShadyCSS&&(hh=window.ShadyCSS.ApplyShim,ih=window.ShadyCSS.CustomStyleInterface);window.ShadyCSS={ScopingShim:Z,prepareTemplate:function(a,b,c){Z.I();Z.prepareTemplate(a,b,c)},styleSubtree:function(a,b){Z.I();Z.styleSubtree(a,b)},styleElement:function(a){Z.I();Z.styleElement(a)},styleDocument:function(a){Z.I();Z.styleDocument(a)},getComputedStyleValue:function(a,b){return Z.getComputedStyleValue(a,b)},nativeCss:V,nativeShadow:U};hh&&(window.ShadyCSS.ApplyShim=hh);\nih&&(window.ShadyCSS.CustomStyleInterface=ih);var jh=window.customElements,kh=window.HTMLImports,lh=window.HTMLTemplateElement;window.WebComponents=window.WebComponents||{};if(jh&&jh.polyfillWrapFlushCallback){var mh,nh=function(){if(mh){lh.M&&lh.M(window.document);var a=mh;mh=null;a();return!0}},oh=kh.whenReady;jh.polyfillWrapFlushCallback(function(a){mh=a;oh(nh)});kh.whenReady=function(a){oh(function(){nh()?kh.whenReady(a):a()})}}\nkh.whenReady(function(){requestAnimationFrame(function(){window.WebComponents.ready=!0;document.dispatchEvent(new CustomEvent(\"WebComponentsReady\",{bubbles:!0}))})});var ph=document.createElement(\"style\");ph.textContent=\"body {transition: opacity ease-in 0.2s; } \\nbody[unresolved] {opacity: 0; display: block; overflow: hidden; position: relative; } \\n\";var qh=document.querySelector(\"head\");qh.insertBefore(ph,qh.firstChild);}).call(this);\n\n//# sourceMappingURL=webcomponents-lite.js.map\n"

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(28))

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "/*!\n* Parsley.js\n* Version 2.8.1 - built Sat, Feb 3rd 2018, 2:27 pm\n* http://parsleyjs.org\n* Guillaume Potier - <guillaume@wisembly.com>\n* Marc-Andre Lafortune - <petroselinum@marc-andre.ca>\n* MIT Licensed\n*/\nfunction _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,i=Array(e.length);t<e.length;t++)i[t]=e[t];return i}return Array.from(e)}var _slice=Array.prototype.slice,_slicedToArray=function(){function e(e,t){var i=[],n=!0,r=!1,s=void 0;try{for(var a,o=e[Symbol.iterator]();!(n=(a=o.next()).done)&&(i.push(a.value),!t||i.length!==t);n=!0);}catch(l){r=!0,s=l}finally{try{!n&&o[\"return\"]&&o[\"return\"]()}finally{if(r)throw s}}return i}return function(t,i){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,i);throw new TypeError(\"Invalid attempt to destructure non-iterable instance\")}}(),_extends=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e};!function(e,t){\"object\"==typeof exports&&\"undefined\"!=typeof module?module.exports=t(require(\"jquery\")):\"function\"==typeof define&&define.amd?define([\"jquery\"],t):e.parsley=t(e.jQuery)}(this,function(e){\"use strict\";function t(e,t){return e.parsleyAdaptedCallback||(e.parsleyAdaptedCallback=function(){var i=Array.prototype.slice.call(arguments,0);i.unshift(this),e.apply(t||M,i)}),e.parsleyAdaptedCallback}function i(e){return 0===e.lastIndexOf(D,0)?e.substr(D.length):e}/**\n   * inputevent - Alleviate browser bugs for input events\n   * https://github.com/marcandre/inputevent\n   * @version v0.0.3 - (built Thu, Apr 14th 2016, 5:58 pm)\n   * @author Marc-Andre Lafortune <github@marc-andre.ca>\n   * @license MIT\n   */\nfunction n(){var t=this,i=window||global;_extends(this,{isNativeEvent:function(e){return e.originalEvent&&e.originalEvent.isTrusted!==!1},fakeInputEvent:function(i){t.isNativeEvent(i)&&e(i.target).trigger(\"input\")},misbehaves:function(i){t.isNativeEvent(i)&&(t.behavesOk(i),e(document).on(\"change.inputevent\",i.data.selector,t.fakeInputEvent),t.fakeInputEvent(i))},behavesOk:function(i){t.isNativeEvent(i)&&e(document).off(\"input.inputevent\",i.data.selector,t.behavesOk).off(\"change.inputevent\",i.data.selector,t.misbehaves)},install:function(){if(!i.inputEventPatched){i.inputEventPatched=\"0.0.3\";for(var n=[\"select\",'input[type=\"checkbox\"]','input[type=\"radio\"]','input[type=\"file\"]'],r=0;r<n.length;r++){var s=n[r];e(document).on(\"input.inputevent\",s,{selector:s},t.behavesOk).on(\"change.inputevent\",s,{selector:s},t.misbehaves)}}},uninstall:function(){delete i.inputEventPatched,e(document).off(\".inputevent\")}})}var r=1,s={},a={attr:function(e,t,i){var n,r,s,a=new RegExp(\"^\"+t,\"i\");if(\"undefined\"==typeof i)i={};else for(n in i)i.hasOwnProperty(n)&&delete i[n];if(!e)return i;for(s=e.attributes,n=s.length;n--;)r=s[n],r&&r.specified&&a.test(r.name)&&(i[this.camelize(r.name.slice(t.length))]=this.deserializeValue(r.value));return i},checkAttr:function(e,t,i){return e.hasAttribute(t+i)},setAttr:function(e,t,i,n){e.setAttribute(this.dasherize(t+i),String(n))},getType:function(e){return e.getAttribute(\"type\")||\"text\"},generateID:function(){return\"\"+r++},deserializeValue:function(e){var t;try{return e?\"true\"==e||\"false\"!=e&&(\"null\"==e?null:isNaN(t=Number(e))?/^[\\[\\{]/.test(e)?JSON.parse(e):e:t):e}catch(i){return e}},camelize:function(e){return e.replace(/-+(.)?/g,function(e,t){return t?t.toUpperCase():\"\"})},dasherize:function(e){return e.replace(/::/g,\"/\").replace(/([A-Z]+)([A-Z][a-z])/g,\"$1_$2\").replace(/([a-z\\d])([A-Z])/g,\"$1_$2\").replace(/_/g,\"-\").toLowerCase()},warn:function(){var e;window.console&&\"function\"==typeof window.console.warn&&(e=window.console).warn.apply(e,arguments)},warnOnce:function(e){s[e]||(s[e]=!0,this.warn.apply(this,arguments))},_resetWarnings:function(){s={}},trimString:function(e){return e.replace(/^\\s+|\\s+$/g,\"\")},parse:{date:function S(e){var t=e.match(/^(\\d{4,})-(\\d\\d)-(\\d\\d)$/);if(!t)return null;var i=t.map(function(e){return parseInt(e,10)}),n=_slicedToArray(i,4),r=(n[0],n[1]),s=n[2],a=n[3],S=new Date(r,s-1,a);return S.getFullYear()!==r||S.getMonth()+1!==s||S.getDate()!==a?null:S},string:function(e){return e},integer:function(e){return isNaN(e)?null:parseInt(e,10)},number:function(e){if(isNaN(e))throw null;return parseFloat(e)},\"boolean\":function(e){return!/^\\s*false\\s*$/i.test(e)},object:function(e){return a.deserializeValue(e)},regexp:function(e){var t=\"\";return/^\\/.*\\/(?:[gimy]*)$/.test(e)?(t=e.replace(/.*\\/([gimy]*)$/,\"$1\"),e=e.replace(new RegExp(\"^/(.*?)/\"+t+\"$\"),\"$1\")):e=\"^\"+e+\"$\",new RegExp(e,t)}},parseRequirement:function(e,t){var i=this.parse[e||\"string\"];if(!i)throw'Unknown requirement specification: \"'+e+'\"';var n=i(t);if(null===n)throw\"Requirement is not a \"+e+': \"'+t+'\"';return n},namespaceEvents:function(t,i){return t=this.trimString(t||\"\").split(/\\s+/),t[0]?e.map(t,function(e){return e+\".\"+i}).join(\" \"):\"\"},difference:function(t,i){var n=[];return e.each(t,function(e,t){i.indexOf(t)==-1&&n.push(t)}),n},all:function(t){return e.when.apply(e,_toConsumableArray(t).concat([42,42]))},objectCreate:Object.create||function(){var e=function(){};return function(t){if(arguments.length>1)throw Error(\"Second argument not supported\");if(\"object\"!=typeof t)throw TypeError(\"Argument must be an object\");e.prototype=t;var i=new e;return e.prototype=null,i}}(),_SubmitSelector:'input[type=\"submit\"], button:submit'},o={namespace:\"data-parsley-\",inputs:\"input, textarea, select\",excluded:\"input[type=button], input[type=submit], input[type=reset], input[type=hidden]\",priorityEnabled:!0,multiple:null,group:null,uiEnabled:!0,validationThreshold:3,focus:\"first\",trigger:!1,triggerAfterFailure:\"input\",errorClass:\"parsley-error\",successClass:\"parsley-success\",classHandler:function(e){},errorsContainer:function(e){},errorsWrapper:'<ul class=\"parsley-errors-list\"></ul>',errorTemplate:\"<li></li>\"},l=function(){this.__id__=a.generateID()};l.prototype={asyncSupport:!0,_pipeAccordingToValidationResult:function(){var t=this,i=function(){var i=e.Deferred();return!0!==t.validationResult&&i.reject(),i.resolve().promise()};return[i,i]},actualizeOptions:function(){return a.attr(this.element,this.options.namespace,this.domOptions),this.parent&&this.parent.actualizeOptions&&this.parent.actualizeOptions(),this},_resetOptions:function(e){this.domOptions=a.objectCreate(this.parent.options),this.options=a.objectCreate(this.domOptions);for(var t in e)e.hasOwnProperty(t)&&(this.options[t]=e[t]);this.actualizeOptions()},_listeners:null,on:function(e,t){this._listeners=this._listeners||{};var i=this._listeners[e]=this._listeners[e]||[];return i.push(t),this},subscribe:function(t,i){e.listenTo(this,t.toLowerCase(),i)},off:function(e,t){var i=this._listeners&&this._listeners[e];if(i)if(t)for(var n=i.length;n--;)i[n]===t&&i.splice(n,1);else delete this._listeners[e];return this},unsubscribe:function(t,i){e.unsubscribeTo(this,t.toLowerCase())},trigger:function(e,t,i){t=t||this;var n,r=this._listeners&&this._listeners[e];if(r)for(var s=r.length;s--;)if(n=r[s].call(t,t,i),n===!1)return n;return!this.parent||this.parent.trigger(e,t,i)},asyncIsValid:function(e,t){return a.warnOnce(\"asyncIsValid is deprecated; please use whenValid instead\"),this.whenValid({group:e,force:t})},_findRelated:function(){return this.options.multiple?e(this.parent.element.querySelectorAll(\"[\"+this.options.namespace+'multiple=\"'+this.options.multiple+'\"]')):this.$element}};var u=function(e,t){var i=e.match(/^\\s*\\[(.*)\\]\\s*$/);if(!i)throw'Requirement is not an array: \"'+e+'\"';var n=i[1].split(\",\").map(a.trimString);if(n.length!==t)throw\"Requirement has \"+n.length+\" values when \"+t+\" are needed\";return n},d=function(e,t,i){var n=null,r={};for(var s in e)if(s){var o=i(s);\"string\"==typeof o&&(o=a.parseRequirement(e[s],o)),r[s]=o}else n=a.parseRequirement(e[s],t);return[n,r]},h=function(t){e.extend(!0,this,t)};h.prototype={validate:function(e,t){if(this.fn)return arguments.length>3&&(t=[].slice.call(arguments,1,-1)),this.fn(e,t);if(Array.isArray(e)){if(!this.validateMultiple)throw\"Validator `\"+this.name+\"` does not handle multiple values\";return this.validateMultiple.apply(this,arguments)}var i=arguments[arguments.length-1];if(this.validateDate&&i._isDateInput())return arguments[0]=a.parse.date(arguments[0]),null!==arguments[0]&&this.validateDate.apply(this,arguments);if(this.validateNumber)return!isNaN(e)&&(arguments[0]=parseFloat(arguments[0]),this.validateNumber.apply(this,arguments));if(this.validateString)return this.validateString.apply(this,arguments);throw\"Validator `\"+this.name+\"` only handles multiple values\"},parseRequirements:function(t,i){if(\"string\"!=typeof t)return Array.isArray(t)?t:[t];var n=this.requirementType;if(Array.isArray(n)){for(var r=u(t,n.length),s=0;s<r.length;s++)r[s]=a.parseRequirement(n[s],r[s]);return r}return e.isPlainObject(n)?d(n,t,i):[a.parseRequirement(n,t)]},requirementType:\"string\",priority:2};var p=function(e,t){this.__class__=\"ValidatorRegistry\",this.locale=\"en\",this.init(e||{},t||{})},c={email:/^((([a-zA-Z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+(\\.([a-zA-Z]|\\d|[!#\\$%&'\\*\\+\\-\\/=\\?\\^_`{\\|}~]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])+)*)|((\\x22)((((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(([\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x7f]|\\x21|[\\x23-\\x5b]|[\\x5d-\\x7e]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(\\\\([\\x01-\\x09\\x0b\\x0c\\x0d-\\x7f]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF]))))*(((\\x20|\\x09)*(\\x0d\\x0a))?(\\x20|\\x09)+)?(\\x22)))@((([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-zA-Z]|\\d|-|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-zA-Z]|\\d|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))\\.)+(([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])|(([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])([a-zA-Z]|\\d|-|_|~|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])*([a-zA-Z]|[\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF])))$/,number:/^-?(\\d*\\.)?\\d+(e[-+]?\\d+)?$/i,integer:/^-?\\d+$/,digits:/^\\d+$/,alphanum:/^\\w+$/i,date:{test:function(e){return null!==a.parse.date(e)}},url:new RegExp(\"^(?:(?:https?|ftp)://)?(?:\\\\S+(?::\\\\S*)?@)?(?:(?:[1-9]\\\\d?|1\\\\d\\\\d|2[01]\\\\d|22[0-3])(?:\\\\.(?:1?\\\\d{1,2}|2[0-4]\\\\d|25[0-5])){2}(?:\\\\.(?:[1-9]\\\\d?|1\\\\d\\\\d|2[0-4]\\\\d|25[0-4]))|(?:(?:[a-zA-Z\\\\u00a1-\\\\uffff0-9]-*)*[a-zA-Z\\\\u00a1-\\\\uffff0-9]+)(?:\\\\.(?:[a-zA-Z\\\\u00a1-\\\\uffff0-9]-*)*[a-zA-Z\\\\u00a1-\\\\uffff0-9]+)*(?:\\\\.(?:[a-zA-Z\\\\u00a1-\\\\uffff]{2,})))(?::\\\\d{2,5})?(?:/\\\\S*)?$\")};c.range=c.number;var f=function(e){var t=(\"\"+e).match(/(?:\\.(\\d+))?(?:[eE]([+-]?\\d+))?$/);return t?Math.max(0,(t[1]?t[1].length:0)-(t[2]?+t[2]:0)):0},m=function(e,t){return t.map(a.parse[e])},g=function(e,t){return function(i){for(var n=arguments.length,r=Array(n>1?n-1:0),s=1;s<n;s++)r[s-1]=arguments[s];return r.pop(),t.apply(void 0,[i].concat(_toConsumableArray(m(e,r))))}},v=function(e){return{validateDate:g(\"date\",e),validateNumber:g(\"number\",e),requirementType:e.length<=2?\"string\":[\"string\",\"string\"],priority:30}};p.prototype={init:function(e,t){this.catalog=t,this.validators=_extends({},this.validators);for(var i in e)this.addValidator(i,e[i].fn,e[i].priority);window.Parsley.trigger(\"parsley:validator:init\")},setLocale:function(e){if(\"undefined\"==typeof this.catalog[e])throw new Error(e+\" is not available in the catalog\");return this.locale=e,this},addCatalog:function(e,t,i){return\"object\"==typeof t&&(this.catalog[e]=t),!0===i?this.setLocale(e):this},addMessage:function(e,t,i){return\"undefined\"==typeof this.catalog[e]&&(this.catalog[e]={}),this.catalog[e][t]=i,this},addMessages:function(e,t){for(var i in t)this.addMessage(e,i,t[i]);return this},addValidator:function(e,t,i){if(this.validators[e])a.warn('Validator \"'+e+'\" is already defined.');else if(o.hasOwnProperty(e))return void a.warn('\"'+e+'\" is a restricted keyword and is not a valid validator name.');return this._setValidator.apply(this,arguments)},hasValidator:function(e){return!!this.validators[e]},updateValidator:function(e,t,i){return this.validators[e]?this._setValidator.apply(this,arguments):(a.warn('Validator \"'+e+'\" is not already defined.'),this.addValidator.apply(this,arguments))},removeValidator:function(e){return this.validators[e]||a.warn('Validator \"'+e+'\" is not defined.'),delete this.validators[e],this},_setValidator:function(e,t,i){\"object\"!=typeof t&&(t={fn:t,priority:i}),t.validate||(t=new h(t)),this.validators[e]=t;for(var n in t.messages||{})this.addMessage(n,e,t.messages[n]);return this},getErrorMessage:function(e){var t;if(\"type\"===e.name){var i=this.catalog[this.locale][e.name]||{};t=i[e.requirements]}else t=this.formatMessage(this.catalog[this.locale][e.name],e.requirements);return t||this.catalog[this.locale].defaultMessage||this.catalog.en.defaultMessage},formatMessage:function(e,t){if(\"object\"==typeof t){for(var i in t)e=this.formatMessage(e,t[i]);return e}return\"string\"==typeof e?e.replace(/%s/i,t):\"\"},validators:{notblank:{validateString:function(e){return/\\S/.test(e)},priority:2},required:{validateMultiple:function(e){return e.length>0},validateString:function(e){return/\\S/.test(e)},priority:512},type:{validateString:function(e,t){var i=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],n=i.step,r=void 0===n?\"any\":n,s=i.base,a=void 0===s?0:s,o=c[t];if(!o)throw new Error(\"validator type `\"+t+\"` is not supported\");if(!o.test(e))return!1;if(\"number\"===t&&!/^any$/i.test(r||\"\")){var l=Number(e),u=Math.max(f(r),f(a));if(f(l)>u)return!1;var d=function(e){return Math.round(e*Math.pow(10,u))};if((d(l)-d(a))%d(r)!=0)return!1}return!0},requirementType:{\"\":\"string\",step:\"string\",base:\"number\"},priority:256},pattern:{validateString:function(e,t){return t.test(e)},requirementType:\"regexp\",priority:64},minlength:{validateString:function(e,t){return e.length>=t},requirementType:\"integer\",priority:30},maxlength:{validateString:function(e,t){return e.length<=t},requirementType:\"integer\",priority:30},length:{validateString:function(e,t,i){return e.length>=t&&e.length<=i},requirementType:[\"integer\",\"integer\"],priority:30},mincheck:{validateMultiple:function(e,t){return e.length>=t},requirementType:\"integer\",priority:30},maxcheck:{validateMultiple:function(e,t){return e.length<=t},requirementType:\"integer\",priority:30},check:{validateMultiple:function(e,t,i){return e.length>=t&&e.length<=i},requirementType:[\"integer\",\"integer\"],priority:30},min:v(function(e,t){return e>=t}),max:v(function(e,t){return e<=t}),range:v(function(e,t,i){return e>=t&&e<=i}),equalto:{validateString:function(t,i){var n=e(i);return n.length?t===n.val():t===i},priority:256}}};var y={},_=function k(e,t,i){for(var n=[],r=[],s=0;s<e.length;s++){for(var a=!1,o=0;o<t.length;o++)if(e[s].assert.name===t[o].assert.name){a=!0;break}a?r.push(e[s]):n.push(e[s])}return{kept:r,added:n,removed:i?[]:k(t,e,!0).added}};y.Form={_actualizeTriggers:function(){var e=this;this.$element.on(\"submit.Parsley\",function(t){e.onSubmitValidate(t)}),this.$element.on(\"click.Parsley\",a._SubmitSelector,function(t){e.onSubmitButton(t)}),!1!==this.options.uiEnabled&&this.element.setAttribute(\"novalidate\",\"\")},focus:function(){if(this._focusedField=null,!0===this.validationResult||\"none\"===this.options.focus)return null;for(var e=0;e<this.fields.length;e++){var t=this.fields[e];if(!0!==t.validationResult&&t.validationResult.length>0&&\"undefined\"==typeof t.options.noFocus&&(this._focusedField=t.$element,\"first\"===this.options.focus))break}return null===this._focusedField?null:this._focusedField.focus()},_destroyUI:function(){this.$element.off(\".Parsley\")}},y.Field={_reflowUI:function(){if(this._buildUI(),this._ui){var e=_(this.validationResult,this._ui.lastValidationResult);this._ui.lastValidationResult=this.validationResult,this._manageStatusClass(),this._manageErrorsMessages(e),this._actualizeTriggers(),!e.kept.length&&!e.added.length||this._failedOnce||(this._failedOnce=!0,this._actualizeTriggers())}},getErrorsMessages:function(){if(!0===this.validationResult)return[];for(var e=[],t=0;t<this.validationResult.length;t++)e.push(this.validationResult[t].errorMessage||this._getErrorMessage(this.validationResult[t].assert));return e},addError:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=t.message,n=t.assert,r=t.updateClass,s=void 0===r||r;this._buildUI(),this._addError(e,{message:i,assert:n}),s&&this._errorClass()},updateError:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=t.message,n=t.assert,r=t.updateClass,s=void 0===r||r;this._buildUI(),this._updateError(e,{message:i,assert:n}),s&&this._errorClass()},removeError:function(e){var t=arguments.length<=1||void 0===arguments[1]?{}:arguments[1],i=t.updateClass,n=void 0===i||i;this._buildUI(),this._removeError(e),n&&this._manageStatusClass()},_manageStatusClass:function(){this.hasConstraints()&&this.needsValidation()&&!0===this.validationResult?this._successClass():this.validationResult.length>0?this._errorClass():this._resetClass()},_manageErrorsMessages:function(t){if(\"undefined\"==typeof this.options.errorsMessagesDisabled){if(\"undefined\"!=typeof this.options.errorMessage)return t.added.length||t.kept.length?(this._insertErrorWrapper(),0===this._ui.$errorsWrapper.find(\".parsley-custom-error-message\").length&&this._ui.$errorsWrapper.append(e(this.options.errorTemplate).addClass(\"parsley-custom-error-message\")),this._ui.$errorsWrapper.addClass(\"filled\").find(\".parsley-custom-error-message\").html(this.options.errorMessage)):this._ui.$errorsWrapper.removeClass(\"filled\").find(\".parsley-custom-error-message\").remove();for(var i=0;i<t.removed.length;i++)this._removeError(t.removed[i].assert.name);for(i=0;i<t.added.length;i++)this._addError(t.added[i].assert.name,{message:t.added[i].errorMessage,assert:t.added[i].assert});for(i=0;i<t.kept.length;i++)this._updateError(t.kept[i].assert.name,{message:t.kept[i].errorMessage,assert:t.kept[i].assert})}},_addError:function(t,i){var n=i.message,r=i.assert;this._insertErrorWrapper(),this._ui.$errorClassHandler.attr(\"aria-describedby\",this._ui.errorsWrapperId),this._ui.$errorsWrapper.addClass(\"filled\").append(e(this.options.errorTemplate).addClass(\"parsley-\"+t).html(n||this._getErrorMessage(r)))},_updateError:function(e,t){var i=t.message,n=t.assert;this._ui.$errorsWrapper.addClass(\"filled\").find(\".parsley-\"+e).html(i||this._getErrorMessage(n))},_removeError:function(e){this._ui.$errorClassHandler.removeAttr(\"aria-describedby\"),this._ui.$errorsWrapper.removeClass(\"filled\").find(\".parsley-\"+e).remove()},_getErrorMessage:function(e){var t=e.name+\"Message\";return\"undefined\"!=typeof this.options[t]?window.Parsley.formatMessage(this.options[t],e.requirements):window.Parsley.getErrorMessage(e)},_buildUI:function(){if(!this._ui&&!1!==this.options.uiEnabled){var t={};this.element.setAttribute(this.options.namespace+\"id\",this.__id__),t.$errorClassHandler=this._manageClassHandler(),t.errorsWrapperId=\"parsley-id-\"+(this.options.multiple?\"multiple-\"+this.options.multiple:this.__id__),t.$errorsWrapper=e(this.options.errorsWrapper).attr(\"id\",t.errorsWrapperId),t.lastValidationResult=[],t.validationInformationVisible=!1,this._ui=t}},_manageClassHandler:function(){if(\"string\"==typeof this.options.classHandler&&e(this.options.classHandler).length)return e(this.options.classHandler);var t=this.options.classHandler;if(\"string\"==typeof this.options.classHandler&&\"function\"==typeof window[this.options.classHandler]&&(t=window[this.options.classHandler]),\"function\"==typeof t){var i=t.call(this,this);if(\"undefined\"!=typeof i&&i.length)return i}else{if(\"object\"==typeof t&&t instanceof jQuery&&t.length)return t;t&&a.warn(\"The class handler `\"+t+\"` does not exist in DOM nor as a global JS function\")}return this._inputHolder()},_inputHolder:function(){return this.options.multiple&&\"SELECT\"!==this.element.nodeName?this.$element.parent():this.$element},_insertErrorWrapper:function(){var t=this.options.errorsContainer;if(0!==this._ui.$errorsWrapper.parent().length)return this._ui.$errorsWrapper.parent();if(\"string\"==typeof t){if(e(t).length)return e(t).append(this._ui.$errorsWrapper);\"function\"==typeof window[t]?t=window[t]:a.warn(\"The errors container `\"+t+\"` does not exist in DOM nor as a global JS function\")}return\"function\"==typeof t&&(t=t.call(this,this)),\"object\"==typeof t&&t.length?t.append(this._ui.$errorsWrapper):this._inputHolder().after(this._ui.$errorsWrapper)},_actualizeTriggers:function(){var e,t=this,i=this._findRelated();i.off(\".Parsley\"),this._failedOnce?i.on(a.namespaceEvents(this.options.triggerAfterFailure,\"Parsley\"),function(){t._validateIfNeeded()}):(e=a.namespaceEvents(this.options.trigger,\"Parsley\"))&&i.on(e,function(e){t._validateIfNeeded(e)})},_validateIfNeeded:function(e){var t=this;e&&/key|input/.test(e.type)&&(!this._ui||!this._ui.validationInformationVisible)&&this.getValue().length<=this.options.validationThreshold||(this.options.debounce?(window.clearTimeout(this._debounced),this._debounced=window.setTimeout(function(){return t.validate()},this.options.debounce)):this.validate())},_resetUI:function(){this._failedOnce=!1,this._actualizeTriggers(),\"undefined\"!=typeof this._ui&&(this._ui.$errorsWrapper.removeClass(\"filled\").children().remove(),this._resetClass(),this._ui.lastValidationResult=[],this._ui.validationInformationVisible=!1)},_destroyUI:function(){this._resetUI(),\"undefined\"!=typeof this._ui&&this._ui.$errorsWrapper.remove(),delete this._ui},_successClass:function(){this._ui.validationInformationVisible=!0,this._ui.$errorClassHandler.removeClass(this.options.errorClass).addClass(this.options.successClass)},_errorClass:function(){this._ui.validationInformationVisible=!0,this._ui.$errorClassHandler.removeClass(this.options.successClass).addClass(this.options.errorClass)},_resetClass:function(){this._ui.$errorClassHandler.removeClass(this.options.successClass).removeClass(this.options.errorClass)}};var w=function(t,i,n){this.__class__=\"Form\",this.element=t,this.$element=e(t),this.domOptions=i,this.options=n,this.parent=window.Parsley,this.fields=[],this.validationResult=null},b={pending:null,resolved:!0,rejected:!1};w.prototype={onSubmitValidate:function(e){var t=this;if(!0!==e.parsley){var i=this._submitSource||this.$element.find(a._SubmitSelector)[0];if(this._submitSource=null,this.$element.find(\".parsley-synthetic-submit-button\").prop(\"disabled\",!0),!i||null===i.getAttribute(\"formnovalidate\")){window.Parsley._remoteCache={};var n=this.whenValidate({event:e});\"resolved\"===n.state()&&!1!==this._trigger(\"submit\")||(e.stopImmediatePropagation(),e.preventDefault(),\"pending\"===n.state()&&n.done(function(){t._submit(i)}))}}},onSubmitButton:function(e){this._submitSource=e.currentTarget},_submit:function(t){if(!1!==this._trigger(\"submit\")){if(t){var i=this.$element.find(\".parsley-synthetic-submit-button\").prop(\"disabled\",!1);0===i.length&&(i=e('<input class=\"parsley-synthetic-submit-button\" type=\"hidden\">').appendTo(this.$element)),i.attr({name:t.getAttribute(\"name\"),value:t.getAttribute(\"value\")})}this.$element.trigger(_extends(e.Event(\"submit\"),{parsley:!0}))}},validate:function(t){if(arguments.length>=1&&!e.isPlainObject(t)){a.warnOnce(\"Calling validate on a parsley form without passing arguments as an object is deprecated.\");var i=_slice.call(arguments),n=i[0],r=i[1],s=i[2];t={group:n,force:r,event:s}}return b[this.whenValidate(t).state()]},whenValidate:function(){var t,i=this,n=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],r=n.group,s=n.force,o=n.event;this.submitEvent=o,o&&(this.submitEvent=_extends({},o,{preventDefault:function(){a.warnOnce(\"Using `this.submitEvent.preventDefault()` is deprecated; instead, call `this.validationResult = false`\"),i.validationResult=!1}})),this.validationResult=!0,this._trigger(\"validate\"),this._refreshFields();var l=this._withoutReactualizingFormOptions(function(){return e.map(i.fields,function(e){return e.whenValidate({force:s,group:r})})});return(t=a.all(l).done(function(){i._trigger(\"success\")}).fail(function(){i.validationResult=!1,i.focus(),i._trigger(\"error\")}).always(function(){i._trigger(\"validated\")})).pipe.apply(t,_toConsumableArray(this._pipeAccordingToValidationResult()))},isValid:function(t){if(arguments.length>=1&&!e.isPlainObject(t)){a.warnOnce(\"Calling isValid on a parsley form without passing arguments as an object is deprecated.\");var i=_slice.call(arguments),n=i[0],r=i[1];t={group:n,force:r}}return b[this.whenValid(t).state()]},whenValid:function(){var t=this,i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=i.group,r=i.force;this._refreshFields();var s=this._withoutReactualizingFormOptions(function(){return e.map(t.fields,function(e){return e.whenValid({group:n,force:r})})});return a.all(s)},refresh:function(){return this._refreshFields(),this},reset:function(){for(var e=0;e<this.fields.length;e++)this.fields[e].reset();this._trigger(\"reset\")},destroy:function(){this._destroyUI();for(var e=0;e<this.fields.length;e++)this.fields[e].destroy();this.$element.removeData(\"Parsley\"),this._trigger(\"destroy\")},_refreshFields:function(){return this.actualizeOptions()._bindFields()},_bindFields:function(){var t=this,i=this.fields;return this.fields=[],this.fieldsMappedById={},this._withoutReactualizingFormOptions(function(){t.$element.find(t.options.inputs).not(t.options.excluded).each(function(e,i){var n=new window.Parsley.Factory(i,{},t);if((\"Field\"===n.__class__||\"FieldMultiple\"===n.__class__)&&!0!==n.options.excluded){var r=n.__class__+\"-\"+n.__id__;\"undefined\"==typeof t.fieldsMappedById[r]&&(t.fieldsMappedById[r]=n,t.fields.push(n))}}),e.each(a.difference(i,t.fields),function(e,t){t.reset()})}),this},_withoutReactualizingFormOptions:function(e){var t=this.actualizeOptions;this.actualizeOptions=function(){return this};var i=e();return this.actualizeOptions=t,i},_trigger:function(e){return this.trigger(\"form:\"+e)}};var F=function(e,t,i,n,r){var s=window.Parsley._validatorRegistry.validators[t],a=new h(s);n=n||e.options[t+\"Priority\"]||a.priority,r=!0===r,_extends(this,{validator:a,name:t,requirements:i,priority:n,isDomConstraint:r}),this._parseRequirements(e.options)},C=function(e){var t=e[0].toUpperCase();return t+e.slice(1)};F.prototype={validate:function(e,t){var i;return(i=this.validator).validate.apply(i,[e].concat(_toConsumableArray(this.requirementList),[t]))},_parseRequirements:function(e){var t=this;this.requirementList=this.validator.parseRequirements(this.requirements,function(i){return e[t.name+C(i)]})}};var A=function(t,i,n,r){this.__class__=\"Field\",this.element=t,this.$element=e(t),\"undefined\"!=typeof r&&(this.parent=r),this.options=n,this.domOptions=i,this.constraints=[],this.constraintsByName={},this.validationResult=!0,this._bindConstraints()},E={pending:null,resolved:!0,rejected:!1};A.prototype={validate:function(t){arguments.length>=1&&!e.isPlainObject(t)&&(a.warnOnce(\"Calling validate on a parsley field without passing arguments as an object is deprecated.\"),t={options:t});var i=this.whenValidate(t);if(!i)return!0;switch(i.state()){case\"pending\":return null;case\"resolved\":return!0;case\"rejected\":return this.validationResult}},whenValidate:function(){var e,t=this,i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=i.force,r=i.group;if(this.refresh(),!r||this._isInGroup(r))return this.value=this.getValue(),this._trigger(\"validate\"),(e=this.whenValid({force:n,value:this.value,_refreshed:!0}).always(function(){t._reflowUI()}).done(function(){t._trigger(\"success\")}).fail(function(){t._trigger(\"error\")}).always(function(){t._trigger(\"validated\")})).pipe.apply(e,_toConsumableArray(this._pipeAccordingToValidationResult()))},hasConstraints:function(){return 0!==this.constraints.length},needsValidation:function(e){return\"undefined\"==typeof e&&(e=this.getValue()),!(!e.length&&!this._isRequired()&&\"undefined\"==typeof this.options.validateIfEmpty)},_isInGroup:function(t){return Array.isArray(this.options.group)?-1!==e.inArray(t,this.options.group):this.options.group===t},isValid:function(t){if(arguments.length>=1&&!e.isPlainObject(t)){a.warnOnce(\"Calling isValid on a parsley field without passing arguments as an object is deprecated.\");var i=_slice.call(arguments),n=i[0],r=i[1];t={force:n,value:r}}var s=this.whenValid(t);return!s||E[s.state()]},whenValid:function(){var t=this,i=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],n=i.force,r=void 0!==n&&n,s=i.value,o=i.group,l=i._refreshed;if(l||this.refresh(),!o||this._isInGroup(o)){if(this.validationResult=!0,!this.hasConstraints())return e.when();if(\"undefined\"!=typeof s&&null!==s||(s=this.getValue()),!this.needsValidation(s)&&!0!==r)return e.when();var u=this._getGroupedConstraints(),d=[];return e.each(u,function(i,n){var r=a.all(e.map(n,function(e){return t._validateConstraint(s,e)}));if(d.push(r),\"rejected\"===r.state())return!1}),a.all(d)}},_validateConstraint:function(t,i){var n=this,r=i.validate(t,this);return!1===r&&(r=e.Deferred().reject()),a.all([r]).fail(function(e){n.validationResult instanceof Array||(n.validationResult=[]),n.validationResult.push({assert:i,errorMessage:\"string\"==typeof e&&e})})},getValue:function(){var e;return e=\"function\"==typeof this.options.value?this.options.value(this):\"undefined\"!=typeof this.options.value?this.options.value:this.$element.val(),\"undefined\"==typeof e||null===e?\"\":this._handleWhitespace(e)},reset:function(){return this._resetUI(),this._trigger(\"reset\")},destroy:function(){this._destroyUI(),this.$element.removeData(\"Parsley\"),this.$element.removeData(\"FieldMultiple\"),this._trigger(\"destroy\")},refresh:function(){return this._refreshConstraints(),this},_refreshConstraints:function(){return this.actualizeOptions()._bindConstraints()},refreshConstraints:function(){return a.warnOnce(\"Parsley's refreshConstraints is deprecated. Please use refresh\"),this.refresh()},addConstraint:function(e,t,i,n){if(window.Parsley._validatorRegistry.validators[e]){var r=new F(this,e,t,i,n);\"undefined\"!==this.constraintsByName[r.name]&&this.removeConstraint(r.name),this.constraints.push(r),this.constraintsByName[r.name]=r}return this},removeConstraint:function(e){for(var t=0;t<this.constraints.length;t++)if(e===this.constraints[t].name){this.constraints.splice(t,1);break}return delete this.constraintsByName[e],this},updateConstraint:function(e,t,i){return this.removeConstraint(e).addConstraint(e,t,i)},_bindConstraints:function(){for(var e=[],t={},i=0;i<this.constraints.length;i++)!1===this.constraints[i].isDomConstraint&&(e.push(this.constraints[i]),t[this.constraints[i].name]=this.constraints[i]);this.constraints=e,this.constraintsByName=t;for(var n in this.options)this.addConstraint(n,this.options[n],void 0,!0);return this._bindHtml5Constraints()},_bindHtml5Constraints:function(){null!==this.element.getAttribute(\"required\")&&this.addConstraint(\"required\",!0,void 0,!0),null!==this.element.getAttribute(\"pattern\")&&this.addConstraint(\"pattern\",this.element.getAttribute(\"pattern\"),void 0,!0);var e=this.element.getAttribute(\"min\"),t=this.element.getAttribute(\"max\");null!==e&&null!==t?this.addConstraint(\"range\",[e,t],void 0,!0):null!==e?this.addConstraint(\"min\",e,void 0,!0):null!==t&&this.addConstraint(\"max\",t,void 0,!0),null!==this.element.getAttribute(\"minlength\")&&null!==this.element.getAttribute(\"maxlength\")?this.addConstraint(\"length\",[this.element.getAttribute(\"minlength\"),this.element.getAttribute(\"maxlength\")],void 0,!0):null!==this.element.getAttribute(\"minlength\")?this.addConstraint(\"minlength\",this.element.getAttribute(\"minlength\"),void 0,!0):null!==this.element.getAttribute(\"maxlength\")&&this.addConstraint(\"maxlength\",this.element.getAttribute(\"maxlength\"),void 0,!0);var i=a.getType(this.element);return\"number\"===i?this.addConstraint(\"type\",[\"number\",{step:this.element.getAttribute(\"step\")||\"1\",base:e||this.element.getAttribute(\"value\")}],void 0,!0):/^(email|url|range|date)$/i.test(i)?this.addConstraint(\"type\",i,void 0,!0):this},_isRequired:function(){return\"undefined\"!=typeof this.constraintsByName.required&&!1!==this.constraintsByName.required.requirements},_trigger:function(e){return this.trigger(\"field:\"+e)},_handleWhitespace:function(e){return!0===this.options.trimValue&&a.warnOnce('data-parsley-trim-value=\"true\" is deprecated, please use data-parsley-whitespace=\"trim\"'),\"squish\"===this.options.whitespace&&(e=e.replace(/\\s{2,}/g,\" \")),\"trim\"!==this.options.whitespace&&\"squish\"!==this.options.whitespace&&!0!==this.options.trimValue||(e=a.trimString(e)),e},_isDateInput:function(){var e=this.constraintsByName.type;return e&&\"date\"===e.requirements},_getGroupedConstraints:function(){if(!1===this.options.priorityEnabled)return[this.constraints];for(var e=[],t={},i=0;i<this.constraints.length;i++){var n=this.constraints[i].priority;t[n]||e.push(t[n]=[]),t[n].push(this.constraints[i])}return e.sort(function(e,t){return t[0].priority-e[0].priority}),e}};var x=A,$=function(){this.__class__=\"FieldMultiple\"};$.prototype={addElement:function(e){return this.$elements.push(e),this},_refreshConstraints:function(){var t;if(this.constraints=[],\"SELECT\"===this.element.nodeName)return this.actualizeOptions()._bindConstraints(),this;for(var i=0;i<this.$elements.length;i++)if(e(\"html\").has(this.$elements[i]).length){t=this.$elements[i].data(\"FieldMultiple\")._refreshConstraints().constraints;for(var n=0;n<t.length;n++)this.addConstraint(t[n].name,t[n].requirements,t[n].priority,t[n].isDomConstraint)}else this.$elements.splice(i,1);return this},getValue:function(){if(\"function\"==typeof this.options.value)return this.options.value(this);if(\"undefined\"!=typeof this.options.value)return this.options.value;if(\"INPUT\"===this.element.nodeName){var t=a.getType(this.element);if(\"radio\"===t)return this._findRelated().filter(\":checked\").val()||\"\";if(\"checkbox\"===t){\nvar i=[];return this._findRelated().filter(\":checked\").each(function(){i.push(e(this).val())}),i}}return\"SELECT\"===this.element.nodeName&&null===this.$element.val()?[]:this.$element.val()},_init:function(){return this.$elements=[this.$element],this}};var P=function(t,i,n){this.element=t,this.$element=e(t);var r=this.$element.data(\"Parsley\");if(r)return\"undefined\"!=typeof n&&r.parent===window.Parsley&&(r.parent=n,r._resetOptions(r.options)),\"object\"==typeof i&&_extends(r.options,i),r;if(!this.$element.length)throw new Error(\"You must bind Parsley on an existing element.\");if(\"undefined\"!=typeof n&&\"Form\"!==n.__class__)throw new Error(\"Parent instance must be a Form instance\");return this.parent=n||window.Parsley,this.init(i)};P.prototype={init:function(e){return this.__class__=\"Parsley\",this.__version__=\"2.8.1\",this.__id__=a.generateID(),this._resetOptions(e),\"FORM\"===this.element.nodeName||a.checkAttr(this.element,this.options.namespace,\"validate\")&&!this.$element.is(this.options.inputs)?this.bind(\"parsleyForm\"):this.isMultiple()?this.handleMultiple():this.bind(\"parsleyField\")},isMultiple:function(){var e=a.getType(this.element);return\"radio\"===e||\"checkbox\"===e||\"SELECT\"===this.element.nodeName&&null!==this.element.getAttribute(\"multiple\")},handleMultiple:function(){var t,i,n=this;if(this.options.multiple=this.options.multiple||(t=this.element.getAttribute(\"name\"))||this.element.getAttribute(\"id\"),\"SELECT\"===this.element.nodeName&&null!==this.element.getAttribute(\"multiple\"))return this.options.multiple=this.options.multiple||this.__id__,this.bind(\"parsleyFieldMultiple\");if(!this.options.multiple)return a.warn(\"To be bound by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.\",this.$element),this;this.options.multiple=this.options.multiple.replace(/(:|\\.|\\[|\\]|\\{|\\}|\\$)/g,\"\"),t&&e('input[name=\"'+t+'\"]').each(function(e,t){var i=a.getType(t);\"radio\"!==i&&\"checkbox\"!==i||t.setAttribute(n.options.namespace+\"multiple\",n.options.multiple)});for(var r=this._findRelated(),s=0;s<r.length;s++)if(i=e(r.get(s)).data(\"Parsley\"),\"undefined\"!=typeof i){this.$element.data(\"FieldMultiple\")||i.addElement(this.$element);break}return this.bind(\"parsleyField\",!0),i||this.bind(\"parsleyFieldMultiple\")},bind:function(t,i){var n;switch(t){case\"parsleyForm\":n=e.extend(new w(this.element,this.domOptions,this.options),new l,window.ParsleyExtend)._bindFields();break;case\"parsleyField\":n=e.extend(new x(this.element,this.domOptions,this.options,this.parent),new l,window.ParsleyExtend);break;case\"parsleyFieldMultiple\":n=e.extend(new x(this.element,this.domOptions,this.options,this.parent),new $,new l,window.ParsleyExtend)._init();break;default:throw new Error(t+\"is not a supported Parsley type\")}return this.options.multiple&&a.setAttr(this.element,this.options.namespace,\"multiple\",this.options.multiple),\"undefined\"!=typeof i?(this.$element.data(\"FieldMultiple\",n),n):(this.$element.data(\"Parsley\",n),n._actualizeTriggers(),n._trigger(\"init\"),n)}};var V=e.fn.jquery.split(\".\");if(parseInt(V[0])<=1&&parseInt(V[1])<8)throw\"The loaded version of jQuery is too old. Please upgrade to 1.8.x or better.\";V.forEach||a.warn(\"Parsley requires ES5 to run properly. Please include https://github.com/es-shims/es5-shim\");var T=_extends(new l,{element:document,$element:e(document),actualizeOptions:null,_resetOptions:null,Factory:P,version:\"2.8.1\"});_extends(x.prototype,y.Field,l.prototype),_extends(w.prototype,y.Form,l.prototype),_extends(P.prototype,l.prototype),e.fn.parsley=e.fn.psly=function(t){if(this.length>1){var i=[];return this.each(function(){i.push(e(this).parsley(t))}),i}if(0!=this.length)return new P(this[0],t)},\"undefined\"==typeof window.ParsleyExtend&&(window.ParsleyExtend={}),T.options=_extends(a.objectCreate(o),window.ParsleyConfig),window.ParsleyConfig=T.options,window.Parsley=window.psly=T,T.Utils=a,window.ParsleyUtils={},e.each(a,function(e,t){\"function\"==typeof t&&(window.ParsleyUtils[e]=function(){return a.warnOnce(\"Accessing `window.ParsleyUtils` is deprecated. Use `window.Parsley.Utils` instead.\"),a[e].apply(a,arguments)})});var O=window.Parsley._validatorRegistry=new p(window.ParsleyConfig.validators,window.ParsleyConfig.i18n);window.ParsleyValidator={},e.each(\"setLocale addCatalog addMessage addMessages getErrorMessage formatMessage addValidator updateValidator removeValidator hasValidator\".split(\" \"),function(e,t){window.Parsley[t]=function(){return O[t].apply(O,arguments)},window.ParsleyValidator[t]=function(){var e;return a.warnOnce(\"Accessing the method '\"+t+\"' through Validator is deprecated. Simply call 'window.Parsley.\"+t+\"(...)'\"),(e=window.Parsley)[t].apply(e,arguments)}}),window.Parsley.UI=y,window.ParsleyUI={removeError:function(e,t,i){var n=!0!==i;return a.warnOnce(\"Accessing UI is deprecated. Call 'removeError' on the instance directly. Please comment in issue 1073 as to your need to call this method.\"),e.removeError(t,{updateClass:n})},getErrorsMessages:function(e){return a.warnOnce(\"Accessing UI is deprecated. Call 'getErrorsMessages' on the instance directly.\"),e.getErrorsMessages()}},e.each(\"addError updateError\".split(\" \"),function(e,t){window.ParsleyUI[t]=function(e,i,n,r,s){var o=!0!==s;return a.warnOnce(\"Accessing UI is deprecated. Call '\"+t+\"' on the instance directly. Please comment in issue 1073 as to your need to call this method.\"),e[t](i,{message:n,assert:r,updateClass:o})}}),!1!==window.ParsleyConfig.autoBind&&e(function(){e(\"[data-parsley-validate]\").length&&e(\"[data-parsley-validate]\").parsley()});var M=e({}),R=function(){a.warnOnce(\"Parsley's pubsub module is deprecated; use the 'on' and 'off' methods on parsley instances or window.Parsley\")},D=\"parsley:\";e.listen=function(e,n){var r;if(R(),\"object\"==typeof arguments[1]&&\"function\"==typeof arguments[2]&&(r=arguments[1],n=arguments[2]),\"function\"!=typeof n)throw new Error(\"Wrong parameters\");window.Parsley.on(i(e),t(n,r))},e.listenTo=function(e,n,r){if(R(),!(e instanceof x||e instanceof w))throw new Error(\"Must give Parsley instance\");if(\"string\"!=typeof n||\"function\"!=typeof r)throw new Error(\"Wrong parameters\");e.on(i(n),t(r))},e.unsubscribe=function(e,t){if(R(),\"string\"!=typeof e||\"function\"!=typeof t)throw new Error(\"Wrong arguments\");window.Parsley.off(i(e),t.parsleyAdaptedCallback)},e.unsubscribeTo=function(e,t){if(R(),!(e instanceof x||e instanceof w))throw new Error(\"Must give Parsley instance\");e.off(i(t))},e.unsubscribeAll=function(t){R(),window.Parsley.off(i(t)),e(\"form,input,textarea,select\").each(function(){var n=e(this).data(\"Parsley\");n&&n.off(i(t))})},e.emit=function(e,t){var n;R();var r=t instanceof x||t instanceof w,s=Array.prototype.slice.call(arguments,r?2:1);s.unshift(i(e)),r||(t=window.Parsley),(n=t).trigger.apply(n,_toConsumableArray(s))};e.extend(!0,T,{asyncValidators:{\"default\":{fn:function(e){return e.status>=200&&e.status<300},url:!1},reverse:{fn:function(e){return e.status<200||e.status>=300},url:!1}},addAsyncValidator:function(e,t,i,n){return T.asyncValidators[e]={fn:t,url:i||!1,options:n||{}},this}}),T.addValidator(\"remote\",{requirementType:{\"\":\"string\",validator:\"string\",reverse:\"boolean\",options:\"object\"},validateString:function(t,i,n,r){var s,a,o={},l=n.validator||(!0===n.reverse?\"reverse\":\"default\");if(\"undefined\"==typeof T.asyncValidators[l])throw new Error(\"Calling an undefined async validator: `\"+l+\"`\");i=T.asyncValidators[l].url||i,i.indexOf(\"{value}\")>-1?i=i.replace(\"{value}\",encodeURIComponent(t)):o[r.element.getAttribute(\"name\")||r.element.getAttribute(\"id\")]=t;var u=e.extend(!0,n.options||{},T.asyncValidators[l].options);s=e.extend(!0,{},{url:i,data:o,type:\"GET\"},u),r.trigger(\"field:ajaxoptions\",r,s),a=e.param(s),\"undefined\"==typeof T._remoteCache&&(T._remoteCache={});var d=T._remoteCache[a]=T._remoteCache[a]||e.ajax(s),h=function(){var t=T.asyncValidators[l].fn.call(r,d,i,n);return t||(t=e.Deferred().reject()),e.when(t)};return d.then(h,h)},priority:-1}),T.on(\"form:submit\",function(){T._remoteCache={}}),l.prototype.addAsyncValidator=function(){return a.warnOnce(\"Accessing the method `addAsyncValidator` through an instance is deprecated. Simply call `Parsley.addAsyncValidator(...)`\"),T.addAsyncValidator.apply(T,arguments)},T.addMessages(\"en\",{defaultMessage:\"This value seems to be invalid.\",type:{email:\"This value should be a valid email.\",url:\"This value should be a valid url.\",number:\"This value should be a valid number.\",integer:\"This value should be a valid integer.\",digits:\"This value should be digits.\",alphanum:\"This value should be alphanumeric.\"},notblank:\"This value should not be blank.\",required:\"This value is required.\",pattern:\"This value seems to be invalid.\",min:\"This value should be greater than or equal to %s.\",max:\"This value should be lower than or equal to %s.\",range:\"This value should be between %s and %s.\",minlength:\"This value is too short. It should have %s characters or more.\",maxlength:\"This value is too long. It should have %s characters or fewer.\",length:\"This value length is invalid. It should be between %s and %s characters long.\",mincheck:\"You must select at least %s choices.\",maxcheck:\"You must select %s choices or fewer.\",check:\"You must select between %s and %s choices.\",equalto:\"This value should be the same.\"}),T.setLocale(\"en\");var I=new n;I.install();var q=T;return q});\n//# sourceMappingURL=parsley.min.js.map\n"

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(30))

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = "// Polyfill for creating CustomEvents on IE9/10/11\n\n// code pulled from:\n// https://github.com/d4tocchini/customevent-polyfill\n// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill\n\ntry {\n    var ce = new window.CustomEvent('test');\n    ce.preventDefault();\n    if (ce.defaultPrevented !== true) {\n        // IE has problems with .preventDefault() on custom events\n        // http://stackoverflow.com/questions/23349191\n        throw new Error('Could not prevent default');\n    }\n} catch(e) {\n  var CustomEvent = function(event, params) {\n    var evt, origPrevent;\n    params = params || {\n      bubbles: false,\n      cancelable: false,\n      detail: undefined\n    };\n\n    evt = document.createEvent(\"CustomEvent\");\n    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);\n    origPrevent = evt.preventDefault;\n    evt.preventDefault = function () {\n      origPrevent.call(this);\n      try {\n        Object.defineProperty(this, 'defaultPrevented', {\n          get: function () {\n            return true;\n          }\n        });\n      } catch(e) {\n        this.defaultPrevented = true;\n      }\n    };\n    return evt;\n  };\n\n  CustomEvent.prototype = window.Event.prototype;\n  window.CustomEvent = CustomEvent; // expose definition to window\n}\n"

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1)(__webpack_require__(32))

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "// Find polyfill\nif (!Array.prototype.find) {\n\tArray.prototype.find = function(predicate) {\n\t\tif (this == null) {\n\t\t\tthrow new TypeError('Array.prototype.find called on null or undefined');\n\t\t}\n\t\tif (typeof predicate !== 'function') {\n\t\t\tthrow new TypeError('predicate must be a function');\n\t\t}\n\t\tvar list = Object(this);\n\t\tvar length = list.length >>> 0;\n\t\tvar thisArg = arguments[1];\n\t\tvar value;\n\n\t\tfor (var i = 0; i < length; i++) {\n\t\t\tvalue = list[i];\n\t\t\tif (predicate.call(thisArg, value, i, list)) {\n\t\t\t\treturn value;\n\t\t\t}\n\t\t}\n\t\treturn undefined;\n\t};\n}"

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Main_1 = __webpack_require__(0);
var TabContainer_1 = __webpack_require__(36);
var TabContainerBreadcrumb_1 = __webpack_require__(40);
var TabContainerSection_1 = __webpack_require__(41);
var Cart_1 = __webpack_require__(9);
/**
 * This is our main kick off file. We used to do this in a require block in the Redirect file but since we've moved to
 * webpack this is the new lay of the land (commonjs). In order to make this work in a non node setup (wordpress) we need
 * a reliable way to quick off the code hidden behind commonjs module loading. In comes our custom event.
 *
 * Basically we take all our code we have access to and need to run on start up and pass it the variables via a custom
 * event in the Redirect file. This allows us to get all our PHP needed variables, and lets us keep our kick off file
 * as a typescript file
 *
 * @type {Window}
 */
var w = window;
window.$ = ($ === undefined) ? jQuery : $;
w.addEventListener("cfw-initialize", function (eventData) {
    var data = eventData.detail;
    var checkoutFormEl = $(data.elements.checkoutFormSelector);
    var breadCrumbEl = $(data.elements.breadCrumbElId);
    var customerInfoEl = $(data.elements.customerInfoElId);
    var shippingMethodEl = $(data.elements.shippingMethodElId);
    var paymentMethodEl = $(data.elements.paymentMethodElId);
    var tabContainerEl = $(data.elements.tabContainerElId);
    var cartContainer = $(data.elements.cartContainerId);
    var cartSubtotal = $(data.elements.cartSubtotalId);
    var cartShipping = $(data.elements.cartShippingId);
    var cartTaxes = $(data.elements.cartTaxesId);
    var cartFees = $(data.elements.cartFeesId);
    var cartTotal = $(data.elements.cartTotalId);
    var cartCoupons = $(data.elements.cartCouponsId);
    var cartReviewBar = $(data.elements.cartReviewBarId);
    var tabContainerBreadcrumb = new TabContainerBreadcrumb_1.TabContainerBreadcrumb(breadCrumbEl);
    var tabContainerSections = [
        new TabContainerSection_1.TabContainerSection(customerInfoEl, "customer_info"),
        new TabContainerSection_1.TabContainerSection(shippingMethodEl, "shipping_method"),
        new TabContainerSection_1.TabContainerSection(paymentMethodEl, "payment_method")
    ];
    var tabContainer = new TabContainer_1.TabContainer(tabContainerEl, tabContainerBreadcrumb, tabContainerSections);
    var cart = new Cart_1.Cart(cartContainer, cartSubtotal, cartShipping, cartTaxes, cartFees, cartTotal, cartCoupons, cartReviewBar);
    var main = new Main_1.Main(checkoutFormEl, tabContainer, data.ajaxInfo, cart, data.settings);
    main.setup();
}, { once: true });


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EasyTabService_1 = __webpack_require__(3);
var EasyTabService_2 = __webpack_require__(3);
var CompleteOrderAction_1 = __webpack_require__(11);
var Main_1 = __webpack_require__(0);
var ValidationService_1 = __webpack_require__(7);
var w = window;
var ParsleyService = /** @class */ (function () {
    /**
     *
     */
    function ParsleyService() {
        this.setParsleyValidators();
        this.handleStateZipFailure();
    }
    /**
     *
     */
    ParsleyService.prototype.setParsleyCustomValidators = function () {
        this.stateAndZipValidator();
    };
    /**
     *
     */
    ParsleyService.prototype.handleStateZipFailure = function () {
        // Parsley isn't a jquery default, this gets around it.
        var $temp = $;
        var shipping_action = function () { return EasyTabService_1.EasyTabService.go(EasyTabService_2.EasyTab.CUSTOMER); };
        if ($temp("#shipping_postcode").length !== 0) {
            $temp("#shipping_postcode").parsley().on("field:error", shipping_action);
            $temp("#shipping_state").parsley().on("field:error", shipping_action);
        }
    };
    /**
     *
     */
    ParsleyService.prototype.setParsleyValidators = function () {
        var _this = this;
        var max_iterations = 1000;
        var iterations = 0;
        var interval = setInterval(function () {
            if (w.Parsley !== undefined) {
                _this.parsley = w.Parsley;
                _this.parsley.on('form:error', function () { return Main_1.Main.removeOverlay(); });
                _this.setParsleyCustomValidators();
                clearInterval(interval);
            }
            else if (iterations >= max_iterations) {
                // Give up
                clearInterval(interval);
            }
            else {
                iterations++;
            }
        }, 50);
    };
    /**
     *
     */
    ParsleyService.prototype.stateAndZipValidator = function () {
        this.parsley.addValidator('stateAndZip', {
            validateString: function (_ignoreValue, country, instance) {
                var _this = this;
                // We have a request already running? Yea let's kill that.
                if (ParsleyService.zipRequest !== null) {
                    ParsleyService.zipRequest.abort();
                }
                // Is it shipping or billing type of state and zip
                var infoType = ParsleyService.getInfoType(instance.$element[0].getAttribute("id"));
                // Fail if info type is error. Something went wrong.
                if (infoType === "error") {
                    return false;
                }
                // If this goes south, where do we go (what tab)
                var failLocation = ParsleyService.getFailLocation(infoType);
                // Zip, State, and City
                var zipElement = $("#" + infoType + "_postcode");
                var stateElement = $("#" + infoType + "_state");
                var cityElement = $("#" + infoType + "_city");
                // If the stateElement is not visible, it's null
                if (stateElement.is(":disabled")) {
                    stateElement = null;
                }
                // If we aren't already checking, check.
                if (!ParsleyService.cityStateValidating) {
                    // Start the check
                    ParsleyService.cityStateValidating = true;
                    // Where to check the zip
                    var requestLocation = "//api.zippopotam.us/" + country + "/" + zipElement.val();
                    // Our request
                    ParsleyService.zipRequest = $.ajax(requestLocation);
                    // Setup our callbacks
                    ParsleyService.zipRequest
                        .then(function (response) { return _this.stateAndZipValidatorOnSuccess(response, instance, infoType, cityElement, stateElement, zipElement, failLocation); })
                        .always(function () {
                        ParsleyService.cityStateValidating = false;
                        var event = new Event("cfw:checkout-validated");
                        window.dispatchEvent(event);
                        $(document.body).trigger("update_checkout");
                    });
                }
                // Return true, if we fail we will go back.
                return true;
            }.bind(this),
        });
    };
    /**
     *
     * @param json
     * @param instance
     * @param {InfoType} infoType
     * @param {JQuery} cityElement
     * @param {JQuery} stateElement
     * @param {JQuery} zipElement
     * @param {EasyTab} failLocation
     */
    ParsleyService.prototype.stateAndZipValidatorOnSuccess = function (json, instance, infoType, cityElement, stateElement, zipElement, failLocation) {
        if (ValidationService_1.ValidationService.validateZip) {
            if (json.places.length === 1) {
                // Set the state response value
                var stateResponseValue = json.places[0]["state abbreviation"];
                // Set the city response value
                var cityResponseValue = json.places[0]["place name"];
                // Billing or Shipping?
                var fieldType = $(instance.element).attr("id").split("_")[1];
                // Set the city field
                cityElement.val(cityResponseValue);
                cityElement.trigger("keyup");
                // If the country in question has a state
                if (stateElement) {
                    if (fieldType === "postcode") {
                        /**
                         * If we have a state response value abbreviation go ahead and set the new state to the state
                         * element
                         */
                        if (stateResponseValue) {
                            stateElement.val(stateResponseValue);
                            stateElement.trigger("change");
                            /**
                             * if the state doesn't have an abbreviation try to set it by the display name. If we can't find
                             * it that way we just leave the state alone
                             */
                        }
                        else if (json.places[0].state && json.places[0].state !== "") {
                            stateElement.val(stateElement.find("option:contains(" + json.places[0].state + ")").val());
                            stateElement.trigger("change");
                        }
                    }
                    stateElement.parsley().reset();
                }
                // Resets in case error labels.
                cityElement.parsley().reset();
            }
        }
        else {
            // Always reset to true if false. We want this to normally fire, but under certain conditions we want to ignore this
            ValidationService_1.ValidationService.validateZip = true;
        }
        if (CompleteOrderAction_1.CompleteOrderAction.preppingOrder) {
            var orderReadyEvent = new Event("cfw:checkout-validated");
            window.dispatchEvent(orderReadyEvent);
        }
        ParsleyService.cityStateValidating = false;
        return true;
    };
    /**
     *
     * @param {string} id
     * @returns {InfoType}
     */
    ParsleyService.getInfoType = function (id) {
        var type = id.split("_")[0];
        if (type !== "shipping" && type !== "billing") {
            return "error";
        }
        return type;
    };
    /**
     * @param {InfoType} infoType
     * @returns {EasyTab}
     */
    ParsleyService.getFailLocation = function (infoType) {
        var location = (infoType === "shipping") ? EasyTabService_2.EasyTab.CUSTOMER : EasyTabService_2.EasyTab.PAYMENT;
        if (!EasyTabService_1.EasyTabService.isThereAShippingTab()) {
            location = EasyTabService_2.EasyTab.CUSTOMER;
        }
        return location;
    };
    Object.defineProperty(ParsleyService.prototype, "parsley", {
        /**
         * @returns {any}
         */
        get: function () {
            return this._parsley;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._parsley = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParsleyService, "cityStateValidating", {
        /**
         * @returns {boolean}
         */
        get: function () {
            return this._cityStateValidating;
        },
        /**
         * @param {boolean} value
         */
        set: function (value) {
            this._cityStateValidating = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParsleyService, "updateShippingTabInfo", {
        /**
         * @returns {boolean}
         */
        get: function () {
            return this._updateShippingTabInfo;
        },
        /**
         * @param {boolean} value
         */
        set: function (value) {
            this._updateShippingTabInfo = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParsleyService, "zipRequest", {
        /**
         * @returns {any}
         */
        get: function () {
            return this._zipRequest;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._zipRequest = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @type {boolean}
     * @static
     * @private
     */
    ParsleyService._cityStateValidating = false;
    /**
     * @type {boolean}
     * @static
     * @private
     */
    ParsleyService._updateShippingTabInfo = false;
    /**
     * @type {null}
     * @private
     */
    ParsleyService._zipRequest = null;
    return ParsleyService;
}());
exports.ParsleyService = ParsleyService;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Main_1 = __webpack_require__(0);
var InputLabelWrap_1 = __webpack_require__(12);
var SelectLabelWrap_1 = __webpack_require__(14);
var LocalizationService = /** @class */ (function () {
    function LocalizationService() {
    }
    /**
     *  Handles localization information for countries and relevant states
     */
    LocalizationService.prototype.setCountryChangeHandlers = function () {
        var _this = this;
        var shipping_country = $("#shipping_country");
        var billing_country = $("#billing_country");
        var shipping_postcode = $("#shipping_postcode");
        var billing_postcode = $("#billing_postcode");
        var shipping_state = $("#shipping_state");
        var billing_state = $("#billing_state");
        // When the country (shipping or billing) get's changed
        var country_change = function (event) {
            var target = $(event.target);
            var target_country = target.val();
            var info_type = target.attr("id").split("_")[0];
            var country_state_list = JSON.parse(wc_country_select_params.countries);
            var state_list_for_country = country_state_list[target_country];
            var locale_data = JSON.parse(wc_address_i18n_params.locale);
            $("#" + info_type + "_state").parsley().reset();
            // If there is a state list for the country and it actually has states in it. Handle the field generation
            if (state_list_for_country && Object.keys(state_list_for_country).length > 0) {
                _this.handleFieldsIfStateListExistsForCountry(info_type, state_list_for_country, target_country);
                // If the state list is either undefined or empty fire here.
            }
            else {
                /**
                 * If the state list is undefined it means we need to reset everything to it's defaults and apply specific
                 * settings
                 */
                if (state_list_for_country === undefined) {
                    _this.removeStateAndReplaceWithTextInput(locale_data[target_country], info_type);
                    /**
                     * If there is a state list with nothing in it, we usually need to hide the state field.
                     */
                }
                else {
                    _this.removeStateAndReplaceWithHiddenInput(locale_data[target_country], info_type);
                }
            }
            /**
             * After we have replaced and reset everything change the labels, required items, and placeholders
             */
            _this.layoutDefaultLabelsAndRequirements(target_country, locale_data, info_type, wc_address_i18n_params.add2_text);
            $("#" + info_type + "_state").parsley().reset();
            // Re-register all the elements
            Main_1.Main.instance.checkoutForm.parsley();
            $(document.body).trigger("update_checkout");
        };
        var locale_data = JSON.parse(wc_address_i18n_params.locale);
        this.layoutDefaultLabelsAndRequirements(shipping_country.val(), locale_data, "shipping", wc_address_i18n_params.add2_text);
        this.layoutDefaultLabelsAndRequirements(billing_country.val(), locale_data, "billing", wc_address_i18n_params.add2_text);
        shipping_country.on('change', country_change);
        billing_country.on('change', country_change);
        shipping_postcode.attr("data-parsley-state-and-zip", shipping_country.val());
        billing_postcode.attr("data-parsley-state-and-zip", billing_country.val());
        shipping_state.attr("data-parsley-state-and-zip", shipping_country.val());
        billing_state.attr("data-parsley-state-and-zip", billing_country.val());
        LocalizationService.initStateMobileMargin();
    };
    /**
     * Add mobile margin removal for state if it doesn't exist on page load. Also removes down arrow if no select state.
     */
    LocalizationService.initStateMobileMargin = function () {
        var shipping_state_field = $("#shipping_state_field");
        var billing_state_field = $("#billing_state_field");
        [shipping_state_field, billing_state_field].forEach(function (field) {
            // If the field is hidden, remove the margin on mobile by adding the appropriate class.
            if (field.find("input[type='hidden']").length > 0) {
                LocalizationService.addOrRemoveStateMarginForMobile("add", field.attr("id").split("_")[0]);
            }
            // While we are at it, let's remove the down arrow if no select is there
            if (field.find("input").length > 0) {
                field.addClass("remove-state-down-arrow");
            }
        });
    };
    /**
     * Adds or removes the margin class for mobile on state if it's hidden
     *
     * @param {"add" | "remove"} type
     * @param info_type
     */
    LocalizationService.addOrRemoveStateMarginForMobile = function (type, info_type) {
        var info_type_state_field = $("#" + info_type + "_state_field");
        var state_gone_wrap_class = "state-gone-margin";
        if (type === "remove") {
            info_type_state_field.removeClass(state_gone_wrap_class);
        }
        if (type === "add") {
            if (!info_type_state_field.hasClass(state_gone_wrap_class)) {
                info_type_state_field.addClass(state_gone_wrap_class);
            }
        }
    };
    /**
     * Sets up the default labels, required items, and placeholders for the country after it has been changed. It also
     * kicks off the overriding portion of the same task at the end.
     *
     * @param target_country
     * @param locale_data
     * @param info_type
     * @param add2_text
     */
    LocalizationService.prototype.layoutDefaultLabelsAndRequirements = function (target_country, locale_data, info_type, add2_text) {
        var default_postcode_data = locale_data.default.postcode;
        var default_state_data = locale_data.default.state;
        var default_city_data = locale_data.default.city;
        var default_add2_data = locale_data.default.address_2;
        var label_class = "cfw-input-label";
        var asterisk = ' <abbr class="required" title="required">*</abbr>';
        var $postcode = $("#" + info_type + "_postcode");
        var $state = $("#" + info_type + "_state");
        var $city = $("#" + info_type + "_city");
        var $address_2 = $("#" + info_type + "_address_2");
        var fields = [["postcode", $postcode], ["state", $state], ["city", $city], ["address_2", $address_2]];
        // Handle Address 2
        $address_2.attr("required", default_add2_data.required);
        $address_2.attr("placeholder", add2_text);
        $address_2.attr("autocomplete", default_add2_data.autocomplete);
        $address_2.siblings("." + label_class).text(add2_text);
        // Handle Postcode
        $postcode.attr("required", default_postcode_data.required);
        $postcode.attr("placeholder", default_postcode_data.label);
        $postcode.attr("autocomplete", default_postcode_data.autocomplete);
        $postcode.siblings("." + label_class).text(default_postcode_data.label);
        if (default_postcode_data.required == true) {
            $postcode.siblings("." + label_class).append(asterisk);
        }
        $state.attr("required", default_state_data.required);
        $state.attr("placeholder", default_state_data.label);
        $state.attr("autocomplete", default_state_data.autocomplete);
        $state.attr("name", info_type + "_state");
        $state.siblings("." + label_class).text(default_state_data.label);
        if (default_state_data.required == true) {
            $state.siblings("." + label_class).append(asterisk);
        }
        $city.attr("required", default_city_data.required);
        $city.attr("placeholder", default_city_data.label);
        $city.attr("autocomplete", default_city_data.autocomplete);
        $city.siblings("." + label_class).text(default_city_data.label);
        if (default_city_data.required == true) {
            $city.siblings("." + label_class).append(asterisk);
        }
        this.findAndApplyDifferentLabelsAndRequirements(fields, asterisk, locale_data[target_country], label_class, locale_data);
    };
    /**
     * This function is for override the defaults if the specified country has more information for the labels,
     * placeholders, and required items
     *
     * @param fields
     * @param asterisk
     * @param locale_data_for_country
     * @param label_class
     * @param locale_data
     */
    LocalizationService.prototype.findAndApplyDifferentLabelsAndRequirements = function (fields, asterisk, locale_data_for_country, label_class, locale_data) {
        var default_lookup = locale_data.default;
        var add2_text = locale_data.add2_text;
        fields.forEach(function (field_pair) {
            var field_name = field_pair[0];
            var field = field_pair[1];
            /**
             * If the locale data for the country exists and it has a length of greater than 0 we can override the
             * defaults
             */
            if (locale_data_for_country !== undefined && Object.keys(locale_data_for_country).length > 0) {
                /**
                 * If the field name exists on the locale for the country precede on overwriting the defaults.
                 */
                if (locale_data_for_country[field_name] !== undefined) {
                    var locale_data_for_field = locale_data_for_country[field_name];
                    var defaultItem = default_lookup[field_name];
                    var label = "";
                    /**
                     * If the field is the address_2 it doesn't use label it uses placeholder for some reason. So what
                     * we do here is simply assign the placeholder to the label if it's address_2
                     */
                    if (field_name == "address_2") {
                        label = add2_text;
                    }
                    else {
                        label = locale_data_for_field.label;
                    }
                    var field_siblings = field.siblings("." + label_class);
                    /**
                     * If the label for the locale isn't undefined. we need to set the placeholder and the label
                     */
                    if (label !== undefined) {
                        field.attr("placeholder", locale_data_for_field.label);
                        field_siblings.html(locale_data_for_field.label);
                        /**
                         * Otherwise we reset the defaults here for good measure. The field address_2 needs to have it's
                         * label be set as the placeholder (because it doesn't use label for some reason)
                         */
                    }
                    else {
                        if (field_name == "address_2") {
                            field.attr("placeholder", add2_text);
                            field_siblings.html(add2_text);
                            /**
                             * If we aren't acdress_2 we can simply procede as normal and set the label for both the
                             * placeholder and the label.
                             */
                        }
                        else {
                            field.attr("placeholder", defaultItem.label);
                            field_siblings.html(defaultItem.label);
                        }
                    }
                    /**
                     * If the locale data for this field is not undefined and is true go ahead and set it's required
                     * attribute to true, and append the asterisk to the label
                     */
                    if (locale_data_for_field.required !== undefined && locale_data_for_field.required == true) {
                        field.attr("required", true);
                        field_siblings.append(asterisk);
                        /**
                         * If the field is not required, go ahead and set it's required attribute to false
                         */
                    }
                    else if (locale_data_for_field.required == false) {
                        field.attr("required", false);
                        /**
                         * Lastly if the field is undefined we need to revert back to the default (maybe we do?)
                         *
                         * TODO: Possibly refactor a lot of these default settings in this function. We may not have to do it.
                         */
                    }
                    else {
                        field.attr("required", defaultItem.required);
                        // If the default item is required, append the asterisk.
                        if (defaultItem.required == true) {
                            field_siblings.append(asterisk);
                        }
                    }
                }
            }
        });
    };
    /**
     *
     * @param country_display_data
     * @param info_type
     */
    LocalizationService.prototype.removeStateAndReplaceWithTextInput = function (country_display_data, info_type) {
        var current_state_field = $("#" + info_type + "_state");
        var state_element_wrap = current_state_field.parents(".cfw-input-wrap");
        var group = info_type;
        var tab_section = Main_1.Main.instance
            .tabContainer
            .tabContainerSectionBy("name", (info_type === "shipping") ? "customer_info" : "payment_method");
        // Remove old element
        current_state_field.remove();
        // Append and amend new element
        state_element_wrap.append("<input type=\"text\" id=\"" + info_type + "_state\" value=\"\" />");
        state_element_wrap.removeClass("cfw-select-input");
        state_element_wrap.addClass("cfw-text-input");
        state_element_wrap.removeClass("cfw-floating-label");
        // Get reference to new element
        var new_state_input = $("#" + info_type + "_state");
        // Amend new element further
        new_state_input.attr("field_key", "state")
            .attr("data-parsley-validate-if-empty", "")
            .attr("data-parsley-trigger", "keyup change focusout")
            .attr("data-parsley-group", group)
            .attr("data-parsley-required", 'true');
        tab_section.selectLabelWraps.forEach(function (select_label_wrap, index) {
            if (select_label_wrap.jel.is(state_element_wrap)) {
                tab_section.selectLabelWraps.splice(index, 1);
            }
        });
        tab_section.inputLabelWraps.push(new InputLabelWrap_1.InputLabelWrap(state_element_wrap));
        LocalizationService.addOrRemoveStateMarginForMobile("remove", info_type);
    };
    /**
     *
     * @param country_display_data
     * @param info_type
     */
    LocalizationService.prototype.removeStateAndReplaceWithHiddenInput = function (country_display_data, info_type) {
        var current_state_field = $("#" + info_type + "_state");
        var state_element_wrap = current_state_field.parents(".cfw-input-wrap");
        current_state_field.remove();
        if (country_display_data && Object.keys(country_display_data).length > 0) {
            var is_required = country_display_data["state"]["required"] === "true";
            if (!is_required) {
                state_element_wrap.removeClass("cfw-select-input");
                state_element_wrap.removeClass("cfw-text-input");
                state_element_wrap.removeClass("cfw-floating-label");
                state_element_wrap.append("<input type=\"hidden\" id=\"" + info_type + "_state\" field_key=\"state\" />");
                LocalizationService.addOrRemoveStateMarginForMobile("add", info_type);
            }
        }
    };
    /**
     * Removes the state input field and appends a select element for the state field. Returns a JQuery reference to the
     * newly created select element
     *
     * @param {JQuery} state_input
     * @param info_type
     * @returns {JQuery}
     */
    LocalizationService.prototype.removeInputAndAddSelect = function (state_input, info_type) {
        var id = state_input.attr("id");
        var classes = state_input.attr("class");
        var group = state_input.data("parsleyGroup");
        var tab_section = Main_1.Main.instance
            .tabContainer
            .tabContainerSectionBy("name", (info_type === "shipping") ? "customer_info" : "payment_method");
        var state_input_wrap = state_input.parent(".cfw-input-wrap");
        if (state_input) {
            // Remove the old input
            state_input.remove();
        }
        // Add the new input base (select field)
        state_input_wrap.append("<select id=\"" + id + "\"></select>");
        state_input_wrap.removeClass("cfw-text-input");
        state_input_wrap.addClass("cfw-select-input");
        // Set the selects properties
        var new_state_input = $("#" + id);
        new_state_input.attr("field_key", "state")
            .attr("class", classes)
            .attr("data-parsley-validate-if-empty", "")
            .attr("data-parsley-trigger", "keyup change focusout")
            .attr("data-parsley-group", group)
            .attr("data-parsley-required", 'true');
        // Re-register all the elements
        Main_1.Main.instance.checkoutForm.parsley();
        tab_section.inputLabelWraps.forEach(function (input_label_wrap, index) {
            if (input_label_wrap.jel.is(state_input_wrap)) {
                tab_section.inputLabelWraps.splice(index, 1);
            }
        });
        tab_section.selectLabelWraps.push(new SelectLabelWrap_1.SelectLabelWrap(state_input_wrap));
        return new_state_input;
    };
    /**
     * Given the current state element, if the state element is an input remove it and create the appropriate select
     * element. Once there is a guaranteed select go ahead and populate it with the state list.
     *
     * @param info_type
     * @param state_list_for_country
     * @param target_country
     */
    LocalizationService.prototype.handleFieldsIfStateListExistsForCountry = function (info_type, state_list_for_country, target_country) {
        // Get the current state handler field (either a select or input)
        var current_state_field = $("#" + info_type + "_state");
        var current_state_field_wrap = $("#" + info_type + "_state_field");
        var current_zip_field = $("#" + info_type + "_postcode");
        current_state_field_wrap.removeClass("remove-state-down-arrow");
        LocalizationService.addOrRemoveStateMarginForMobile("remove", info_type);
        // If the current state handler is an input field, we need to change it to a select
        if (current_state_field.is('input')) {
            current_state_field = this.removeInputAndAddSelect(current_state_field, info_type);
        }
        // Now that the state field is guaranteed to be a select, we need to populate it.
        this.populateStates(current_state_field, state_list_for_country);
        this.setCountryOnZipAndState(current_zip_field, current_state_field, target_country);
    };
    /**
     *
     * @param {JQuery} postcode
     * @param {JQuery} state
     * @param country
     */
    LocalizationService.prototype.setCountryOnZipAndState = function (postcode, state, country) {
        postcode.attr("data-parsley-state-and-zip", country);
        state.attr("data-parsley-state-and-zip", country);
    };
    /**
     * Given a state select field, populate it with the given list
     *
     * @param select
     * @param state_list
     */
    LocalizationService.prototype.populateStates = function (select, state_list) {
        if (select.is("select")) {
            select.empty();
            select.append("<option value=\"\">Select a state...</option>");
            Object.getOwnPropertyNames(state_list)
                .forEach(function (state) { return select.append("<option value=\"" + state + "\">" + state_list[state] + "</option>}"); });
            select.parents(".cfw-input-wrap").removeClass("cfw-floating-label");
        }
    };
    return LocalizationService;
}());
exports.LocalizationService = LocalizationService;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(2);
var AccountExistsAction_1 = __webpack_require__(37);
var LoginAction_1 = __webpack_require__(38);
var FormElement_1 = __webpack_require__(10);
var Main_1 = __webpack_require__(0);
var ValidationService_1 = __webpack_require__(7);
var UpdateCheckoutAction_1 = __webpack_require__(8);
var ApplyCouponAction_1 = __webpack_require__(39);
var Alert_1 = __webpack_require__(5);
/**
 *
 */
var TabContainer = /** @class */ (function (_super) {
    __extends(TabContainer, _super);
    /**
     * @param jel
     * @param tabContainerBreadcrumb
     * @param tabContainerSections
     */
    function TabContainer(jel, tabContainerBreadcrumb, tabContainerSections) {
        var _this = _super.call(this, jel) || this;
        _this.tabContainerBreadcrumb = tabContainerBreadcrumb;
        _this.tabContainerSections = tabContainerSections;
        return _this;
    }
    /**
     * Sometimes in some browsers (looking at you safari and chrome) the label doesn't float when the data is retrieved
     * via garlic. This will fix this issue and float the label like it should.
     */
    TabContainer.prototype.setFloatLabelOnGarlicRetrieve = function () {
        $(".garlic-auto-save").each(function (index, elem) {
            $(elem).garlic({ onRetrieve: function (element) { return $(element).parent().addClass(FormElement_1.FormElement.labelClass); } });
        });
    };
    /**
     *
     */
    TabContainer.prototype.setAccountCheckListener = function () {
        var _this = this;
        var customer_info = this.tabContainerSectionBy("name", "customer_info");
        var email_input_wrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
        var ajax_info = Main_1.Main.instance.ajaxInfo;
        if (email_input_wrap) {
            var email_input_1 = email_input_wrap.holder.jel;
            var handler = function () { return new AccountExistsAction_1.AccountExistsAction("account_exists", ajax_info, email_input_1.val(), _this.jel).load(); };
            // Add check to keyup event
            email_input_1.on("keyup", handler);
            email_input_1.on("change", handler);
            // Handles page onload use case
            new AccountExistsAction_1.AccountExistsAction("account_exists", ajax_info, email_input_1.val(), this.jel).load();
        }
    };
    /**
     *
     */
    TabContainer.prototype.setLogInListener = function () {
        var customer_info = this.tabContainerSectionBy("name", "customer_info");
        var email_input_wrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
        if (email_input_wrap) {
            var email_input_2 = email_input_wrap.holder.jel;
            var password_input_wrap = customer_info.getInputLabelWrapById("cfw-password-wrap");
            var password_input_1 = password_input_wrap.holder.jel;
            var login_btn = $("#cfw-login-btn");
            // Fire the login action on click
            login_btn.on("click", function () { return new LoginAction_1.LoginAction("login", Main_1.Main.instance.ajaxInfo, email_input_2.val(), password_input_1.val()).load(); });
        }
    };
    /**
     * Handles updating all the fields on a breadcrumb click or a move to the next section button
     */
    TabContainer.prototype.setUpdateAllShippingFieldsListener = function () {
        var continueBtn = $("#cfw-shipping-info-action .cfw-next-tab");
        var shipping_payment_bc = this.tabContainerBreadcrumb.jel.find(".tab:nth-child(2), .tab:nth-child(3)");
        continueBtn.on("click", function () { return $(document.body).trigger("update_checkout"); });
        shipping_payment_bc.on("click", function () { return $(document.body).trigger("update_checkout"); });
    };
    /**
     *
     */
    TabContainer.prototype.setUpCreditCardRadioReveal = function () {
        var stripe_container = $(".payment_method_stripe");
        if (stripe_container.length > 0) {
            var stripe_options = stripe_container.find('input[type="radio"][name="wc-stripe-payment-token"]');
            stripe_options.each(function (index, elem) {
                if ($(elem).attr("id") == "wc-stripe-payment-token-new") {
                    $(elem).on('click', function () {
                        $("#wc-stripe-cc-form").slideDown(300);
                        $(".woocommerce-SavedPaymentMethods-saveNew").slideDown(300);
                        $(".wc-saved-payment-methods").removeClass("kill-bottom-margin");
                    });
                    $(window).on('load', function () {
                        if ($(elem).is(":checked")) {
                            $("#wc-stripe-cc-form").slideDown(300);
                            $(".woocommerce-SavedPaymentMethods-saveNew").slideDown(300);
                            $(".wc-saved-payment-methods").removeClass("kill-bottom-margin");
                        }
                    });
                }
                else {
                    $(elem).on('click', function () {
                        $("#wc-stripe-cc-form").slideUp(300);
                        $(".woocommerce-SavedPaymentMethods-saveNew").slideUp(300);
                        $(".wc-saved-payment-methods").addClass("kill-bottom-margin");
                    });
                    $(window).on('load', function () {
                        if ($(elem).is(":checked")) {
                            $(".wc-saved-payment-methods").addClass("kill-bottom-margin");
                        }
                    });
                }
            });
        }
    };
    /**
     *
     */
    TabContainer.prototype.setUpCreditCardFields = function () {
        var CHECK = "paytrace_check_choice";
        var CARD = "paytrace_card_choice";
        // Stripe Form
        var stripe_form_wraps = $("#wc-stripe-cc-form .form-row");
        $("#wc-stripe-cc-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        $("#wc-stripe-cc-form").find(".clear").remove();
        stripe_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");
            if ($(elem).hasClass("form-row-wide")) {
                $(elem).wrap("<div class='cfw-column-6'></div>");
            }
            if ($(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last")) {
                $(elem).wrap("<div class='cfw-column-3'></div>");
            }
        });
        // Authorize.net - AIM
        var authorizenet_aim_form_wraps = $("#wc-authorize-net-aim-credit-card-form .form-row");
        $("#wc-authorize-net-aim-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        authorizenet_aim_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");
            if ($(elem).hasClass("form-row-wide")) {
                $(elem).wrap("<div class='cfw-column-6'></div>");
            }
            if ($(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last")) {
                $(elem).wrap("<div class='cfw-column-3'></div>");
            }
        });
        // PayFlow Pro
        var payflow_pro_form_wraps = $(".payment_method_paypal_pro_payflow > fieldset > .form-row");
        $(".payment_method_paypal_pro_payflow > fieldset").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        payflow_pro_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");
            if ($(elem).hasClass("form-row-first") && $(elem).index() === 0) {
                $(elem).wrap("<div class='cfw-column-6'></div>");
            }
            else {
                $(elem).wrap("<div class='cfw-column-3'></div>");
            }
        });
        // PayPal Pro
        var paypro_form_wraps = $(".payment_method_paypal_pro > fieldset > .form-row");
        $(".payment_method_paypal_pro > fieldset").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        paypro_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");
            if ($(elem).hasClass("form-row-first") && $(elem).index() === 0) {
                $(elem).wrap("<div class='cfw-column-6'></div>");
            }
            else {
                $(elem).wrap("<div class='cfw-column-3'></div>");
            }
        });
        // PayTrace Credit
        var paytrace_form_wraps = $("#paytrace-cards-form .form-row");
        $("#paytrace-cards-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        paytrace_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");
            if ($(elem).hasClass("form-row-wide")) {
                $(elem).wrap("<div class='cfw-column-6'></div>");
            }
            if ($(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last")) {
                $(elem).wrap("<div class='cfw-column-3'></div>");
            }
        });
        var paytrace_check_form_wraps = $("#paytrace-checks-form .form-row");
        $("#paytrace-checks-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        paytrace_check_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");
            if ($(elem).hasClass("form-row-wide")) {
                $(elem).wrap("<div class='cfw-column-6'></div>");
            }
            if ($(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last")) {
                $(elem).wrap("<div class='cfw-column-6'></div>");
            }
        });
        $(window).on('load', function () {
            // PayTrace gateway field state workaround
            var checked_radio = $("input[type='radio'][name='paytrace_type_choice']:checked");
            checked_radio.trigger("change");
            jQuery(document.body).trigger('wc-credit-card-form-init');
        });
        // One Click Upsells - Stripe Form
        var ocu_stripe_form_wraps = $("#wc-ocustripe-cc-form .form-row");
        var ocu_stripe_container = $("#wc-ocustripe-cc-form");
        ocu_stripe_container.wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        ocu_stripe_container.find(".clear").remove();
        ocu_stripe_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");
            if ($(elem).hasClass("form-row-wide") && $(elem).index() !== 0) {
                $(elem).wrap("<div class='cfw-column-6'></div>");
            }
            else if ($(elem).hasClass("form-row-wide") && $(elem).index() === 0) {
                $(elem).wrap("<div class='cfw-column-12'></div>");
            }
            if ($(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last")) {
                $(elem).wrap("<div class='cfw-column-3'></div>");
            }
        });
        // FirstData - PayEezy
        var firstdata_payeezy_form_wraps = $("#wc-first-data-payeezy-gateway-credit-card-credit-card-form .form-row");
        $("#wc-first-data-payeezy-gateway-credit-card-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        firstdata_payeezy_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label[for!='wc-first-data-payeezy-gateway-credit-card-tokenize-payment-method']").addClass("cfw-input-label");
            $(elem).find("input").not(':checkbox').css("width", "100%");
            $(elem).wrap("<div class='cfw-column-12 pad-bottom'></div>");
        });
        // Authorize.net CIM
        var authnet_cim_form_wraps = $("#wc-authorize-net-cim-credit-card-credit-card-form .form-row");
        $("#wc-authorize-net-cim-credit-card-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        authnet_cim_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label[for!='wc-authorize-net-cim-credit-card-tokenize-payment-method']").addClass("cfw-input-label");
            $(elem).find("input").not(':checkbox').css("width", "100%");
            $(elem).wrap("<div class='cfw-column-12 pad-bottom'></div>");
        });
        // First Data - Global Gateway
        var firstdata_global_form_wraps = $("#wc-first-data-global-gateway-credit-card-form .form-row");
        $("#wc-first-data-global-gateway-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        firstdata_global_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label").addClass("cfw-input-label");
            $(elem).find("input").css("width", "100%");
            if ($(elem).hasClass("form-row-wide")) {
                $(elem).wrap("<div class='cfw-column-6'></div>");
            }
            if ($(elem).hasClass("form-row-first") || $(elem).hasClass("form-row-last")) {
                $(elem).wrap("<div class='cfw-column-3'></div>");
            }
        });
        // First Data - Payeezy JS
        var firstdata_payeezyjs_form_wraps = $("#wc-first-data-payeezy-credit-card-credit-card-form .form-row");
        $("#wc-first-data-payeezy-credit-card-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        firstdata_payeezyjs_form_wraps.each(function (index, elem) {
            $(elem).addClass("cfw-input-wrap");
            $(elem).addClass("cfw-text-input");
            $(elem).find("label[for!='wc-first-data-payeezy-credit-card-tokenize-payment-method']").addClass("cfw-input-label");
            $(elem).find("input").not(':checkbox').css("width", "100%");
            $(elem).wrap("<div class='cfw-column-12 pad-bottom'></div>");
        });
    };
    /**
     *
     */
    TabContainer.prototype.setUpPaymentTabRadioButtons = function () {
        // The payment radio buttons to register the click events too
        var payment_radio_buttons = this
            .tabContainerSectionBy("name", "payment_method")
            .getInputsFromSection('[type="radio"][name="payment_method"]');
        var ship_to_different_address_radio_buttons = this
            .tabContainerSectionBy("name", "payment_method")
            .getInputsFromSection('[type="radio"][name="ship_to_different_address"]');
        this.setRevealOnRadioButtonGroup(payment_radio_buttons);
        this.setRevealOnRadioButtonGroup(ship_to_different_address_radio_buttons, true);
    };
    /**
     * Handles the payment method revealing and registering the click events.
     */
    TabContainer.prototype.setRevealOnRadioButtonGroup = function (radio_buttons, remove_add_required) {
        if (remove_add_required === void 0) { remove_add_required = false; }
        // Handles sliding down the containers that aren't supposed to be open, and opens the one that is.
        var slideUpAndDownContainers = function (rb) {
            // Filter out the current radio button
            // Slide up the other buttons
            radio_buttons
                .filter(function (filterItem) { return filterItem != rb; })
                .forEach(function (other) { return other.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideUp(300); });
            // Slide down our button
            rb.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideDown(300);
            var input_wraps = $("#cfw-billing-fields-container").find(".cfw-input-wrap");
            if (remove_add_required) {
                input_wraps.each(function (index, elem) {
                    var input = $(elem).find("input");
                    var select = $(elem).find("select");
                    var items = [input, select];
                    items.forEach(function (item) {
                        if (item.length > 0) {
                            if (rb.jel.val() == 1) {
                                if (item[0].hasAttribute("cfw-required-placeholder")) {
                                    item[0].setAttribute("required", "");
                                    item[0].removeAttribute("cfw-required-placeholder");
                                }
                            }
                            else {
                                if (item[0].hasAttribute("required")) {
                                    item[0].setAttribute("cfw-required-placeholder", "");
                                }
                                item[0].removeAttribute("required");
                            }
                        }
                    });
                });
            }
        };
        // Register the slide up and down container on click
        radio_buttons
            .forEach(function (rb) {
            // On payment radio button click....
            rb.jel.on('click', function () {
                slideUpAndDownContainers(rb);
            });
            // Fire it once for page load if selected
            $(window).on('load', function () {
                if (rb.jel.is(":checked")) {
                    slideUpAndDownContainers(rb);
                }
            });
        });
    };
    /**
     *
     */
    TabContainer.prototype.setShippingPaymentUpdate = function () {
        var _this = this;
        var shipping_method = this.tabContainerSectionBy("name", "shipping_method");
        shipping_method.jel.find('#cfw-shipping-method-list input[type="radio"]').each(function (index, el) {
            $(el).on("click", function () { return new UpdateCheckoutAction_1.UpdateCheckoutAction("update_checkout", Main_1.Main.instance.ajaxInfo, _this.getFormObject()).load(); });
        });
    };
    /**
     *
     */
    TabContainer.prototype.setUpdateCheckout = function () {
        var _this = this;
        var main = Main_1.Main.instance;
        $(document.body).on("update_checkout", function () {
            if (!main.updating) {
                main.updating = true;
                new UpdateCheckoutAction_1.UpdateCheckoutAction("update_checkout", main.ajaxInfo, _this.getFormObject()).load();
            }
        });
        $(document.body).trigger('update_checkout');
    };
    /**
     *
     */
    TabContainer.prototype.setShippingFieldsOnLoad = function () {
        var customer_info = this.tabContainerSectionBy("name", "customer_info");
        var form_elements = customer_info.getFormElementsByModule('cfw-shipping-info');
        var staticShippingFields = this.getUpdateShippingRequiredItems();
        form_elements.forEach(function (formElement) {
            var feFieldKey = formElement.holder.jel.attr("field_key");
            var feFieldValue = formElement.holder.jel.val();
            var match = staticShippingFields.shipping_details_fields.find(function (sdf) { return sdf.attr("field_type") == feFieldKey; });
            match.children(".field_value").text(feFieldValue);
        });
    };
    /**
     *
     */
    TabContainer.prototype.setUpMobileCartDetailsReveal = function () {
        var showCartDetails = new Element_1.Element($("#cfw-show-cart-details"));
        showCartDetails.jel.on('click tap', function () {
            $("#cfw-cart-details-collapse-wrap").slideToggle(300).parent().toggleClass("active");
        });
        $(window).on('resize', function () {
            if (window.innerWidth >= 767) {
                $("#cfw-cart-details-collapse-wrap").css('display', 'block');
                $("#cfw-cart-details").removeClass('active');
            }
        });
        if (window.innerWidth >= 767) {
            $("#cfw-cart-details-collapse-wrap").css('display', 'block');
        }
        else {
            $("#cfw-cart-details-collapse-wrap").css('display', 'none');
        }
    };
    /**
     * @returns {{}}
     */
    TabContainer.prototype.getFormObject = function () {
        var main = Main_1.Main.instance;
        var checkout_form = main.checkoutForm;
        var ship_to_different_address = parseInt($("[name='ship_to_different_address']:checked").val());
        var $required_inputs = checkout_form.find('.address-field.validate-required:visible');
        var has_full_address = true;
        var lookFor = main.settings.default_address_fields;
        var formData = {
            post_data: checkout_form.serialize()
        };
        if ($required_inputs.length) {
            $required_inputs.each(function () {
                if ($(this).find(':input').val() === '') {
                    has_full_address = false;
                }
            });
        }
        var formArr = checkout_form.serializeArray();
        formArr.forEach(function (item) { return formData[item.name] = item.value; });
        formData["has_full_address"] = has_full_address;
        formData["ship_to_different_address"] = ship_to_different_address;
        if (ship_to_different_address === 0) {
            lookFor.forEach(function (field) {
                if ($("#billing_" + field).length > 0) {
                    formData["billing_" + field] = formData["shipping_" + field];
                }
            });
        }
        return formData;
    };
    /**
     *
     */
    TabContainer.prototype.setTermsAndConditions = function () {
        var termsAndConditionsLinkClass = "woocommerce-terms-and-conditions-link";
        var termsAndConditionsContentClass = "woocommerce-terms-and-conditions";
        var termsAndConditionsLink = new Element_1.Element($("." + termsAndConditionsLinkClass));
        var termsAndConditionsContent = new Element_1.Element($("." + termsAndConditionsContentClass));
        termsAndConditionsLink.jel.on('click', function (eventObject) {
            eventObject.preventDefault();
            termsAndConditionsContent.jel.slideToggle(300);
        });
    };
    /**
     *
     */
    TabContainer.prototype.setCompleteOrderHandlers = function () {
        var checkout_form = Main_1.Main.instance.checkoutForm;
        var completeOrderButton = new Element_1.Element($("#place_order"));
        checkout_form.on('submit', this.completeOrderSubmitHandler.bind(this));
        completeOrderButton.jel.on('click', this.completeOrderClickHandler.bind(this));
    };
    /**
     *
     */
    TabContainer.prototype.completeOrderSubmitHandler = function (e) {
        var main = Main_1.Main.instance;
        var checkout_form = Main_1.Main.instance.checkoutForm;
        var preSwapData = this.checkoutDataAtSubmitClick;
        // Prevent any weirdness by preventing default
        e.preventDefault();
        // If all the payment stuff has finished any ajax calls, run the complete order.
        if (checkout_form.triggerHandler('checkout_place_order') !== false && checkout_form.triggerHandler('checkout_place_order_' + checkout_form.find('input[name="payment_method"]:checked').val()) !== false) {
            // Reset data
            for (var field in preSwapData) {
                var billing = $("#billing_" + field);
                billing.val(preSwapData[field]);
            }
            if (this.errorObserver) {
                this.errorObserver.disconnect();
            }
            this.orderKickOff(main.ajaxInfo, this.getFormObject());
        }
    };
    /**
     *
     */
    TabContainer.prototype.completeOrderClickHandler = function () {
        var main = Main_1.Main.instance;
        var checkout_form = main.checkoutForm;
        var lookFor = main.settings.default_address_fields;
        var preSwapData = this.checkoutDataAtSubmitClick = {};
        Main_1.Main.addOverlay();
        if (parseInt(checkout_form.find('input[name="ship_to_different_address"]:checked').val()) === 0) {
            lookFor.forEach(function (field) {
                var billing = $("#billing_" + field);
                var shipping = $("#shipping_" + field);
                if (billing.length > 0) {
                    preSwapData[field] = billing.val();
                    billing.val(shipping.val());
                    billing.trigger("keyup");
                }
            });
        }
        // Select the node that will be observed for mutations
        var targetNode = checkout_form[0];
        // Options for the observer (which mutations to observe)
        var config = { childList: true, characterData: true, subtree: true };
        if (!this.errorObserver) {
            // Create an observer instance linked to the callback function
            var observer = new MutationObserver(this.submitOrderErrorMutationListener.bind(this));
            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);
            this.errorObserver = observer;
        }
        checkout_form.trigger('submit');
    };
    /**
     * @param mutationsList
     */
    TabContainer.prototype.submitOrderErrorMutationListener = function (mutationsList) {
        var main = Main_1.Main.instance;
        var _loop_1 = function (mutation) {
            if (mutation.type === "childList") {
                var addedNodes = mutation.addedNodes;
                var $errorNode_1 = null;
                addedNodes.forEach(function (node) {
                    var $node = $(node);
                    var hasClass = $node.hasClass("woocommerce-error");
                    var hasGroupCheckoutClass = $node.hasClass("woocommerce-NoticeGroup-checkout");
                    if (hasClass || hasGroupCheckoutClass) {
                        Main_1.Main.removeOverlay();
                        $errorNode_1 = $node;
                        $errorNode_1.attr("class", "");
                    }
                });
                if ($errorNode_1) {
                    var alertInfo = {
                        type: "CFWSubmitError",
                        message: $errorNode_1,
                        cssClass: "cfw-alert-danger"
                    };
                    var alert_1 = new Alert_1.Alert($("#cfw-alert-container"), alertInfo);
                    alert_1.addAlert();
                }
                if (this_1.errorObserver !== undefined && this_1.errorObserver !== null) {
                    this_1.errorObserver.disconnect();
                    this_1.errorObserver = null;
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, mutationsList_1 = mutationsList; _i < mutationsList_1.length; _i++) {
            var mutation = mutationsList_1[_i];
            _loop_1(mutation);
        }
    };
    /**
     *
     * @param {AjaxInfo} ajaxInfo
     * @param data
     */
    TabContainer.prototype.orderKickOff = function (ajaxInfo, data) {
        var isShippingDifferentFromBilling = $("#shipping_dif_from_billing:checked").length !== 0;
        ValidationService_1.ValidationService.createOrder(isShippingDifferentFromBilling, ajaxInfo, data);
    };
    /**
     *
     */
    TabContainer.prototype.setApplyCouponListener = function () {
        var _this = this;
        $("#cfw-promo-code-btn").on('click', function () {
            var coupon_field = $("#cfw-promo-code");
            if (coupon_field.val() !== "") {
                new ApplyCouponAction_1.ApplyCouponAction('cfw_apply_coupon', Main_1.Main.instance.ajaxInfo, coupon_field.val(), Main_1.Main.instance.cart, _this.getFormObject()).load();
            }
            else {
                // Remove alerts
                Alert_1.Alert.removeAlerts();
            }
        });
    };
    /**
     * @param {boolean} show
     */
    TabContainer.togglePaymentFields = function (show) {
        var togglePaymentClass = "cfw-payment-false";
        var mainEl = $("#cfw-content");
        if (show) {
            mainEl.removeClass(togglePaymentClass);
        }
        else if (!mainEl.hasClass(togglePaymentClass)) {
            mainEl.addClass(togglePaymentClass);
        }
    };
    /**
     * @returns {UpdateShippingFieldsRI}
     */
    TabContainer.prototype.getUpdateShippingRequiredItems = function () {
        var sdf_jquery_results = $("#cfw-shipping-details-fields .cfw-shipping-details-field");
        var shipping_details_fields = [];
        var action = "update_shipping_fields";
        sdf_jquery_results.each(function (index, val) { shipping_details_fields.push($(val)); });
        return {
            action: action,
            shipping_details_fields: shipping_details_fields
        };
    };
    /**
     *
     */
    TabContainer.prototype.easyTabs = function () {
        this.jel.easytabs({
            defaultTab: "li.tab#default-tab",
            tabs: "ul > li.tab"
        });
    };
    /**
     * @param by
     * @param value
     * @returns {TabContainerSection}
     */
    TabContainer.prototype.tabContainerSectionBy = function (by, value) {
        return this.tabContainerSections.find(function (tabContainerSection) { return tabContainerSection[by] == value; });
    };
    Object.defineProperty(TabContainer.prototype, "tabContainerBreadcrumb", {
        /**
         * @returns {TabContainerBreadcrumb}
         */
        get: function () {
            return this._tabContainerBreadcrumb;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._tabContainerBreadcrumb = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabContainer.prototype, "tabContainerSections", {
        /**
         * @returns {Array<TabContainerSection>}
         */
        get: function () {
            return this._tabContainerSections;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._tabContainerSections = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabContainer.prototype, "errorObserver", {
        /**
         * @returns {MutationObserver}
         */
        get: function () {
            return this._errorObserver;
        },
        /**
         * @param {MutationObserver} value
         */
        set: function (value) {
            this._errorObserver = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabContainer.prototype, "checkoutDataAtSubmitClick", {
        /**
         * @returns {any}
         */
        get: function () {
            return this._checkoutDataAtSubmitClick;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._checkoutDataAtSubmitClick = value;
        },
        enumerable: true,
        configurable: true
    });
    return TabContainer;
}(Element_1.Element));
exports.TabContainer = TabContainer;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __webpack_require__(4);
var ResponsePrep_1 = __webpack_require__(6);
/**
 * Ajax does the account exist action. Takes the information from email box and fires of a request to see if the account
 * exists
 */
var AccountExistsAction = /** @class */ (function (_super) {
    __extends(AccountExistsAction, _super);
    /**
     * @param id
     * @param ajaxInfo
     * @param email
     * @param ezTabContainer
     */
    function AccountExistsAction(id, ajaxInfo, email, ezTabContainer) {
        var _this = this;
        // Object prep
        var data = {
            "wc-ajax": id,
            security: ajaxInfo.nonce,
            email: email
        };
        // Call parent
        _this = _super.call(this, id, ajaxInfo.url, data) || this;
        // Setup our container
        _this.ezTabContainer = ezTabContainer;
        return _this;
    }
    /**
     * @param resp
     */
    AccountExistsAction.prototype.response = function (resp) {
        var login_slide = $("#cfw-login-slide");
        var register_user_checkbox = $("#createaccount")[0];
        var register_container = $("#cfw-login-details .cfw-check-input");
        // If account exists slide down the password field, uncheck the register box, and hide the container for the checkbox
        if (resp.account_exists) {
            login_slide.slideDown(300);
            register_user_checkbox.checked = false;
            register_container.css("display", "none");
            AccountExistsAction.checkBox = true;
            $(register_user_checkbox).trigger('change');
            // If account does not exist, reverse
        }
        else {
            login_slide.slideUp(300);
            if (AccountExistsAction.checkBox) {
                register_user_checkbox.checked = true;
                $(register_user_checkbox).trigger('change');
                AccountExistsAction.checkBox = false;
            }
            register_container.css("display", "block");
        }
    };
    Object.defineProperty(AccountExistsAction.prototype, "ezTabContainer", {
        /**
         * @returns {JQuery}
         */
        get: function () {
            return this._ezTabContainer;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._ezTabContainer = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AccountExistsAction, "checkBox", {
        /**
         * @returns {boolean}
         */
        get: function () {
            return AccountExistsAction._checkBox;
        },
        /**
         * @param {boolean} value
         */
        set: function (value) {
            AccountExistsAction._checkBox = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @type {boolean}
     * @private
     */
    AccountExistsAction._checkBox = true;
    __decorate([
        ResponsePrep_1.ResponsePrep
    ], AccountExistsAction.prototype, "response", null);
    return AccountExistsAction;
}(Action_1.Action));
exports.AccountExistsAction = AccountExistsAction;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __webpack_require__(4);
var Alert_1 = __webpack_require__(5);
var ResponsePrep_1 = __webpack_require__(6);
/**
 *
 */
var LoginAction = /** @class */ (function (_super) {
    __extends(LoginAction, _super);
    /**
     *
     * @param id
     * @param ajaxInfo
     * @param email
     * @param password
     */
    function LoginAction(id, ajaxInfo, email, password) {
        var _this = this;
        var data = {
            "wc-ajax": id,
            security: ajaxInfo.nonce,
            email: email,
            password: password
        };
        _this = _super.call(this, id, ajaxInfo.url, data) || this;
        return _this;
    }
    /**
     *
     * @param resp
     */
    LoginAction.prototype.response = function (resp) {
        if (resp.logged_in) {
            location.reload();
        }
        else {
            var alertInfo = {
                type: "LoginFailBadAccInfo",
                message: resp.message,
                cssClass: "cfw-alert-danger"
            };
            var alert_1 = new Alert_1.Alert($("#cfw-alert-container"), alertInfo);
            alert_1.addAlert();
        }
    };
    __decorate([
        ResponsePrep_1.ResponsePrep
    ], LoginAction.prototype, "response", null);
    return LoginAction;
}(Action_1.Action));
exports.LoginAction = LoginAction;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __webpack_require__(4);
var Cart_1 = __webpack_require__(9);
var Alert_1 = __webpack_require__(5);
var ResponsePrep_1 = __webpack_require__(6);
var Main_1 = __webpack_require__(0);
var UpdateCheckoutAction_1 = __webpack_require__(8);
/**
 *
 */
var ApplyCouponAction = /** @class */ (function (_super) {
    __extends(ApplyCouponAction, _super);
    /**
     * @param {string} id
     * @param {AjaxInfo} ajaxInfo
     * @param {string} code
     * @param {Cart} cart
     * @param {any} fields
     */
    function ApplyCouponAction(id, ajaxInfo, code, cart, fields) {
        var _this = this;
        var data = {
            "wc-ajax": id,
            security: ajaxInfo.nonce,
            coupon_code: code
        };
        _this = _super.call(this, id, ajaxInfo.url, data) || this;
        _this.cart = cart;
        _this.fields = fields;
        return _this;
    }
    /**
     * @param resp
     */
    ApplyCouponAction.prototype.response = function (resp) {
        var alertInfo;
        if (resp.new_totals) {
            Cart_1.Cart.outputValues(this.cart, resp.new_totals);
        }
        if (resp.coupons) {
            var coupons = $.map(resp.coupons, function (value, index) {
                return [value];
            });
            Cart_1.Cart.outputCoupons(this.cart.coupons, coupons);
        }
        if (resp.message.success) {
            alertInfo = {
                type: "ApplyCouponSuccess",
                message: resp.message.success[0],
                cssClass: "cfw-alert-success"
            };
        }
        if (resp.message.error) {
            alertInfo = {
                type: "ApplyCouponError",
                message: resp.message.error[0],
                cssClass: "cfw-alert-danger"
            };
        }
        var alert = new Alert_1.Alert($("#cfw-alert-container"), alertInfo);
        alert.addAlert();
        Main_1.Main.togglePaymentRequired(resp.needs_payment);
        new UpdateCheckoutAction_1.UpdateCheckoutAction("update_checkout", Main_1.Main.instance.ajaxInfo, this.fields).load();
    };
    Object.defineProperty(ApplyCouponAction.prototype, "fields", {
        /**
         * @returns {any}
         */
        get: function () {
            return this._fields;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._fields = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ApplyCouponAction.prototype, "cart", {
        /**
         * @returns {Cart}
         */
        get: function () {
            return this._cart;
        },
        /**
         * @param {Cart} value
         */
        set: function (value) {
            this._cart = value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        ResponsePrep_1.ResponsePrep
    ], ApplyCouponAction.prototype, "response", null);
    return ApplyCouponAction;
}(Action_1.Action));
exports.ApplyCouponAction = ApplyCouponAction;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(2);
/**
 *
 */
var TabContainerBreadcrumb = /** @class */ (function (_super) {
    __extends(TabContainerBreadcrumb, _super);
    /**
     *
     * @param jel
     */
    function TabContainerBreadcrumb(jel) {
        return _super.call(this, jel) || this;
    }
    return TabContainerBreadcrumb;
}(Element_1.Element));
exports.TabContainerBreadcrumb = TabContainerBreadcrumb;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(2);
var InputLabelWrap_1 = __webpack_require__(12);
var LabelType_1 = __webpack_require__(13);
var SelectLabelWrap_1 = __webpack_require__(14);
/**
 *
 */
var TabContainerSection = /** @class */ (function (_super) {
    __extends(TabContainerSection, _super);
    /**
     *
     * @param jel
     * @param name
     */
    function TabContainerSection(jel, name) {
        var _this = _super.call(this, jel) || this;
        /**
         *
         * @type {string}
         * @private
         */
        _this._name = "";
        /**
         *
         * @type {Array}
         * @private
         */
        _this._inputLabelWraps = [];
        /**
         *
         * @type {Array}
         * @private
         */
        _this._selectLabelWraps = [];
        _this.name = name;
        return _this;
    }
    /**
     *
     * @param id
     * @returns {InputLabelWrap}
     */
    TabContainerSection.prototype.getInputLabelWrapById = function (id) {
        return this.inputLabelWraps.find(function (inputLabelWrap) { return inputLabelWrap.jel.attr("id") == id; });
    };
    /**
     *
     * @returns {string}
     */
    TabContainerSection.prototype.getWrapSelector = function () {
        var selector = "";
        TabContainerSection.inputLabelTypes.forEach(function (labelType, index) {
            selector += "." + TabContainerSection.inputLabelWrapClass + "." + labelType.cssClass;
            if (index + 1 != TabContainerSection.inputLabelTypes.length) {
                selector += ", ";
            }
        });
        return selector;
    };
    /**
     * Gets all the inputs for a tab section
     *
     * @param query
     * @returns {Array<Element>}
     */
    TabContainerSection.prototype.getInputsFromSection = function (query) {
        if (query === void 0) { query = ""; }
        var out = [];
        this.jel.find("input" + query).each(function (index, elem) {
            out.push(new Element_1.Element($(elem)));
        });
        return out;
    };
    /**
     *
     */
    TabContainerSection.prototype.setWraps = function () {
        var inputLabelWraps = [];
        var selectLabelWraps = [];
        var jLabelWrap = this.jel.find(this.getWrapSelector());
        jLabelWrap.each(function (index, wrap) {
            if ($(wrap).hasClass("cfw-select-input") && $(wrap).find("select").length > 0) {
                var slw = new SelectLabelWrap_1.SelectLabelWrap($(wrap));
                selectLabelWraps.push(slw);
            }
            else {
                var ilw = new InputLabelWrap_1.InputLabelWrap($(wrap));
                inputLabelWraps.push(ilw);
            }
        });
        this.inputLabelWraps = inputLabelWraps;
        this.selectLabelWraps = selectLabelWraps;
    };
    /**
     * Modules are sections within tab container sections. They are the direct containers of the input / select wraps.
     * The purpose of this method is to allow the developer to get all the input wraps via a cfw-module class, rather
     * than having to do deep dives to figure out what input wrap belongs to where. Makes it easier to add actions to
     * input wraps / inputs
     *
     * @param moduleId
     * @returns {Array<FormElement>}
     */
    TabContainerSection.prototype.getFormElementsByModule = function (moduleId) {
        var wraps = [];
        this.inputLabelWraps.forEach(function (ilw) {
            var mc = ilw.moduleContainer;
            if (mc.attr('id') == moduleId) {
                wraps.push(ilw);
            }
        });
        this.selectLabelWraps.forEach(function (slw) {
            var mc = slw.moduleContainer;
            if (mc.attr('id') == moduleId) {
                wraps.push(slw);
            }
        });
        return wraps;
    };
    Object.defineProperty(TabContainerSection.prototype, "name", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return this._name;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabContainerSection.prototype, "inputLabelWraps", {
        /**
         *
         * @returns {Array<InputLabelWrap>}
         */
        get: function () {
            return this._inputLabelWraps;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._inputLabelWraps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabContainerSection.prototype, "selectLabelWraps", {
        /**
         *
         * @returns {Array<SelectLabelWrap>}
         */
        get: function () {
            return this._selectLabelWraps;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._selectLabelWraps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabContainerSection, "inputLabelTypes", {
        /**
         *
         * @returns {Array<InputLabelType>}
         */
        get: function () {
            return TabContainerSection._inputLabelTypes;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            TabContainerSection._inputLabelTypes = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabContainerSection, "inputLabelWrapClass", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return TabContainerSection._inputLabelWrapClass;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            TabContainerSection._inputLabelWrapClass = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @type {string}
     * @private
     */
    TabContainerSection._inputLabelWrapClass = "cfw-input-wrap";
    /**
     *
     * @type {[{type: LabelType; cssClass: string},{type: LabelType; cssClass: string},{type: LabelType; cssClass: string}]}
     * @private
     */
    TabContainerSection._inputLabelTypes = [
        { type: LabelType_1.LabelType.TEXT, cssClass: "cfw-text-input" },
        { type: LabelType_1.LabelType.TEL, cssClass: "cfw-tel-input" },
        { type: LabelType_1.LabelType.PASSWORD, cssClass: "cfw-password-input" },
        { type: LabelType_1.LabelType.SELECT, cssClass: "cfw-select-input" }
    ];
    return TabContainerSection;
}(Element_1.Element));
exports.TabContainerSection = TabContainerSection;


/***/ })
/******/ ]);
//# sourceMappingURL=checkout-woocommerce-front.js.map