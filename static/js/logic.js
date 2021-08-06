// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map("map", {
    center: [0, -10],
    zoom: 2
  });
  
  // Adding a tile layer (the background map image) to our map
  // We use the addTo method to add objects to our map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson').then(({features})=>{
      console.log(features[100].properties);

        function getColor(depth) {
            switch (true) {
                case depth>90:
                    return 'red'
                case depth>60:
                    return 'yellow'
                case depth<61:
                    return 'green'
            }
        };

      features.forEach(obj => {
          var lat = obj.geometry.coordinates[1];
          var lng = obj.geometry.coordinates[0];
          var depth = obj.geometry.coordinates[2];
          var mag = obj.properties.mag;
          var place = obj.properties.place;

          L.circleMarker([lat,lng], 
            {'radius':mag*2,
            'color':'black',
            'weight':1.5,
            'fillColor':getColor(depth),
            'fillOpacity':.7
        }).bindPopup(place+'<br>Magnitude: '+mag).addTo(myMap)
      });
  });

  var legend = L.control({position:'bottomright'});

  legend.onAdd = function () {
      var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML += '<i style="background:red";>>90</i><br>'
      div.innerHTML += '<i style="background:yellow";>>60</i><br>'
      div.innerHTML += '<i style="background:green";><60</i><br>'
      return div;
  };

  legend.addTo(myMap)