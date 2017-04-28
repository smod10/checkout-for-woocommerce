function CFW_Main(tabContainer, tabContainerBreadcrumb, tabContainerSections) {
	this._tabContainer = tabContainer;
	this._tabContainerBreadcrumb = tabContainerBreadcrumb;
	this._tabContainerSections = tabContainerSections;
}

CFW_Main.prototype.setup = function() {
	// Setup easy tabs
	this._tabContainer.easytabs();
	this.setupInputListeners();
	this.setupAnimationListeners();
};

CFW_Main.prototype.addRemoveLabelClass = function(parent, label_class){

	if(this.value !== "" && !parent.hasClass(label_class)) {
		parent.addClass(label_class);
	}

	if(this.value === "" && parent.hasClass(label_class)) {
		parent.removeClass(label_class);
	}
};

CFW_Main.prototype.setupInputListeners = function() {
	var ci = this._tabContainerSections.customer_info;
	var types = ["text", "password"];
	var ci_input_wraps = ci.find('.cfw-input-wrap.cfw-text-input, .cfw-input-wrap.cfw-password-input');
	var label_class = "cfw-floating-label";
	var self = this;

	ci_input_wraps.each(function(index, input_wrap) {

		types.forEach(function(type){

			var inputs = $(input_wrap).find('input[type="' + type + '"]');

			inputs.each(function(index, input){
				var parent = $(input_wrap);

				self.addRemoveLabelClass(parent, label_class);

				input.addEventListener("keyup", function(){
					self.addRemoveLabelClass(parent, label_class);
				});
			});
		});
	})
};

CFW_Main.prototype.setupAnimationListeners = function() {
	$("#cfw-ci-login").on("click", function(){
		$("#cfw-login-slide").slideDown(300);
	})
};