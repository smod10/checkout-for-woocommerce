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
define("Elements/FormElement", ["require", "exports", "Elements/Element"], function (require, exports, Element_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var FormElement = (function (_super) {
        __extends(FormElement, _super);
        function FormElement(jel) {
            var _this = _super.call(this, jel) || this;
            _this._eventCallbacks = [];
            return _this;
        }
        FormElement.prototype.wrapClassSwap = function (value) {
            if (value !== "" && !this.jel.hasClass(FormElement.labelClass)) {
                this.jel.addClass(FormElement.labelClass);
            }
            if (value === "" && this.jel.hasClass(FormElement.labelClass)) {
                this.jel.removeClass(FormElement.labelClass);
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
        return FormElement;
    }(Element_2.Element));
    FormElement._labelClass = "cfw-floating-label";
    exports.FormElement = FormElement;
});
define("Elements/InputLabelWrap", ["require", "exports", "Elements/Element", "Enums/LabelType", "Elements/FormElement"], function (require, exports, Element_3, LabelType_1, FormElement_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var InputLabelWrap = (function (_super) {
        __extends(InputLabelWrap, _super);
        function InputLabelWrap(jel) {
            var _this = _super.call(this, jel) || this;
            _this.setInputAndLabel();
            _this.eventCallbacks = [
                { eventName: "keyup", func: function () {
                        this.wrapClassSwap(this.input.jel.val());
                    }.bind(_this), target: null }
            ];
            _this.registerEventCallbacks();
            _this.wrapClassSwap(_this.input.jel.val());
            return _this;
        }
        InputLabelWrap.prototype.registerEventCallbacks = function () {
            var _this = this;
            if (this.input) {
                this.eventCallbacks.forEach(function (eventCb) {
                    var eventName = eventCb.eventName;
                    var cb = eventCb.func;
                    var target = eventCb.target;
                    if (!target) {
                        target = _this.input.jel;
                    }
                    target.on(eventName, cb);
                });
            }
        };
        InputLabelWrap.prototype.setInputAndLabel = function () {
            var lt = $.map(LabelType_1.LabelType, function (value, index) {
                return [value];
            });
            for (var i = 0; i < lt.length / 2; i++) {
                var type = lt[i].toLowerCase();
                var tjel = this.jel.find('input[type="' + type + '"]');
                if (tjel.length > 0) {
                    this.input = new Element_3.Element(tjel);
                }
            }
        };
        Object.defineProperty(InputLabelWrap.prototype, "input", {
            get: function () {
                return this._input;
            },
            set: function (value) {
                this._input = value;
            },
            enumerable: true,
            configurable: true
        });
        return InputLabelWrap;
    }(FormElement_1.FormElement));
    exports.InputLabelWrap = InputLabelWrap;
});
define("Elements/SelectLabelWrap", ["require", "exports", "Elements/Element", "Enums/LabelType", "Elements/FormElement"], function (require, exports, Element_4, LabelType_2, FormElement_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectLabelWrap = (function (_super) {
        __extends(SelectLabelWrap, _super);
        function SelectLabelWrap(jel) {
            var _this = _super.call(this, jel) || this;
            _this.setSelectAndLabel();
            _this.eventCallbacks = [
                { eventName: "change", func: function () {
                        this.wrapClassSwap(this.select.jel.val());
                    }.bind(_this), target: null },
                { eventName: "keyup", func: function () {
                        this.wrapClassSwap(this.select.jel.val());
                    }.bind(_this), target: null }
            ];
            _this.registerEventCallbacks();
            _this.wrapClassSwap(_this.select.jel.val());
            return _this;
        }
        SelectLabelWrap.prototype.registerEventCallbacks = function () {
            var _this = this;
            if (this.select) {
                this.eventCallbacks.forEach(function (eventCb) {
                    var eventName = eventCb.eventName;
                    var cb = eventCb.func;
                    var target = eventCb.target;
                    if (!target) {
                        target = _this.select.jel;
                    }
                    target.on(eventName, cb);
                });
            }
        };
        SelectLabelWrap.prototype.setSelectAndLabel = function () {
            var lt = $.map(LabelType_2.LabelType, function (value, index) {
                return [value];
            });
            for (var i = 0; i < lt.length / 2; i++) {
                var type = lt[i].toLowerCase();
                var tjel = this.jel.find('select');
                if (tjel.length > 0) {
                    this.select = new Element_4.Element(tjel);
                }
            }
        };
        Object.defineProperty(SelectLabelWrap.prototype, "select", {
            get: function () {
                return this._select;
            },
            set: function (value) {
                this._select = value;
            },
            enumerable: true,
            configurable: true
        });
        return SelectLabelWrap;
    }(FormElement_2.FormElement));
    exports.SelectLabelWrap = SelectLabelWrap;
});
define("Elements/TabContainerSection", ["require", "exports", "Elements/Element", "Elements/InputLabelWrap", "Enums/LabelType", "Elements/SelectLabelWrap"], function (require, exports, Element_5, InputLabelWrap_1, LabelType_3, SelectLabelWrap_1) {
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
        TabContainerSection.prototype.setWraps = function () {
            var inputLabelWraps = [];
            var selectLabelWraps = [];
            var jLabelWrap = this.jel.find(this.getWrapSelector());
            jLabelWrap.each(function (index, wrap) {
                if ($(wrap).hasClass("cfw-select-input")) {
                    selectLabelWraps.push(new SelectLabelWrap_1.SelectLabelWrap($(wrap)));
                }
                else {
                    inputLabelWraps.push(new InputLabelWrap_1.InputLabelWrap($(wrap)));
                }
            });
            this.inputLabelWraps = inputLabelWraps;
            this.selectLabelWraps = selectLabelWraps;
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
    }(Element_5.Element));
    TabContainerSection._inputLabelWrapClass = "cfw-input-wrap";
    TabContainerSection._inputLabelTypes = [
        { type: LabelType_3.LabelType.TEXT, cssClass: "cfw-text-input" },
        { type: LabelType_3.LabelType.PASSWORD, cssClass: "cfw-password-input" },
        { type: LabelType_3.LabelType.SELECT, cssClass: "cfw-select-input" }
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
            $.post(this.url.href, this.data, this.response);
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
        function AccountExistsAction(id, ajaxInfo, email) {
            var _this = this;
            var data = {
                action: id,
                security: ajaxInfo.nonce,
                email: email
            };
            _this = _super.call(this, id, ajaxInfo.admin_url, data) || this;
            return _this;
        }
        AccountExistsAction.prototype.response = function (resp) {
            if (resp.account_exists) {
                $("#cfw-login-slide").slideDown(300);
                $("#cfw-login-slide input[type='password']").focus();
                $("#cfw-acc-register-chk").attr('checked', null);
            }
            else {
                $("#cfw-login-slide").slideUp(300);
                $("#cfw-acc-register-chk").attr('checked', '');
            }
        };
        return AccountExistsAction;
    }(Action_1.Action));
    __decorate([
        ResponsePrep_1.ResponsePrep
    ], AccountExistsAction.prototype, "response", null);
    exports.AccountExistsAction = AccountExistsAction;
});
define("Elements/Alert", ["require", "exports", "Elements/Element"], function (require, exports, Element_6) {
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
    }(Element_6.Element));
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
define("Elements/TabContainer", ["require", "exports", "Elements/Element", "Actions/AccountExistsAction", "Actions/LoginAction"], function (require, exports, Element_7, AccountExistsAction_1, LoginAction_1) {
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
            var customer_info = this.tabContainerSectionBy("name", "customer_info");
            var email_input_wrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
            if (email_input_wrap) {
                var email_input_1 = email_input_wrap.input.jel;
                new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val()).load();
                email_input_1.on("keyup", function () { return new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input_1.val()).load(); });
            }
        };
        TabContainer.prototype.setLogInListener = function (ajaxInfo) {
            var customer_info = this.tabContainerSectionBy("name", "customer_info");
            var email_input_wrap = customer_info.getInputLabelWrapById("cfw-email-wrap");
            if (email_input_wrap) {
                var email_input_2 = email_input_wrap.input.jel;
                var password_input_wrap = customer_info.getInputLabelWrapById("cfw-password-wrap");
                var password_input_1 = password_input_wrap.input.jel;
                var login_btn = $("#cfw-login-btn");
                login_btn.on("click", function () { return new LoginAction_1.LoginAction("login", ajaxInfo, email_input_2.val(), password_input_1.val()).load(); });
            }
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
    }(Element_7.Element));
    exports.TabContainer = TabContainer;
});
define("Main", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = (function () {
        function Main(tabContainer, ajaxInfo) {
            this.tabContainer = tabContainer;
            this.ajaxInfo = ajaxInfo;
        }
        Main.prototype.setup = function () {
            this.tabContainer.easyTabs();
            this.setupAnimationListeners();
            this.tabContainer.setAccountCheckListener(this.ajaxInfo);
            this.tabContainer.setLogInListener(this.ajaxInfo);
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
        return Main;
    }());
    exports.Main = Main;
});

//# sourceMappingURL=checkout-woocommerce-front.js.map
