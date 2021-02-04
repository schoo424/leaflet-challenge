// Creating map object
var myMap = L.map("map-id", {
  center: [37.0902, -95.7129],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function that will determine the color of a neighborhood based on the borough it belongs to
function chooseColor(mag) {
  if (mag > 5.0) {
    return "red";
  }  
  
  else if (mag > 4.0) {
    return "orange";
  }
  
  else if (mag > 3.0) {
    return "yellow";
  }  

  else if (mag > 2.0) {
    return "#236AB9";
  }  
  else if (mag > 0) {
    return "blue";
  }

}

// Grabbing our GeoJSON data..
d3.json(link).then(function(data) {
  // Creating a geoJSON layer with the retrieved data
  L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    pointToLayer: function(feature,latlng) {
      return L.circleMarker(latlng)
    },
    style: function(feature) {
      return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        fillColor: chooseColor(feature.properties.mag),
        fillOpacity: .75,
        weight: 1.5,
        radius: feature.properties.mag*5
      };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
      // Set mouse events to change map styling
      // layer.on({
      //   // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
      //   mouseover: function(event) {
      //     layer = event.target;
      //     layer.setStyle({
      //       fillOpacity: 0.9
      //     });
      //   },
      //   // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
      //   mouseout: function(event) {
      //     layer = event.target;
      //     layer.setStyle({
      //       fillOpacity: 0.5
      //     });
      //   },
      //   // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
      //   click: function(event) {
      //     myMap.fitBounds(event.target.getBounds());
      //   }
      // });
      // Giving each feature a pop-up with information pertinent to it
      layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2> Magnitude: " + feature.properties.mag + "</h2>");

    }
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0,2.0,3.0,4.0,5.0],
          labels = [];
          colors = ["blue", "#236AB9", "yellow", "orange", "red"]

      // loop through our mag and generate a label with a color for each interval.  code gathered from https://leafletjs.com/examples/choropleth/
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +      
              grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap);

});



// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
// d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);

