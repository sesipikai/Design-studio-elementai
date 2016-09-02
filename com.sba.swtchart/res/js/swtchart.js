sap.designstudio.sdk.Component.subclass("com.sba.swtchart.Swtchart", function() {
	
	var that = this;
	var canvas = undefined;
	var chart_ID = "";
	var meta_data;
	var chart_data;
	var chart_title_visible;
	var chart_title;
	var chart_title_css;
	var label_css;
	var data_labels_visible;
	var data_labels_css;
	var data_labels_scaling;
	var data_labels_format;
	var data_labels_format_se;
	var data_labels_suffix;
	var data_labels_xOffset;
	var bars_css_start;
	var bars_css_end;
	var bars_css_plus;
	var bars_css_minus;
	var d3_xaxis_format;
	var x_offset_manual_left;
	var x_offset_manual_right;
	var y_offset_manual_top;
	var y_offset_manual_bottom;
	var d3_y_axis_format;
	var start_label;
	var end_label;
	var start_overwrite_use;
	var start_overwrite;
	var end_overwrite;
	var use_balansing;
	var balansing_column_label;
	var faktas_label;
	var planas_label;
	var shorten_inner_labels;
	var shorter_label_length;
	var warp_labels;
	var y_axis_size;
	var x_axis_size;
	var x_axis_font_size;
	var rotate_labels;
	var auto_fit;
	var rotate_num;

	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
		//this.$().append( "<div id='MANODIV' style='width:100%;height:100%;'>"); //sukuriam savo DIV grafikui
	};

	this.afterUpdate = function() {
		
		drawWaterfallChart();
	};

	function drawWaterfallChart(){
		if(chart_data && chart_data.data) { //jei turim duomenu
						
			var width = that.$().outerWidth(true);
			var height = that.$().outerHeight(true);
			var remove = d3.select("#id"+chart_ID.substring(4, 20)).remove();
			canvas = d3.select(that.$()[0]).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
			
			var flatData = {}; //Isplokstinta struktura				
			
			var options = org_scn_community_databound.initializeOptions(); //parinktys
			options.ignoreResults = true;
			flatData = org_scn_community_databound.flatten(chart_data, options); //funkcija kuri isplokstina mano resultSet
			
			var length = flatData.geometry.rowLength; //elementu kiekis / 2
			var headers = flatData.rowHeaders; // Labels
			var otherLength = flatData.geometry.colLength; // kiek stulpeliu
			var otherHeaders = flatData.columnHeaders;  // stulpeliu pavadinimai
			var data = flatData.values; //reiksmiu masyvas 
			var data_fact = [];
			var data_plan = [];
			
			// masyvai plano ir fakto reiksmems
			for (var i = 0; i < length; i++){
				data_fact[i] = data[i][0];
				data_plan[i] = data[i][1];
			}
			
			var start = d3.sum(data_plan);
			var end = d3.sum(data_fact);
			
			var start_array = [];
			var end_array = [];
			var delta_array = [];
			var column_sizes = [];
			var charting_array = [];
			
			if (start_overwrite_use) {
				start = start_overwrite;
			}
			if (start_overwrite_use) {
				end = end_overwrite;
			}
			if (use_balansing) {
				var true_delta = d3.sum(data_fact) - d3.sum(data_plan);
				var new_delta = end - start;
				data_fact[length]= new_delta - true_delta;
				data_plan[length]= 0;
				headers[length] = balansing_column_label;
				length=length+1;
			}
				
			headers.unshift(start_label);
			headers.push(end_label);
			
			if (auto_fit) {
				if (length >= rotate_num) {
					warp_labels = false;
					rotate_labels = true;
				} else {
					warp_labels = true;
					rotate_labels = false;
				}
			}
			
			//calculate delta array
			
			

			delta_array[0] = 0;
			delta_array[length+1]=0;
			for(var i = 0; i < length; i++) {
				delta_array[i+1]=data_fact[i]-data_plan[i];
			}

			column_sizes[0]=start;
			column_sizes[length+1]=end;
			for(var i = 0; i < length; i++){
				column_sizes[i+1]=column_sizes[i]+delta_array[i];
			}

			charting_array[0] = start;
			charting_array[length+1]= end;
			for(var i = 1; i < length + 1; i++) {
				charting_array[i]=delta_array[i];
			}
		
			
			start_array[0] = start;
			end_array[0] = 0;
			start_array[length + 1] = end;
			end_array[length + 1] = 0;
			
			for (var i = 1; i < length + 1; i++) {
				if (i == 1) {
					start_array[i]=start_array[i-1];
				} else {
					start_array[i]=end_array[i-1];
				}
				end_array[i]=start_array[i]+delta_array[i];
			}
			
			
			var max = d3.max([0, d3.max(column_sizes)])*1.05;
			var min = d3.min([0, d3.min(column_sizes)])*1.05;
			
			// Shorting inner labels (or not)
			
			//var temp_string = "";
			if (shorten_inner_labels == true) {
				for (var i = 1; i < length - 1; i++){
					//temp_string = headers[i];
					if( headers[i].length > shorter_label_length) {
						//temp_string = headers[i];
						headers[i] = headers[i].substring(0,shorter_label_length).concat(".");
					}
				}
			}
			
			var empty_label = "" ;
			var empty_label_lenght = 0;
			var empty_label_length = 0;
			var empty_label_length_h = 0;
			var max_label_length = 0;
			var max_label_heigth = 0;
			var max_label_char_count = 0;
			var char_length_px = 0;
			if (warp_labels || rotate_labels ) {
				//surandame max ilgio label
				for(i=0; i < length; i++) {
					empty_label = headers[i];
					var dezute_swt = canvas.append("text")
					.attr("id","Dezute_swt")
					.attr("class", "labels_swt")
					.attr("fill", "black")
					.attr("font-size", x_axis_font_size+"px")
					.attr("text-anchor","end")
					.attr("dy", ".35em")
					.attr("y", 100)
					.text(empty_label)
					.attr("transform", "translate("+100+","+100+")");
					empty_label_length_w = dezute_swt[0][0].getBBox().width;
					empty_label_length_h = dezute_swt[0][0].getBBox().height;
					deletedezute = d3.select("#Dezute_swt").remove();
					if (empty_label_length_w > max_label_length){
						max_label_pixels_w = Math.ceil(empty_label_length_w/5)*5;
						max_label_pixels_h = empty_label_length_h;
						max_label_length = empty_label_length_w;
						max_label_height = empty_label_length_h;
						max_label_char_count = headers[i].length;
						char_length_px = max_label_length / max_label_char_count;
					}
				}
			}
			
			
			
			
			var Xoffset_d = y_axis_size;
			var Yoffset = 5;
			var Xoffset = y_axis_size;
			
			//Chart title on/off
			
			if (chart_title_visible){
				Yoffset = 15 + y_offset_manual_top;						//make room for title by shifting everything down	
			}			
			
			
			//X intervalu apskaiciavimas
			
	

			var x = d3.scale.ordinal()
				.domain(headers)
				.rangeBands([0, width-Xoffset_d], .2);
			
			var Xaxis = d3.svg.axis()
			.orient("bottom")
			.scale(x);	
			
			var eiluciu_sk = 1;
			var kiek_s=0;
			var warped_labels = [];
			var tarpine = 0;
			empty_label = "";
			
			if (warp_labels){
				if(Math.ceil(max_label_length) > Math.ceil(x.rangeBand())) {
					eiluciu_sk = Math.ceil(max_label_length / x.rangeBand());
					kiek_s = Math.ceil(x.rangeBand()/char_length_px);
					x_axis_size = x_axis_size + max_label_height;
					
					for (i = 0; i < length+2; i++){
						if (headers[i].length <= kiek_s) {
							warped_labels.push(headers[i]);
							for(j = 1; j < eiluciu_sk; j++) {
								warped_labels.push(" ");
							}
						} else {
							tarpine = headers[i].length; 
							warped_labels.push(headers[i].substring(0,kiek_s));
							tarpine = tarpine - kiek_s;
							for(j = 1; j < eiluciu_sk; j++){
								if (tarpine > 0) {
									warped_labels.push(headers[i].substring(j*kiek_s,j*kiek_s+kiek_s));
									tarpine = tarpine - kiek_s;
								} else {
									warped_labels.push(" ");
								}
							}
						}
					}
				} else {
					//x_axis_size = max_label_height;
					warp_labels = false;
				}
			}
			
			if (warp_labels) {
				for(var i=0; i < length+2; i++) {
					for(var j = 0; j < eiluciu_sk; j++) {
						canvas.append("text")
							.attr("class","labels_swt")
							.attr("font_size", x_axis_font_size+"px")
							.attr("y",0)
							.attr("x",x(headers[i])+x.rangeBand()/2)
							.attr("dy", j*max_label_height)
							.attr("text-anchor","middle")
							.attr("transform", "translate("+Xoffset+","+(height-x_axis_size/2)+")")
							.text(warped_labels[i*eiluciu_sk+j]);
					}
				}
			} else {
				if (rotate_labels) {
					x_axis_size = max_label_pixels_w*1.15;	
					for (var i = 0; i < length +2 ; i++) {
						var rLables = canvas.append("text")
							.attr("id","text.xaxis")
							.attr("class", "labels_swt")
							.attr("font-size", x_axis_font_size)
							.attr("text-anchor", "end")
							.attr("transform", "translate("+(Xoffset+x(headers[i])+x.rangeBand()/2+max_label_height/4)+","+(height-x_axis_size+2)+")rotate(-90)")
							//.attr("x", x(headers[i])+x.rangeBand()/2)
							//.attr("y", 0)
							.text(headers[i]);			 
					}
					//var rotate = rLables.select("text").attr("transform","translate("+Xoffset+","+(height-x_axis_size/2)+")rotate(-90)");
					
						/*var rLables = canvas.selectAll("text.rotateLabels")
										.data(headers[i])
										.enter()
										.append("text")
											.attr("class", "lables_swt")
											.attr("font-size", x_axis_font_size)
											.attr("text-anchor", "end")
											.attr("transform", "rotate(-90)")
											//.attr("transform", "translate("+Xoffset+","+(height-x_axis_size/2)+")")
											.attr("x", function (d,i) {return x(headers[i])+x.rangeBand()/2;})
											.attr("y", 0)
											.text(function (d,i){
												return headers[i];
											})			*/		
				} else {
					canvas.append("g")
					.attr("class", "xaxis")
					.attr("transform", "translate("+Xoffset+","+(height-x_axis_size)+")")
					.call(Xaxis);
				}
				
			}
			
			
			
			var y = d3.scale.linear()
				.domain([min, max])
				.range([height-x_axis_size-5, 0]).nice();
			
			
					
			

			
			var Yaxis_format = d3.format(d3_y_axis_format);	
			var Yaxis = d3.svg.axis()
				.ticks(10)
				.tickFormat(function(d) {return Yaxis_format(d);})
				.orient("left")
				.scale(y);	
			
			//stulpeliai
			
			canvas.append("g")
				.attr("class", "x axis")
				.append("line")
					.attr("x1",0)
					.attr("x2",width-y_axis_size)
					.attr("y1", y(0))
					.attr("y2", y(0))
					.attr("transform", "translate("+Xoffset+","+Yoffset+")");
			//TIP
			
			var tip_format_number = d3.format(",.0f");
			var tip_format_proc = d3.format("%");
			var tip = d3.tip()
					.attr('class', 'd3-tip')
					.offset([-10, 0])
					.html(function(d ,i) {
						if (i == 0 || i == length+1) {
							var label = start_label;
							var value = start;
							if (i != 0) {
								label = end_label;
								value = end;
							}
							return "<b>"+label+"</b>"+" "+tip_format_number(value)+"</br>";
						} else {
							
							return "<b>"+headers[i]+"</b></br>"+
									faktas_label + ": "+ tip_format_number(data_fact[i-1]) +"</br>" +
									planas_label + ": "+ tip_format_number(data_plan[i-1]) +"</br>" +
									"Skirtumas: "+ tip_format_number(delta_array[i]) +"</br>";
						}	
					});	
			
		var bars = canvas.selectAll("rect")
					.data(charting_array)
						.enter()
							.append("rect")
							.attr("style", function(d, i) { 
								var style = "";
								if (i == 0) {
									style = bars_css_start;
								} else {
									if (i == length + 1) {
										style = bars_css_end;
									} else {
										if (d >= 0 ) {
											style = bars_css_plus;
										} else { 
											style = bars_css_minus;
										}
									}
								}
								return style;
							})
							.attr("width", x.rangeBand())
							.attr("height", function(d, i) {
								var height = 0;
								if (start_array[i] <= end_array[i] ) {
									height = y(start_array[i]) - y(end_array[i]);
								} else {
									height = y(end_array[i])-y(start_array[i]);
								}
								return height;
								;})
								.attr("y", function(d, i) { 
									var ypoz;
									if (start_array[i] <= end_array[i]) {
										ypoz = y(end_array[i]);
									} else {
										ypoz = y(start_array[i]);
									}
									return ypoz; })
								.on('mouseover', tip.show)
								.on('mouseout', tip.hide)
								.attr("x", function(d, i) { return x(headers[i]);})
								.attr("transform", "translate("+Xoffset+","+Yoffset+")");
		
		canvas.call(tip);
		
		var make_data_labels_format = d3.format(data_labels_format);
		var make_data_labels_format_se = d3.format(data_labels_format_se);
		
		if (data_labels_visible) {
			var minus_color = "rgb(223,0,0)";
			var text = canvas.selectAll("text.datalabels")
				.data(charting_array)
				.enter()
					.append("text")
					.attr("class", "text_heading")
					.attr("fill", function(d, i) { 
						var fill = "";
						if (i == 0) {
							fill = "rgb(0,0,0)";
						} else {
							if (i == length + 1) {
								fill = "rgb(0,0,0)";
							} else {
								if (d >= 0 ) {
									fill = "rgb(0,0,0)";
								} else { 
									fill = minus_color;
								}
							}
						}
						return fill;
						})
						.attr("y", function(d, i) { 
							var ypoz;
							if (d < 0) {
								ypoz = y(d3.min([ end_array[i], start_array[i] ]));
							} else {
								ypoz = y(d3.max([ end_array[i], start_array[i] ]));
							}
							return ypoz; })
							.attr("dy", function (d, i) {
								var dy = "0";
								if (d < 0) {
									dy = "1.0em";
								} else {
									dy="-0.35em";
								}
								return dy;
							})
							.attr("x", function(d, i) { return x(headers[i]) + x.rangeBand()/2 ;})
							.attr("text-anchor", "middle")
							.text(function(d, i) {
								var text = "";
								if (i == 0 || i == length + 1){
									text = make_data_labels_format_se(d/data_labels_scaling);
								} else {
									text = make_data_labels_format(d/data_labels_scaling);
								}
								
								return text;})
							.attr("transform","translate("+Xoffset+","+Yoffset+")");
		}

			canvas.append("g")
				.attr("class", "axis")
				.attr("transform", "translate("+Xoffset+","+Yoffset+")")
				.call(Yaxis);


			
			if (chart_title_visible){						
				canvas.append("g")					//Append chart_title
					.attr("class", "text_title")
					.append("text")
						.attr("x",0)
						.attr("y",y_offset_manual_top)
						.attr("style",chart_title_css)
						.text(chart_title);
			}
			
			x_axis_size = 20;
			
		
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
	
	this.datalabelsformatse = function(value) {
		if(value === undefined) {
			return data_labels_format_se;
		} else {
			data_labels_format_se = value;
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
	
	this.barscssstart = function(value) {
		if(value === undefined) {
			return bars_css_start;
		} else {
			bars_css_start = value;
			return this;
		}
	};
	
	this.barscssend = function(value) {
		if(value === undefined) {
			return bars_css_end;
		} else {
			bars_css_end = value;
			return this;
		}
	};
	
	this.barscssplus = function(value) {
		if(value === undefined) {
			return bars_css_plus;
		} else {
			bars_css_plus = value;
			return this;
		}
	};
	
	this.barscssminus = function(value) {
		if(value === undefined) {
			return bars_css_minus;
		} else {
			bars_css_minus = value;
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
	
	this.d3yaxisformat = function(value) {
		if(value === undefined) {
			return d3_y_axis_format;
		} else {
			d3_y_axis_format = value;
			return this;
		}
	};
	
	//start
	
	this.startlabel = function(value) {
		if(value === undefined) {
			return start_label;
		} else {
			start_label = value;
			return this;
		}
	};
	this.endlabel = function(value) {
		if(value === undefined) {
			return end_label;
		} else {
			end_label = value;
			return this;
		}
	};
	this.startoverwriteuse = function(value) {
		if(value === undefined) {
			return start_overwrite_use;
		} else {
			start_overwrite_use = value;
			return this;
		}
	};
	this.startoverwrite = function(value) {
		if(value === undefined) {
			return start_overwrite;
		} else {
			start_overwrite = value;
			return this;
		}
	};
	this.endoverwrite = function(value) {
		if(value === undefined) {
			return end_overwrite;
		} else {
			end_overwrite = value;
			return this;
		}
	};
	this.usebalansing = function(value) {
		if(value === undefined) {
			return use_balansing;
		} else {
			use_balansing = value;
			return this;
		}
	};
	this.balansingcolumnlabel = function(value) {
		if(value === undefined) {
			return balansing_column_label;
		} else {
			balansing_column_label = value;
			return this;
		}
	};
	this.faktaslabel = function(value) {
		if(value === undefined) {
			return faktas_label;
		} else {
			faktas_label = value;
			return this;
		}
	};
	this.planaslabel = function(value) {
		if(value === undefined) {
			return planas_label;
		} else {
			planas_label = value;
			return this;
		}
	};
	this.shorteninnerlabels = function(value) {
		if(value === undefined) {
			return shorten_inner_labels;
		} else {
			shorten_inner_labels = value;
			return this;
		}
	};
	this.shorterlabellength = function(value) {
		if(value === undefined) {
			return shorter_label_length;
		} else {
			shorter_label_length = value;
			return this;
		}
	};
	this.warplabels = function(value) {
		if(value === undefined) {
			return warp_labels;
		} else {
			warp_labels = value;
			return this;
		}
	};
	this.yaxissize = function(value) {
		if(value === undefined) {
			return y_axis_size;
		} else {
			y_axis_size = value;
			return this;
		}
	};
	this.xaxissize = function(value) {
		if(value === undefined) {
			return x_axis_size;
		} else {
			x_axis_size = value;
			return this;
		}
	};
	this.xaxisfontsize = function(value) {
		if(value === undefined) {
			return x_axis_font_size;
		} else {
			x_axis_font_size = value;
			return this;
		}
	};
	this.rotatelabels = function(value) {
		if(value === undefined) {
			return rotate_labels;
		} else {
			rotate_labels = value;
			return this;
		}
	};
	this.autofit = function(value) {
		if(value === undefined) {
			return auto_fit;
		} else {
			auto_fit = value;
			return this;
		}
	};
	this.rotatenum = function(value) {
		if(value === undefined) {
			return rotate_num;
		} else {
			rotate_num = value;
			return this;
		}
	};

});
