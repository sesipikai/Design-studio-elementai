sap.designstudio.sdk.Component.subclass("com.sba.hover.Hover", function() {

	var that = this;

	this.init = function() {
		this.$().addClass("HoverBox");
		this.$().click(function() {
			that.fireEvent("onclick");
		});
		this.$().mouseover(function(){
			that.fireEvent("mouseover");
		});
	};

	this.color = function(value) {
		if (value === undefined) {
			return this.$().css("background-color");
		} else {
			this.$().css("background-color", value);
			return this;
		}
	};
	
	this.opacity = function(value) {
		if (value === undefined) {
			return this.$().css("opacity");
		} else {
			this.$().css("opacity", value);
			return this;
		}
	};
	
});