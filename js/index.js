'use strict';

// Map configuration options
var mapLayers = require('./map-layer-config')

var addMapControls = require('./addMapControls')
var showDataAtPoint = require('./show-data-at-point')
var locateUser = require('./locate-user')
var addMapLayers = require('./add-map-layers')
var addSpreadsheetData = require('./add-spreadsheet-data')

//
// Map initialization
//

// Enable Mapbox services
mapboxgl.accessToken = mapLayers['access-token'];

// Initialize GL map
var map = new mapboxgl.Map(mapLayers.map);

// Add map UI controls
var mapControls = addMapControls(map, mapboxgl.accessToken, {
  mapConfig: mapLayers.map,
  search: {
    position: 'top-right',
    countries: 'in'
  }
});

map.on('load', () => {

  //
  // Map customizationns
  //

  // Setup map layers for styling
  addMapLayers(map);

  // Load additional attributes from spreadsheet
  addSpreadsheetData();

  //
  // Define map interactivity
  //

  // Find user location
  locateUser(map, mapControls.geolocate, mapLayers.map, showDataAtPoint);
  

  mapControls.search.on('result', (e)=>{
    showDataAtPoint(map, { lng: e.result.center[0], lat: e.result.center[1]}, e)
  })
  map.touchZoomRotate.disableRotation();


  map.on('click', mapLayers["click-layer-ids"][0], (e) => {

    map.flyTo({
      center: e.lngLat
    })
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