define(["css!../css/component.css","sap/designstudio/sdk/component"], function(css, Component) {
Component.subclass("com.sba.blank.Blank", function() {
	
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
	
	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
	};

	this.afterUpdate = function() {	
		drawblank();
	};

	function drawblank(){
		if(chart_data && chart_data.data) { //jei turim duomenu
			
			remove = d3.select("#id"+chart_ID.substring(4, 20)).remove();
			canvas = d3.select(that.$()[0]).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
			width = that.$().outerWidth(true);
			height = that.$().outerHeight(true);
			flatData = {}; //Isplokstinta struktura				
			options = org_scn_community_databound.initializeOptions(); //parinktys
			options.ignoreResults = true;
			flatData = org_scn_community_databound.flatten(chart_data, options); //funkcija kuri isplokstina mano resultSet
			length = flatData.geometry.rowLength; //elementu kiekis / 2
			headers = flatData.rowHeaders; // Labels
			otherLength = flatData.geometry.colLength; // kiek stulpeliu
			otherHeaders = flatData.columnHeaders;  // stulpeliu pavadinimai
			data = flatData.values; //reiksmiu masyvas 
			
			
			/*tip = d3.tip()
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
					
					//.on('mouseover', tip.show) prideti jei norim mouse over
					//.on('mouseout', tip.hide) prideti jei norim mouse over
					
			*/
			
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
