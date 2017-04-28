function CFW_Main(tabContainer, tabContainerBreadcrumb, tabContainerSections) {
	this._tabContainer = tabContainer;
	this._tabContainerBreadcrumb = tabContainerBreadcrumb;
	this._tabContainerSections = tabContainerSections;
}

CFW_Main.prototype.setup = function() {
	// Setup easy tabs
	this._tabContainer.easytabs();

	var callbacks = [
		this.initializeInputLabels.bind(this),
		this.addKeyUpListenersToInputs.bind(this)
	];

	this.setupInputListeners(callbacks);
	this.setupAnimationListeners();
};

CFW_Main.prototype.initializeInputLabels = function(input_wrap, label_class, type, inputs) {
	inputs.each(function(index, input){

		var parent = $(input_wrap);

		$(window).on("load", function(){
			if(input.value !== "" && !parent.hasClass(label_class)) {
				parent.addClass(label_class);
				console.log("..");
			}

			if(input.value === "" && parent.hasClass(label_class)) {
				parent.removeClass(label_class);
				console.log("...");
			}
		});
	});
};

CFW_Main.prototype.addKeyUpListenersToInputs = function(input_wrap, label_class, type, inputs) {
	inputs.each(function(index, input){

		// self.addRemoveLabelClass(parent, label_class);
		input.addEventListener("keyup", function(){
			var parent = $(input_wrap);

			if(this.value !== "" && !parent.hasClass(label_class)) {
				parent.addClass(label_class);
			}

			if(this.value === "" && parent.hasClass(label_class)) {
				parent.removeClass(label_class);
			}
		});
	});
};

CFW_Main.prototype.getInputWraps = function() {
	var ci = this._tabContainerSections.customer_info;
	var ci_input_wraps = ci.find('.cfw-input-wrap.cfw-text-input, .cfw-input-wrap.cfw-password-input');

	return ci_input_wraps;
};

CFW_Main.prototype.setupInputListeners = function(callbacks) {

	var types = ["text", "password"];
	var ci_input_wraps = this.getInputWraps();
	var label_class = "cfw-floating-label";

	ci_input_wraps.each(function(index, input_wrap) {

		types.forEach(function(type){

			var inputs = $(input_wrap).find('input[type="' + type + '"]');

			callbacks.forEach(function(cb) {
				cb(input_wrap, label_class, type, inputs);
			});
		});
	})
};

CFW_Main.prototype.setupAnimationListeners = function() {
	$("#cfw-ci-login").on("click", function(){
		$("#cfw-login-slide").slideDown(300);
	})
};