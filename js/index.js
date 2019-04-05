'use strict';

// Enable Mapbox services
mapboxgl.accessToken = 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2p1M3JuNnRjMGZ2NzN6bGVqN3Z4bmVtOSJ9.Fx0kmfg-7ll2Oi-7ZVJrfQ';

// App configuration
const _app = {
  map: {
    init: {
      container: 'map',
      style: 'mapbox://styles/planemad/cjoescdh20cl62spey0zj3v19',      zoom: 3.7,
      bounds: [66, 7, 99, 37],
      maxBounds: [50, 5, 114, 40],
      pitchWithRotate: false,
      hash: true
    }
  }
}

// Initialize GL map
var map = new mapboxgl.Map(_app.map.init);

map.on('load', function() {

  addMapControls(map, mapboxgl.accessToken, {
    MapboxGeocoder: {
      position:'top-right',
      country: 'in',
      bbox: _app.map.bounds
    },
    geoip: {
      server: 'https://publicmap-freegeoip.herokuapp.com/json/'
    }
  });

});
