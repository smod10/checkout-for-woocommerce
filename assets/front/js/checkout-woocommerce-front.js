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
define("Elements/Element", ["require", "exports"], function (require, exports) {
    "use strict";
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
    "use strict";
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
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LabelType;
    (function (LabelType) {
        LabelType[LabelType["TEXT"] = 0] = "TEXT";
        LabelType[LabelType["PASSWORD"] = 1] = "PASSWORD";
    })(LabelType = exports.LabelType || (exports.LabelType = {}));
});
define("Types/Types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("Elements/InputLabelWrap", ["require", "exports", "Elements/Element", "Enums/LabelType"], function (require, exports, Element_2, LabelType_1) {
    "use strict";
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
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabContainerSection = (function (_super) {
        __extends(TabContainerSection, _super);
        function TabContainerSection(jel, name, inputLabelWrapClass, inputLabelTypes) {
            if (inputLabelWrapClass === void 0) { inputLabelWrapClass = "cfw-input-wrap"; }
            if (inputLabelTypes === void 0) { inputLabelTypes = [
                { type: LabelType_2.LabelType.TEXT, cssClass: "cfw-text-input" },
                { type: LabelType_2.LabelType.PASSWORD, cssClass: "cfw-password-input" }
            ]; }
            var _this = _super.call(this, jel) || this;
            _this._name = "";
            _this._inputLabelWrapClass = "";
            _this._inputLabelTypes = [];
            _this._inputLabelWraps = [];
            _this.name = name;
            _this.inputLabelWrapClass = inputLabelWrapClass;
            _this.inputLabelTypes = inputLabelTypes;
            _this.setInputLabelWraps();
            return _this;
        }
        TabContainerSection.prototype.getInputLabelWrapSelector = function () {
            var _this = this;
            var selector = "";
            this.inputLabelTypes.forEach(function (labelType, index) {
                selector += "." + _this.inputLabelWrapClass + "." + labelType.cssClass;
                if (index + 1 != _this.inputLabelTypes.length) {
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
        Object.defineProperty(TabContainerSection.prototype, "inputLabelTypes", {
            get: function () {
                return this._inputLabelTypes;
            },
            set: function (value) {
                this._inputLabelTypes = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TabContainerSection.prototype, "inputLabelWrapClass", {
            get: function () {
                return this._inputLabelWrapClass;
            },
            set: function (value) {
                this._inputLabelWrapClass = value;
            },
            enumerable: true,
            configurable: true
        });
        return TabContainerSection;
    }(Element_3.Element));
    exports.TabContainerSection = TabContainerSection;
});
define("Elements/TabContainer", ["require", "exports", "Elements/Element"], function (require, exports, Element_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabContainer = (function (_super) {
        __extends(TabContainer, _super);
        function TabContainer(jel, tabContainerBreadcrumb, tabContainerSections) {
            var _this = _super.call(this, jel) || this;
            _this.tabContainerBreadcrumb = tabContainerBreadcrumb;
            _this.tabContainerSections = tabContainerSections;
            return _this;
        }
        TabContainer.prototype.easyTabs = function () {
            this.jel.easytabs();
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
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = (function () {
        function Main(tabContainer) {
            this.tabContainer = tabContainer;
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
        return Main;
    }());
    exports.Main = Main;
});

//# sourceMappingURL=checkout-woocommerce-front.js.map
