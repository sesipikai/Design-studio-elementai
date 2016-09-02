sap.designstudio.sdk.Component.subclass("com.sba.projektaskpi.ProjektasKPI", function() {
	
	var that = this;
	var canvas = undefined;
	var chart_ID = "";
	
	this.init = function() {
		var container = this.$()[0];
		chart_ID = "id"+Math.random();
		canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
	};

	this.afterUpdate = function() {
		drawProjektasKPI();
	};

	function drawProjektasKPI(){
		var remove = d3.select("#id"+chart_ID.substring(4, 20)).remove();
		canvas = d3.select(that.$()[0]).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
		var width = that.$().outerWidth(true);
		var height = that.$().outerHeight(true);
		var flatData = {}; //Isplokstinta struktura							
		var options = org_scn_community_databound.initializeOptions(); //parinktys
		options.ignoreResults = true;
		flatData = org_scn_community_databound.flatten(chart_data, options); //funkcija kuri isplokstina mano resultSet			
		var length = flatData.geometry.rowLength; //elementu kiekis / 2
		var headers = flatData.rowHeaders; // Labels
		var otherLength = flatData.geometry.colLength; // kiek stulpeliu
		var otherHeaders = flatData.columnHeaders;  // stulpeliu pavadinimai
		var data = flatData.values; //reiksmiu masyvas 
		var project_tasks = [];
		var project_team = [];
		var project_title = [];
		var tasks_done = [];
		var tasks_start = [];
		var tasks_late = [];
		var tasks_na = [];
		var project_start = [];
		var project_end = [];
		
		for(var i = 0; i < length; i++) {
			var Stringas = headers[i];
			if (Stringas.indexOf("|") != -1 ) {
				project_title[i] = Stringas.substring(0,Stringas.indexOf("|"));
				Stringas = Stringas.substring(Stringas.indexOf("|")+1);
			}
			if (Stringas.indexOf("|") != -1 ) {
				project_start[i] = Stringas.substring(0,Stringas.indexOf("|"));
				Stringas = Stringas.substring(Stringas.indexOf("|")+1);
				project_end[i] = Stringas;
			}

			project_tasks[i] = data[i][0];
			project_team[i] = data[i][5];
			tasks_done[i] = data[i][1];
			tasks_start[i] = data[i][2];
			tasks_late[i] = data[i][3];
			tasks_na[i] = data[i][4];
		}
		
		var title_height = 20; //Bindable
		var h_separator = 25; //bindables
		var number_of_projects = length; //computable
		var t_width = width - 4;
		var t_height = (height-4)/number_of_projects-(number_of_projects-1)*h_separator;
		var big_box = t_height-title_height+10;
		
		for (p = 0; p < number_of_projects; p++) {
			// title
			
			var y_init = title_height+10 +(t_height+h_separator)*p;
			var x_init = 2;
			
			
			canvas.append("text")
				.attr("class", title)
				.attr("x",x_init)
				.attr("fill", "black")
				.attr("font-size", "20px")
				.attr("y",title_height+(t_height+h_separator)*p)
				.text(project_title[p]);
			

			//draw boxes
			
			//viso projektu
			canvas.append("rect")
				.attr("x", x_init)
				.attr("y", y_init)
				.attr("fill", "rgb(34,187,173)")
				.attr("height", big_box)
				.attr("width", big_box);
				
			canvas.append("text")
				.attr("class", big_box_t)
				.attr("fill", "white")
				.attr("font-size", "16px")
				.attr("dy", 16)
				.attr("dx", 2)
				.attr("x", x_init)
				.attr("y", y_init)
				.text("VISO UŽDUOČIŲ");
				
			canvas.append("text")
				.attr("class", big_box_s)
				.attr("fill", "white")
				.attr("font-size", "90px")
				.attr("text-anchor", "middle")
				.attr("dy", 45)
				.attr("dx", 0)
				.attr("x", x_init+big_box/2)
				.attr("y", y_init+big_box/2)
				.text(project_tasks[p]);
				
			
			//padaryta, veluoja, pradeta, liko
			
			x_init = x_init + big_box + 5;
			
			//Atlikta
			canvas.append("rect")
				.attr("x", x_init)
				.attr("y", y_init)
				.attr("fill", "rgb(103,185,75)")
				.attr("height", big_box/2 - 1)
				.attr("width", big_box/2- 1 );
				
			canvas.append("text")
				.attr("class", small_box_3_t)
				.attr("fill", "black")
				.attr("font-size", "10px")
				.attr("dy", 10)
				.attr("x", x_init)
				.attr("y", y_init)
				.text("Atlikta");
			
			canvas.append("text")
				.attr("class", small_box_3_s)
				.attr("fill", "black")
				.attr("font-size", "46px")
				.attr("text-anchor", "end")
				.attr("dy", -3)
				.attr("dx", 0)
				.attr("x", x_init+big_box/2 - 3)
				.attr("y", y_init+big_box/2 - 3)
				.text(tasks_done[p]);
				
			//pradeta
			canvas.append("rect")
				.attr("fill", "rgb(230,229,36)")
				.attr("x", x_init)
				.attr("y", y_init + big_box/2 + 1)
				.attr("height", big_box/2 - 1)
				.attr("width", big_box/2- 1 );
				
			canvas.append("text")
				.attr("class", small_box_3_t)
				.attr("fill", "black")
				.attr("font-size", "10px")
				.attr("dy", 10)
				.attr("x", x_init)
				.attr("y", y_init+big_box/2 + 1)
				.text("Pradėta");
				
			canvas.append("text")
				.attr("class", small_box_3_s)
				.attr("fill", "black")
				.attr("font-size", "46px")
				.attr("text-anchor", "end")
				.attr("dy", -3)
				.attr("dx", 0)
				.attr("x", x_init+big_box/2 - 3)
				.attr("y", y_init+big_box/2 + 1+big_box/2 - 3)
				.text(tasks_start[p]);
				

			x_init = x_init + big_box/2 + 1;
			//vėluoja
			canvas.append("rect")
				.attr("fill", "rgb(238,228,172)")
				.attr("x", x_init)
				.attr("y", y_init)
				.attr("height", big_box/2 - 1)
				.attr("width", big_box/2- 1 );
				
			canvas.append("text")
				.attr("class", small_box_v_t)
				.attr("fill", "red")
				.attr("font-size", "10px")
				.attr("dy", 10)
				.attr("x", x_init)
				.attr("y", y_init)
				.text("Vėluoja");

			canvas.append("text")
				.attr("class", small_box_v_s)
				.attr("fill", "red")
				.attr("font-size", "46px")
				.attr("text-anchor", "end")
				.attr("dy", -3)
				.attr("dx", 0)
				.attr("x", x_init+big_box/2 - 3)
				.attr("y", y_init+big_box/2 - 3)
				.text(tasks_late[p]);
				
			//nepradeta
			canvas.append("rect")
				.attr("fill", "rgb(230,230,230)")
				.attr("x", x_init)
				.attr("y", y_init + big_box/2 + 1)
				.attr("height", big_box/2 - 1)
				.attr("width", big_box/2- 1 );
				
			canvas.append("text")
				.attr("class", small_box_3_t)
				.attr("fill", "black")
				.attr("font-size", "10px")
				.attr("dy", 10)
				.attr("x", x_init)
				.attr("y", y_init+ big_box/2 + 1)
				.text("Nepradėta");

			canvas.append("text")
				.attr("class", small_box_3_s)
				.attr("fill", "black")
				.attr("font-size", "46px")
				.attr("text-anchor", "end")
				.attr("dy", -3)
				.attr("dx", 0)
				.attr("x", x_init+big_box/2 - 3)
				.attr("y", y_init+big_box/2 + 1+big_box/2 - 3)
				.text(tasks_na[p]);
			
			
			x_init = x_init + big_box/2 - 1 + 5;
			//komanda
			
			canvas.append("rect")
			.attr("x", x_init)
			.attr("y", y_init)
			.attr("fill", "rgb(143,33,99)")
			.attr("height", big_box)
			.attr("width", big_box);
		
			canvas.append("text")
			.attr("class", big_box_t)
			.attr("fill", "white")
			.attr("font-size", "16px")
			.attr("dy", 16)
			.attr("dx", 2)
			.attr("x", x_init)
			.attr("y", y_init)
			.text("Komanda");
			
		var body = big_box/4;
		canvas.append("circle")
			.attr("class", "zmogeliukas")
			.attr("cx", x_init+big_box/2)
			.attr("cy", y_init+big_box/4)
			.attr("r", (body-2)/2);
		
		canvas.append("rect")
			.attr("class", "zmogeliukas")
			.attr("width", body)
			.attr("height", body+body/2)
			.attr("x", x_init+big_box/2-body/2)
			.attr("y", y_init+big_box/4+(body-2)/2+4)
			.attr("rx", body/2)
			.attr("ry", body/2);
		
		canvas.append("rect")
			.attr("class", "zmogeliukas")
			.attr("width", body-body/4)
			.attr("height", body*2)
			.attr("x", x_init+big_box/2-(body-body/4)/2)
			.attr("y", y_init+big_box/4+(body-2)/2+4)
			.attr("rx", body/2)
			.attr("ry", body/2);
			
		body = body*0.6;
		var right = big_box/6;
		var down = big_box/6;
		var left = big_box/6;
			
		canvas.append("circle")
			.attr("class", "zmogeliukas")
			.attr("cx", x_init+big_box/2+right)
			.attr("cy", y_init+big_box/4+down)
			.attr("r", (body-2)/2);
		
		canvas.append("rect")
			.attr("class", "zmogeliukas")
			.attr("width", body)
			.attr("height", body+body/2)
			.attr("x", x_init+big_box/2-body/2+right)
			.attr("y", y_init+big_box/4+(body-2)/2+4+down)
			.attr("rx", body/2)
			.attr("ry", body/2);
		
		canvas.append("rect")
			.attr("class", "zmogeliukas")
			.attr("width", body-body/4)
			.attr("height", body*2)
			.attr("x", x_init+big_box/2-(body-body/4)/2+right)
			.attr("y", y_init+big_box/4+(body-2)/2+4+down)
			.attr("rx", body/2)
			.attr("ry", body/2);
			
			
		canvas.append("circle")
			.attr("class", "zmogeliukas")
			.attr("cx", x_init+big_box/2-left)
			.attr("cy", y_init+big_box/4+down)
			.attr("r", (body-2)/2);
		
		canvas.append("rect")
			.attr("class", "zmogeliukas")
			.attr("width", body)
			.attr("height", body+body/2)
			.attr("x", x_init+big_box/2-body/2-left)
			.attr("y", y_init+big_box/4+(body-2)/2+4+down)
			.attr("rx", body/2)
			.attr("ry", body/2);
		
		canvas.append("rect")
			.attr("class", "zmogeliukas")
			.attr("width", body-body/4)
			.attr("height", body*2)
			.attr("x", x_init+big_box/2-(body-body/4)/2-left)
			.attr("y", y_init+big_box/4+(body-2)/2+4+down)
			.attr("rx", body/2)
			.attr("ry", body/2);
			
		canvas.append("text")
			.attr("class", big_box_s)
			.attr("fill", "black")
			.attr("font-size", "32px")
			.attr("dy", 32)
			.attr("dx", 0)
			.attr("text-anchor","middle")
			.attr("x", x_init+big_box/2)
			.attr("y", y_init+big_box/2)
			.text(project_team[p]);
			
			/*
			if( project_team[p] > 160 ) {
				canvas.append("text")
				.attr("class", se_t)
				.attr("fill", "black")
				.attr("font-size", "16px")
				.attr("dy", 16)
				.attr("x", x_init)
				.attr("y", y_init)
				.text("Komanda");
			
				canvas.append("text")
				.attr("class", se_s)
				.attr("fill", "rgb(34,187,173)")
				.attr("font-size", "90px")
				.attr("text-anchor", "middle")
				.attr("dy", 45)
				.attr("dx", 0)
				.attr("x", x_init+big_box/2)
				.attr("y", y_init+big_box/2)
				.text(project_team[p]);
			}
			if( project_team[p] < 160 ) {
				if( project_team[p] <= 10 ) {
					var row_cap = 5;
					var body = big_box/7;
				} 
			
				if( project_team[p] <= 30  && project_team[p] > 10 ) {
					var row_cap = 10;
					var body = big_box/13;
				}
			
				if( project_team[p] <= 75  && project_team[p] > 30 ) {
					var row_cap = 15;
					var body = big_box/21;
				}
			
				if( project_team[p] >75 ) {
					var row_cap = 20;
					var body = big_box/32;
				}
			

				var tarpas = body+2;
				var t_i = 0;
				var t_j = 0;
				var j = 0;
				var k = 0;
				var h = 0;
							
			//zmogeliukai
			for (var i = 0; i < project_team[p]; i++) {
				if ( i % 5 == 0 && i != 0) {
					j++;
					t_i = body*j;
				}
				
				if (i % row_cap == 0 && i != 0) {
					j=0;
					k=0;
					h++;
					t_j = body*4*h;
					t_i = 0;
				}
				canvas.append("circle")
					.attr("class", "zmogeliukas")
					.attr("cx", x_init+body/2+k*tarpas+t_i)
					.attr("cy", y_init+body/2+t_j)
					.attr("r", (body-2)/2);
				
				canvas.append("rect")
					.attr("class", "zmogeliukas")
					.attr("width", body)
					.attr("height", body+body/2)
					.attr("x", x_init+tarpas*k+t_i)
					.attr("y", y_init+body+t_j)
					.attr("rx", body/2)
					.attr("ry", body/2);
				
				canvas.append("rect")
					.attr("class", "zmogeliukas")
					.attr("width", body-body/4)
					.attr("height", body*2)
					.attr("x", x_init+body/8+tarpas*k+t_i)
					.attr("y", y_init+body+t_j)
					.attr("rx", body/2)
					.attr("ry", body/2);
				
				k++;
			}	
			}
			*/	
			x_init = x_init + big_box + 5;
			//likutis
			//startas
			canvas.append("rect")
				.attr("x", x_init)
				.attr("y", y_init)
				.attr("fill", "rgb(102,201,161)")
				.attr("height", big_box/2 - 1)
				.attr("width", big_box/2- 1 );
				
			canvas.append("text")
				.attr("class", small_box_3_t)
				.attr("fill", "black")
				.attr("font-size", "10px")
				.attr("dy", 10)
				.attr("x", x_init)
				.attr("y", y_init)
				.text("Startas");
			
			canvas.append("text")
				.attr("class", small_box_3_s)
				.attr("fill", "black")
				.attr("font-size", "18px")
				.attr("text-anchor", "end")
				.attr("dy", -3)
				.attr("dx", 0)
				.attr("x", x_init+big_box/2 - 3)
				.attr("y", y_init+big_box/2 - 3)
				.text(project_start[p]);
				
			//Pabaiga
			canvas.append("rect")
				.attr("fill", "rgb(56,114,184)")
				.attr("x", x_init)
				.attr("y", y_init + big_box/2 + 1)
				.attr("height", big_box/2 - 1)
				.attr("width", big_box/2- 1 );
				
			canvas.append("text")
				.attr("class", small_box_3_t)
				.attr("fill", "black")
				.attr("font-size", "10px")
				.attr("dy", 10)
				.attr("x", x_init)
				.attr("y", y_init+big_box/2 + 1)
				.text("Pabaiga");
				
			canvas.append("text")
				.attr("class", small_box_3_s)
				.attr("fill", "black")
				.attr("font-size", "18px")
				.attr("text-anchor", "end")
				.attr("dy", -3)
				.attr("dx", 0)
				.attr("x", x_init+big_box/2 - 3)
				.attr("y", y_init+big_box/2 + 1+big_box/2 - 3)
				.text(project_end[p]);
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
	
	this.Title = function(value) {
		if (value === undefined) {
			return title;
		} else {
			title = value;
			return this;
		}
	};
	
	this.BigBoxT = function(value) {
		if (value === undefined) {
			return big_box_t;
		} else {
			big_box_t = value;
			return this;
		}
	};
	
	this.BigBoxS = function(value) {
		if (value === undefined) {
			return big_box_s;
		} else {
			big_box_s = value;
			return this;
		}
	};
	
	
	this.SmallBox3T = function(value) {
		if (value === undefined) {
			return small_box_3_t;
		} else {
			small_box_3_t = value;
			return this;
		}
	};
	
	this.SmallBox3S = function(value) {
		if (value === undefined) {
			return small_box_3_s;
		} else {
			small_box_3_s = value;
			return this;
		}
	};
	
	this.SmallBoxVT = function(value) {
		if (value === undefined) {
			return small_box_v_t;
		} else {
			small_box_v_t = value;
			return this;
		}
	};
	
	this.SmallBoxVS = function(value) {
		if (value === undefined) {
			return small_box_v_s;
		} else {
			small_box_v_s = value;
			return this;
		}
	};
	
	this.SET = function(value) {
		if (value === undefined) {
			return se_t;
		} else {
			se_t = value;
			return this;
		}
	};
	
	this.SES = function(value) {
		if (value === undefined) {
			return se_s;
		} else {
			se_s = value;
			return this;
		}
	};
	
	
	
	

});
