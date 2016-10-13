sap.designstudio.sdk.Component.subclass("com.sba.bulletchart.Bulletchart", function() {
	
	var that = this;
	var canvas = undefined;
	var remove;
	var chart_ID = "";
	var axis_max;
	var axis_min;
	var Performance;
	var target_one;
	var target_two;
	var scales_one;
	var scales_two;
	var scales_one_css;
	var scales_two_css;
	var target_two_v;
	var alert_on;
	var title_on;
	var show_axis;
	var axis_format_bindable;
	
	var x_offset;
	var y_offset;
	var a_height;
	var axis_size = 20;
	var scale_size;
	var performance_size;
	var target_size;
	var x;
	var perf_proc; //bindable
	var target_proc; //bindable
	var burbulas_size;
	var burbulas_proc;
	var bc_axis;
	var axis_format;
	var title_font_size;
	
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
			this.drawBulletChart();
		}else{
			// Sizes are the same.  Don't redraw, but poll again after an interval.
			that._poller = window.setTimeout(function(){that.measureSize(that)},that._pollInterval);	
		}	
	};
	
	
	
	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		//canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
	};

	this.afterUpdate = function() {
		this.drawBulletChart();
	};

	this.drawBulletChart = function(){
		if(true) { //jei turim duomenu
			
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
			
			x_offset = 0; 
			y_offset = 0;

	
			var noS = 2; //bindable
			var PTT = [ Performance, target_one, target_two ]; //bindable
			var scale_values = [scales_one, scales_two, scales_two]; //bindable
			var scale_fill = [scales_one_css, scales_two_css]; //bindable
			//var targets_css = [target_one_css, target_two_css]; //bindable
			var labels = ["Pardavimai"]; //bindable

			a_height = height;
			a_width = width;
			if (title_on == true){
				a_height = height-title_height;
				y_offset = title_height;
			}
			
			if( show_axis == true) {
				a_height = a_height-axis_size;
			}	
			
			scale_size = a_height;
			performance_size = a_height*perf_proc;
			target_size = a_height*target_proc;
			burbulas_size = a_height*burbulas_proc;
			
			if (alert_on == true) {
				x_offset = a_height;
				a_width = width-a_height;
			} else {
				x_offset = 5;
				a_width = width;
			}
			
			x = d3.scale.linear()
						.domain([axis_min, axis_max])
						.range([0, a_width-15]).nice();	
			
				
			var tip = d3.tip()
				.attr('class', 'd3-tip')
				.offset([-10, 0])
				.html(alert_html);


			if (alert_on == true){
					canvas.append("circle")
									.attr("class", alert_css)
									.attr("cx", a_height/2)
									.attr("cy", a_height/2)
									.attr("transform", "translate(0,"+y_offset+")")
									.attr("class", alert_css)
									.on('mouseover', tip.show)
									.on('mouseout', tip.hide)
									.attr("r",burbulas_size/2);
			}
			
			//scales
			for (var i = 0; i < noS; i++) {	
				if (scale_values[i] > 0 ) {
					canvas.append("rect")
								.attr("class", scale_fill[i])
								.attr("width", Math.abs(x(scale_values[i])-x(0)))
								.attr("height", scale_size)
								.attr("y", 0)
								.attr("transform", "translate("+x_offset+","+y_offset+")")
								.attr("x", x(0));
				} else {
					canvas.append("rect")
					.attr("class", scale_fill[i])
					.attr("width", Math.abs(x(scale_values[i])-x(0)))
					.attr("height", scale_size)
					.attr("y", 0)
					.attr("transform", "translate("+x_offset+","+y_offset+")")
					.attr("x", x(scale_values[i]));	
				}
			}
			
			//target one
			
					canvas.append("rect")
								.attr("class", target_one_css)
								.attr("width", 2+manual_target_widht)
								.attr("height", target_size)
								.attr("y", (1-target_proc)/2*a_height)
								.attr("transform", "translate("+x_offset+","+y_offset+")")
								.attr("x", x(PTT[1]));
					
			//target two
					
			if (target_two_v == true) {		
					canvas.append("rect")
								.attr("class", target_du_css)
								.attr("width", 2+manual_target_widht)
								.attr("height", target_size)
								.attr("y", (1-target_proc)/2*a_height)
								.attr("transform", "translate("+x_offset+","+y_offset+")")
								.attr("x", x(PTT[2]));
			}
			
			
			//performance
			if (PTT[0] > 0) {
					canvas.append("rect")
								.attr("class", performance_css)
								.attr("width", Math.abs(x(PTT[0])-x(0)))
								.attr("height", performance_size)
								.attr("y", (1-perf_proc)/2*a_height)
								.attr("transform", "translate("+x_offset+","+y_offset+")")
								.attr("x", x(0));
			} else {
					canvas.append("rect")
						.attr("class", performance_css)
						.attr("width", Math.abs(x(PTT[0])-x(0)))
						.attr("height", performance_size)
						.attr("y", (1-perf_proc)/2*a_height)
						.attr("transform", "translate("+x_offset+","+y_offset+")")
						.attr("x", x(PTT[0]));
			}
								
			if(show_axis == true) {
				axis_format = d3.format(axis_format_bindable);
				bc_Xaxis = d3.svg.axis()
					.ticks(5)
					.tickFormat(function(d) {return axis_format(d);})
					.scale(x);
				canvas.append("g")
					.attr("class", "bc_axis")
					.call(bc_Xaxis)
					.attr("transform", "translate("+x_offset+","+(height-axis_size)+")");
				
			}
			
			if(title_on == true) {
					canvas.append("text")
								.attr("class", "text_title")
								.attr("font-size",title_font_size+"px")
								.attr("y", 0)
								.attr("x", x(0))
								.attr("dy", title_font_size)
								.attr("text-anchor", "start")
								.attr("transform", "translate("+x_offset+",0)")
								.text(Title);
			}
			
			canvas.call(tip);
			
			this._poller = window.setTimeout(function(){that.measureSize(that)},that._pollInterval);		
		}
	};

	this.data = function(value) {
		if (value === undefined) {
			return chart_data;
		} else {
			chart_data = value;
			return this;
		}
	};
	
	this.scalesone = function(value) {
		if (value === undefined) {
			return scales_one;
		} else {
			scales_one = value;
			return this;
		}
	};
	
	this.scalestwo = function(value) {
		if (value === undefined) {
			return scales_two;
		} else {
			scales_two = value;
			return this;
		}
	};
	
	this.performance = function(value) {
		if (value === undefined) {
			return Performance;
		} else {
			Performance = value;
			return this;
		}
	};
	
	this.targetone = function(value) {
		if (value === undefined) {
			return target_one;
		} else {
			target_one = value;
			return this;
		}
	};
	
	this.targettwo = function(value) {
		if (value === undefined) {
			return target_two;
		} else {
			target_two = value;
			return this;
		}
	};
	
	this.targettwov = function(value) {
		if (value === undefined) {
			return target_two_v;
		} else {
			target_two_v = value;
			return this;
		}
	};
	
	this.axismax = function(value) {
		if (value === undefined) {
			return axis_max;
		} else {
			axis_max = value;
			return this;
		}
	};
	
	this.axismin = function(value) {
		if (value === undefined) {
			return axis_min;
		} else {
			axis_min = value;
			return this;
		}
	};
	
	this.alerton = function(value) {
		if (value === undefined) {
			return alert_on;
		} else {
			alert_on = value;
			return this;
		}
	};
	
	this.titleon = function(value) {
		if (value === undefined) {
			return title_on;
		} else {
			title_on = value;
			return this;
		}
	};
	
	this.axiscss = function(value) {
		if (value === undefined) {
			return axis_css;
		} else {
			axis_css = value;
			return this;
		}
	};
	
	this.titlecss = function(value) {
		if (value === undefined) {
			return title_css;
		} else {
			title_css = value;
			return this;
		}
	};
	
	this.title = function(value) {
		if (value === undefined) {
			return Title;
		} else {
			Title = value;
			return this;
		}
	};
	
	this.titleheight = function(value) {
		if (value === undefined) {
			return title_height;
		} else {
			title_height = value;
			return this;
		}
	};
	
	this.titlefontsize = function(value) {
		if (value === undefined) {
			return title_font_size;
		} else {
			title_font_size = value;
			return this;
		}
	};
	
	this.scalesonecss = function(value) {
		if (value === undefined) {
			return scales_one_css;
		} else {
			scales_one_css = value;
			return this;
		}
	};
	
	this.scalestwocss = function(value) {
		if (value === undefined) {
			return scales_two_css;
		} else {
			scales_two_css = value;
			return this;
		}
	};
	
	this.alertcss = function(value) {
		if (value === undefined) {
			return alert_css;
		} else {
			alert_css = value;
			return this;
		}
	};
	
	this.performancecss = function(value) {
		if (value === undefined) {
			return performance_css;
		} else {
			performance_css = value;
			return this;
		}
	};
	
	this.targetonecss = function(value) {
		if (value === undefined) {
			return target_one_css;
		} else {
			target_one_css = value;
			return this;
		}
	};
	
	this.targetducss = function(value) {
		if (value === undefined) {
			return target_du_css;
		} else {
			target_du_css = value;
			return this;
		}
	};

	this.perfproc = function(value) {
		if (value === undefined) {
			return perf_proc;
		} else {
			perf_proc = value;
			return this;
		}
	};
	this.targetproc = function(value) {
		if (value === undefined) {
			return target_proc;
		} else {
			target_proc = value;
			return this;
		}
	};
	this.burbulasproc = function(value) {
		if (value === undefined) {
			return burbulas_proc;
		} else {
			burbulas_proc = value;
			return this;
		}
	};
	
	this.alerthtml = function(value) {
		if (value === undefined) {
			return alert_html;
		} else {
			alert_html = value;
			return this;
		}
	};

	this.axisformatbindable = function(value) {
		if (value === undefined) {
			return axis_format_bindable;
		} else {
			axis_format_bindable = value;
			return this;
		}
	};
	
	this.manualtargetwidht = function(value) {
		if (value === undefined) {
			return manual_target_widht;
		} else {
			manual_target_widht = value;
			return this;
		}
	};
	
	this.alertcss = function(value) {
		if (value === undefined) {
			return alert_css;
		} else {
			alert_css = value;
			return this;
		}
	};
	
	this.showaxis = function(value) {
		if (value === undefined) {
			return show_axis;
		} else {
			show_axis = value;
			return this;
		}
	};
	

});
