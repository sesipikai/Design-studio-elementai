sap.designstudio.sdk.PropertyPage.subclass("com.sba.barchart.BarchartPropertyPage",  function() {

	var that = this;

	this.init = function() {
		$("#form").submit(function() {
			that.firePropertiesChanged(["Title"]);
			return false;
		});
	};

	this.color = function(value) {
		if (value === undefined) {
			return $("#chart_title").val();
		}
		else {
			$("#chart_title").val(value);
			return this;
		}
	};
});