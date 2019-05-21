'use strict';

var addMapControls = require('./addMapControls')
var showDataAtPoint = require('./show-data-at-point')
var locateUser = require('./locate-user')
var mapLayers = require('./map-layer-config')
var addMapLayers = require('./add-map-layers')
var addSpreadsheetData = require('./add-spreadsheet-data')

// Enable Mapbox services
mapboxgl.accessToken = mapLayers['access-token'];

// Initialize GL map
var map = new mapboxgl.Map(mapLayers.map);

map.on('load', () => {

  // Setup map layers for styling
  addMapLayers(map);

  // Load additional attributes from spreadsheet
  addSpreadsheetData();

  // Find user location
  locateUser(map, showDataAtPoint);

  // Add map UI controls
  addMapControls(map, mapboxgl.accessToken, {
    MapboxGeocoder: {
      position: 'top-right',
      countries: 'in'
    }
  });
  map.touchZoomRotate.disableRotation();

  //Define map interactivity

  map.on('click', mapLayers["click-layer-ids"][0], (e) => {

    // Show details of map features at location
    showDataAtPoint(map, e.lngLat)

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