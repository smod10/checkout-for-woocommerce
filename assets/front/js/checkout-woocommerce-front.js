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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Main_1 = __webpack_require__(5);
var TabContainer_1 = __webpack_require__(10);
var TabContainerBreadcrumb_1 = __webpack_require__(18);
var TabContainerSection_1 = __webpack_require__(19);
var Cart_1 = __webpack_require__(4);
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
w.addEventListener("cfw-initialize", function (eventData) {
    var data = eventData.detail;
    var breadCrumbEl = $(data.elements.breadCrumbElId);
    var customerInfoEl = $(data.elements.customerInfoElId);
    var shippingMethodEl = $(data.elements.shippingMethodElId);
    var paymentMethodEl = $(data.elements.paymentMethodElId);
    var tabContainerEl = $(data.elements.tabContainerElId);
    var cartContainer = $(data.elements.cartContainerId);
    var cartSubtotal = $(data.elements.cartSubtotalId);
    var cartShipping = $(data.elements.cartShippingId);
    var cartTaxes = $(data.elements.cartTaxesId);
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
    var cart = new Cart_1.Cart(cartContainer, cartSubtotal, cartShipping, cartTaxes, cartTotal, cartCoupons, cartReviewBar);
    var main = new Main_1.Main(tabContainer, data.ajaxInfo, cart, data.settings);
    main.setup();
}, { once: true });


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
var Element = /** @class */ (function () {
    /**
     *
     * @param jel
     */
    function Element(jel) {
        this.jel = jel;
    }
    Object.defineProperty(Element.prototype, "jel", {
        /**
         *
         * @returns {JQuery}
         */
        get: function () {
            return this._jel;
        },
        /**
         *
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
/* 2 */
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
        this.url = url;
        this.data = data;
    }
    /**
     * Fire ze ajax
     */
    Action.prototype.load = function () {
        $.post(this.url.href, this.data, this.response.bind(this));
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
         * @returns {URL}
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
/* 3 */
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
/* 4 */
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
var Element_1 = __webpack_require__(1);
var Cart = /** @class */ (function (_super) {
    __extends(Cart, _super);
    /**
     * @param cartContainer
     * @param subTotal
     * @param shipping
     * @param taxes
     * @param total
     * @param coupons
     * @param reviewBarTotal
     */
    function Cart(cartContainer, subTotal, shipping, taxes, total, coupons, reviewBarTotal) {
        var _this = _super.call(this, cartContainer) || this;
        _this.subTotal = new Element_1.Element(subTotal);
        _this.shipping = new Element_1.Element(shipping);
        _this.taxes = new Element_1.Element(taxes);
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
        Cart.outputValue(cart.shipping, values.new_shipping_total);
        Cart.outputValue(cart.taxes, values.new_taxes_total);
        Cart.outputValue(cart.total, values.new_total);
        Cart.outputValue(cart.reviewBarTotal, values.new_total);
    };
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/// <reference path="../../../../typings/index.d.ts" />
/// <reference path="Definitions/ArrayFind.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var ValidationService_1 = __webpack_require__(6);
/**
 *
 */
var Main = /** @class */ (function () {
    /**
     *
     * @param tabContainer
     * @param ajaxInfo
     * @param cart
     * @param settings
     */
    function Main(tabContainer, ajaxInfo, cart, settings) {
        this.tabContainer = tabContainer;
        this.ajaxInfo = ajaxInfo;
        this.cart = cart;
        this.settings = settings;
        this.validationService = new ValidationService_1.ValidationService(tabContainer);
        Main.instance = this;
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
        /**
         * NOTE: If you are doing any DOM manipulation (adding and removing classes specifically). Do it before the setWraps
         * call on the tab container sections. Once this is called all the setup of the different areas will have completed and
         * wont be run again until next page load
         */
        // Loop through and set up the wraps on the tab container sections
        this.tabContainer.tabContainerSections.forEach(function (tcs) { return tcs.setWraps(); });
        // Set up event handlers
        this.tabContainer.setAccountCheckListener(this.ajaxInfo);
        this.tabContainer.setLogInListener(this.ajaxInfo);
        this.tabContainer.setUpdateShippingFieldsListener(this.ajaxInfo, this.cart);
        this.tabContainer.setUpdateAllShippingFieldsListener(this.ajaxInfo, this.cart);
        this.tabContainer.setShippingPaymentUpdate(this.ajaxInfo, this.cart);
        this.tabContainer.setUpPaymentTabRadioButtons();
        this.tabContainer.setUpCreditCardRadioReveal();
        this.tabContainer.setUpMobileCartDetailsReveal();
        this.tabContainer.setCompleteOrder(this.ajaxInfo, this.cart);
        this.tabContainer.setApplyCouponListener(this.ajaxInfo, this.cart);
        // Handles the shipping fields on load if the user happens to land on the shipping method page.
        this.tabContainer.setShippingFieldsOnLoad();
    };
    /**
     * Sets up animation listeners
     */
    Main.prototype.setupAnimationListeners = function () {
        $("#cfw-ci-login").on("click", function () {
            $("#cfw-login-slide").slideDown(300);
        });
    };
    Object.defineProperty(Main.prototype, "tabContainer", {
        /**
         *
         * @returns {TabContainer}
         */
        get: function () {
            return this._tabContainer;
        },
        /**
         *
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
         *
         * @returns {AjaxInfo}
         */
        get: function () {
            return this._ajaxInfo;
        },
        /**
         *
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
         *
         * @returns {Cart}
         */
        get: function () {
            return this._cart;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._cart = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        set: function (value) {
            this._settings = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "validationService", {
        get: function () {
            return this._validationService;
        },
        set: function (value) {
            this._validationService = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Main, "instance", {
        get: function () {
            return Main._instance;
        },
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Parsley;
var EValidationSections;
(function (EValidationSections) {
    EValidationSections[EValidationSections["SHIPPING"] = 0] = "SHIPPING";
    EValidationSections[EValidationSections["BILLING"] = 1] = "BILLING";
    EValidationSections[EValidationSections["ACCOUNT"] = 2] = "ACCOUNT";
})(EValidationSections = exports.EValidationSections || (exports.EValidationSections = {}));
var ValidationService = /** @class */ (function () {
    /**
     * @param {TabContainer} tabContainer
     */
    function ValidationService(tabContainer) {
        /**
         * @type {Array}
         * @private
         */
        this._easyTabsOrder = [];
        this.tabContainer = tabContainer;
        this.easyTabsOrder = [$("#cfw-customer-info"), $("#cfw-shipping-method"), $("#cfw-payment-method")];
        this.setup();
    }
    ValidationService.prototype.setup = function () {
        this.setEventListeners();
        if (window.location.hash != "#cfw-customer-info" && window.location.hash != "") {
            if (!this.validate(EValidationSections.SHIPPING)) {
                window.location.hash = "#cfw-customer-info";
            }
        }
        // Parsley isn't a jquery default, this gets around it.
        var $temp = $;
        var shipping_action = function (element) {
            $("#cfw-tab-container").easytabs("select", "#cfw-customer-info");
        };
        if ($temp("#shipping_postcode").length !== 0) {
            $temp("#shipping_postcode").parsley().on("field:error", shipping_action);
            $temp("#shipping_state").parsley().on("field:error", shipping_action);
        }
    };
    ValidationService.prototype.setEventListeners = function () {
        this.tabContainer.jel.bind('easytabs:before', function (event, clicked, target, settings) {
            var currentPanelIndex;
            var targetPanelIndex;
            this.easyTabsOrder.forEach(function (tab, index) {
                if (tab.filter(":visible").length !== 0) {
                    currentPanelIndex = index;
                }
                if (tab.is($(target))) {
                    targetPanelIndex = index;
                }
            });
            if (targetPanelIndex > currentPanelIndex) {
                if (currentPanelIndex === 0) {
                    var validated = this.validate(EValidationSections.ACCOUNT) && this.validate(EValidationSections.SHIPPING);
                    if (!validated) {
                        window.location.hash = "#" + this.easyTabsOrder[currentPanelIndex].attr("id");
                    }
                    return validated;
                }
            }
            return true;
        }.bind(this));
    };
    ValidationService.prototype.validate = function (section) {
        var validated;
        switch (section) {
            case EValidationSections.SHIPPING:
                validated = $("#cfw-checkout-form").parsley().validate("shipping");
                break;
            case EValidationSections.BILLING:
                validated = $("#cfw-checkout-form").parsley().validate("billing");
                break;
            case EValidationSections.ACCOUNT:
                validated = $("#cfw-checkout-form").parsley().validate("account");
                break;
        }
        if (validated == null)
            validated = true;
        return validated;
    };
    Object.defineProperty(ValidationService.prototype, "easyTabsOrder", {
        get: function () {
            return this._easyTabsOrder;
        },
        set: function (value) {
            this._easyTabsOrder = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ValidationService.prototype, "tabContainer", {
        get: function () {
            return this._tabContainer;
        },
        set: function (value) {
            this._tabContainer = value;
        },
        enumerable: true,
        configurable: true
    });
    return ValidationService;
}());
exports.ValidationService = ValidationService;


/***/ }),
/* 7 */
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
var Element_1 = __webpack_require__(1);
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
        if (Alert.previousClass) {
            this.jel.removeClass(Alert.previousClass);
        }
        $("#cfw-content").removeClass("show-overlay");
        this.jel.find(".message").html(this.alertInfo.message);
        this.jel.addClass(this.alertInfo.cssClass);
        this.jel.slideDown(300);
        window.scrollTo(0, 0);
        Alert.previousClass = this.alertInfo.cssClass;
    };
    Object.defineProperty(Alert.prototype, "alertInfo", {
        /**
         *
         * @returns {AlertInfo}
         */
        get: function () {
            return this._alertInfo;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._alertInfo = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Alert, "previousClass", {
        get: function () {
            return this._previousClass;
        },
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
Object.defineProperty(exports, "__esModule", { value: true });
var Element_1 = __webpack_require__(1);
var LabelType_1 = __webpack_require__(9);
/**
 *
 */
var FormElement = /** @class */ (function (_super) {
    __extends(FormElement, _super);
    /**
     *
     * @param jel
     */
    function FormElement(jel) {
        var _this = _super.call(this, jel) || this;
        /**
         *
         * @type {Array}
         * @private
         */
        _this._eventCallbacks = [];
        return _this;
    }
    /**
     *
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
     *
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
     *
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
         *
         * @returns {string}
         */
        get: function () {
            return FormElement._labelClass;
        },
        /**
         *
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
         *
         * @returns {Array<EventCallback>}
         */
        get: function () {
            return this._eventCallbacks;
        },
        /**
         *
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
         *
         * @returns {JQuery}
         */
        get: function () {
            return this._moduleContainer;
        },
        /**
         *
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
         *
         * @returns {Element}
         */
        get: function () {
            return this._holder;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._holder = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @type {string}
     * @private
     */
    FormElement._labelClass = "cfw-floating-label";
    return FormElement;
}(Element_1.Element));
exports.FormElement = FormElement;


/***/ }),
/* 9 */
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
var Element_1 = __webpack_require__(1);
var AccountExistsAction_1 = __webpack_require__(11);
var LoginAction_1 = __webpack_require__(12);
var UpdateShippingFieldsAction_1 = __webpack_require__(13);
var UpdateShippingMethodAction_1 = __webpack_require__(14);
var CompleteOrderAction_1 = __webpack_require__(15);
var Main_1 = __webpack_require__(5);
var ApplyCouponAction_1 = __webpack_require__(17);
var ValidationService_1 = __webpack_require__(6);
/**
 *
 */
var TabContainer = /** @class */ (function (_super) {
    __extends(TabContainer, _super);
    /**
     *
     * @param jel
     * @param tabContainerBreadcrumb
     * @param tabContainerSections
     */
    function TabContainer(jel, tabContainerBreadcrumb, tabContainerSections) {
        var _this = _super.call(this, jel) || this;
        /**
         *
         * @type {boolean}
         * @private
         */
        _this._sendOrder = false;
        _this.tabContainerBreadcrumb = tabContainerBreadcrumb;
        _this.tabContainerSections = tabContainerSections;
        return _this;
    }
    /**
     *
     * @param ajaxInfo
     */
    TabContainer.prototype.setAccountCheckListener = function (ajaxInfo) {
        var _this = this;
        var customer_info = this.tabContainerSectionBy("name", "customer_info");
        var email_input_wrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
        if (email_input_wrap) {
            var email_input_1 = email_input_wrap.holder.jel;
            var reg_email = $("#cfw-acc-register-chk");
            // Handles page onload use case
            new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val(), this.jel).load();
            var handler = function () { return new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val(), _this.jel).load(); };
            // Add check to keyup event
            email_input_1.on("keyup", handler);
            email_input_1.on("change", handler);
            reg_email.on('change', handler);
            // On page load check
            var onLoadAccCheck = new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val(), this.jel);
            onLoadAccCheck.load();
        }
    };
    /**
     *
     * @param ajaxInfo
     */
    TabContainer.prototype.setLogInListener = function (ajaxInfo) {
        var customer_info = this.tabContainerSectionBy("name", "customer_info");
        var email_input_wrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
        if (email_input_wrap) {
            var email_input_2 = email_input_wrap.holder.jel;
            var password_input_wrap = customer_info.getInputLabelWrapById("cfw-password-wrap");
            var password_input_1 = password_input_wrap.holder.jel;
            var login_btn = $("#cfw-login-btn");
            // Fire the login action on click
            login_btn.on("click", function () { return new LoginAction_1.LoginAction("login", ajaxInfo, email_input_2.val(), password_input_1.val()).load(); });
        }
    };
    /**
     * Handles on change events from the shipping input
     *
     * @param ajaxInfo
     * @param cart
     */
    TabContainer.prototype.setUpdateShippingFieldsListener = function (ajaxInfo, cart) {
        var customer_info = this.tabContainerSectionBy("name", "customer_info");
        var form_elements = customer_info.getFormElementsByModule('cfw-shipping-info');
        var on = "change";
        var usfri = this.getUpdateShippingRequiredItems();
        var tc = this;
        var registerUpdateShippingFieldsActionOnChange = function (fe, action, ajaxInfo, shipping_details_fields, on) {
            fe.holder.jel.on(on, function (event) { return TabContainer.genericUpdateShippingFieldsActionProcess(fe, event.target.value, ajaxInfo, action, shipping_details_fields, cart, tc).load(); });
        };
        form_elements.forEach(function (fe) { return registerUpdateShippingFieldsActionOnChange(fe, usfri.action, ajaxInfo, usfri.shipping_details_fields, on); });
    };
    /**
     * Handles updating all the fields on a breadcrumb click or a move to the next section button
     *
     * @param ajaxInfo
     * @param cart
     */
    TabContainer.prototype.setUpdateAllShippingFieldsListener = function (ajaxInfo, cart) {
        var customer_info = this.tabContainerSectionBy("name", "customer_info");
        var form_elements = customer_info.getFormElementsByModule('cfw-shipping-info');
        var continue_button = customer_info.jel.find("#cfw-shipping-info-action");
        var shipping_payment_bc = this.tabContainerBreadcrumb.jel.find(".tab:nth-child(2), .tab:nth-child(3)");
        var usfri = this.getUpdateShippingRequiredItems();
        var tc = this;
        var updateAllProcess = function (event) {
            form_elements.forEach(function (fe) { return TabContainer.genericUpdateShippingFieldsActionProcess(fe, fe.holder.jel.val(), ajaxInfo, usfri.action, usfri.shipping_details_fields, cart, tc).load(); });
        };
        continue_button.on("click", updateAllProcess.bind(this));
        shipping_payment_bc.on("click", updateAllProcess.bind(this));
    };
    /**
     * @param fe
     * @param value
     * @param ajaxInfo
     * @param action
     * @param shipping_details_fields
     * @param cart
     * @param tabContainer
     */
    TabContainer.genericUpdateShippingFieldsActionProcess = function (fe, value, ajaxInfo, action, shipping_details_fields, cart, tabContainer) {
        var type = fe.holder.jel.attr("field_key");
        var cdi = { field_type: type, field_value: value };
        return new UpdateShippingFieldsAction_1.UpdateShippingFieldsAction(action, ajaxInfo, [cdi], shipping_details_fields, cart, tabContainer);
    };
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
                    if ($(elem).is(":checked")) {
                        $("#wc-stripe-cc-form").slideDown(300);
                        $(".woocommerce-SavedPaymentMethods-saveNew").slideDown(300);
                        $(".wc-saved-payment-methods").removeClass("kill-bottom-margin");
                    }
                }
                else {
                    $(elem).on('click', function () {
                        $("#wc-stripe-cc-form").slideUp(300);
                        $(".woocommerce-SavedPaymentMethods-saveNew").slideUp(300);
                        $(".wc-saved-payment-methods").addClass("kill-bottom-margin");
                    });
                    if ($(elem).is(":checked")) {
                        $(".wc-saved-payment-methods").addClass("kill-bottom-margin");
                    }
                }
            });
        }
    };
    TabContainer.prototype.setUpCreditCardFields = function () {
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
        // Authorize.net
        var authorizenet_form_wraps = $("#wc-authorize-net-aim-credit-card-form .form-row");
        $("#wc-authorize-net-aim-credit-card-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
        authorizenet_form_wraps.each(function (index, elem) {
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
    };
    TabContainer.prototype.setUpPaymentTabRadioButtons = function () {
        // The payment radio buttons to register the click events too
        var payment_radio_buttons = this
            .tabContainerSectionBy("name", "payment_method")
            .getInputsFromSection('[type="radio"][name="payment_method"]');
        var shipping_same_radio_buttons = this
            .tabContainerSectionBy("name", "payment_method")
            .getInputsFromSection('[type="radio"][name="shipping_same"]');
        this.setRevealOnRadioButtonGroup(payment_radio_buttons);
        this.setRevealOnRadioButtonGroup(shipping_same_radio_buttons, true);
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
            if (rb.jel.is(":checked")) {
                slideUpAndDownContainers(rb);
            }
        });
    };
    /**
     *
     * @param ajaxInfo
     * @param cart
     */
    TabContainer.prototype.setShippingPaymentUpdate = function (ajaxInfo, cart) {
        var _this = this;
        var shipping_method = this.tabContainerSectionBy("name", "shipping_method");
        var updateShippingMethod = function (event) {
            var shipMethodVal = event.target.value;
            new UpdateShippingMethodAction_1.UpdateShippingMethodAction("update_shipping_method", ajaxInfo, shipMethodVal, cart).load();
        };
        shipping_method.jel.find('#cfw-shipping-method input[type="radio"]').each(function (index, el) {
            $(el).on("click", updateShippingMethod.bind(_this));
        });
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
    TabContainer.prototype.setUpMobileCartDetailsReveal = function () {
        var showCartDetails = new Element_1.Element($("#cfw-show-cart-details"));
        showCartDetails.jel.on('click', function () {
            $("#cfw-cart-details-collapse-wrap").slideToggle(300).parent().toggleClass("active");
        });
        $(window).on('resize', function () {
            if (window.innerWidth >= 767) {
                $("#cfw-cart-details-collapse-wrap").css('display', 'block');
                $("#cfw-cart-details").removeClass('active');
            }
            else {
                $("#cfw-cart-details-collapse-wrap").css('display', 'none');
            }
        });
    };
    TabContainer.prototype.getOrderDetails = function () {
        var ship_to_different_address = parseInt($("[name='shipping_same']:checked").val());
        var payment_method = $('[name="payment_method"]:checked').val();
        var account_password = $('#cfw-password').val();
        var billing_email = $("#cfw-email").val();
        var billing_first_name = $("#billing_first_name").val();
        var billing_last_name = $("#billing_last_name").val();
        var billing_company = $("#billing_company").val();
        var billing_country = $("#billing_country").val();
        var billing_address_1 = $("#billing_address_1").val();
        var billing_address_2 = $("#billing_address_2").val();
        var billing_city = $("#billing_city").val();
        var billing_state = $("#billing_state").val();
        var billing_postcode = $("#billing_postcode").val();
        var shipping_first_name = $("#shipping_first_name").val();
        var shipping_last_name = $("#shipping_last_name").val();
        var shipping_company = $("#shipping_company").val();
        var shipping_country = $("#shipping_country").val();
        var shipping_address_1 = $("#shipping_address_1").val();
        var shipping_address_2 = $("#shipping_address_2").val();
        var shipping_city = $("#shipping_city").val();
        var shipping_state = $("#shipping_state").val();
        var shipping_postcode = $("#shipping_postcode").val();
        var shipping_method = $("[name='shipping_method[0]']:checked").val();
        var _wpnonce = $("#_wpnonce").val();
        var _wp_http_referer = $("[name='_wp_http_referer']").val();
        var wc_stripe_payment_token = $("[name='wc-stripe-payment-token']").val();
        var wc_authorize_net_aim_account_number = $("[name='wc-authorize-net-aim-account-number']").val();
        var wc_authorize_net_aim_expiry = $("[name='wc-authorize-net-aim-expiry']").val();
        var wc_authorize_net_aim_csc = $("[name='wc-authorize-net-aim-csc']").val();
        var paypal_pro_payflow_card_number = $("[name='paypal_pro_payflow-card-number']").val();
        var paypal_pro_payflow_card_expiry = $("[name='paypal_pro_payflow-card-expiry']").val();
        var paypal_pro_payflow_card_cvc = $("[name='paypal_pro_payflow-card-cvc']").val();
        var paypal_pro_card_number = $("[name='paypal_pro-card-number']").val();
        var paypal_pro_card_expiry = $("[name='paypal_pro-card-expiry']").val();
        var paypal_pro_card_cvc = $("[name='paypal_pro-card-cvc']").val();
        if (ship_to_different_address === 0) {
            billing_first_name = shipping_first_name;
            billing_last_name = shipping_last_name;
            billing_company = shipping_company;
            billing_country = shipping_country;
            billing_address_1 = shipping_address_1;
            billing_address_2 = shipping_address_2;
            billing_city = shipping_city;
            billing_state = shipping_state;
            billing_postcode = shipping_postcode;
        }
        var completeOrderCheckoutData = {
            billing_first_name: billing_first_name,
            billing_last_name: billing_last_name,
            billing_company: billing_company,
            billing_country: billing_country,
            billing_address_1: billing_address_1,
            billing_address_2: billing_address_2,
            billing_city: billing_city,
            billing_state: billing_state,
            billing_postcode: billing_postcode,
            billing_phone: 0,
            billing_email: billing_email,
            ship_to_different_address: ship_to_different_address,
            shipping_first_name: shipping_first_name,
            shipping_last_name: shipping_last_name,
            shipping_company: shipping_company,
            shipping_country: shipping_country,
            shipping_address_1: shipping_address_1,
            shipping_address_2: shipping_address_2,
            shipping_city: shipping_city,
            shipping_state: shipping_state,
            shipping_postcode: shipping_postcode,
            order_comments: '',
            "shipping_method[0]": shipping_method,
            payment_method: payment_method,
            "wc-stripe-payment-token": wc_stripe_payment_token,
            _wpnonce: _wpnonce,
            _wp_http_referer: _wp_http_referer,
            "wc-authorize-net-aim-account-number": wc_authorize_net_aim_account_number,
            "wc-authorize-net-aim-expiry": wc_authorize_net_aim_expiry,
            "wc-authorize-net-aim-csc": wc_authorize_net_aim_csc,
            "paypal_pro_payflow-card-number": paypal_pro_payflow_card_number,
            "paypal_pro_payflow-card-expiry": paypal_pro_payflow_card_expiry,
            "paypal_pro_payflow-card-cvc": paypal_pro_payflow_card_cvc,
            "paypal_pro-card-number": paypal_pro_card_number,
            "paypal_pro-card-expiry": paypal_pro_card_expiry,
            "paypal_pro-card-cvc": paypal_pro_card_cvc,
        };
        if (account_password && account_password.length > 0) {
            completeOrderCheckoutData["account_password"] = account_password;
        }
        if ($("#cfw-acc-register-chk:checked").length > 0) {
            completeOrderCheckoutData["createaccount"] = 1;
        }
        if ($("#wc-stripe-new-payment-method:checked").length > 0) {
            completeOrderCheckoutData["wc-stripe-new-payment-method"] = true;
        }
        return completeOrderCheckoutData;
    };
    TabContainer.prototype.setCompleteOrder = function (ajaxInfo, cart) {
        var _this = this;
        var completeOrderButton = new Element_1.Element($("#cfw-complete-order-button"));
        completeOrderButton.jel.on('click', function () {
            var createOrder = true;
            var w = window;
            if ($("#shipping_dif_from_billing:checked").length !== 0) {
                w.CREATE_ORDER = true;
                w.addEventListener("cfw:state-zip-success", function () {
                    w.CREATE_ORDER = false;
                    if (createOrder) {
                        new CompleteOrderAction_1.CompleteOrderAction('complete_order', ajaxInfo, this.getOrderDetails());
                    }
                }.bind(_this), { once: true });
                w.addEventListener("cfw:state-zip-failure", function () {
                    w.CREATE_ORDER = false;
                }.bind(_this), { once: true });
                createOrder = Main_1.Main.instance.validationService.validate(ValidationService_1.EValidationSections.BILLING);
            }
            else {
                new CompleteOrderAction_1.CompleteOrderAction('complete_order', ajaxInfo, _this.getOrderDetails());
            }
        });
    };
    TabContainer.prototype.setApplyCouponListener = function (ajaxInfo, cart) {
        $("#cfw-promo-code-btn").on('click', function () {
            new ApplyCouponAction_1.ApplyCouponAction('apply_coupon', ajaxInfo, $("#cfw-promo-code").val(), cart).load();
        });
    };
    /**
     *
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
        this.jel.easytabs();
    };
    /**
     *
     * @param by
     * @param value
     * @returns {TabContainerSection}
     */
    TabContainer.prototype.tabContainerSectionBy = function (by, value) {
        return this.tabContainerSections.find(function (tabContainerSection) { return tabContainerSection[by] == value; });
    };
    Object.defineProperty(TabContainer.prototype, "tabContainerBreadcrumb", {
        /**
         *
         * @returns {TabContainerBreadcrumb}
         */
        get: function () {
            return this._tabContainerBreadcrumb;
        },
        /**
         *
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
         *
         * @returns {Array<TabContainerSection>}
         */
        get: function () {
            return this._tabContainerSections;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._tabContainerSections = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabContainer.prototype, "sendOrder", {
        get: function () {
            return this._sendOrder;
        },
        set: function (value) {
            this._sendOrder = value;
        },
        enumerable: true,
        configurable: true
    });
    return TabContainer;
}(Element_1.Element));
exports.TabContainer = TabContainer;


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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __webpack_require__(2);
var ResponsePrep_1 = __webpack_require__(3);
/**
 * Ajax does the account exist action. Takes the information from email box and fires of a request to see if the account
 * exists
 */
var AccountExistsAction = /** @class */ (function (_super) {
    __extends(AccountExistsAction, _super);
    /**
     *
     * @param id
     * @param ajaxInfo
     * @param email
     * @param ezTabContainer
     */
    function AccountExistsAction(id, ajaxInfo, email, ezTabContainer) {
        var _this = this;
        // Object prep
        var data = {
            action: id,
            security: ajaxInfo.nonce,
            email: email
        };
        // Call parent
        _this = _super.call(this, id, ajaxInfo.admin_url, data) || this;
        // Setup our container
        _this.ezTabContainer = ezTabContainer;
        return _this;
    }
    /**
     * @param resp
     */
    AccountExistsAction.prototype.response = function (resp) {
        var login_slide = $("#cfw-login-slide");
        var register_user_checkbox = $("#cfw-acc-register-chk")[0];
        var register_container = $("#cfw-login-details .cfw-check-input");
        // If account exists slide down the password field, uncheck the register box, and hide the container for the checkbox
        if (resp.account_exists) {
            login_slide.slideDown(300);
            register_user_checkbox.checked = false;
            register_container.css("display", "none");
            AccountExistsAction.checkBox = true;
            // If account does not exist, reverse
        }
        else {
            login_slide.slideUp(300);
            if (AccountExistsAction.checkBox) {
                register_user_checkbox.checked = true;
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
        get: function () {
            return AccountExistsAction._checkBox;
        },
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __webpack_require__(2);
var Alert_1 = __webpack_require__(7);
var ResponsePrep_1 = __webpack_require__(3);
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
            action: id,
            security: ajaxInfo.nonce,
            email: email,
            password: password
        };
        _this = _super.call(this, id, ajaxInfo.admin_url, data) || this;
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
/* 13 */
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
var Action_1 = __webpack_require__(2);
var ResponsePrep_1 = __webpack_require__(3);
var Cart_1 = __webpack_require__(4);
/**
 *
 */
var UpdateShippingFieldsAction = /** @class */ (function (_super) {
    __extends(UpdateShippingFieldsAction, _super);
    /**
     * @param id
     * @param ajaxInfo
     * @param shipping_fields_info
     * @param shipping_details_fields
     * @param cart
     * @param tabContainer
     */
    function UpdateShippingFieldsAction(id, ajaxInfo, shipping_fields_info, shipping_details_fields, cart, tabContainer) {
        var _this = this;
        var data = {
            action: id,
            security: ajaxInfo.nonce,
            shipping_fields_info: shipping_fields_info
        };
        _this = _super.call(this, id, ajaxInfo.admin_url, data) || this;
        _this.shipping_details_fields = shipping_details_fields;
        _this.cart = cart;
        _this.tabContainer = tabContainer;
        _this.ajaxInfo = ajaxInfo;
        return _this;
    }
    /**
     *
     * @param resp
     */
    UpdateShippingFieldsAction.prototype.response = function (resp) {
        var _this = this;
        if (!resp.error) {
            var ufi_arr_1 = [];
            var updated_shipping_methods_1 = [];
            if (resp.updated_fields_info) {
                // Push all the object values into an array
                Object.keys(resp.updated_fields_info).forEach(function (key) { return ufi_arr_1.push(resp.updated_fields_info[key]); });
                Object.keys(resp.updated_ship_methods).forEach(function (key) { return updated_shipping_methods_1.push(resp.updated_ship_methods[key]); });
                // Sort them
                ufi_arr_1.sort();
                // Loop over and apply
                ufi_arr_1.forEach(function (ufi) {
                    var ft = ufi.field_type;
                    var fv = ufi.field_value;
                    _this.shipping_details_fields.forEach(function (field) {
                        if (field.attr("field_type") == ft) {
                            field.children(".field_value").text(fv);
                        }
                    });
                });
                if (updated_shipping_methods_1.length > 0) {
                    $("#shipping_method").html("");
                }
                // Update shipping methods
                updated_shipping_methods_1.forEach(function (ship_method) {
                    var item = $("<li>" + ship_method + "</li>");
                    $("#shipping_method").append(item);
                });
                this.tabContainer.setShippingPaymentUpdate(this.ajaxInfo, this.cart);
                // Update totals
                Cart_1.Cart.outputValues(this.cart, resp.new_totals);
            }
        }
    };
    Object.defineProperty(UpdateShippingFieldsAction.prototype, "ajaxInfo", {
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
    Object.defineProperty(UpdateShippingFieldsAction.prototype, "tabContainer", {
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
    Object.defineProperty(UpdateShippingFieldsAction.prototype, "cart", {
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
    Object.defineProperty(UpdateShippingFieldsAction.prototype, "shipping_details_fields", {
        /**
         * @returns {Array<JQuery>}
         */
        get: function () {
            return this._shipping_details_fields;
        },
        /**
         * @param value
         */
        set: function (value) {
            this._shipping_details_fields = value;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        ResponsePrep_1.ResponsePrep
    ], UpdateShippingFieldsAction.prototype, "response", null);
    return UpdateShippingFieldsAction;
}(Action_1.Action));
exports.UpdateShippingFieldsAction = UpdateShippingFieldsAction;


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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = __webpack_require__(2);
var ResponsePrep_1 = __webpack_require__(3);
var Cart_1 = __webpack_require__(4);
var UpdateShippingMethodAction = /** @class */ (function (_super) {
    __extends(UpdateShippingMethodAction, _super);
    /**
     * @param id
     * @param ajaxInfo
     * @param shipping_method
     * @param cart
     */
    function UpdateShippingMethodAction(id, ajaxInfo, shipping_method, cart) {
        var _this = this;
        var data = {
            action: id,
            security: ajaxInfo.nonce,
            shipping_method: [shipping_method]
        };
        _this = _super.call(this, id, ajaxInfo.admin_url, data) || this;
        _this.cart = cart;
        return _this;
    }
    /**
     * @param resp
     */
    UpdateShippingMethodAction.prototype.response = function (resp) {
        if (resp.new_totals) {
            Cart_1.Cart.outputValues(this.cart, resp.new_totals);
        }
    };
    Object.defineProperty(UpdateShippingMethodAction.prototype, "cart", {
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
    __decorate([
        ResponsePrep_1.ResponsePrep
    ], UpdateShippingMethodAction.prototype, "response", null);
    return UpdateShippingMethodAction;
}(Action_1.Action));
exports.UpdateShippingMethodAction = UpdateShippingMethodAction;


/***/ }),
/* 15 */
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
var Action_1 = __webpack_require__(2);
var StripeService_1 = __webpack_require__(16);
var Alert_1 = __webpack_require__(7);
var Main_1 = __webpack_require__(5);
var ValidationService_1 = __webpack_require__(6);
var CompleteOrderAction = /** @class */ (function (_super) {
    __extends(CompleteOrderAction, _super);
    /**
     *
     * @param id
     * @param ajaxInfo
     * @param checkoutData
     */
    function CompleteOrderAction(id, ajaxInfo, checkoutData) {
        var _this = this;
        // We do a normal object here because to make a new type just to add two different options seems silly.
        var data = {
            action: id,
            security: ajaxInfo.nonce,
            billing_first_name: checkoutData.billing_first_name,
            billing_last_name: checkoutData.billing_last_name,
            billing_company: checkoutData.billing_company,
            billing_country: checkoutData.billing_country,
            billing_address_1: checkoutData.billing_address_1,
            billing_address_2: checkoutData.billing_address_2,
            billing_city: checkoutData.billing_city,
            billing_state: checkoutData.billing_state,
            billing_postcode: checkoutData.billing_postcode,
            billing_phone: checkoutData.billing_phone,
            billing_email: checkoutData.billing_email,
            ship_to_different_address: checkoutData.ship_to_different_address,
            shipping_first_name: checkoutData.shipping_first_name,
            shipping_last_name: checkoutData.shipping_last_name,
            shipping_company: checkoutData.shipping_company,
            shipping_country: checkoutData.shipping_country,
            shipping_address_1: checkoutData.shipping_address_1,
            shipping_address_2: checkoutData.shipping_address_2,
            shipping_city: checkoutData.shipping_city,
            shipping_state: checkoutData.shipping_state,
            shipping_postcode: checkoutData.shipping_postcode,
            order_comments: checkoutData.order_comments,
            "shipping_method[0]": checkoutData["shipping_method[0]"],
            payment_method: checkoutData.payment_method,
            "wc-stripe-payment-token": checkoutData["wc-stripe-payment-token"],
            _wpnonce: checkoutData._wpnonce,
            _wp_http_referer: checkoutData._wp_http_referer,
            "wc-authorize-net-aim-account-number": checkoutData["wc-authorize-net-aim-account-number"],
            "wc-authorize-net-aim-expiry": checkoutData["wc-authorize-net-aim-expiry"],
            "wc-authorize-net-aim-csc": checkoutData["wc-authorize-net-aim-csc"],
            "paypal_pro_payflow-card-number": checkoutData["paypal_pro_payflow-card-number"],
            "paypal_pro_payflow-card-expiry": checkoutData["paypal_pro_payflow-card-expiry"],
            "paypal_pro_payflow-card-cvc": checkoutData["paypal_pro_payflow-card-cvc"],
            "paypal_pro-card-number": checkoutData["paypal_pro-card-number"],
            "paypal_pro-card-expiry": checkoutData["paypal_pro-card-expiry"],
            "paypal_pro-card-cvc": checkoutData["paypal_pro-card-cvc"],
        };
        if (checkoutData.account_password) {
            data["account_password"] = checkoutData.account_password;
        }
        if (checkoutData.createaccount) {
            data["createaccount"] = checkoutData.createaccount;
        }
        if (checkoutData["wc-stripe-new-payment-method"]) {
            data["wc-stripe-new-payment-method"] = checkoutData["wc-stripe-new-payment-method"];
        }
        _this = _super.call(this, id, ajaxInfo.admin_url, data) || this;
        $("#cfw-content").addClass("show-overlay");
        _this.stripeServiceCallbacks = {
            success: function (response) {
                _this.stripeResponse = response;
                _this.addStripeTokenToData(response.id);
                _this.needsStripeToken = false;
                _this.load();
            },
            noData: function (response) {
                var alertInfo = {
                    type: "StripeNoDataError",
                    message: "Stripe: " + response.error.message,
                    cssClass: "cfw-alert-danger"
                };
                var alert = new Alert_1.Alert($("#cfw-alert-container"), alertInfo);
                alert.addAlert();
            },
            badData: function (response) {
                var alertInfo = {
                    type: "StripeBadDataError",
                    message: "Stripe: " + response.error.message,
                    cssClass: "cfw-alert-danger"
                };
                var alert = new Alert_1.Alert($("#cfw-alert-container"), alertInfo);
                alert.addAlert();
                _this.resetData();
            }
        };
        _this.setup();
        return _this;
    }
    /**
     * Provided a Stripe Token was given add it to the data that will be sent with the request
     *
     * @param {string} stripeToken
     */
    CompleteOrderAction.prototype.addStripeTokenToData = function (stripeToken) {
        if (stripeToken) {
            this.data["stripe_token"] = stripeToken;
            if (!this.data["payment_method"]) {
                this.data["payment_method"] = "stripe";
            }
        }
    };
    /**
     * The setup function which mainly determines if we need a stripe token to continue
     */
    CompleteOrderAction.prototype.setup = function () {
        if (StripeService_1.StripeService.hasStripe() && StripeService_1.StripeService.hasNewPayment()) {
            this.needsStripeToken = true;
            StripeService_1.StripeService.setupStripeMessageListener(this.stripeServiceCallbacks);
            StripeService_1.StripeService.triggerStripe();
        }
        else {
            this.needsStripeToken = false;
            this.load();
        }
    };
    /**
     * Overridden to handle if we need a stripe token or not.
     */
    CompleteOrderAction.prototype.load = function () {
        if (!this.needsStripeToken) {
            _super.prototype.load.call(this);
        }
    };
    Object.defineProperty(CompleteOrderAction.prototype, "needsStripeToken", {
        /**
         * @returns {boolean}
         */
        get: function () {
            return this._needsStripeToken;
        },
        /**
         * @param {boolean} value
         */
        set: function (value) {
            this._needsStripeToken = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompleteOrderAction.prototype, "stripeServiceCallbacks", {
        /**
         * @returns {StripeServiceCallbacks}
         */
        get: function () {
            return this._stripeServiceCallbacks;
        },
        /**
         * @param {StripeServiceCallbacks} value
         */
        set: function (value) {
            this._stripeServiceCallbacks = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompleteOrderAction.prototype, "stripeResponse", {
        /**
         * @returns {StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse}
         */
        get: function () {
            return this._stripeResponse;
        },
        /**
         * @param {StripeValidResponse | StripeBadDataResponse | StripeNoDataResponse} value
         */
        set: function (value) {
            this._stripeResponse = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param resp
     */
    CompleteOrderAction.prototype.response = function (resp) {
        if (resp.result === "success") {
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
            this.resetData();
        }
    };
    CompleteOrderAction.prototype.resetData = function () {
        var _this = this;
        $('#cfw-password').val(this.data["account_password"]);
        $("#cfw-email").val(this.data.billing_email);
        $("#billing_first_name").val(this.data.billing_first_name);
        $("#billing_last_name").val(this.data.billing_last_name);
        $("#billing_company").val(this.data.billing_company);
        $("#billing_country").val(this.data.billing_country);
        $("#billing_address_1").val(this.data.billing_address_1);
        $("#billing_address_2").val(this.data.billing_address_2);
        $("#billing_city").val(this.data.billing_city);
        $("#billing_state").val(this.data.billing_state);
        $("#billing_postcode").val(this.data.billing_postcode);
        $("#shipping_first_name").val(this.data.shipping_first_name);
        $("#shipping_last_name").val(this.data.shipping_last_name);
        $("#shipping_company").val(this.data.shipping_company);
        $("#shipping_country").val(this.data.shipping_country);
        $("#shipping_address_1").val(this.data.shipping_address_1);
        $("#shipping_address_2").val(this.data.shipping_address_2);
        $("#shipping_city").val(this.data.shipping_city);
        $("#shipping_state").val(this.data.shipping_state);
        $("#shipping_postcode").val(this.data.shipping_postcode);
        $("[name='shipping_method[0]']").each(function (index, elem) {
            if ($(elem).val() == _this.data["shipping_method[0]"]) {
                $(elem).prop('checked', true);
            }
        });
        $("[name='shipping_same']").each(function (index, elem) {
            if ($(elem).val() == _this.data.ship_to_different_address) {
                $(elem).prop('checked', true);
            }
        });
        $('[name="payment_method"]').each(function (index, elem) {
            if ($(elem).val() == _this.data.payment_method) {
                $(elem).prop('checked', true);
            }
        });
        $("[name='wc-stripe-payment-token']").each(function (index, elem) {
            if ($(elem).val() == _this.data["wc-stripe-payment-token"]) {
                $(elem).prop('checked', true);
            }
        });
        $("#_wpnonce").val(this.data._wpnonce);
        $("[name='_wp_http_referer']").val(this.data._wp_http_referer);
        $("#cfw-login-btn").val("Login");
        Main_1.Main.instance.validationService.validate(ValidationService_1.EValidationSections.SHIPPING);
        Main_1.Main.instance.validationService.validate(ValidationService_1.EValidationSections.BILLING);
        Main_1.Main.instance.validationService.validate(ValidationService_1.EValidationSections.ACCOUNT);
    };
    return CompleteOrderAction;
}(Action_1.Action));
exports.CompleteOrderAction = CompleteOrderAction;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Handles intercepting the stripe javascript to and from data. Performs various actions based on the data returned
 */
var StripeService = /** @class */ (function () {
    function StripeService() {
    }
    /**
     * Setup the stripe message listener with our callbacks
     *
     * @param {StripeServiceCallbacks} callbacks
     */
    StripeService.setupStripeMessageListener = function (callbacks) {
        window.addEventListener("message", function (event) { return StripeService.stripeMessageListener(event, callbacks); }, { once: true });
    };
    /**
     * Based on the data passed via message, if it's the correct URL handle the data.
     *
     * @param {MessageEvent} event
     * @param {StripeServiceCallbacks} callbacks
     */
    StripeService.stripeMessageListener = function (event, callbacks) {
        var origin = event.origin;
        if (this.serviceUrls.find(function (serviceUrl) { return origin == serviceUrl; })) {
            if (typeof event.data == "string") {
                var stripeResponse = StripeService.parseStripeMessage(event.data);
                switch (stripeResponse.code) {
                    case 200:
                        callbacks.success(stripeResponse.resp);
                        break;
                    case 400:
                        callbacks.noData(stripeResponse.resp);
                        break;
                    case 402:
                        callbacks.badData(stripeResponse.resp);
                        break;
                }
            }
        }
    };
    /**
     * Trigger the stripe event that checks the credit card ata
     */
    StripeService.triggerStripe = function () {
        var checkoutForm = $("form.woocommerce-checkout");
        checkoutForm.trigger('checkout_place_order_stripe');
        checkoutForm.on('submit', function (event) { return event.preventDefault(); });
    };
    /**
     * Parse the data returned by stripe. This mainly removes the random string that comes before the JSON object.
     *
     * @param {string} message
     * @returns {StripeResponse}
     */
    StripeService.parseStripeMessage = function (message) {
        var matchResults = message.match('default\\d{0,}(?:(?!{).)*');
        var out = null;
        if (matchResults.length > 0) {
            var match = matchResults[0];
            var dataString = message.substr(match.length, message.length);
            out = JSON.parse(dataString);
        }
        return out;
    };
    /**
     * Is the stripe method checked?
     *
     * @returns {boolean}
     */
    StripeService.hasStripe = function () {
        return $("#payment_method_stripe:checked").length > 0;
    };
    /**
     * Is the new payment option checked?
     *
     * @returns {boolean}
     */
    StripeService.hasNewPayment = function () {
        return $("#wc-stripe-payment-token-new:checked").length > 0;
    };
    Object.defineProperty(StripeService, "serviceUrls", {
        /**
         * @returns {Array<string>}
         */
        get: function () {
            return this._serviceUrls;
        },
        /**
         * @param {Array<string>} value
         */
        set: function (value) {
            this._serviceUrls = value;
        },
        enumerable: true,
        configurable: true
    });
    StripeService._serviceUrls = ["https://js.stripe.com"];
    return StripeService;
}());
exports.StripeService = StripeService;


/***/ }),
/* 17 */
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
var Action_1 = __webpack_require__(2);
var ResponsePrep_1 = __webpack_require__(3);
var Cart_1 = __webpack_require__(4);
var Alert_1 = __webpack_require__(7);
var ApplyCouponAction = /** @class */ (function (_super) {
    __extends(ApplyCouponAction, _super);
    function ApplyCouponAction(id, ajaxInfo, code, cart) {
        var _this = this;
        var data = {
            action: id,
            security: ajaxInfo.nonce,
            coupon_code: code
        };
        _this = _super.call(this, id, ajaxInfo.admin_url, data) || this;
        _this.cart = cart;
        return _this;
    }
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
    };
    Object.defineProperty(ApplyCouponAction.prototype, "cart", {
        get: function () {
            return this._cart;
        },
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
/* 18 */
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
var Element_1 = __webpack_require__(1);
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
/* 19 */
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
var Element_1 = __webpack_require__(1);
var InputLabelWrap_1 = __webpack_require__(20);
var LabelType_1 = __webpack_require__(9);
var SelectLabelWrap_1 = __webpack_require__(21);
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
            var moduleContainer = $(wrap).parents(".cfw-module");
            if ($(wrap).hasClass("cfw-select-input")) {
                var slw = new SelectLabelWrap_1.SelectLabelWrap($(wrap));
                slw.moduleContainer = moduleContainer;
                selectLabelWraps.push(slw);
            }
            else {
                var ilw = new InputLabelWrap_1.InputLabelWrap($(wrap));
                ilw.moduleContainer = moduleContainer;
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
        { type: LabelType_1.LabelType.PASSWORD, cssClass: "cfw-password-input" },
        { type: LabelType_1.LabelType.SELECT, cssClass: "cfw-select-input" }
    ];
    return TabContainerSection;
}(Element_1.Element));
exports.TabContainerSection = TabContainerSection;


/***/ }),
/* 20 */
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
var FormElement_1 = __webpack_require__(8);
/**
 *
 */
var InputLabelWrap = /** @class */ (function (_super) {
    __extends(InputLabelWrap, _super);
    /**
     *
     * @param jel
     */
    function InputLabelWrap(jel) {
        var _this = _super.call(this, jel) || this;
        _this.setHolderAndLabel('input[type="%s"]', true);
        _this.eventCallbacks = [
            { eventName: "keyup", func: function () {
                    this.wrapClassSwap(this.holder.jel.val());
                }.bind(_this), target: null }
        ];
        _this.regAndWrap();
        return _this;
    }
    return InputLabelWrap;
}(FormElement_1.FormElement));
exports.InputLabelWrap = InputLabelWrap;


/***/ }),
/* 21 */
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
var FormElement_1 = __webpack_require__(8);
/**
 *
 */
var SelectLabelWrap = /** @class */ (function (_super) {
    __extends(SelectLabelWrap, _super);
    /**
     *
     * @param jel
     */
    function SelectLabelWrap(jel) {
        var _this = _super.call(this, jel) || this;
        _this.setHolderAndLabel(_this.jel.find('select'));
        _this.eventCallbacks = [
            { eventName: "change", func: function () {
                    this.wrapClassSwap(this.holder.jel.val());
                }.bind(_this), target: null },
            { eventName: "keyup", func: function () {
                    this.wrapClassSwap(this.holder.jel.val());
                }.bind(_this), target: null }
        ];
        _this.regAndWrap();
        return _this;
    }
    return SelectLabelWrap;
}(FormElement_1.FormElement));
exports.SelectLabelWrap = SelectLabelWrap;


/***/ })
/******/ ]);