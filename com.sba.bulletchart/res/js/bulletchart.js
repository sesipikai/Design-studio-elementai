sap.designstudio.sdk.Component.subclass("com.sba.bulletchart.Bulletchart", function() {
	
	var that = this;
	var canvas = undefined;
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
	
	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
	};

	this.afterUpdate = function() {
		drawBulletChart();
	};

	function drawBulletChart(){
		if(true) { //jei turim duomenu
			
			var remove = d3.select("#id"+chart_ID.substring(4, 20)).remove();
			canvas = d3.select(that.$()[0]).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
			var width = that.$().outerWidth(true);
			var height = that.$().outerHeight(true);	
			var a_height = height*0.95; 
			var a_width = width;
			var x_offset = 0; 
			var y_offset = 0;

	
			var noS = 2; //bindable
			var PTT = [ Performance, target_one, target_two ]; //bindable
			var scale_values = [scales_one, scales_two, scales_two]; //bindable
			var scale_fill = [scales_one_css, scales_two_css]; //bindable
			//var targets_css = [target_one_css, target_two_css]; //bindable
			var labels = ["Pardavimai"]; //bindable
			var perf_proc = 0.4; //bindable
			var target_proc = 0.8; //bindable
			
			if (alert_on == true) {
				x_offset = a_width*0.085;
				a_width = a_width*0.9;
			} else {
				x_offset = a_width*0.025;
				a_width = a_width*0.95;
			}
		
			
			if (title_on == true){
				a_height = a_height-title_height;
				y_offset = title_height;
			}
			
			if( show_axis == true) {
				a_height = a_height*0.75;
			}		
			
			var x = d3.scale.linear()
						.domain([axis_min, axis_max])
						.range([0, a_width]);	
			
				
			var scale_size = a_height;
			var performance_size = a_height*perf_proc;
			var target_size = a_height*target_proc;
			
			var tip = d3.tip()
			.attr('class', 'd3-tip')
			.offset([-10, 0])
			.html(alert_html);


			if (alert_on == true){
					canvas.append("circle")
									.attr("class", alert_css)
									.attr("cx", target_size/2.5)
									.attr("cy", scale_size/2)
									.attr("transform", "translate(0,"+y_offset+")")
									.attr("class", alert_css)
									.on('mouseover', tip.show)
									.on('mouseout', tip.hide)
									.attr("r",target_size/2.5);
					
					x_offset = target_size/1.25+target_size/5;
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
								.attr("width", a_width*0.005+manual_target_widht)
								.attr("height", target_size)
								.attr("y", (1-target_proc)/2*a_height)
								.attr("transform", "translate("+x_offset+","+y_offset+")")
								.attr("x", x(PTT[1]));
					
			//target two
					
			if (target_two_v == true) {		
					canvas.append("rect")
								.attr("class", target_du_css)
								.attr("width", a_width*0.005+manual_target_widht)
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
								
			//ticks
			if(show_axis == true) {
				var domain_div = (Math.abs(axis_min)+Math.abs(axis_max))/4;
				for (var i = 0; i <= 4; i++) {	
						canvas.append("rect")
									.attr("fill", "black")
									.attr("width", a_width*0.001)
									.attr("height", scale_size*0.05)
									.attr("y", scale_size)
									.attr("transform", "translate("+x_offset+","+y_offset+")")
									.attr("x", x(axis_min+domain_div*i-axis_max*0.0005));
				}
			
				//axis_text
				
				var font_size = height-y_offset-a_height-scale_size*0.05;
				
				//axis_format
				
				var axis_format = d3.format(axis_format_bindable);
				
				for (var i = 0; i <= 4; i++) {	
						canvas.append("text")
									.attr("y", scale_size*1.05)
									.attr("x", x(axis_min+domain_div*i-axis_max*0.0005))
									.attr("text-anchor", "middle")
									.attr("dy", font_size)
									.attr("class",axis_css)
									.attr("font-size", font_size+"px")
									.attr("transform", "translate("+x_offset+","+y_offset+")")
									.text(axis_format(Math.round(axis_min+domain_div*i)));
				}
			}
			
			if(title_on == true) {
					canvas.append("text")
								.attr("class", title_css)
								.attr("y", 0)
								.attr("x", x(0))
								.attr("dy", 18)
								.attr("text-anchor", "start")
								.attr("transform", "translate("+x_offset+",0)")
								.text(Title);
			}
			
			canvas.call(tip);
			
			
			
		
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
