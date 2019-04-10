'use strict';

var addMapControls = require('./addMapControls')
var showDataAtPoint = require('./show-data-at-point')
var locateUser = require('./locate-user')
var addStyleLayers = require('./add-style-layers')

// Enable Mapbox services
mapboxgl.accessToken = 'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2p1M3JuNnRjMGZ2NzN6bGVqN3Z4bmVtOSJ9.Fx0kmfg-7ll2Oi-7ZVJrfQ';

// App configuration
const _app = {
  map: {
    init: {
      container: 'map',
      style: 'mapbox://styles/planemad/cjoescdh20cl62spey0zj3v19',
      bounds: [66, 7, 99, 37],
      maxBounds: [50, 5, 114, 40],
      pitchWithRotate: false,
      hash: true
    }
  }
}

// Initialize GL map
var map = new mapboxgl.Map(_app.map.init);

map.on('load', () => {

  // Setup map layers for styling
  addStyleLayers(map);

  // Find user location
  locateUser(map);

  // Add map UI controls
  addMapControls(map, mapboxgl.accessToken, {
    MapboxGeocoder: {
      position: 'top-right',
      countries: 'in'
    }
  });
  map.touchZoomRotate.disableRotation();

  //Define map interactivity

  map.on('click', 'pc fill mask', (e) => {

    // Package the features at clicked location to resemble a tilequery result
    e.tileFeatures = {
      'ac': {},
      'pc': e.features[0],
      'schedule': {}
    }

    // Show constituency details at location
    showDataAtPoint(map, e)

  })

  // // Add hover effect on mouseover
  // var hoveredFeatureId = null;
  // map.on('mousemove', 'pc fill mask', (e) => {

  //   if (e.features[0].id != hoveredFeatureId) {

  //     var currentState = map.getFeatureState({
  //       source: 'mapbox://planemad.3picr4b8',
  //       sourceLayer: 'pc',
  //       id: e.features[0].id
  //     })['state']

  //     if (currentState != 'active') {

  //       map.removeFeatureState({
  //         source: 'mapbox://planemad.3picr4b8',
  //         sourceLayer: 'pc',
  //         id: hoveredFeatureId
  //       }, 'state');

  //       map.setFeatureState({
  //         source: 'mapbox://planemad.3picr4b8',
  //         sourceLayer: 'pc',
  //         id: e.features[0].id
  //       }, {
  //         state: 'hover'
  //       });

  //       hoveredFeatureId = e.features[0].id;

  //     }
  //   }
  // })

});