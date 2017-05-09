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
    })(LabelType = exports.LabelType || (exports.LabelType = {}));
});
define("Types/Types", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Elements/InputLabelWrap", ["require", "exports", "Elements/Element", "Enums/LabelType"], function (require, exports, Element_2, LabelType_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var InputLabelWrap = (function (_super) {
        __extends(InputLabelWrap, _super);
        function InputLabelWrap(jel, eventCallbacks) {
            if (eventCallbacks === void 0) { eventCallbacks = []; }
            var _this = _super.call(this, jel) || this;
            _this.eventCallbacks = [
                { eventName: "keyup", func: _this.wrapClassSwap.bind(_this), target: null }
            ];
            _this.setInputAndLabel();
            _this.wrapClassSwap();
            return _this;
        }
        InputLabelWrap.prototype.wrapClassSwap = function () {
            if (this.input.jel.val() !== "" && !this.jel.hasClass(InputLabelWrap.labelClass)) {
                this.jel.addClass(InputLabelWrap.labelClass);
            }
            if (this.input.jel.val() === "" && this.jel.hasClass(InputLabelWrap.labelClass)) {
                this.jel.removeClass(InputLabelWrap.labelClass);
            }
        };
        InputLabelWrap.prototype.setInputAndLabel = function () {
            var _this = this;
            var lt = $.map(LabelType_1.LabelType, function (value, index) {
                return [value];
            });
            for (var i = 0; i < lt.length / 2; i++) {
                var type = lt[i].toLowerCase();
                var tjel = this.jel.find('input[type="' + type + '"]');
                if (tjel.length > 0) {
                    this.input = new Element_2.Element(tjel);
                }
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
            }
        };
        Object.defineProperty(InputLabelWrap, "labelClass", {
            get: function () {
                return InputLabelWrap._labelClass;
            },
            set: function (value) {
                InputLabelWrap._labelClass = value;
            },
            enumerable: true,
            configurable: true
        });
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
        Object.defineProperty(InputLabelWrap.prototype, "eventCallbacks", {
            get: function () {
                return this._eventCallbacks;
            },
            set: function (value) {
                this._eventCallbacks = value;
            },
            enumerable: true,
            configurable: true
        });
        return InputLabelWrap;
    }(Element_2.Element));
    InputLabelWrap._labelClass = "cfw-floating-label";
    exports.InputLabelWrap = InputLabelWrap;
});
define("Elements/TabContainerSection", ["require", "exports", "Elements/Element", "Elements/InputLabelWrap", "Enums/LabelType"], function (require, exports, Element_3, InputLabelWrap_1, LabelType_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabContainerSection = (function (_super) {
        __extends(TabContainerSection, _super);
        function TabContainerSection(jel, name) {
            var _this = _super.call(this, jel) || this;
            _this._name = "";
            _this._inputLabelWraps = [];
            _this.name = name;
            _this.setInputLabelWraps();
            return _this;
        }
        TabContainerSection.prototype.getInputLabelWrapById = function (id) {
            return this.inputLabelWraps.find(function (inputLabelWrap) { return inputLabelWrap.jel.attr("id") == id; });
        };
        TabContainerSection.prototype.getInputLabelWrapSelector = function () {
            var selector = "";
            TabContainerSection.inputLabelTypes.forEach(function (labelType, index) {
                selector += "." + TabContainerSection.inputLabelWrapClass + "." + labelType.cssClass;
                if (index + 1 != TabContainerSection.inputLabelTypes.length) {
                    selector += ", ";
                }
            });
            return selector;
        };
        TabContainerSection.prototype.setInputLabelWraps = function () {
            var inputLabelWraps = [];
            var jInputLabelWraps = this.jel.find(this.getInputLabelWrapSelector());
            jInputLabelWraps.each(function (index, wrap) {
                inputLabelWraps.push(new InputLabelWrap_1.InputLabelWrap($(wrap)));
            });
            this.inputLabelWraps = inputLabelWraps;
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
        { type: LabelType_2.LabelType.PASSWORD, cssClass: "cfw-password-input" }
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
            this.load();
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
define("Elements/TabContainer", ["require", "exports", "Elements/Element", "Actions/AccountExistsAction"], function (require, exports, Element_4, AccountExistsAction_1) {
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
            var email_input = email_input_wrap.input.jel;
            var onLoadAea = new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input.val());
            email_input.on("keyup", function () { return new AccountExistsAction_1.AccountExistsAction("account_exists", ajaxInfo, email_input.val()); });
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
    }(Element_4.Element));
    exports.TabContainer = TabContainer;
});
define("Main", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = (function () {
        function Main(tabContainer, ajaxInfo) {
            this.tabContainer = tabContainer;
            this.ajaxInfo = ajaxInfo;
            this.tabContainer.setAccountCheckListener(this.ajaxInfo);
        }
        Main.prototype.setup = function () {
            this.tabContainer.easyTabs();
            this.setupAnimationListeners();
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
