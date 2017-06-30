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
        LabelType[LabelType["PASSWORD"] = 1] = "PASSWORD";
        LabelType[LabelType["SELECT"] = 2] = "SELECT";
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
        return FormElement;
    }(Element_2.Element));
    FormElement._labelClass = "cfw-floating-label";
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
            _this.setWraps();
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
        return TabContainerSection;
    }(Element_3.Element));
    TabContainerSection._inputLabelWrapClass = "cfw-input-wrap";
    TabContainerSection._inputLabelTypes = [
        { type: LabelType_2.LabelType.TEXT, cssClass: "cfw-text-input" },
        { type: LabelType_2.LabelType.PASSWORD, cssClass: "cfw-password-input" },
        { type: LabelType_2.LabelType.SELECT, cssClass: "cfw-select-input" }
    ];
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
            if (resp.account_exists) {
                this.ezTabContainer.bind('easytabs:after', function () {
                    if (resp.account_exists) {
                        $("#cfw-login-slide").slideDown(300);
                        $("#cfw-login-slide input[type='password']").focus();
                        $("#cfw-acc-register-chk").attr('checked', null);
                    }
                });
                $("#cfw-login-slide").slideDown(300);
                $("#cfw-login-slide input[type='password']").focus();
                $("#cfw-acc-register-chk").attr('checked', null);
                this.ezTabContainer.easytabs('select', '#cfw-customer-info');
            }
            else {
                $("#cfw-login-slide").slideUp(300);
                $("#cfw-acc-register-chk").attr('checked', '');
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
        return AccountExistsAction;
    }(Action_1.Action));
    __decorate([
        ResponsePrep_1.ResponsePrep
    ], AccountExistsAction.prototype, "response", null);
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
            this.jel.find(".message").html(this.alertInfo.message);
            this.jel.addClass(this.alertInfo.cssClass);
            this.jel.slideDown(300);
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
        return Alert;
    }(Element_4.Element));
    exports.Alert = Alert;
});
define("Actions/LoginAction", ["require", "exports", "Actions/Action", "Elements/Alert", "Decorators/ResponsePrep", "Enums/AlertType"], function (require, exports, Action_2, Alert_1, ResponsePrep_2, AlertType_1) {
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
                    type: AlertType_1.AlertType.LoginFailBadAccInfo,
                    message: resp.message,
                    cssClass: "cfw-alert-danger"
                };
                var alert_1 = new Alert_1.Alert($("#cfw-alert-container"), alertInfo);
                alert_1.addAlert();
            }
        };
        return LoginAction;
    }(Action_2.Action));
    __decorate([
        ResponsePrep_2.ResponsePrep
    ], LoginAction.prototype, "response", null);
    exports.LoginAction = LoginAction;
});
define("Elements/Cart", ["require", "exports", "Elements/Element"], function (require, exports, Element_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Cart = (function (_super) {
        __extends(Cart, _super);
        function Cart(cartContainer, subTotal, shipping, taxes, total) {
            var _this = _super.call(this, cartContainer) || this;
            _this.subTotal = new Element_5.Element(subTotal);
            _this.shipping = new Element_5.Element(shipping);
            _this.taxes = new Element_5.Element(taxes);
            _this.total = new Element_5.Element(total);
            return _this;
        }
        Cart.outputValues = function (cart, values) {
            Cart.outputValue(cart.subTotal, values.new_subtotal);
            Cart.outputValue(cart.shipping, values.new_shipping_total);
            Cart.outputValue(cart.taxes, values.new_taxes_total);
            Cart.outputValue(cart.total, values.new_total);
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
        return UpdateShippingFieldsAction;
    }(Action_3.Action));
    __decorate([
        ResponsePrep_3.ResponsePrep
    ], UpdateShippingFieldsAction.prototype, "response", null);
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
                console.log(resp);
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
        return UpdateShippingMethodAction;
    }(Action_4.Action));
    __decorate([
        ResponsePrep_4.ResponsePrep
    ], UpdateShippingMethodAction.prototype, "response", null);
    exports.UpdateShippingMethodAction = UpdateShippingMethodAction;
});
define("Elements/TabContainer", ["require", "exports", "Elements/Element", "Actions/AccountExistsAction", "Actions/LoginAction", "Actions/UpdateShippingFieldsAction", "Actions/UpdateShippingMethodAction"], function (require, exports, Element_6, AccountExistsAction_1, LoginAction_1, UpdateShippingFieldsAction_1, UpdateShippingMethodAction_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabContainer = (function (_super) {
        __extends(TabContainer, _super);
        function TabContainer(jel, tabContainerBreadcrumb, tabContainerSections) {
            var _this = _super.call(this, jel) || this;
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
                new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val(), this.jel).load();
                email_input_1.on("keyup", function () { return new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val(), _this.jel).load(); });
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
        TabContainer.prototype.setUpPaymentTabRadioButtons = function () {
            var payment_radio_buttons = this
                .tabContainerSectionBy("name", "payment_method")
                .getInputsFromSection('[type="radio"][name="payment_method"]');
            var shipping_same_radio_buttons = this
                .tabContainerSectionBy("name", "payment_method")
                .getInputsFromSection('[type="radio"][name="shipping_same"]');
            this.setRevealOnRadioButtonGroup(payment_radio_buttons);
            this.setRevealOnRadioButtonGroup(shipping_same_radio_buttons);
        };
        TabContainer.prototype.setRevealOnRadioButtonGroup = function (radio_buttons) {
            var slideUpAndDownContainers = function (rb) {
                radio_buttons
                    .filter(function (filterItem) { return filterItem != rb; })
                    .forEach(function (other) { return other.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideUp(300); });
                rb.jel.parents(".cfw-radio-reveal-title-wrap").siblings(".cfw-radio-reveal-content-wrap").slideDown(300);
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
        TabContainer.genericUpdateShippingFieldsActionProcess = function (fe, value, ajaxInfo, action, shipping_details_fields, cart, tabContainer) {
            var type = fe.holder.jel.attr("field_key");
            var cdi = { field_type: type, field_value: value };
            return new UpdateShippingFieldsAction_1.UpdateShippingFieldsAction(action, ajaxInfo, [cdi], shipping_details_fields, cart, tabContainer);
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
        return TabContainer;
    }(Element_6.Element));
    exports.TabContainer = TabContainer;
});
define("Main", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = (function () {
        function Main(tabContainer, ajaxInfo, cart) {
            this.tabContainer = tabContainer;
            this.ajaxInfo = ajaxInfo;
            this.cart = cart;
        }
        Main.prototype.setup = function () {
            this.tabContainer.easyTabs();
            this.setupAnimationListeners();
            this.tabContainer.setAccountCheckListener(this.ajaxInfo);
            this.tabContainer.setLogInListener(this.ajaxInfo);
            this.tabContainer.setUpdateShippingFieldsListener(this.ajaxInfo, this.cart);
            this.tabContainer.setUpdateAllShippingFieldsListener(this.ajaxInfo, this.cart);
            this.tabContainer.setShippingPaymentUpdate(this.ajaxInfo, this.cart);
            this.tabContainer.setUpPaymentTabRadioButtons();
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
        return Main;
    }());
    exports.Main = Main;
});

//# sourceMappingURL=checkout-woocommerce-front.js.map
