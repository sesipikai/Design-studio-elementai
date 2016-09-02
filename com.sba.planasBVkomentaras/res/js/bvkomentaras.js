define(["css!../css/component.css","sap/designstudio/sdk/component"], function(css, Component) {
Component.subclass("com.sba.bvkomentaras.BVkomentaras", function() {
	
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
	var triggerv;
	var triggerc = 1;
	
	this._poller = null;
	this._pollInterval = 250;
	this._previosWidth = -1;
	this._previousHeight = -1;
	this._naudojamas_ugis = 100;
	this._naudojamas_plotis = 100;
	
	
	var YYYYMM;
	var PLANT;
	var GRUPE;
	var SPALVA;
	var ARTIKULAS;
	var MATERIAL;
	var KG;
	var KP;
	
	
	
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
			this.drawbvkomentaras();
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
		if (trigger_v == triggerc) {
			this.addkomentarasdetalus();
			triggerc = trigger_v + 1; 
		}
		this.drawbvkomentaras();
	};

	this.drawbvkomentaras = function(){
			
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
			
			
			var mygtukas = canvas.append("rect")
								.attr("x",0)
								.attr("y",0)
								.attr("width",width)
								.attr("height",height)
								.attr("style","fill:red")
								.style("fill-opacity",0)
								.on("click", function (d,i) {addkomentarasdetalus(); return i;});
			
			that._poller = window.setTimeout(function(){that.measureSize(that)},that._pollInterval);	
	};
	
	this.addkomentarasdetalus = function(){
		var url = "http://bo4.sba.lt:8080/Links/Publikavimas/PlanasBVkomentarai/add_detalus.jsp?&YYYYMM="+YYYYMM
						+"&PLANT="+ PLANT
						+"&GRUPE=" + GRUPE
						+"&SPALVA=" + SPALVA
						+"&ARTIKULAS=" + ARTIKULAS
						+"&MATERIAL="+ MATERIAL
						+"&KP="+ encodeURI(KP)
						+"&KG="+ encodeURI(KG);
		var mano_popupas = window.open(url);
		setTimeout(function () {mano_popupas.close();}, 1000);
						
		
	};
	
	this.data = function(value) {
		if (value === undefined) {
			return chart_data;
		} else {
			chart_data = value;
			return this;
		}
	};
	this.menesis = function(value) {
		if(value === undefined) {
			return YYYYMM;
		} else {
			YYYYMM = value;
			return this;
		}
	};
	this.plant = function(value) {
		if(value === undefined) {
			return PLANT;
		} else {
			PLANT = value;
			return this;
		}
	};
	this.grupe = function(value) {
		if(value === undefined) {
			return GRUPE;
		} else {
			GRUPE = value;
			return this;
		}
	};
	this.spalva = function(value) {
		if(value === undefined) {
			return SPALVA;
		} else {
			SPALVA = value;
			return this;
		}
	};
	this.artikulas = function(value) {
		if(value === undefined) {
			return ARTIKULAS;
		} else {
			ARTIKULAS = value;
			return this;
		}
	};
	this.material = function(value) {
		if(value === undefined) {
			return MATERIAL;
		} else {
			MATERIAL = value;
			return this;
		}
	};
	this.kp = function(value) {
		if(value === undefined) {
			return KP;
		} else {
			KP = value;
			return this;
		}
	};
	this.kg = function(value) {
		if(value === undefined) {
			return KG;
		} else {
			KG = value;
			return this;
		}
	};

	this.triggerv = function(value) {
		if(value === undefined) {
			return trigger_v;
		} else {
			trigger_v = value;
			return this;
		}
	};

});
});
