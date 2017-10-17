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
define("Elements/Element", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Element = (function () {
        function Element(jel) {
            this.jel = jel;
        }
        Object.defineProperty(Element.prototype, "jel", {
            get: function () {
                return this._jel;
            },
            set: function (value) {
                this._jel = value;
            },
            enumerable: true,
            configurable: true
        });
        return Element;
    }());
    exports.Element = Element;
});
define("Elements/TabContainerBreadcrumb", ["require", "exports", "Elements/Element"], function (require, exports, Element_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabContainerBreadcrumb = (function (_super) {
        __extends(TabContainerBreadcrumb, _super);
        function TabContainerBreadcrumb(jel) {
            return _super.call(this, jel) || this;
        }
        return TabContainerBreadcrumb;
    }(Element_1.Element));
    exports.TabContainerBreadcrumb = TabContainerBreadcrumb;
});
define("Enums/LabelType", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var LabelType;
    (function (LabelType) {
        LabelType[LabelType["TEXT"] = 0] = "TEXT";
        LabelType[LabelType["TEL"] = 1] = "TEL";
        LabelType[LabelType["EMAIL"] = 2] = "EMAIL";
        LabelType[LabelType["PASSWORD"] = 3] = "PASSWORD";
        LabelType[LabelType["SELECT"] = 4] = "SELECT";
    })(LabelType = exports.LabelType || (exports.LabelType = {}));
});
define("Enums/AlertType", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AlertType;
    (function (AlertType) {
        AlertType[AlertType["LoginFailBadAccInfo"] = 0] = "LoginFailBadAccInfo";
    })(AlertType = exports.AlertType || (exports.AlertType = {}));
});
define("Types/Types", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Elements/FormElement", ["require", "exports", "Elements/Element", "Enums/LabelType"], function (require, exports, Element_2, LabelType_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormElement = (function (_super) {
        __extends(FormElement, _super);
        function FormElement(jel) {
            var _this = _super.call(this, jel) || this;
            _this._eventCallbacks = [];
            return _this;
        }
        FormElement.getLabelTypes = function () {
            return $.map(LabelType_1.LabelType, function (value, index) {
                return [value];
            });
        };
        FormElement.prototype.regAndWrap = function () {
            this.registerEventCallbacks();
            this.wrapClassSwap(this.holder.jel.val());
        };
        FormElement.prototype.setHolderAndLabel = function (tjel, useType) {
            if (useType === void 0) { useType = false; }
            var lt = FormElement.getLabelTypes();
            for (var i = 0; i < lt.length / 2; i++) {
                var jqTjel = tjel;
                if (useType && typeof tjel === 'string') {
                    var type = lt[i].toLowerCase();
                    jqTjel = this.jel.find(tjel.replace("%s", type));
                }
                if (jqTjel.length > 0) {
                    this.holder = new Element_2.Element(jqTjel);
                }
            }
        };
        FormElement.prototype.wrapClassSwap = function (value) {
            if (value !== "" && !this.jel.hasClass(FormElement.labelClass)) {
                this.jel.addClass(FormElement.labelClass);
            }
            if (value === "" && this.jel.hasClass(FormElement.labelClass)) {
                this.jel.removeClass(FormElement.labelClass);
            }
        };
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
            get: function () {
                return FormElement._labelClass;
            },
            set: function (value) {
                FormElement._labelClass = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormElement.prototype, "eventCallbacks", {
            get: function () {
                return this._eventCallbacks;
            },
            set: function (value) {
                this._eventCallbacks = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormElement.prototype, "moduleContainer", {
            get: function () {
                return this._moduleContainer;
            },
            set: function (value) {
                this._moduleContainer = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormElement.prototype, "holder", {
            get: function () {
                return this._holder;
            },
            set: function (value) {
                this._holder = value;
            },
            enumerable: true,
            configurable: true
        });
        FormElement._labelClass = "cfw-floating-label";
        return FormElement;
    }(Element_2.Element));
    exports.FormElement = FormElement;
});
define("Elements/InputLabelWrap", ["require", "exports", "Elements/FormElement"], function (require, exports, FormElement_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var InputLabelWrap = (function (_super) {
        __extends(InputLabelWrap, _super);
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
});
define("Elements/SelectLabelWrap", ["require", "exports", "Elements/FormElement"], function (require, exports, FormElement_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectLabelWrap = (function (_super) {
        __extends(SelectLabelWrap, _super);
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
    }(FormElement_2.FormElement));
    exports.SelectLabelWrap = SelectLabelWrap;
});
define("Elements/TabContainerSection", ["require", "exports", "Elements/Element", "Elements/InputLabelWrap", "Enums/LabelType", "Elements/SelectLabelWrap"], function (require, exports, Element_3, InputLabelWrap_1, LabelType_2, SelectLabelWrap_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabContainerSection = (function (_super) {
        __extends(TabContainerSection, _super);
        function TabContainerSection(jel, name) {
            var _this = _super.call(this, jel) || this;
            _this._name = "";
            _this._inputLabelWraps = [];
            _this._selectLabelWraps = [];
            _this.name = name;
            return _this;
        }
        TabContainerSection.prototype.getInputLabelWrapById = function (id) {
            return this.inputLabelWraps.find(function (inputLabelWrap) { return inputLabelWrap.jel.attr("id") == id; });
        };
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
        TabContainerSection.prototype.getInputsFromSection = function (query) {
            if (query === void 0) { query = ""; }
            var out = [];
            this.jel.find("input" + query).each(function (index, elem) {
                out.push(new Element_3.Element($(elem)));
            });
            return out;
        };
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
            get: function () {
                return this._name;
            },
            set: function (value) {
                this._name = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TabContainerSection.prototype, "inputLabelWraps", {
            get: function () {
                return this._inputLabelWraps;
            },
            set: function (value) {
                this._inputLabelWraps = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TabContainerSection.prototype, "selectLabelWraps", {
            get: function () {
                return this._selectLabelWraps;
            },
            set: function (value) {
                this._selectLabelWraps = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TabContainerSection, "inputLabelTypes", {
            get: function () {
                return TabContainerSection._inputLabelTypes;
            },
            set: function (value) {
                TabContainerSection._inputLabelTypes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TabContainerSection, "inputLabelWrapClass", {
            get: function () {
                return TabContainerSection._inputLabelWrapClass;
            },
            set: function (value) {
                TabContainerSection._inputLabelWrapClass = value;
            },
            enumerable: true,
            configurable: true
        });
        TabContainerSection._inputLabelWrapClass = "cfw-input-wrap";
        TabContainerSection._inputLabelTypes = [
            { type: LabelType_2.LabelType.TEXT, cssClass: "cfw-text-input" },
            { type: LabelType_2.LabelType.PASSWORD, cssClass: "cfw-password-input" },
            { type: LabelType_2.LabelType.SELECT, cssClass: "cfw-select-input" }
        ];
        return TabContainerSection;
    }(Element_3.Element));
    exports.TabContainerSection = TabContainerSection;
});
define("Actions/Action", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Action = (function () {
        function Action(id, url, data) {
            this.id = id;
            this.url = url;
            this.data = data;
        }
        Action.prototype.load = function () {
            $.post(this.url.href, this.data, this.response.bind(this));
        };
        Object.defineProperty(Action.prototype, "id", {
            get: function () {
                return this._id;
            },
            set: function (value) {
                this._id = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "url", {
            get: function () {
                return this._url;
            },
            set: function (value) {
                this._url = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
            },
            enumerable: true,
            configurable: true
        });
        return Action;
    }());
    exports.Action = Action;
});
define("Decorators/ResponsePrep", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function ResponsePrep(target, propertyKey, descriptor) {
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }
        var originalMethod = descriptor.value;
        descriptor.value = function () {
            arguments[0] = JSON.parse(arguments[0]);
            return originalMethod.apply(this, arguments);
        };
        return descriptor;
    }
    exports.ResponsePrep = ResponsePrep;
});
define("Actions/AccountExistsAction", ["require", "exports", "Actions/Action", "Decorators/ResponsePrep"], function (require, exports, Action_1, ResponsePrep_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var AccountExistsAction = (function (_super) {
        __extends(AccountExistsAction, _super);
        function AccountExistsAction(id, ajaxInfo, email, ezTabContainer) {
            var _this = this;
            var data = {
                action: id,
                security: ajaxInfo.nonce,
                email: email
            };
            _this = _super.call(this, id, ajaxInfo.admin_url, data) || this;
            _this.ezTabContainer = ezTabContainer;
            return _this;
        }
        AccountExistsAction.prototype.response = function (resp) {
            var login_slide = $("#cfw-login-slide");
            var register_user_checkbox = $("#cfw-acc-register-chk")[0];
            var register_container = $("#cfw-login-details .cfw-check-input");
            if (resp.account_exists) {
                login_slide.slideDown(300);
                register_user_checkbox.checked = false;
                register_container.css("display", "none");
                AccountExistsAction.checkBox = true;
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
            get: function () {
                return this._ezTabContainer;
            },
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
        AccountExistsAction._checkBox = true;
        __decorate([
            ResponsePrep_1.ResponsePrep
        ], AccountExistsAction.prototype, "response", null);
        return AccountExistsAction;
    }(Action_1.Action));
    exports.AccountExistsAction = AccountExistsAction;
});
define("Elements/Alert", ["require", "exports", "Elements/Element"], function (require, exports, Element_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Alert = (function (_super) {
        __extends(Alert, _super);
        function Alert(alertContainer, alertInfo) {
            var _this = _super.call(this, alertContainer) || this;
            _this.alertInfo = alertInfo;
            return _this;
        }
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
            get: function () {
                return this._alertInfo;
            },
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
    }(Element_4.Element));
    exports.Alert = Alert;
});
define("Actions/LoginAction", ["require", "exports", "Actions/Action", "Elements/Alert", "Decorators/ResponsePrep"], function (require, exports, Action_2, Alert_1, ResponsePrep_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoginAction = (function (_super) {
        __extends(LoginAction, _super);
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
            ResponsePrep_2.ResponsePrep
        ], LoginAction.prototype, "response", null);
        return LoginAction;
    }(Action_2.Action));
    exports.LoginAction = LoginAction;
});
define("Elements/Cart", ["require", "exports", "Elements/Element"], function (require, exports, Element_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cart = (function (_super) {
        __extends(Cart, _super);
        function Cart(cartContainer, subTotal, shipping, taxes, total, coupons) {
            var _this = _super.call(this, cartContainer) || this;
            _this.subTotal = new Element_5.Element(subTotal);
            _this.shipping = new Element_5.Element(shipping);
            _this.taxes = new Element_5.Element(taxes);
            _this.total = new Element_5.Element(total);
            _this.coupons = new Element_5.Element(coupons);
            return _this;
        }
        Cart.outputValues = function (cart, values) {
            Cart.outputValue(cart.subTotal, values.new_subtotal);
            Cart.outputValue(cart.shipping, values.new_shipping_total);
            Cart.outputValue(cart.taxes, values.new_taxes_total);
            Cart.outputValue(cart.total, values.new_total);
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
        Cart.outputValue = function (cartLineItem, value, childClass) {
            if (childClass === void 0) { childClass = ".amount"; }
            if (cartLineItem.jel.length > 0) {
                cartLineItem.jel.children(childClass).html(value);
            }
        };
        Object.defineProperty(Cart.prototype, "subTotal", {
            get: function () {
                return this._subTotal;
            },
            set: function (value) {
                this._subTotal = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cart.prototype, "shipping", {
            get: function () {
                return this._shipping;
            },
            set: function (value) {
                this._shipping = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cart.prototype, "taxes", {
            get: function () {
                return this._taxes;
            },
            set: function (value) {
                this._taxes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cart.prototype, "total", {
            get: function () {
                return this._total;
            },
            set: function (value) {
                this._total = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Cart.prototype, "coupons", {
            get: function () {
                return this._coupons;
            },
            set: function (value) {
                this._coupons = value;
            },
            enumerable: true,
            configurable: true
        });
        return Cart;
    }(Element_5.Element));
    exports.Cart = Cart;
});
define("Actions/UpdateShippingFieldsAction", ["require", "exports", "Actions/Action", "Decorators/ResponsePrep", "Elements/Cart"], function (require, exports, Action_3, ResponsePrep_3, Cart_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpdateShippingFieldsAction = (function (_super) {
        __extends(UpdateShippingFieldsAction, _super);
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
        UpdateShippingFieldsAction.prototype.response = function (resp) {
            var _this = this;
            if (!resp.error) {
                var ufi_arr_1 = [];
                var updated_shipping_methods_1 = [];
                if (resp.updated_fields_info) {
                    Object.keys(resp.updated_fields_info).forEach(function (key) { return ufi_arr_1.push(resp.updated_fields_info[key]); });
                    Object.keys(resp.updated_ship_methods).forEach(function (key) { return updated_shipping_methods_1.push(resp.updated_ship_methods[key]); });
                    ufi_arr_1.sort();
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
                    updated_shipping_methods_1.forEach(function (ship_method) {
                        var item = $("<li>" + ship_method + "</li>");
                        $("#shipping_method").append(item);
                    });
                    this.tabContainer.setShippingPaymentUpdate(this.ajaxInfo, this.cart);
                    Cart_1.Cart.outputValues(this.cart, resp.new_totals);
                }
            }
        };
        Object.defineProperty(UpdateShippingFieldsAction.prototype, "ajaxInfo", {
            get: function () {
                return this._ajaxInfo;
            },
            set: function (value) {
                this._ajaxInfo = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateShippingFieldsAction.prototype, "tabContainer", {
            get: function () {
                return this._tabContainer;
            },
            set: function (value) {
                this._tabContainer = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateShippingFieldsAction.prototype, "cart", {
            get: function () {
                return this._cart;
            },
            set: function (value) {
                this._cart = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateShippingFieldsAction.prototype, "shipping_details_fields", {
            get: function () {
                return this._shipping_details_fields;
            },
            set: function (value) {
                this._shipping_details_fields = value;
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            ResponsePrep_3.ResponsePrep
        ], UpdateShippingFieldsAction.prototype, "response", null);
        return UpdateShippingFieldsAction;
    }(Action_3.Action));
    exports.UpdateShippingFieldsAction = UpdateShippingFieldsAction;
});
define("Actions/UpdateShippingMethodAction", ["require", "exports", "Actions/Action", "Decorators/ResponsePrep", "Elements/Cart"], function (require, exports, Action_4, ResponsePrep_4, Cart_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpdateShippingMethodAction = (function (_super) {
        __extends(UpdateShippingMethodAction, _super);
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
        UpdateShippingMethodAction.prototype.response = function (resp) {
            if (resp.new_totals) {
                Cart_2.Cart.outputValues(this.cart, resp.new_totals);
            }
        };
        Object.defineProperty(UpdateShippingMethodAction.prototype, "cart", {
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
            ResponsePrep_4.ResponsePrep
        ], UpdateShippingMethodAction.prototype, "response", null);
        return UpdateShippingMethodAction;
    }(Action_4.Action));
    exports.UpdateShippingMethodAction = UpdateShippingMethodAction;
});
define("Services/StripeService", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var StripeService = (function () {
        function StripeService() {
        }
        StripeService.setupStripeMessageListener = function (callbacks) {
            window.addEventListener("message", function (event) { return StripeService.stripeMessageListener(event, callbacks); }, { once: true });
        };
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
        StripeService.triggerStripe = function () {
            var checkoutForm = $("form.woocommerce-checkout");
            checkoutForm.trigger('checkout_place_order_stripe');
            checkoutForm.on('submit', function (event) { return event.preventDefault(); });
        };
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
        StripeService.hasStripe = function () {
            return $("#payment_method_stripe:checked").length > 0;
        };
        StripeService.hasNewPayment = function () {
            return $("#wc-stripe-payment-token-new:checked").length > 0;
        };
        Object.defineProperty(StripeService, "serviceUrls", {
            get: function () {
                return this._serviceUrls;
            },
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
});
define("Services/ValidationService", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Parsley;
    var EValidationSections;
    (function (EValidationSections) {
        EValidationSections[EValidationSections["SHIPPING"] = 0] = "SHIPPING";
        EValidationSections[EValidationSections["BILLING"] = 1] = "BILLING";
        EValidationSections[EValidationSections["ACCOUNT"] = 2] = "ACCOUNT";
    })(EValidationSections = exports.EValidationSections || (exports.EValidationSections = {}));
    var ValidationService = (function () {
        function ValidationService(tabContainer) {
            this._easyTabsOrder = [];
            this.tabContainer = tabContainer;
            this.easyTabsOrder = [$("#cfw-customer-info"), $("#cfw-shipping-method"), $("#cfw-payment-method")];
            this.setup();
        }
        ValidationService.prototype.setup = function () {
            this.setEventListeners();
            this.setStripeCacheDestroyers();
            if (window.location.hash != "#cfw-customer-info" && window.location.hash != "") {
                if (!this.validate(EValidationSections.SHIPPING)) {
                    window.location.hash = "#cfw-customer-info";
                }
            }
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
        ValidationService.prototype.setStripeCacheDestroyers = function () {
            var destroyCacheItems = ["stripe-card-number", "stripe-card-expiry", "stripe-card-cvc"];
            destroyCacheItems.forEach(function (item) {
                $("#" + item).on('keyup', function () {
                    destroyCacheItems.forEach(function (innerItem) {
                        $("#" + innerItem).garlic('destroy');
                    });
                });
            });
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
});
define("Actions/CompleteOrderAction", ["require", "exports", "Actions/Action", "Services/StripeService", "Elements/Alert", "Main", "Services/ValidationService"], function (require, exports, Action_5, StripeService_1, Alert_2, Main_1, ValidationService_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var CompleteOrderAction = (function (_super) {
        __extends(CompleteOrderAction, _super);
        function CompleteOrderAction(id, ajaxInfo, checkoutData) {
            var _this = this;
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
                    var alert = new Alert_2.Alert($("#cfw-alert-container"), alertInfo);
                    alert.addAlert();
                },
                badData: function (response) {
                    var alertInfo = {
                        type: "StripeBadDataError",
                        message: "Stripe: " + response.error.message,
                        cssClass: "cfw-alert-danger"
                    };
                    var alert = new Alert_2.Alert($("#cfw-alert-container"), alertInfo);
                    alert.addAlert();
                    _this.resetData();
                }
            };
            _this.setup();
            return _this;
        }
        CompleteOrderAction.prototype.addStripeTokenToData = function (stripeToken) {
            if (stripeToken) {
                this.data["stripe_token"] = stripeToken;
                if (!this.data["payment_method"]) {
                    this.data["payment_method"] = "stripe";
                }
            }
        };
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
        CompleteOrderAction.prototype.load = function () {
            if (!this.needsStripeToken) {
                _super.prototype.load.call(this);
            }
        };
        Object.defineProperty(CompleteOrderAction.prototype, "needsStripeToken", {
            get: function () {
                return this._needsStripeToken;
            },
            set: function (value) {
                this._needsStripeToken = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompleteOrderAction.prototype, "stripeServiceCallbacks", {
            get: function () {
                return this._stripeServiceCallbacks;
            },
            set: function (value) {
                this._stripeServiceCallbacks = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompleteOrderAction.prototype, "stripeResponse", {
            get: function () {
                return this._stripeResponse;
            },
            set: function (value) {
                this._stripeResponse = value;
            },
            enumerable: true,
            configurable: true
        });
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
                var alert_2 = new Alert_2.Alert($("#cfw-alert-container"), alertInfo);
                alert_2.addAlert();
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
    }(Action_5.Action));
    exports.CompleteOrderAction = CompleteOrderAction;
});
define("Actions/ApplyCouponAction", ["require", "exports", "Actions/Action", "Decorators/ResponsePrep", "Elements/Cart", "Elements/Alert"], function (require, exports, Action_6, ResponsePrep_5, Cart_3, Alert_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var ApplyCouponAction = (function (_super) {
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
                Cart_3.Cart.outputValues(this.cart, resp.new_totals);
            }
            if (resp.coupons) {
                var coupons = $.map(resp.coupons, function (value, index) {
                    return [value];
                });
                Cart_3.Cart.outputCoupons(this.cart.coupons, coupons);
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
            var alert = new Alert_3.Alert($("#cfw-alert-container"), alertInfo);
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
            ResponsePrep_5.ResponsePrep
        ], ApplyCouponAction.prototype, "response", null);
        return ApplyCouponAction;
    }(Action_6.Action));
    exports.ApplyCouponAction = ApplyCouponAction;
});
define("Elements/TabContainer", ["require", "exports", "Elements/Element", "Actions/AccountExistsAction", "Actions/LoginAction", "Actions/UpdateShippingFieldsAction", "Actions/UpdateShippingMethodAction", "Actions/CompleteOrderAction", "Main", "Actions/ApplyCouponAction", "Services/ValidationService"], function (require, exports, Element_6, AccountExistsAction_1, LoginAction_1, UpdateShippingFieldsAction_1, UpdateShippingMethodAction_1, CompleteOrderAction_1, Main_2, ApplyCouponAction_1, ValidationService_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabContainer = (function (_super) {
        __extends(TabContainer, _super);
        function TabContainer(jel, tabContainerBreadcrumb, tabContainerSections) {
            var _this = _super.call(this, jel) || this;
            _this._sendOrder = false;
            _this.tabContainerBreadcrumb = tabContainerBreadcrumb;
            _this.tabContainerSections = tabContainerSections;
            return _this;
        }
        TabContainer.prototype.setAccountCheckListener = function (ajaxInfo) {
            var _this = this;
            var customer_info = this.tabContainerSectionBy("name", "customer_info");
            var email_input_wrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
            if (email_input_wrap) {
                var email_input_1 = email_input_wrap.holder.jel;
                var reg_email = $("#cfw-acc-register-chk");
                new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val(), this.jel).load();
                var handler = function () { return new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val(), _this.jel).load(); };
                email_input_1.on("keyup", handler);
                email_input_1.on("change", handler);
                reg_email.on('change', handler);
                var onLoadAccCheck = new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val(), this.jel);
                onLoadAccCheck.load();
            }
        };
        TabContainer.prototype.setLogInListener = function (ajaxInfo) {
            var customer_info = this.tabContainerSectionBy("name", "customer_info");
            var email_input_wrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
            if (email_input_wrap) {
                var email_input_2 = email_input_wrap.holder.jel;
                var password_input_wrap = customer_info.getInputLabelWrapById("cfw-password-wrap");
                var password_input_1 = password_input_wrap.holder.jel;
                var login_btn = $("#cfw-login-btn");
                login_btn.on("click", function () { return new LoginAction_1.LoginAction("login", ajaxInfo, email_input_2.val(), password_input_1.val()).load(); });
            }
        };
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
            var form_wraps = $("#wc-stripe-cc-form .form-row");
            $("#wc-stripe-cc-form").wrapInner("<div class='cfw-sg-container cfw-input-wrap-row'>");
            $("#wc-stripe-cc-form").find(".clear").remove();
            form_wraps.each(function (index, elem) {
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
        };
        TabContainer.prototype.setUpPaymentTabRadioButtons = function () {
            var payment_radio_buttons = this
                .tabContainerSectionBy("name", "payment_method")
                .getInputsFromSection('[type="radio"][name="payment_method"]');
            var shipping_same_radio_buttons = this
                .tabContainerSectionBy("name", "payment_method")
                .getInputsFromSection('[type="radio"][name="shipping_same"]');
            this.setRevealOnRadioButtonGroup(payment_radio_buttons);
            this.setRevealOnRadioButtonGroup(shipping_same_radio_buttons, true);
        };
        TabContainer.prototype.setRevealOnRadioButtonGroup = function (radio_buttons, remove_add_required) {
            if (remove_add_required === void 0) { remove_add_required = false; }
            var slideUpAndDownContainers = function (rb) {
                radio_buttons
                    .filter(function (filterItem) { return filterItem != rb; })
                    .forEach(function (other) { return other.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideUp(300); });
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
            radio_buttons
                .forEach(function (rb) {
                rb.jel.on('click', function () {
                    slideUpAndDownContainers(rb);
                });
                if (rb.jel.is(":checked")) {
                    slideUpAndDownContainers(rb);
                }
            });
        };
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
            var showCartDetails = new Element_6.Element($("#cfw-show-cart-details"));
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
                _wp_http_referer: _wp_http_referer
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
            var completeOrderButton = new Element_6.Element($("#cfw-complete-order-button"));
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
                    createOrder = Main_2.Main.instance.validationService.validate(ValidationService_2.EValidationSections.BILLING);
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
        TabContainer.prototype.easyTabs = function () {
            this.jel.easytabs();
        };
        TabContainer.prototype.tabContainerSectionBy = function (by, value) {
            return this.tabContainerSections.find(function (tabContainerSection) { return tabContainerSection[by] == value; });
        };
        Object.defineProperty(TabContainer.prototype, "tabContainerBreadcrumb", {
            get: function () {
                return this._tabContainerBreadcrumb;
            },
            set: function (value) {
                this._tabContainerBreadcrumb = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TabContainer.prototype, "tabContainerSections", {
            get: function () {
                return this._tabContainerSections;
            },
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
    }(Element_6.Element));
    exports.TabContainer = TabContainer;
});
define("Main", ["require", "exports", "Services/ValidationService"], function (require, exports, ValidationService_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = (function () {
        function Main(tabContainer, ajaxInfo, cart, settings) {
            this.tabContainer = tabContainer;
            this.ajaxInfo = ajaxInfo;
            this.cart = cart;
            this.settings = settings;
            this.validationService = new ValidationService_3.ValidationService(tabContainer);
            Main.instance = this;
        }
        Main.prototype.setup = function () {
            this.tabContainer.easyTabs();
            this.setupAnimationListeners();
            this.tabContainer.setUpCreditCardFields();
            this.tabContainer.tabContainerSections.forEach(function (tcs) { return tcs.setWraps(); });
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
            this.tabContainer.setShippingFieldsOnLoad();
        };
        Main.prototype.setupAnimationListeners = function () {
            $("#cfw-ci-login").on("click", function () {
                $("#cfw-login-slide").slideDown(300);
            });
        };
        Object.defineProperty(Main.prototype, "tabContainer", {
            get: function () {
                return this._tabContainer;
            },
            set: function (value) {
                this._tabContainer = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Main.prototype, "ajaxInfo", {
            get: function () {
                return this._ajaxInfo;
            },
            set: function (value) {
                this._ajaxInfo = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Main.prototype, "cart", {
            get: function () {
                return this._cart;
            },
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
});

//# sourceMappingURL=checkout-woocommerce-front.js.map
