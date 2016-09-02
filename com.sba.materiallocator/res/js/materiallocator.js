sap.designstudio.sdk.Component.subclass("com.sba.materiallocator.Materiallocator", function() {
	
	var that = this;
	var canvas = undefined;
	var chart_ID = "";
	
	this.init = function() {
		var container = this.$()[0];
		this.$().click(function() {
			that.fireEvent("onclick");
		});
		this.$().mouseover(function()
		{
			that.fireEvent("mouseover");
		});
		chart_ID = "id"+Math.random();
		canvas = d3.select(container).append("svg:svg").attr("id","id"+chart_ID.substring(4, 20)).attr("width", "100%").attr("height", "100%").append("g");
		//this.$().append( "<div id='MANODIV' style='width:100%;height:100%;'>"); //sukuriam savo DIV grafikui
	};

	this.afterUpdate = function() {
		
		drawLocator();
	};

	function drawLocator(){
		if(true) { //jei turim duomenu
			
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
			var values = []; //naujas 1 x n masyvas
			var new_length = 0; //naujo masyvo ilgis
			
			//var Locations_array = headers;
			var Locations_array = headers;
			if(chart_data){
				var Locations_array = headers;
			} else {
				var Locations_array = [];
			}
			var Kiekis_array = [];
			var Porcija_array= [];
			
			
			for(var i = 0; i<Locations_array.length; i++){
				Kiekis_array[i] = data[i][0];
				Porcija_array[i] = data[i][1];
			}
			
			//var rows = 15;
			//var columns = 5;
			var gap = 1;
			var sizeW = 10;
			var sizeH = 10;
			var rc = columns*blocks + blocks*3;
			sizeW = (width-10-rc*gap)/rc;
			rc = rows + 1;
			sizeH = (height-offset_top - gap*rc)/rc; 
			if ((rows+1)*(sizeW+gap) > (height-offset_top)) {
				size = sizeH;
			} else {
				size = sizeW;
			}
			//var size = (Math.min(height-offset_top,width) - (rc+1)*gap)/(rc+1);
			var dataArray = [];
			var Sandelys_array = [];
			var Rampa_array = [];
			var Pozicija_array = [];
			var Aukstis_array = [];
			var bruksnys = 0;
			var Stringas = "";
			var Rampa = 0;
			var Pozcija = 0;
			var Aukstis = 0;
			var place_array = [];
			var k = 0;
			var max = d3.max(Porcija_array);
			
			var fill_array = [];
			for(var i = 0; i < (rows*columns)*blocks; i++){
				fill_array[i] = 0;
			}
			for(var i = 0; i < Locations_array.length; i++){
				Stringas = Locations_array[i];
				if (Stringas.indexOf("-") != -1 ) {
					Sandelys_array[i] = Stringas.substring(0,2);
					Stringas = Stringas.substring(3);
				} else {Sandelys_array[i] = "0";}
				if (Stringas.indexOf("-") != -1 ) {
					Rampa = Stringas.substring(0,Stringas.indexOf("-"));
					//isveciam i rampos indeksa
					if (Rampa == "A") {Rampa_array[i]=0;}
					if (Rampa == "B") {Rampa_array[i]=1;}
					if (Rampa == "C") {Rampa_array[i]=2;}
					if (Rampa == "D") {Rampa_array[i]=3;}
					if (Rampa == "E") {Rampa_array[i]=4;}
					if (Rampa == "F") {Rampa_array[i]=5;}
					if (Rampa == "G") {Rampa_array[i]=6;}
					if (Rampa == "H") {Rampa_array[i]=7;}
					if (Rampa == "I") {Rampa_array[i]=8;}
					if (Rampa == "J") {Rampa_array[i]=9;}
					if (Rampa == "K") {Rampa_array[i]=10;}
					if (Rampa == "L") {Rampa_array[i]=11;}
					if (Rampa == "M") {Rampa_array[i]=12;}
					if (Rampa == "N") {Rampa_array[i]=13;}
					if (Rampa == "O") {Rampa_array[i]=14;}
					if (Rampa == "P") {Rampa_array[i]=15;}
					if (Rampa == "Q") {Rampa_array[i]=16;}
					if (Rampa == "R") {Rampa_array[i]=17;}
					if (Rampa == "S") {Rampa_array[i]=18;}
					if (Rampa == "T") {Rampa_array[i]=19;}
					if (Rampa == "U") {Rampa_array[i]=20;}
					if (Rampa == "V") {Rampa_array[i]=21;}
					if (Rampa == "W") {Rampa_array[i]=22;}
					if (Rampa == "X") {Rampa_array[i]=23;}
					if (Rampa == "Y") {Rampa_array[i]=24;}
					if (Rampa == "Z") {Rampa_array[i]=25;}
					Stringas = Stringas.substring(Stringas.indexOf("-")+1);
				} else {Rampa_array[i] = 100;} 
				if (Stringas.indexOf("-") != -1 ) {
					Pozicija_array[i] = parseInt(Stringas.substring(0,Stringas.indexOf("-")));
					Aukstis = Stringas.substring(Stringas.indexOf("-")+1);
					if(Aukstis == "I") {Aukstis_array[i]=0;}
					if(Aukstis == "II") {Aukstis_array[i]=1;}
					if(Aukstis == "III") {Aukstis_array[i]=2;}
					if(Aukstis == "IV") {Aukstis_array[i]=3;}
					if(Aukstis == "V") {Aukstis_array[i]=4;}
					if(Aukstis == "VI") {Aukstis_array[i]=4;}
					if(Aukstis == "VII") {Aukstis_array[i]=4;}
					if(Aukstis == "VIII") {Aukstis_array[i]=4;}
					if(Aukstis == "IX") {Aukstis_array[i]=4;}
					if(Aukstis == "X") {Aukstis_array[i]=4;}
				} else {Pozicija_array[i] = 100; Aukstis_array[i] = 100;}
				if(Rampa_array[i] != 100 && Aukstis_array[i] != 100 && Pozicija_array[i] != 100) {
					place_array[k] = Rampa_array[i]*(rows*columns) + Aukstis_array[i]*rows + Pozicija_array[i]-1;
					fill_array[Pozicija_array[i]-1+(Rampa_array[i]*(columns*rows))]=1;
					fill_array[rows+Aukstis_array[i]+(Rampa_array[i]*(columns*rows))]=1;
					k++;				
				}
			}
					
			var l_array = [];
			var k = 0;
			for(var b=0; b<blocks; b++){
				for (var i=0; i<rows; i++) {
					for (var j=0; j<columns; j++){
						dataArray[k] = 0;
						for( var z=0; z<Locations_array.length; z++){
							if(k==place_array[z]) {
								dataArray[k] = z;
							}
						}
						k++;
					}	
				}
			}
			//Locations_array.length+max jei norim piesti legenda
			for(var i = 0; i < Locations_array.length; i++){
				dataArray[k]=1;
				k++;
			}

			var indk = 0;
			for(var ind = 0; ind < (rows)*(columns)*blocks; ind++){
				indk = ind;
				l_array[ind]=0;
				while (indk >= rows*columns ){
					indk = indk - (rows*columns); 
				}
				if (indk < rows ) {
					l_array[ind] = 1;
				}			
				if (indk >= rows && indk < rows+columns) {
					l_array[ind] = 2;
				}
				
			}
			
			
			var k = 0;
			var labelArray = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]; 
			
			var tip = d3.tip()
						.attr('class', 'd3-tip')
						.offset([-10, 0])
						.html(function(d ,i) {
							if (i < rows*columns*blocks) {
								return "-";
							} else {
								return "<b>"+Locations_array[i-rows*columns*blocks]+"</b></br>"+
										"Porcijos nr: "+Porcija_array[i-rows*columns*blocks]+"</br>"+
										"Kiekis: " + Kiekis_array[i-rows*columns*blocks];
							}
										
					});		
			
			var bars = canvas.selectAll("rect")
							.data(dataArray)
							.enter()
								.append("rect")
								.attr("fill", color_off)
								.attr("width", size)
								.attr("height", size)
								.attr("y", function(d, i) {
									var y = (i-(Math.floor(i/rows))*rows)*(size+gap)+(size+gap);
									if ( i >= rows*columns*blocks) { y = -10 ;}
									return y; })
								.attr("id", function(d,i) {
									var id = "peseant";
									if (i >=rows*columns*blocks) { id = "royal"+(i-rows*columns*blocks);}
									return id;
								})
								.on('mouseover', tip.show)
								.on('mouseout', tip.hide)
								.attr("transform", "translate(10,"+offset_top+")")
								.attr("x", function(d, i) {
									var x = (Math.floor(i/rows)*(size+gap)+(size+gap)) + Math.floor(i/(rows*columns))*(columns/1.5)*(size+gap);
									if ( i >= rows*columns*blocks) { x = (size+gap)*(Porcija_array[i-rows*columns*blocks]) ; }
									return x;
								});
			
			
								
			for(var i = 0; i < Locations_array.length; i++){
				//if( i >= max ) {
				//	var color = Math.floor(83+(i-max)*360/(max));
				//	if (color > 360) {color = color - 360;}
				//	color = 0;
				//	canvas.select("#royal"+i)
				//			.attr("fill", color_on);
				//} else {
					var opacity = 0;
					if(place_array.length>0){
						opacity = 1;
					}
					var color = Math.floor(83+(Porcija_array[i]-1)*360/(max));
					if (color > 360) {color = color - 360;}
					color = 0;
					canvas.select("#royal"+i)
							.attr("fill", color_on)
							.transition()
							.style("opacity", opacity)
							.duration(1500)
							.attr("x", Math.floor(place_array[i]/rows)*(size+gap)+(size+gap) + Math.floor(place_array[i]/(rows*columns))*((columns/1.5)*(size+gap)) )
							.attr("y", (place_array[i]-(Math.floor(place_array[i]/rows))*rows)*(size+gap)+(size+gap));
							
				//}
			}
			
			canvas.call(tip);
										
			var labels = canvas.selectAll("text")
							.data(l_array)
							.enter()
								.append("text")
								.attr("fill", function(d, i) {
									var returncolor = color_off;
									if (fill_array[i] == 1) {
										returncolor = color_on;
									} 
									return returncolor;}
									)
								.attr("font-size", function(d,i) {
									var fsize = size+"px";
									if (d == 2) {
										fsize = size/1.5 +"px";
									}
									return fsize;
								})
								.attr("y", function(d, i) {
									var y = (i-(Math.floor(i/rows))*rows)*(size+gap)+(size+gap);
									if (d == 2) {
										y = size/2+size/4;
									}
									return y;
								})
								.attr("dy",function(d,i) {
									var dy = size/8 +"px";
									if (d == 1) {
										dy =(size/2+size/4 + gap)+"px";
									}
									return dy;
								})
								.attr("dx",function(d,i) {
									var dx = "0px";
									if (d == 2) {
										dx = size/4+"px";
									}
									return dx;
								})							
								.attr("x", function(d, i) {
									var x = size;
									var k = i;
									var blocknum = Math.floor(i/(rows*columns));
									k = k - blocknum*(rows*columns);
									x = x + blocknum*((columns/1.5)*(size+gap) + columns *(size+gap));
									var si = k - rows;
									if (d == 2) {
										x = (si)*(size+gap) + (size+gap) + (size/4) + blocknum*((columns/1.5)*(size+gap) + columns *(size+gap));
									}
									return x; })
								.attr("text-anchor", function(d,i) {
									var anchor = "end";
									if (d == 2) {
										anchor = "middle";
									}
									return anchor;
								})
								.attr("transform", "translate(10,"+offset_top+")")
								.text(function(d,i) {
									var text = "";
									var ki = 0;
									ki = i;
									while (ki >= rows*columns) {
										ki = ki - rows*columns;
									}
									if( d == 1 ) {
										text = ki+1;
									}
									if (d == 2) {
										text = labelArray[ki-rows];
									}								
									return text;
								
								});
			
			for(var i = 0; i<Locations_array.length; i++){
				canvas.append("text")
					.attr("x", 0)
					.attr("y", i*10+10)
					.attr("text", Locations_array[i]);
			}
			
			canvas.append("text")
				.attr("x",0)
				.attr("y",0)
				.attr("text",max);
			
			canvas.append("text")
			.attr("x",0)
			.attr("y",0)
			.attr("text",place_array.length);
				
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
	
	this.offsetTop = function(value) {
		if(value === undefined) {
			return offset_top;
		} else {
			offset_top = value;
			return this;
		}
	};
	
	this.Rows = function(value) {
		if(value === undefined) {
			return rows;
		} else {
			rows = value;
			return this;
		}
	};
	
	this.Columns = function(value) {
		if(value === undefined) {
			return columns;
		} else {
			columns = value;
			return this;
		}
	};
	
	this.Blocks = function(value) {
		if(value === undefined) {
			return blocks;
		} else {
			blocks = value;
			return this;
		}
	};
	
	this.Coloroff = function(value) {
		if(value === undefined) {
			return color_off;
		} else {
			color_off = value;
			return this;
		}
	};
	
	this.Coloron = function(value) {
		if(value === undefined) {
			return color_on;
		} else {
			color_on = value;
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
	
	
	

});
