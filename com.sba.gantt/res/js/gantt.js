sap.designstudio.sdk.Component.subclass("com.sba.gantt.Gantt", function() {
	
	var that = this;
	var canvas = undefined;
	var chart_ID = "";
	
	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
		//this.$().append( "<div id='MANODIV' style='width:100%;height:100%;'>"); //sukuriam savo DIV grafikui
	};

	this.afterUpdate = function() {
		
		drawGanntChart();
	};

	function drawGanntChart(){
		if(chart_data && chart_data.data) { //jei turim duomenu
			
			var remove = d3.select("#id"+chart_ID.substring(4, 20)).remove();
			canvas = d3.select(that.$()[0]).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
			
			var width = that.$().outerWidth(true);
			var height = that.$().outerHeight(true);
			
			var flatData = {}; //Isplokstinta struktura				
			
			var options = org_scn_community_databound.initializeOptions(); //parinktys
			options.ignoreResults = true;
			flatData = org_scn_community_databound.flatten(chart_data, options); //funkcija kuri isplokstina mano resultSet
			var rowHeaders2D = flatData.rowHeaders2D;
			var length = flatData.geometry.rowLength; //elementu kiekis / 2
			var headers = flatData.rowHeaders; // Labels
			var otherLength = flatData.geometry.colLength; // kiek stulpeliu
			var otherHeaders = flatData.columnHeaders;  // stulpeliu pavadinimai
			var kiekiai = flatData.values; //reiksmiu masyvas 
			var values = []; //naujas 1 x n masyvas
			var new_length = 0; //naujo masyvo ilgis
			var format = d3.time.format("%Y-%m-%d %H:%M:%S");
			var kiekiai = [];
			var gaminiai = [];
			var datos = [];
			var day = "2016-01-01 ";
			var time = "";
			var data ="";
			for(var i = 0; i<length; i++){
				//kiekiai[i] = data[i];
				time = headers[i].substring(0,headers[i].indexOf("|")-1);
				gaminiai[i] = headers[i].substring(headers[i].indexOf("|")+1);
				data = day+time;
				datos[i] = format.parse(data);
			}
			
			var padding = 5;
			var G_gaminiai = d3.set(gaminiai).values();
			var unikalios_reiksmes = G_gaminiai.length;
			
			//var datos = [new Date("2016-01-01 00:01:05"), new Date("2016-01-01 03:01:06"), new Date("2016-01-01 07:59:13"),new Date("2016-01-01 18:06:05")];
			var G_A = [];
			var G_T = [];
			var G_K = [];
			var G_S = [];
			var G_G = [];
			G_S[0] = format.parse("2016-01-01 00:00:00");
			G_A[0] = G_gaminiai.indexOf(gaminiai[0]);
			G_G[0] = datos[0];
			var ilgis = G_gaminiai[0].length;
			var ilgis_i = 0;
			for(var i=1; i < length; i++){
				G_A[i] = G_gaminiai.indexOf(gaminiai[i]);
				G_S[i] = G_G[i-1];
				G_G[i] = datos[i];
				var einamas_ilgis = gaminiai[i].length;
				if (einamas_ilgis > ilgis) {
					ilgis = gaminiai[i].length;
					ilgis_i = i;
				}
			}
			var bar_height = (height-padding*2)/((unikalios_reiksmes*2-1));
			var text = canvas.append("g")
				.append("text")
				.attr("class", "t_heading")
				.attr("font-size",bar_height/2)
				.attr("x", 100)
				.attr("y", 100)
				.text(gaminiai[ilgis_i]);
			
			
			var label_ilgis = text.node().getBBox().width+5;
			var label_aukstis = text.node().getBBox().height;
			d3.selectAll("text").remove();
			var d_min = "2016-01-01 00:00:00";
			var date_max = datos[length-1];
			var date_min = format.parse(d_min);
			
			var xScale = d3.time.scale()
					.domain([date_min,date_max])
					.range([0, width-padding*3-label_ilgis]);
					
			var yScale = d3.scale.linear()
						.domain([0, unikalios_reiksmes-0.5])
						.range([0, height-padding*2-label_aukstis*2-14]);	

					
			var xAxis = d3.svg.axis()
	            .orient("bottom")
				.tickFormat(d3.time.format("%H%"))
				.ticks(d3.time.minute, 360)
	            .scale(xScale);
				
			var yAxis =d3.svg.axis()
				.orient("left")
				.scale(yScale);	
			
			var tip = d3.tip()
							.attr('class', 'd3-tip')
							.offset(function(d,i) {
								var Indeksas = d3.select(this).attr('id');
								if ( G_A[Indeksas] != 0 ) {
									return [-10, 0];
								}else {
									return [bar_height*3, 0];
								}
								})
							.html(function(d ,i) {
								var Indeksas = d3.select(this).attr('id');
								var true_indeksas = +Indeksas;
								var reiksme = flatData.values[true_indeksas];
								var Kas = "";
								return "<b>"+gaminiai[true_indeksas]+"</br>Pagamintas kiekis: </b>"+reiksme+"</br>";
										
			});
			
			for(var i=0; i<length-1; i++) {
					if((G_A[i] != G_A[i+1]) && pagaliukai_visible ) {
					canvas.append("g")
					.append("line")
					.attr("x1",xScale(G_G[i]))
					.attr("y1", function(d) {
						if (G_A[i]<G_A[i+1]) {
							return yScale(G_A[i])+bar_height;
						} else {
							return yScale(G_A[i]);
						}
					})
					.attr("x2",xScale(G_G[i]))
					.attr("y2",function(d) {
						if (G_A[i]<G_A[i+1]) {
							return yScale(G_A[i+1]);
						} else {
							return yScale(G_A[i+1])+bar_height;
						}
					})
					.attr("stroke-width", 0.25)
					.attr("stroke", "black")
					.style("stroke-dasharray", ("2, 2"))
					.attr("transform", "translate("+(padding*2+label_ilgis)+","+padding+")");
					}
			}									
			for (var i = 0; i < length; i++){
			canvas.append("g")
					.append("rect")
					.attr("id", ""+i)
					.attr("x", xScale(G_S[i]))
					.attr("y", yScale(G_A[i]))
					.attr("fill", bar_spalva)
					.on('mouseover', tip.show)
					.on('mouseout', tip.hide)
					.attr("width", xScale(G_G[i])-xScale(G_S[i]))
					.attr("height", bar_height)
					.attr("transform", "translate("+(padding*2+label_ilgis)+","+padding+")");
			
			if ( i < unikalios_reiksmes ) {
				canvas.append("g")
						.append("text")
						.attr("class","t_heading")
						.attr("x", label_ilgis)
						.attr("y", yScale(i))
						.attr("font-size", bar_height/2)
						.attr("text-anchor", "end")
						.attr("dy", bar_height*0.7)
						.text(G_gaminiai[i])
						.attr("transform", "translate("+padding+","+padding+")");				
			}
			}
			
			canvas.call(tip);

			
			
			canvas.append("g")
					.attr("transform", "translate("+(padding*2+label_ilgis)+","+(height-padding*2-label_aukstis)+")")
					.attr("class", "axis")
					.call(xAxis);
			
			canvas.selectAll(".axis text")
					.attr("font-size", bar_height/3);

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
	
	this.metadata = function(value) {
		if (value === undefined) {
			return meta_data;
		} else {
			meta_data = value;
			return this;
		}
	};
	
	
	this.pagaliukaivisible = function(value) {
		if(value === undefined) {
			return pagaliukai_visible;
		} else {
			pagaliukai_visible = value;
			return this;
		}
	};
	
	this.barspalva = function(value) {
		if(value === undefined) {
			return bar_spalva;
		} else {
			bar_spalva = value;
			return this;
		}
	};
	
	this.horizontallabelsize = function(value) {
		if(value === undefined) {
			return horizontal_label_size;
		} else {
			horizontal_label_size = value;
			return this;
		}
	};
	
	this.axislabelsize = function(value) {
		if(value === undefined) {
			return axis_label_size;
		} else {
			axis_label_size = value;
			return this;
		}
	};
	

});
