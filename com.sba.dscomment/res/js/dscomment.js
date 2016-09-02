import java.sql.Conncetion;

sap.designstudio.sdk.Component.subclass("com.sba.dscomment.DScomment", function() {
	
	var that = this;
	var canvas = undefined;
	var chart_ID = "";
	
	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
	};

	this.afterUpdate = function() {
		drawDSComment();
	};

	function drawDSComment(){
			var remove = d3.select("#id"+chart_ID.substring(4, 20)).remove();
			canvas = d3.select(that.$()[0]).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
			var width = that.$().outerWidth(true);
			var height = that.$().outerHeight(true);
			canvas.append("text")
					.attr("x","10")
					.attr("y","10")
					.text("Sedi");
			
			//Class.forName("net.sourceforge.jtds.jdbc.Driver").newInstance(); 
			var con = java.sql.DriverManager.getConnection("jdbc:jtds:sqlserver://10.19.156.28:60608;","bo","bo");
			var read = "SELECT * FROM bo.BoKomentarai WHERE Menesis=201604 AND Komentaras_ID=1";
			var s = con.createStatement();
			var rs =  s.executeQuery(read);
			canvas.append("text")
			.attr("x","20")
			.attr("y","20")
			.text( rs.getString("Komentaras_ID"));
	}
});
