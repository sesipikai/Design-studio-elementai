sap.designstudio.sdk.Component.subclass("com.sba.investicijosmulti.Investicijosmulti", function() {
	
	var that = this;
	var canvas = undefined;
	var chart_ID = "";
	
	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
	};

	this.afterUpdate = function() {
		drawInvesticjos();
	};

	function drawInvesticjos(){
		var remove = d3.select("#id"+chart_ID.substring(4, 20)).remove();
		canvas = d3.select(that.$()[0]).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
		var width = that.$().outerWidth(true);
		var height = that.$().outerHeight(true);
		
		var a_height = height; //y
		var a_width = width;
		var x_offset = 0; 
		var y_offset = 0;
		
		var flatData = {}; //Isplokstinta struktura							
		var options = org_scn_community_databound.initializeOptions(); //parinktys
		options.ignoreResults = true;
		flatData = org_scn_community_databound.flatten(chart_data, options); //funkcija kuri isplokstina mano resultSet			
		var length = flatData.geometry.rowLength; //elementu kiekis / 2
		var headers = flatData.rowHeaders; // Labels
		var otherLength = flatData.geometry.colLength; // kiek stulpeliu
		var otherHeaders = flatData.columnHeaders;  // stulpeliu pavadinimai
		var data = flatData.values; //reiksmiu masyvas 
		var noi = headers.length;
		var faktas = [];
		var biudzetas = [];
		var projektai = [];
		
		for (var i = 0; i < noi; i++) {
			projektai[i] = headers[i];
			faktas[i] = data[i][0];
			biudzetas[i] = data[i][1];
		}
		
		var min = 0; //bindalbe
		var max = 5000; //bindable

		x_offset = a_width*0.025;
		a_width = a_width*0.85;
		a_height = a_height*0.75;
		
		

		var x = d3.scale.linear()
					.domain([min, max])
					.range([0, a_width]);	
		
		var scale_size = a_height/noi;
		var grazus = d3.format(",4n");
		var procentas = d3.format(",%");
		if (noi > 1 ) {
			var tarpas = scale_size+height*0.2/(noi-1);
		} else {
			var tarpas = scale_size+height*0.2;
		}
		
		//Biudzetas
		for (var i = 0; i < noi; i++) {
			
		max = Math.ceil(d3.max([faktas[i], biudzetas[i]])/5000)*5000;
		
		x = d3.scale.linear()
			.domain([min, max])
			.range([0, a_width]);
		
		canvas.append("rect")
			.attr("fill", "rgb(230,230,230)")
			.attr("width", x(biudzetas[i]))
			.attr("height", scale_size/5)
			.attr("y", scale_size/5*2.5+tarpas*i)
			.attr("transform", "translate("+x_offset+","+y_offset+")")
			.attr("x", x(0));
			
		canvas.append("text")
			.attr("class", "text_heading")
			.attr("x",x(biudzetas[i]))
			.attr("y",(scale_size/5-5)+tarpas*i)
			.attr("text-anchor", "middle")
			.attr("transform", "translate("+x_offset+","+y_offset+")")
			.text("Biudžetas");
		
		canvas.append("text")
			.attr("class", "text_title")
			.attr("x",x(0))
			.attr("y",(scale_size/5*2)+tarpas*i)
			.attr("text-anchor", "left")
			.attr("transform", "translate("+x_offset+","+y_offset+")")
			.text(projektai[i]);
			
		canvas.append("text")
			.attr("class", "text_heading")
			.attr("x",x(biudzetas[i]))
			.attr("y",(scale_size/5+10)+tarpas*i)
			.attr("text-anchor", "middle")
			.attr("transform", "translate("+x_offset+","+y_offset+")")
			.text(grazus(Math.round(biudzetas[i]/1000))+"t EUR");
			
		canvas.append("line")
			.style("stroke-dasharray", ("1, 1"))
			.style("stroke-opacity", 0.9)
			.style("stroke", "rgb(230,230,230)")
			.attr("x1",x(biudzetas[i]))
			.attr("y1",(scale_size/5*3)+tarpas*i)
			.attr("x2",x(biudzetas[i]))
			.attr("y2",(scale_size/5*2)+tarpas*i)
			.attr("transform", "translate("+x_offset+","+y_offset+")");
						
		//Faktas
		
		canvas.append("rect")
			.attr("fill", "rgb(102,201,215)")
			.attr("width", x(faktas[i]))
			.attr("height", scale_size/5)
			.attr("y", (scale_size/5*2.5)+tarpas*i)
			.attr("transform", "translate("+x_offset+","+y_offset+")")
			.attr("x", x(0));
		
		canvas.append("text")
			.attr("x",x(faktas[i]))
			.attr("class", "text_heading")
			.attr("y",(scale_size-5)+tarpas*i)
			.attr("text-anchor", "middle")
			.attr("transform", "translate("+x_offset+","+y_offset+")")
			.text("Įsisavinimas "+procentas(faktas[i]/biudzetas[i]));
		
		canvas.append("text")
			.attr("x",x(faktas[i]))
			.attr("class", "text_heading")
			.attr("y",(scale_size+10)+tarpas*i)
			.attr("text-anchor", "middle")
			.attr("transform", "translate("+x_offset+","+y_offset+")")
			.text(grazus(Math.round(faktas[i]/1000))+"t EUR");
			
		canvas.append("line")
			.style("stroke-dasharray", ("1, 1"))
			.style("stroke-opacity", 0.9)
            .style("stroke", "rgb(102,201,215)")
			.attr("x1",x(faktas[i]))
			.attr("y1",(scale_size/5*3)+tarpas*i)
			.attr("x2",x(faktas[i]))
			.attr("y2",(scale_size/5*4)+tarpas*i)
			.attr("transform", "translate("+x_offset+","+y_offset+")");
		}
	}

	this.data = function(value) {
		if (value === undefined) {
			return chart_data;
		} else {
			chart_data = value;
			return this;
		}
	};
	

});
