        //Initialize the leaflet map
        var map = L.map('map', {
            center: [38.0147,-84.483],
            zoom: 11,
            //minZoom: 10,
            //maxZoom: 26,
            zoomControl: true,
            dragging: true,
        });
               
        //Create the layer and add it to the map
        var layer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	        subdomains: 'abcd',
	        //minZoom: 0,
	        //maxZoom: 20,
	        ext: 'png'
        });
        map.addLayer(layer);     
       
       //Load tract data as leaflet geoJSON 
       //Assign the style and onEachFeature functions
       //Add the resulting features to the map
        var geojson = L.geoJson(tracts, {
        		style: style,
        		onEachFeature: onEachFeature
        }).addTo(map);
		
		//Create a leaflet control for the legend
		//Give the legend an onAdd handler
		//Add the legend to the map
        var legend = L.control({position: 'bottomright'});
        
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [1000, 2000, 3000, 4000, 5000],
                labels = [];
            // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < grades.length; i++) {
                console.log("legend for "+ grades[i] + " to "+grades[i+1]+" = " +getColor(grades[i] + 1));
                div.innerHTML +=
                    '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }  
            return div;
        };
        legend.addTo(map);
        
        
    //*
    //STYLE CREATION
    
    //Given a value for the property DEC_10_S_2, return a specific color
    function getColor(DEC_10_S_2) {
        return DEC_10_S_2 >= 5000 ? '#810f7c' :
           DEC_10_S_2 >= 4000 ? '#8856a7' :
           DEC_10_S_2 >= 3000 ? '#8c96c6' :
           DEC_10_S_2 >= 2000 ? '#9ebcda' :
           DEC_10_S_2 >= 1000 ? '#bfd3e6' :
                      '#ffffff';
    } 
        
    //Given a feature, return an object with style properties that leaflet unsderstands   
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.DEC_10_S_2),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        }
    }    
 
    //**
    //DOM EVENTS (Interactive stuff)
    //Change a layer's style when passed a DOM event (e)
    function highlightFeature(e) {
    	var layer = e.target;
    	layer.setStyle({
    		weight: 5,
    		color: '#666',
    		dashArray: '',
    		fillOpacity: 0.7
        });

    	if (!L.Browser.ie && !L.Browser.opera) {
    		layer.bringToFront();
    	}

        //FIXME: Info hasn't been defined
	    //info.update(layer.feature.properties);
    }
    
    //Reset a layer's style when passed a DOM event 
    //(I guess leaflet keeps track of past layer styles?)    
    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        //FIXME: Info hasn't been defined
    	//info.update();
    }
    
    //Zoom to a feature when passed a DOM event
    function zoomToFeature(e) {
    	map.fitBounds(e.target.getBounds());
    }
    
    //Now that the event handlers are written, assign them to
    //specific DOM events that could happen to the layer
    function onEachFeature(feature, layer) {
    	layer.on({
    		mouseover: highlightFeature,
    		mouseout: resetHighlight,
    		click: zoomToFeature
    	});
    }
    
    map.fitBounds(geojson.getBounds());