define(["css!../css/component.css","sap/designstudio/sdk/component"], function(css, Component) {
Component.subclass("com.sba.barchart.Barchart", function() {
	
	var that = this;
	var canvas = undefined;
	var chart_ID = "";
	var chart_data;
	var meta_data; 
	var cssstyle; 
	var chart_title_visible;
	var chart_title; 
	var chart_title_css;
	var label_css; 
	var data_labels_visible; 
	var data_labels_css;
	var data_labels_scaling; 
	var data_labels_format; 
	var data_labels_suffix; 
	var data_labels_xOffset; 
	var bars_css_front;
	var bars_css_back; 
	var d3_xaxis_format; 
	var x_offset_manual_left; 
	var x_offset_manual_right; 
	var y_offset_manual_top; 
	var y_offset_manual_bottom; 
	var show_bubbles;
	var axis_size;
	var y_axis_font_size;
	var show_bubbles_labels;
	var alert_a_p;
	var fill_red;
	var fill_green;
	var fill_yellow;
	var bubble_fill_green;
	var bubble_fill_yellow;
	var data_label_size;
	var tooltip_faktas;
	var tooltip_planas;
	var remove;
	var width;
	var height;
	var flatData = {};
	var options;
	var length;
	var headers = [];
	var otherLength;
	var otherHeaders = [];
	var data;
	var values = [];
	var new_lenght;
	var max_fact_value;
	var max_label_length;
	var max_label_text;
	var max_label_pixels_w;
	var max_label_pixels_h ;
	var make_data_labels_format;
	var max_data_label_length;
	var max_data_label;
	var max_data_label_pixels_w;
	var max_data_label_pixels_h;
	var empty_label;
	var empty_label_length;
	var tip_format_number;
	var tip_format_proc;		
	var max_bubble_data_label_length;
	var max_bubble_data_label;
	var max_bubble_data_label_pixels_w;
	var max_bubble_data_label_pixels_h;
	var dezute;
	var deletedezute;
	var Xoffset;
	var Yoffset;
	var storulis;
	var barsize;
	var barsizep;
	var skipsize;	
	var skipsizep;
	var bubblesOffset;
	var maxd;
	var mind; 	
	var x; 
    var maximalus_ilgis;
    var nominalus_ilgis;
	var Xaxis_format;		
	var bc_Xaxis;
	var tip_format_number;
	var tip_format_proc;
	var tip;
	var bars;
	var labels;
	var bubbles;
	var empty_label_length_w;
	var empty_label_length_h;
	var tooltip_number;
	var tooltip_proc;
	
	this._poller = null;
	this._pollInterval = 250;
	this._previosWidth = -1;
	this._previousHeight = -1;
	this._naudojamas_ugis = 100;
	this._naudojamas_plotis = 100;
	
	this.measureSize = function(that) {
		var currentWidth = that.$().innerWidth();
		var currentHeight = that.$().innerHeight();
		if(currentWidth != that._previousWidth || currentHeight != that._previousHeight){
			// If width or height has changed since the last calculation, redraw.
					// Debug alert:
					//alert("Resize detected.\n\nOld:" + that._previousWidth + " x " + that._previousHeight + 
					//		"\n\nNew:" + currentWidth + " x " + currentHeight);
					//
			that._previousHeight = currentHeight;
			that._previousWidth = currentWidth;	
			that._naudojamas_ugis = currentHeight;
			that._naudojamas_plotis = currentWidth;	
			this.drawBarChart();
		}else{
			// Sizes are the same.  Don't redraw, but poll again after an interval.
			that._poller = window.setTimeout(function(){that.measureSize(that)},that._pollInterval);	
		}	
	};
	
	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		//canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
		//this.$().append( "<div id='MANODIV' style='width:100%;height:100%;'>"); //sukuriam savo DIV grafikui
	};

	this.afterUpdate = function() {	
		this.drawBarChart();
	};

	this.drawBarChart = function(){
		if(chart_data && chart_data.data) { //jei turim duomenu
			
			remove = d3.select("#id"+chart_ID.substring(4, 20)).remove();
			canvas = d3.select(that.$()[0]).append("svg:svg")
						.attr("id","id"+chart_ID.substring(4, 20))
						.attr("width", that._naudojamas_plotis)
						.attr("height", that._naudojamas_ugis)
						.append("g");
			
			canvas.transition().duration(250);
			//alert(""+that._naudojamas_plotis + " / " + that._naudojamas_ugis);
			width = that._naudojamas_plotis;
			height = that._naudojamas_ugis;
			flatData = {}; //Isplokstinta struktura				
			options = org_scn_community_databound.initializeOptions(); //parinktys
			options.ignoreResults = true;
			flatData = org_scn_community_databound.flatten(chart_data, options); //funkcija kuri isplokstina mano resultSet
			length = flatData.geometry.rowLength; //elementu kiekis / 2
			headers = flatData.rowHeaders; // Labels
			otherLength = flatData.geometry.colLength; // kiek stulpeliu
			otherHeaders = flatData.columnHeaders;  // stulpeliu pavadinimai
			data = flatData.values; //reiksmiu masyvas 
			values = []; //naujas 1 x n masyvas
			new_length = 0; //naujo masyvo ilgis
			
			for (var i = 0; i < length; i++) { //planines reiksmes
				values[new_length] = data[i][1];
				new_length++;
			}
			
			max_fact_value = 0;
			for (var i = 0; i < length; i++){ //faktines reiksmes
				values[new_length] = data[i][0];
				new_length++;
				if (data[i][0] > max_fact_value) {
					max_fact_value = data[i][0]; 
				}
			}
			
			
			//Apskaiciuojame Y asies atitraukima

			empty_label = "";
			empty_label_length_w = 0;
			empty_label_length_w = 0;
			max_label_pixels_w = 0;
			max_label_pixels_h = 0;
			max_label_length = 0;
			for (var i = 0; i < length; i++){
				empty_label = headers[i];
				dezute = canvas.append("text")
				.attr("id","Dezute")
				.attr("class", "bc_labels")
				.attr("fill", "black")
				.attr("font-size", y_axis_font_size+"px")
				.attr("text-anchor","end")
				.attr("dy", ".35em")
				.attr("y", 100)
				.text(empty_label)
				.attr("transform", "translate("+100+","+100+")");
				empty_label_length_w = dezute[0][0].getBBox().width;
				empty_label_length_h = dezute[0][0].getBBox().height;
				deletedezute = d3.select("#Dezute").remove();
				if (empty_label_length_w > max_label_length){
					max_label_pixels_w = Math.ceil(empty_label_length_w/5)*5;
					max_label_pixels_h = empty_label_length_h;
					max_label_length = empty_label_length_w;
				}
			}
	
			
			//Apskaiciuojame max data nepriklausomai nuo to bus jis naudojamas ar ne
			
			make_data_labels_format = d3.format(data_labels_format);
			max_data_label_length = 0;
			max_data_label = "";
			max_data_label_pixels_w = 0;
			max_data_label_pixels_h = 0;
			empty_label = "";
			empty_label_length = 0;
			empty_label_pixels_w = 0;
			empty_label_pixels_h = 0;
			if (data_labels_visible) {
				for (var i = 0; i < length; i++){
					empty_label = (make_data_labels_format(values[length+i]/data_labels_scaling)+data_labels_suffix)+"";
					dezute = canvas.append("text")
					.attr("id","Dezute")
					.attr("class", "bc_labels")
					.attr("fill", "black")
					.attr("font-size", data_label_size+"px")
					.attr("text-anchor","end")
					.attr("dy", ".35em")
					.attr("y", 100)
					.text(empty_label)
					.attr("transform", "translate("+100+","+100+")");
					empty_label_pixels_w = dezute[0][0].getBBox().width;
					empty_label_pixels_h = dezute[0][0].getBBox().height;
					deletedezute = d3.select("#Dezute").remove();
					if ( empty_label_pixels_w > max_data_label_length) {
						max_data_label = empty_label;
						max_data_label_pixels_w = Math.ceil(empty_label_pixels_w/5)*5;
						max_data_label_pixels_h = empty_label_pixels_h;
						max_data_label_length = empty_label_pixels_w;				
					}
				}
			}
			

			//burbuliuku data labels
			tip_format_number = d3.format(tooltip_number);
			tip_format_proc = d3.format(tooltip_proc);	
			max_bubble_data_label_length = 0;
			empty_label = "";
			empty_label_length_w = 0;
			empty_label_length_h = 0;
			max_bubble_data_label_pixels_w = 0;
			max_bubble_data_label_pixels_h = 0;
			
			if (show_bubbles_labels) {
				for (var i = 0; i < length; i++){
					if (alert_a_p == "P") {
						if (values[i] == 0 ) {
							empty_label = "++";
						} else {
							empty_label = tip_format_proc(values[i+length]/values[i])+"";
							empty_label_length = empty_label.length;
						}
					} else {
						empty_label = Math.round((values[i+length]-values[i])*1000)/10+"p.p.";
						empty_label_length = empty_label.length;
					}
					dezute = canvas.append("text")
					.attr("id","Dezute")
					.attr("class", "bc_labels")
					.attr("fill", "black")
					.attr("font-size", data_label_size+"px")
					.attr("text-anchor","end")
					.attr("dy", ".35em")
					.attr("y", 100)
					.text(empty_label)
					.attr("transform", "translate("+100+","+100+")");
					empty_label_pixels_w = dezute[0][0].getBBox().width;
					empty_label_pixels_h = dezute[0][0].getBBox().height;
					deletedezute = d3.select("#Dezute").remove();
					
					if ( empty_label_pixels_w > max_bubble_data_label_length) {
						max_bubble_data_label_length = empty_label_pixels_w;
						max_bubble_data_label = empty_label;
						max_bubble_data_label_pixels_w = Math.ceil(empty_label_pixels_w/5)*5;
						max_bubble_data_label_pixels_h = empty_label_pixels_h;	
					}
				}
			}
			
			empty_label = "";
			empty_label_length_w = 0;
			empty_label_length_h = 0;
			Xoffset = 0;
			
			Xoffset = max_label_pixels_w + x_offset_manual_left;
			Yoffset = 0;
			
			//reiksmes stulpeliams
			
			storulis = (height-axis_size)/(new_length/2);
			barsize = storulis*0.7;
			barsizep = barsize*0.6;
			skipsize = storulis*0.15;	
			skipsizep = (barsize-barsizep)/2;
			Xoffset = Xoffset + skipsize;		
			bubblesOffset = 0;
			
			if (show_bubbles){
				bubblesOffset = storulis+max_bubble_data_label_pixels_w;
			}
			
			//Chart title on/off
			
			if (chart_title_visible){
				Yoffset = 15 + y_offset_manual_top;						//make room for title by shifting everything down	
			}			
			
			//X intervalu apskaiciavimas
			
			maxd = d3.max([0, d3.max(values)]); // max value
			mind = d3.min([0, d3.min(values)]); // min value		
			
			x = d3.scale.linear()
					.domain([mind, maxd]) //reiksmiu intervalas
					.range([0 , width-Xoffset-x_offset_manual_right-bubblesOffset]).nice(); //atvaizdavimo intervalas
			
			maximalus_ilgis = x(max_fact_value)+max_data_label_pixels_w;
			nominalus_ilgis = width-Xoffset-x_offset_manual_right-bubblesOffset;
			
			if (maximalus_ilgis > nominalus_ilgis) {
				x = d3.scale.linear()
					.domain([mind, maxd]) //reiksmiu intervalas
					.range([0 , nominalus_ilgis - (maximalus_ilgis - nominalus_ilgis)]).nice();
				nominalus_ilgis = nominalus_ilgis - (maximalus_ilgis - nominalus_ilgis);
			}
			// X asis
			Xaxis_format = d3.format(d3_xaxis_format);		
			bc_Xaxis = d3.svg.axis()
						.ticks(5)
						.tickFormat(function(d) {return Xaxis_format(d);})
						.scale(x);
			//stulpeliai
			
			tip_format_number = d3.format(tooltip_number);
			tip_format_proc = d3.format(tooltip_proc);
			tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d ,i) {
						var Kas = "";
						var procentas = 1;
						var Faktas = 0;
						var Planas = 0;
						var spalva = "green";
						if (i<=length-1){
							Kas = headers[i];
							Faktas = values[i+length];
							Planas = values[i];
						} else {
							Kas = headers[i-length];
							Faktas = values[i];
							Planas = values[i-length];
						}
						if (Planas!=0){
							procentas = Faktas/Planas;
						} else {
							procentas=0;
						}
						if (Faktas < Planas) {
							spalva = "red";
						}
						
						var return_string = "";
						if (alert_a_p == "P" ) {
							return_string = "<b>"+Kas+"</b></br>" +
							tooltip_faktas + ": <b>"+tip_format_number(Faktas)+"</b></br>" +
							tooltip_planas +": <b>"+tip_format_number(Planas)+"</b></br>" +
							tooltip_faktas + " - " + tooltip_planas + ": <b><font color='"+spalva+"'>"+tip_format_number(Faktas-Planas)+"</font></b></br>" +
							"Plano vykdymas: <b><font color='"+spalva+"'>"+tip_format_proc(procentas)+"</font></b></br>";
						} else {
							return_string = "<b>"+Kas+"</b></br>" +
							tooltip_faktas + ": <b>"+tip_format_number(Faktas)+"</b></br>" +
							tooltip_planas +": <b>"+tip_format_number(Planas)+"</b></br>" +
							tooltip_faktas + " - " + tooltip_planas + ": <b><font color='"+spalva+"'>"+tip_format_number(Faktas-Planas)+"</font></b></br>";
						}
						return 	return_string;
					});
			
			bars = canvas.selectAll("rect") 
				.data(values)
				.enter()
					.append("rect")
							.attr("style",function(d,i){
								var style="";
								if(i <= length - 1) {
									style = bars_css_back;
								} else {style = bars_css_front;}
								return style;	
							})
							.attr("width", function(d) {return Math.abs(x(d)- x(0)); })
							.attr("height", function(d,i) {
								var returnh;
								if (i <= length-1) {returnh = barsize;}
								else {returnh = barsizep;}
								return returnh; })
							.attr("y", function(d, i) { 
								var returni;
								if (i <= length-1) {returni = skipsize + i*storulis;}
								else {returni = (i-length)*storulis+skipsizep+skipsize;}
								return returni; })
							.on('mouseover', tip.show)
							.on('mouseout', tip.hide)
							.attr("x", function(d) {
								var poz_x = x(0);
								if (d < 0) {
									poz_x = x(0)-Math.abs(x(d)- x(0));
								}
								return poz_x;
							})
							.attr("transform", "translate("+Xoffset+","+Yoffset+")");
			
			//pavadinimai
			
			labels = canvas.selectAll("text")
							.data(headers)
							.enter()
								.append("text")
								.attr("class", "bc_labels")
								.attr("fill", "black")
								.attr("font-size", y_axis_font_size+"px")
								.attr("text-anchor","end")
								.attr("dy", storulis/2+max_label_pixels_h/4+"px")
								.attr("y", function(d, i) { return i*storulis; })
								.text(function(d) { return d;})
								.attr("transform", "translate("+max_label_pixels_w+","+Yoffset+")");
			
			//data labels start
			
			//
			

		
			
			if (data_labels_visible) {
				for (var i = 0; i < length; i++){
					canvas.append("g")
						.append("text")
						.attr("class", "bc_labels")
						.attr("font-size", data_label_size+"px")
						.attr("y", i*storulis)
						.attr("x", function() {
							var xp = x(values[length+i]);
								if(values[length+i] < 0) {
									xp = x(0)-Math.abs(x(values[length+i])- x(0));
								}
							return xp;
						})
						.attr("text-anchor", function(){
							var ta = "start";
							if(values[length+i] < 0) {
								ta = "end";
							}
							return ta;
						})
						.attr("dy",  storulis/2+max_label_pixels_h/4+"px")
						.attr("dx", function() {
							var dx = ""+data_labels_xOffset;
							if (values[length+i] < 0){
								dx = ""+(-1*data_labels_xOffset);
							}
							return dx;
						})
						.text(make_data_labels_format(values[length+i]/data_labels_scaling)+data_labels_suffix)
						.attr("transform", "translate("+Xoffset+","+Yoffset+")");
				}
			}
			
			
			canvas.append("g")
				.attr("class", "bc_axis")
				.call(bc_Xaxis)
				.attr("transform", "translate("+Xoffset+","+(height-axis_size)+")");
			
			canvas.call(tip);
			
			canvas.append("g")
				.attr("class", "bc_y_axis")
				.append("line")
					.attr("x1",x(0))
					.attr("x2",x(0))
					.attr("y2",(height-axis_size))
					.attr("transform", "translate("+Xoffset+","+Yoffset+")");
		}
		
		//Append bubbles

		if (show_bubbles){
			bubbles = canvas.selectAll("circles")
							.data(headers)
							.enter()
									.append("circle")
										.attr("cx",0)
										.attr("cy", function (d, i) { return (i*storulis + storulis/2);})
										.attr("r",barsizep/2)
										.attr("fill", function(d,i){
											var fill;
											if(alert_a_p == "P") {
												if (values[i]!=0){
													if(values[i+length]/values[i]>=bubble_fill_green){
														fill = fill_green;
													} else {
														if (values[i+length]/values[i]>=bubble_fill_yellow){
															fill=fill_yellow;
														} else {
															fill=fill_red;
														}
													}
												} else{
													fill = fill_green;
												}
											} else {
												if (values[i+length]-values[i] >= bubble_fill_green) {
													fill = fill_green;
												} else {
													if (values[i+length]-values[i] >= bubble_fill_yellow) {
														fill = fill_yellow;
													} else {
														fill = fill_red;
													}
												}
											}
											return fill;
										})
										.attr("transform", "translate("+(width-storulis/2-max_bubble_data_label_pixels_w)+","+Yoffset+")");
				if (show_bubbles_labels) {
					for (var i = 0; i < length; i++){
						canvas.append("g")
							.append("text")
							.attr("class", "bc_labels")
							.attr("font-size", data_label_size)
							.attr("y", i*storulis)
							.attr("x", width-max_bubble_data_label_pixels_w)
							.attr("text-anchor", "start")
							.attr("dy",  storulis/2+max_label_pixels_h/4+"px")
							.attr("dx", 0)
							.text(function () {
								var text = "-";
								if (alert_a_p == "P") {
									if (values[i] == 0 ) {
										text = "++";
									} else {
										text = tip_format_proc(values[i+length]/values[i])+"";
									}
								} else {
									text = Math.round((values[i+length]-values[i])*1000)/10+"p.p.";
								}
								return text;
							})
						.attr("transform", "translate(0,"+Yoffset+")");
					}
				}
				
		}
		
		if (chart_title_visible){						
			canvas.append("g")					//Append chart_title
				.attr("class", "bc_Chart_title")
				.append("text")
					.attr("x",0)
					.attr("y",Yoffset-1)
					.attr("style",chart_title_css)
					.text(chart_title);
		}
		
		this._poller = window.setTimeout(function(){that.measureSize(that)},that._pollInterval);		
	};

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
	
	this.css = function(value) {
		if(value === undefined) {
			return cssstyle;
		} else {
			cssstyle = value;
			return this;
		}
	};
	
	this.charttitlevisible = function(value) {
		if(value === undefined) {
			return chart_title_visible;
		} else {
			chart_title_visible = value;
			return this;
		}
	};
	
	this.charttitle = function(value) {
		if(value === undefined) {
			return chart_title;
		} else {
			chart_title = value;
			return this;
		}
	};
	
	this.charttitlecss = function(value) {
		if(value === undefined) {
			return chart_title_css;
		} else {
			chart_title_css = value;
			return this;
		}
	};
	
	this.labelcss = function(value) {
		if(value === undefined) {
			return label_css;
		} else {
			label_css = value;
			return this;
		}
	};
	
	this.datalabelsvisible = function(value) {
		if(value === undefined) {
			return data_labels_visible;
		} else {
			data_labels_visible = value;
			return this;
		}
	};
	
	this.datalabelscss = function(value) {
		if(value === undefined) {
			return data_labels_css;
		} else {
			data_labels_css = value;
			return this;
		}
	};
	
	this.datalabelsscaling = function(value) {
		if(value === undefined) {
			return data_labels_scaling;
		} else {
			data_labels_scaling = value;
			return this;
		}
	};
	
	this.datalabelsformat = function(value) {
		if(value === undefined) {
			return data_labels_format;
		} else {
			data_labels_format = value;
			return this;
		}
	};
	
	this.datalabelssuffix = function(value) {
		if(value === undefined) {
			return data_labels_suffix;
		} else {
			data_labels_suffix = value;
			return this;
		}
	};
	
	this.datalabelsxOffset = function(value) {
		if(value === undefined) {
			return data_labels_xOffset;
		} else {
			data_labels_xOffset = value;
			return this;
		}
	};
	
	this.barscssfront = function(value) {
		if(value === undefined) {
			return bars_css_front;
		} else {
			bars_css_front = value;
			return this;
		}
	};
	
	this.barscssback = function(value) {
		if(value === undefined) {
			return bars_css_back;
		} else {
			bars_css_back = value;
			return this;
		}
	};
	
	this.d3xaxisformat = function(value) {
		if(value === undefined) {
			return d3_xaxis_format;
		} else {
			d3_xaxis_format = value;
			return this;
		}
	};
	
	this.xoffsetmanualleft = function(value) {
		if(value === undefined) {
			return x_offset_manual_left;
		} else {
			x_offset_manual_left = value;
			return this;
		}
	};
	
	this.xoffsetmanualright = function(value) {
		if(value === undefined) {
			return x_offset_manual_right;
		} else {
			x_offset_manual_right = value;
			return this;
		}
	};
	
	this.yoffsetmanualtop = function(value) {
		if(value === undefined) {
			return y_offset_manual_top;
		} else {
			y_offset_manual_top = value;
			return this;
		}
	};
	
	this.yoffsetmanualbottom = function(value) {
		if(value === undefined) {
			return y_offset_manual_bottom;
		} else {
			y_offset_manual_bottom = value;
			return this;
		}
	};
	
	this.showbubbles = function(value) {
		if(value === undefined) {
			return show_bubbles;
		} else {
			show_bubbles = value;
			return this;
		}
	};
	
	this.showbubbleslabels = function(value) {
		if(value === undefined) {
			return show_bubbles_labels;
		} else {
			show_bubbles_labels = value;
			return this;
		}
	};
	
	this.axissize = function(value) {
		if(value === undefined) {
			return axis_size;
		} else {
			axis_size = value;
			return this;
		}
	};
	
	this.yaxisfontsize = function(value) {
		if(value === undefined) {
			return y_axis_font_size;
		} else {
			y_axis_font_size = value;
			return this;
		}
	};
	
	this.alertap = function(value) {
		if(value === undefined) {
			return alert_a_p;
		} else {
			alert_a_p = value;
			return this;
		}
	};
	
	this.bubblefillgreen = function(value) {
		if(value === undefined) {
			return bubble_fill_green;
		} else {
			bubble_fill_green = value;
			return this;
		}
	};
	
	this.bubblefillyellow = function(value) {
		if(value === undefined) {
			return bubble_fill_yellow;
		} else {
			bubble_fill_yellow = value;
			return this;
		}
	};
	
	this.fillred = function(value) {
		if(value === undefined) {
			return fill_red;
		} else {
			fill_red = value;
			return this;
		}
	};
	
	this.fillgreen = function(value) {
		if(value === undefined) {
			return fill_green;
		} else {
			fill_green = value;
			return this;
		}
	};
	
	this.fillyellow = function(value) {
		if(value === undefined) {
			return fill_yellow;
		} else {
			fill_yellow = value;
			return this;
		}
	};
	
	
	this.datalabelsize = function(value) {
		if(value === undefined) {
			return data_label_size;
		} else {
			data_label_size = value;
			return this;
		}
	};
	this.tooltipfaktas = function(value) {
		if(value === undefined) {
			return tooltip_faktas;
		} else {
			tooltip_faktas = value;
			return this;
		}
	};
	this.tooltipplanas = function(value) {
		if(value === undefined) {
			return tooltip_planas;
		} else {
			tooltip_planas = value;
			return this;
		}
	};
	this.tooltipnumber = function(value) {
		if(value === undefined) {
			return tooltip_number;
		} else {
			tooltip_number = value;
			return this;
		}
	};
	this.tooltipproc = function(value) {
		if(value === undefined) {
			return tooltip_proc;
		} else {
			tooltip_proc = value;
			return this;
		}
	};

});
});
