define(["css!../css/component.css","sap/designstudio/sdk/component"], function(css, Component) {
Component.subclass("com.sba.calendar.Calendar", function() {
	
	var that = this;
	var canvas = undefined;
	var chart_ID = "";
	var chart_data;
	var meta_data; 
	var cssstyle; 
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
	
	this._poller = null;
	this._pollInterval = 250;
	this._previosWidth = -1;
	this._previousHeight = -1;
	this._naudojamas_ugis = 100;
	this._naudojamas_plotis = 100;
	
	var font_size = 12;
	var tip;
	var date_format_string;
	var menesiai_l = ["Sausis","Vasaris","Kovas","Balandis","Gegužė","Birželis","Liepa","Rugpjūtis","Rugsėjis","Spalis","Lapkritis","GRUODIS"];
	var savaites_dienos = ["PIR","ANT","TRE","KET","PEN","ŠES","SEK"];
	var savaites = ["W1","W2","W3","W52","W19"];
	var Yoffset;
	var Xoffset;
	var Menindeksas;
	var Metai;
	var ar_savaites_rodomos = false;
	var box_w;
	var box_h;
	var stulpelis;
	var skyriklis;
	var men_dienu_sk;
	var pirma_diena;
	var dienu_masyvas = [];
	var duomenu_masyvas = [];
	var labels_masyvas = [];
	var color_min = "red";
	var color_middle = "white";
	var color_max = "green";
	var min = "";
	var max = "";
	var middle = "";
	var use_auto_range;
	var use_current_month;
	var ar_initas = false;
	var selected_label;
	
	this.measureSize = function(that) {
		var currentWidth = that.$().outerWidth(true);
		var currentHeight = that.$().outerHeight(true);
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
			//alert(currentWidth);
			this.drawcalendar();
		}else{
			// Sizes are the same.  Don't redraw, but poll again after an interval.
			that._poller = window.setTimeout(function(){that.measureSize(that)},that._pollInterval);	
		}	
	};
	
	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		this.$().click(function() {
			that.fireEvent("onclick");
		});
		//canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).append("g");
		//canvas.transition().duration(250)
		//	.attr("width", that._naudojamas_plotis)
		//	.attr("height", that._naudojamas_ugis);
	};

	this.afterUpdate = function() {	
		this.drawcalendar();	
	};
	
	this.getcurrentmonth = function(){
		var _local_date = new Date();
		Menindeksas = _local_date.getMonth();
		Metai = _local_date.getFullYear();
	}
	
	this.setduomenys = function(duomenys,labels) {
		var _local_date;
		var _lacal_value = null;
		var _label_index = null;
		duomenu_masyvas = [];
		labels_masyvas = [];
		for(var i = 0; i < dienu_masyvas.length; i++){
			_label_index = null;
			if (Menindeksas+1 < 10) {
				if(i+1 < 10) {
					_local_date = Metai + "-0" + (Menindeksas+1) + "-0" + (i+1); 
				} else {
					_local_date = Metai + "-0" + (Menindeksas+1) + "-" + (i+1); 
				}
			} else {
				if(i+1 < 10) {
					_local_date = Metai + "-" + (Menindeksas+1) + "-0" + (i+1); 
				} else {
					_local_date = Metai + "-" + (Menindeksas+1) + "-" + (i+1); 
				}
			}
			labels_masyvas.push(_local_date);
			//alert(_local_date);
			for(var j = 0; j < labels.length; j++){
				if(_local_date == labels[j]) {
					_label_index = j;
				}
			}
			if (_label_index == null) {
				duomenu_masyvas.push(null);
			} else {
				duomenu_masyvas.push(parseFloat(duomenys[_label_index]));
			}
		}
	};
	
	this.setpirmadiena = function(vmetai,vmen) {
		men_dienu_sk = new Date(vmetai, vmen+1, 0).getDate();
		pirma_diena = new Date(vmetai, vmen, 1).getDay();
		if(pirma_diena == 0) {
			pirma_diena = 7;
		}
		//alert(Metai + "-" + Menindeksas +"-"+" "+men_dienu_sk+"/"+pirma_diena);
	};
	
	this.precalc = function(vwidth,vheight) {
		that.setpirmadiena(Metai, Menindeksas);
		skyriklis = 1;
		if(ar_savaites_rodomos) {
			stulpelis = vwidth/9;
			if( 7.5*stulpelis > vheight) {
				stulpelis = vheight/(7.5+1);
			}
			Xoffset = (vwidth - stulpelis*9)/2+stulpelis;
			Yoffset = (stulpelis*1.5);
			that.drawWeeks();
		} else {
			stulpelis = (vwidth-6*skyriklis)/7;
			if( 7.5*stulpelis + 5*skyriklis > vheight) {
				stulpelis = (vheight-5)/7.5;
			}
			
			Xoffset = (vwidth - stulpelis*7 - skyriklis*6)/2;
			Yoffset = (stulpelis*1.5);
		}
		
		var dezute = canvas.append("text")
		.attr("id","Dezute")
		.attr("class", "calendar_labels")
		.attr("fill", "black")
		.attr("font-size", font_size+"px")
		.attr("text-anchor","end")
		.attr("y", 100)
		.text("W52")
		.attr("transform", "translate("+100+","+100+")");
		box_w = dezute[0][0].getBBox().width;
		box_h = dezute[0][0].getBBox().height;
		deletedezute = d3.select("#Dezute").remove();
	};
	
	this.drawWeeks = function() {
		for(var i = 0; i < savaites.length; i++) {
			var week_text = canvas.append("text")
			.attr("class","calendar_labels")
			.attr("x", stulpelis-skyriklis)
			.attr("y", (1+i)*(stulpelis+skyriklis)+stulpelis/2+box_h/2)
			.attr("text-anchor", "end")
			.attr("transform","translate("+0+","+Yoffset+")")
			.text(savaites[i]);
		}
	};

function drawMen(vstulpelis,vskyriklis,vmenindeksas,vxoffset,vfontsize) {
		
		d3.select("#men_pav"+chart_ID.substring(4, 20)).remove();
		d3.select("#line_back"+chart_ID.substring(4, 20)).remove();
		d3.select("#line_pirmyn"+chart_ID.substring(4, 20)).remove();
		d3.selectAll("#dienos"+chart_ID.substring(4, 20)).remove();
		
		var _font_size_menesis = Math.round(1.5*stulpelis / 3 * 2 * 0.60);
		var _font_size_dienu_pav = Math.round(1.5*stulpelis / 4 * 0.60);
		
		var men_pav = canvas.append("text")
		.attr("id","men_pav"+chart_ID.substring(4, 20))
		.attr("x", 3.5*vstulpelis+3*vskyriklis)
		.attr("class","calendar_axis_text_title")
		.attr("y", 0)
		.attr("text-anchor", "middle")
		.attr("transform","translate("+vxoffset+","+0+")")
		.attr("font-size", _font_size_menesis+"px")
		.text(menesiai_l[vmenindeksas]);
		 
		var push = d3.select("#men_pav"+chart_ID.substring(4, 20)).attr("transform","translate("+vxoffset+","+men_pav[0][0].getBBox().height+")");
		var men_v = men_pav[0][0].getBBox().width;
		var men_h = men_pav[0][0].getBBox().height;
		var aukstis  = men_h * 0.5;
		
		var lineFunction = d3.svg.line()
								.x(function(d) {return d.x;})
								.y(function(d) {return d.y;})
								.interpolate("linear");
		var linija_back_taskai = [
		                         {"x": 3.5*vstulpelis+4*vskyriklis-(men_v/2+vskyriklis)-aukstis, "y":men_h-aukstis},
		                         {"x": 3.5*vstulpelis+4*vskyriklis-(men_v/2+vskyriklis)-aukstis-Math.cos(Math.PI/4)*aukstis, "y": men_h-aukstis/2},
		                         {"x": 3.5*vstulpelis+4*vskyriklis-(men_v/2+vskyriklis)-aukstis, "y": men_h}
		                         ];
		var linija_pirmyn_taskai = [
			                         {"x": 3.5*vstulpelis+4*vskyriklis+(men_v/2+vskyriklis)+aukstis, "y":men_h-aukstis},
			                         {"x": 3.5*vstulpelis+4*vskyriklis+(men_v/2+vskyriklis)+aukstis+Math.cos(Math.PI/4)*aukstis, "y": men_h-aukstis/2},
			                         {"x": 3.5*vstulpelis+4*vskyriklis+(men_v/2+vskyriklis)+aukstis, "y": men_h}
			                         ];
		var linija_back = canvas.append("path")
								.attr("id","line_back"+chart_ID.substring(4, 20))
								.attr("d", lineFunction(linija_back_taskai))
								.attr("stroke-width",2)
								.attr("stroke","black")
								.attr("transform","translate("+vxoffset+","+0+")")
								.on("click", function(d,i) { if(vmenindeksas == 0) {
										Menindeksas = 11;
										Metai = Metai - 1;
										that.drawcalendar();
										//drawMen(vstulpelis,vskyriklis,11,vxoffset,vfontsize);
									} else {
										Menindeksas = vmenindeksas - 1;
										that.drawcalendar();
										//drawMen(vstulpelis,vskyriklis,vmenindeksas-1,vxoffset,vfontsize);
									}; return i;});

		var linija_pirmyn = canvas.append("path")
								.attr("id","line_pirmyn"+chart_ID.substring(4, 20))
								.attr("d", lineFunction(linija_pirmyn_taskai))
								.attr("stroke-width",2)
								.attr("stroke","black")
								.attr("transform","translate("+vxoffset+","+0+")")
								.on("click", function(d,i) { if(vmenindeksas == 11) {
									Menindeksas = 0;
									Metai = Metai + 1;
									//drawMen(vstulpelis,vskyriklis,0,vxoffset,vfontsize);
									that.drawcalendar();
								} else {
									Menindeksas = vmenindeksas + 1;
									//drawMen(vstulpelis,vskyriklis,vmenindeksas+1,vxoffset,vfontsize);
									that.drawcalendar();
								}; return i;});
		for(var i = 0; i < 7; i++) {
		var header_text = canvas.append("text")
			.attr("id","dienos"+chart_ID.substring(4, 20))
			.attr("class","calendar_labels")
			.attr("x", (vstulpelis+vskyriklis)*(i)+vstulpelis/2)
			.attr("y", 0)
			.attr("dy",-1*_font_size_dienu_pav/2)
			.attr("text-anchor","middle")
			.attr("transform","translate("+vxoffset+","+Yoffset+")")
			.attr("font-size",_font_size_dienu_pav)
			.text(savaites_dienos[i]);
		}
	
	}

	this.drawcalendar = function (){
		if(chart_data && chart_data.data) { //jei turim duomenu
			
			remove = d3.select("#id"+chart_ID.substring(4, 20)).remove();
			canvas = d3.select(that.$()[0]).append("svg:svg")
						.attr("id","id"+chart_ID.substring(4, 20))
						.attr("width", that._naudojamas_plotis)
						.attr("height", that._naudojamas_ugis)
						.append("g");
			canvas.transition().duration(250);
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
			
			tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(function(d ,i) {
				return 	d.name+": "+ d.value;
			});
			if (use_current_month && ar_initas == false) {
				that.getcurrentmonth();
				ar_initas = true;
			}
			
			that.precalc(width, height);
			drawMen(stulpelis,skyriklis,Menindeksas,Xoffset,font_size);
			

			dienu_masyvas = [];

			for(var i = 1; i <= men_dienu_sk; i++) {
				dienu_masyvas.push(i);		
			}

			that.setduomenys(data,headers);
			if (use_auto_range) {
				min = d3.min(duomenu_masyvas);
				max = d3.max(duomenu_masyvas);
				middle = (min + max)/2;
			}

			//alert(_local_min + " " + _local_max);
			var color = d3.scale.linear()
				.domain([min, middle, max])
				.range([color_min,color_middle,color_max]);
			var kvadratuku_masyvas = [];
			var counter_wd = pirma_diena-1;
			var counter_w = 0;
			var _local_label = "";
			var _local_color = "";
			for (var i = 0; i < dienu_masyvas.length; i++){
				if ( dienu_masyvas[i] < 10) {
					_local_label = "0"+dienu_masyvas[i];
				} else {
					_local_label = dienu_masyvas[i];
				}
				if (duomenu_masyvas[i] == null) {
					_local_color = "rgb(220,220,220)";
				} else {
					_local_color = color(duomenu_masyvas[i]);
				}
				var kvadratukas = {
						y: counter_w*(stulpelis+skyriklis),
						x: counter_wd*(stulpelis+skyriklis),
						yl: counter_w*(stulpelis+skyriklis),
						xl: counter_wd*(stulpelis+skyriklis)+ 1/2*stulpelis,
						width: stulpelis,
						height: stulpelis,
						style: "fill:"+_local_color,
						transform: "translate("+Xoffset+","+Yoffset+")",
						name: labels_masyvas[i],
						label: _local_label,
						value: duomenu_masyvas[i],
						click: menesiai_l[6]
				}
				kvadratuku_masyvas.push(kvadratukas);
				counter_wd++;
				if(counter_wd == 7) {
					counter_wd = 0;
					counter_w++;
				}
			}
			
			
					var _txtlocal = canvas.append("text")
						.attr("id","Dezute7")
						.attr("class", "calendar_labels")
						.attr("fill", "black")
						.attr("text-anchor","end")
						.attr("y", 100)
						.text("29")
						.attr("transform", "translate("+100+","+100+")");
					var _box_h = _txtlocal[0][0].getBBox().height;
					deletedezute = d3.select("#Dezute7").remove();
		
		
			var tk = canvas.selectAll("rect_pilni")
			.data(kvadratuku_masyvas)
			.enter()
			.append("rect")
				.attr("id",function(d) {return d.name;})
				.attr("x", function(d) {return d.x;})
				.attr("y", function(d) {return d.y;})
				.attr("width", function(d) {return d.width;})
				.attr("height", function(d) {return d.height;})
				.attr("style", function(d) {return d.style;})
				.attr("transform", function(d) {return  d.transform;})
				.on('mouseover', tip.show)
				.on('mouseout', tip.hide)
				.on('click', function (d,i) { that.selectedlabel(d.name);
											  that.firePropertiesChanged(["selectedlabel"]);
											  d3.select(".d3-tip").remove();
											  return i;});
			var tl = canvas.selectAll("rect_labels")
				.data(kvadratuku_masyvas)
				.enter()
				.append("text")
					.attr("id",function(d) {return d.name;})
					.attr("x", function(d) {return d.xl;})
					.attr("y", function(d) {return d.yl+_box_h/3+stulpelis/2;})
					.attr("class", "calendar_labels")
					.attr("text-anchor","middle")
					.attr("transform","translate("+Xoffset+","+Yoffset+")")
					.on('mouseover', tip.show)
				    .on('mouseout', tip.hide)
				    .on('click', function (d,i) { that.selectedlabel(d.name);
											  that.firePropertiesChanged(["selectedlabel"]);
											  d3.select(".d3-tip").remove();
											  return i;})
					.text(function (d) {return d.label;})

		canvas.call(tip);	
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
	
	this.metai = function(value) {
		if (value === undefined) {
			return Metai;
		} else {
			Metai = value;
			return this;
		}
	};
	
	this.menindeksas = function(value) {
		if (value === undefined) {
			return Menindeksas;
		} else {
			Menindeksas = value;
			return this;
		}
	};
	
	this.colormin = function(value) {
		if (value === undefined) {
			return color_min;
		} else {
			color_min = value;
			return this;
		}
	};
	
	this.colormax = function(value) {
		if (value === undefined) {
			return color_max;
		} else {
			color_max = value;
			return this;
		}
	};
	
	this.colormiddle = function(value) {
		if (value === undefined) {
			return color_middle;
		} else {
			color_middle = value;
			return this;
		}
	};
	
	this.vmax = function(value) {
		if (value === undefined) {
			return max;
		} else {
			max = value;
			return this;
		}
	};
	this.vmin = function(value) {
		if (value === undefined) {
			return min;
		} else {
			min = value;
			return this;
		}
	};
	this.vmiddle = function(value) {
		if (value === undefined) {
			return middle;
		} else {
			middle = value;
			return this;
		}
	};
	this.useautorange = function(value) {
		if (value === undefined) {
			return use_auto_range;
		} else {
			use_auto_range = value;
			return this;
		}
	};
	this.usecurrentmonth = function(value) {
		if (value === undefined) {
			ar_initas = false;
			return use_current_month;
		} else {
			ar_initas = false;
			use_current_month = value;
			return this;
		}
	};
	
	this.selectedlabel = function(value) {
		if (value === undefined) {
			return selected_label;
		} else {
			selected_label = value;
			return this;
		}
	};
	
	
});
});
