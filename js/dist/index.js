(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {"1":{"ECI_code":"S09","state":"Jammu & Kashmir"},"2":{"ECI_code":"S08","state":"Himachal Pradesh"},"3":{"ECI_code":"S19","state":"Punjab"},"4":{"ECI_code":"U02","state":"Chandigarh"},"5":{"ECI_code":"S28","state":"Uttarakhand"},"6":{"ECI_code":"S07","state":"Haryana"},"7":{"ECI_code":"U05","state":"NCT OF Delhi"},"8":{"ECI_code":"S20","state":"Rajasthan"},"9":{"ECI_code":"S24","state":"Uttar Pradesh"},"10":{"ECI_code":"S04","state":"Bihar"},"11":{"ECI_code":"S21","state":"Sikkim"},"12":{"ECI_code":"S02","state":"Arunachal Pradesh"},"13":{"ECI_code":"S17","state":"Nagaland"},"14":{"ECI_code":"S14","state":"Manipur"},"15":{"ECI_code":"S16","state":"Mizoram"},"16":{"ECI_code":"S23","state":"Tripura"},"17":{"ECI_code":"S15","state":"Meghalaya"},"18":{"ECI_code":"S03","state":"Assam"},"19":{"ECI_code":"S25","state":"West Bengal"},"20":{"ECI_code":"S27","state":"Jharkhand"},"21":{"ECI_code":"S18","state":"Odisha"},"22":{"ECI_code":"S26","state":"Chhattisgarh"},"23":{"ECI_code":"S12","state":"Madhya Pradesh"},"24":{"ECI_code":"S06","state":"Gujarat"},"25":{"ECI_code":"U04","state":"Daman & Diu"},"26":{"ECI_code":"U03","state":"Dadra & Nagar Haveli"},"27":{"ECI_code":"S13","state":"Maharashtra"},"29":{"ECI_code":"S10","state":"Karnataka"},"30":{"ECI_code":"S05","state":"Goa"},"31":{"ECI_code":"U06","state":"Lakshadweep"},"32":{"ECI_code":"S11","state":"Kerala"},"33":{"ECI_code":"S22","state":"Tamil Nadu"},"34":{"ECI_code":"U07","state":"Puducherry"},"35":{"ECI_code":"U01","state":"Andaman & Nicobar Islands"},"36":{"ECI_code":"S29","state":"Telangana"},"37":{"ECI_code":"S01","state":"Andhra Pradesh"}};
},{}],2:[function(require,module,exports){
var mapLayers = require('./map-layer-config')
var ECILookup = require('./ECILookup')
// var mapLayers = {}


module.exports = addMapLayers

// Add styling to map layers to show active and hover constituencies

function addMapLayers(map) {

    map.setPaintProperty('pc line border-highlight', 'line-color', [
        "match", ["feature-state", "state"], 'active',
        "hsl(62, 97%, 61%)",
        "hsl(22, 98%, 92%)"
    ])

    map.setPaintProperty('pc line border-highlight', 'line-gap-width', [
        "match", ["feature-state", "state"], 'active',
        1,
        "match", ["feature-state", "state"], 'hover',
        0,
        0
    ])

    map.setPaintProperty('pc fill mask', 'fill-opacity', [
        "match", ["feature-state", "state"], 'active',
        0,
        "match", ["feature-state", "state"], 'hover',
        0.2,
        0.6
    ])

}
},{"./ECILookup":1,"./map-layer-config":8}],3:[function(require,module,exports){
/**
 * Mapbox Marker
 * Add a marker upon user click
 * Remove any existing marker before adding one
 */

// Track marker so that we can remove on the next user click
var marker;

function addMarker(map, e) {

  // Remove existing marker
  if (marker) {
    marker.remove();

    // Quick hack so that it is easy to check whether user has clicked
    marker = undefined;
  }

  // Add marker on user click
  marker = new mapboxgl.Marker()
    .setLngLat(e.lngLat)
    .addTo(map)
  ;

  map.flyTo({center: [e.lngLat.lng,e.lngLat.lat]})

}

function userHasClicked() {
  return marker !== undefined;
}

module.exports = { addMarker, userHasClicked, };

},{}],4:[function(require,module,exports){
module.exports = addSpreadsheetData;

// https://docs.google.com/spreadsheets/d/e/2PACX-1vS28qKU6gXipgNSwla32jCSh4UhCzcg9VE9GgPfjDVu56wTW-gbLZiWI1xrK6xmKbl2LwAO3Ib9ThsZ/pub?output=csv

// https://docs.google.com/spreadsheets/d/e/2PACX-1vS28qKU6gXipgNSwla32jCSh4UhCzcg9VE9GgPfjDVu56wTW-gbLZiWI1xrK6xmKbl2LwAO3Ib9ThsZ/pub?gid=1578100145&single=true&output=csv
function addSpreadsheetData() {
}
},{}],5:[function(require,module,exports){
/*
 * Mapbox GL Tools - Add Default Mapbox Controls
 * Adds a set of UI controls for Mapbox Maps
 */

function addMapControls(map, accessToken, options) {

  // Add  map UI controls
  var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-right');

  if (typeof accessToken !== 'undefined') {
    var geocoder = new MapboxGeocoder({
      accessToken: accessToken,

      // limit results 
      countries: options.MapboxGeocoder.countries,

      // further limit results to the geographic bounds representing the region
      bbox: options.MapboxGeocoder.bbox

    });
    map.addControl(geocoder, options.MapboxGeocoder.position || 'top-left');

    // Listen for the `result` event from the MapboxGeocoder that is triggered when a user
    // makes a selection and add a symbol that matches the result.
    geocoder.on('result', function (event) {});

  }

  var scale = new mapboxgl.ScaleControl({
    maxWidth: 80,
    unit: 'metric'
  });
  map.addControl(scale);


  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

  return {
    NavigationControl : nav,
    MapboxGeocoder : geocoder,
    ScaleControl : scale
  }
}

module.exports = addMapControls;

},{}],6:[function(require,module,exports){
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
},{"./add-map-layers":2,"./add-spreadsheet-data":4,"./addMapControls":5,"./locate-user":7,"./map-layer-config":8,"./show-data-at-point":10}],7:[function(require,module,exports){
var Markers = require('./add-marker');
var mapLayers = require('./map-layer-config')

var browserLocated = false

module.exports = locateUser

function errorHandler(err) {
  console.log('Error getting accurate user location', err)
}

function locateUser(map, showDataAtPoint) {

  // Checks if a given point is within the default map area
  function isPointWithinBounds(lngLat){
    if (lngLat.lng > mapLayers.map.bounds[0] && lngLat.lng < mapLayers.map.bounds[2] && lngLat.lat > mapLayers.map.bounds[1] && lngLat.lat < mapLayers.map.bounds[3]) {
      return true;
    }else{
      return false;
    }
  }

  // Display user location on the map
  function showLocation(lngLat) {

    // User has an active location clicked and thus we don't need Browser Geolocation
    if (Markers.userHasClicked()) {
      return;
    }

    // Abort if user coordinate is outside map area
    if (!isPointWithinBounds(lngLat)) {
      return
    }

    map.flyTo({
      center: [lngLat.lng, lngLat.lat],
      zoom: 9
    });

    showDataAtPoint(map, {
      lngLat: lngLat
    })

  }

  // Try to determinne accurate user locationn using HTML5 geolocation
  if (navigator.geolocation && !Markers.userHasClicked()) {
    // timeout at 60000 milliseconds (60 seconds)
    var options = {
      enableHighAccuracy: true,
      timeout: 60000
    }
    function showGeoLocation(postion){
      showLocation({
        lng: position.coords.longitude,
        lat: position.coords.latitude
      })
    }
    navigator.geolocation.getCurrentPosition(showGeoLocation, errorHandler, options)
  } else {
    console.log("Browser does not support geolocation!")
  }

  // we fire the IP location request after 2 seconds
  // if the browser location has not worked until then
  // if the user clicked, do not fire the request
  //                      do not display if the user clicked in between
  setTimeout(() => {
    if (browserLocated || Markers.userHasClicked()) return
    fetch('https://publicmap-freegeoip.herokuapp.com/json/')
      .then(response => response.json())
      .then(body => {
        if (!browserLocated && !Markers.userHasClicked()) {

          browserLocated = true

          showLocation({
            lng: body.longitude,
            lat: body.latitude
          })

        }
      })
  }, 2000)
}
},{"./add-marker":3,"./map-layer-config":8}],8:[function(require,module,exports){
module.exports = {
    'access-token' :'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2p1M3JuNnRjMGZ2NzN6bGVqN3Z4bmVtOSJ9.Fx0kmfg-7ll2Oi-7ZVJrfQ',
     // Map innitialization
     map: {
        container: 'map',
        style: 'mapbox://styles/planemad/cjoescdh20cl62spey0zj3v19',
        bounds: [66, 7, 99, 37],
        maxBounds: [50, 5, 114, 40],
        pitchWithRotate: false,
        hash: true
      },
    // Queryable feature layers on click
    // for the queries to work, then need to be visible in the map style
    // to make innvisible queryable layers, set the paint opacity to 0
    'click-layer-ids': ['pc fill mask','ac fill mask'],
    // Corresponding tileset ids for feature querying
    'click-layer-tileset-ids': ['planemad.3picr4b8']
}
},{}],9:[function(require,module,exports){
module.exports = queryLayerFeatures;

// Mapbox GL utility function to query for features at a point 
// Extends queryRenderedFeatures by using the tilequery API to fetch features not in view
function queryLayerFeatures(map, latLng, layers, cb, options) {

  // Find the tileset ids of the layers
  var tilesetIds = []
  layers.forEach(layer => {
    // Extract the tileset id from the source id
    tilesetIds.push(map.getLayer(layer).source.slice(9));
  })
  tilesetIds = [...new Set(tilesetIds)];

  // Create object to hold query results of map features at a point
  var featuresAtPoint = {queryLocation: latLng};

  // Attempt to query the visible tile layers directly instead of using a request to the tilequery API
  map.queryRenderedFeatures(map.project(latLng), {
    layers: layers
  }).forEach(feature => {
    featuresAtPoint[feature.sourceLayer] = feature;
  })

  // If not successful in getting the results directly from loaded tiles
  // fetch the features at that point using the tilequery API
  if (Object.keys(featuresAtPoint).length == 1) {

    // Fetch features from the array of tileset ids using the Mapbox tilequery API
    // Create an array of tilequery  urls and fetch them using promises
    var fetchRequests = tilesetIds.map(tileset =>
      // Mapbox tilequery API: https://docs.mapbox.com/help/interactive-tools/tilequery-api-playground/
      fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${latLng.lng},${latLng.lat}.json?limit=5&radius=0&dedupe=true&access_token=${mapboxgl.accessToken}`)
      .then(resp => resp.json())
    )

    // Fetch and bundle all the results
    Promise.all(fetchRequests)
    .then(response => {
      // Add all features from the tilequery results to the result object
      response.forEach(featureCollection => {
        featureCollection.features.forEach(feature => {
          featuresAtPoint[feature.properties.tilequery.layer] = feature;
        })
      });

      // Update panel with results
      cb(map, featuresAtPoint);

    })
  }else{
    // Update panel with results
    cb(map, featuresAtPoint);
  }

  return featuresAtPoint;

}
},{}],10:[function(require,module,exports){
var ECILookup = require('./ECILookup')
var Markers = require('./add-marker')
var mapLayers = require('./map-layer-config')
var queryLayerFeatures = require('./query-layer-features')

module.exports = showDataAtPoint

function showDataAtPoint(map, e) {

  // Add a map marker at clicked location and move the map to center it
  Markers.addMarker(map, e);
  map.flyTo({
    center: [e.lngLat.lng, e.lngLat.lat]
  })

  queryLayerFeatures(map,e.lngLat,mapLayers["click-layer-ids"], updateInfoPanel)

}

function updateInfoPanel(map, featuresAtPoint) {

  console.log('Features at queried point:', featuresAtPoint);

  // Add a loading spinner to the infoPanel while we fetch data
  document.getElementById('infoPanel').innerHTML = '';
  document.getElementById('infoPanel').classList.add('loading', 'loading--s');

  var ECI_code = ECILookup[String(featuresAtPoint.pc.properties.st_code)]['ECI_code'];

  // Composing link to Official ECI candidates affidavits page: https://affidavit.eci.gov.in/showaffidavit/1/S13/34/PC
  var ECIAffidavit_URL = `https://affidavit.eci.gov.in/showaffidavit/1/${ECI_code}/${String(featuresAtPoint.pc.properties.pc_no)}/PC`;

  // Composing info
  var info = `<span class='txt-light'>2019 Lok Sabha Elections</span><br>
    <span class='txt-light'>Your Constituency: </span><b>${featuresAtPoint.pc.properties.pc_name}</b> (${featuresAtPoint.pc.properties.pc_no})<br>
    <span class='txt-light'>Voting is on: </span><b>${featuresAtPoint.pc.properties['2019_election_date'].split('T')[0]}</b> (Phase ${featuresAtPoint.pc.properties['2019_election_phase']})<br>
    <a href="${ECIAffidavit_URL}" target="_blank" class="link">Click here to see the Candidates</a> <br>
    State: ${featuresAtPoint.pc.properties.st_name} (${ECI_code})<br>
    `;
  document.getElementById('infoPanel').classList.remove('loading');
  document.getElementById('infoPanel').innerHTML = info;

  // Clear previous and set the feature-state of the selected constieuncy feature id in the style layer as 'active'
  map.removeFeatureState({
    source: 'mapbox://planemad.3picr4b8',
    sourceLayer: 'pc'
  });
  map.setFeatureState({
    source: 'mapbox://planemad.3picr4b8',
    sourceLayer: 'pc',
    id: featuresAtPoint.pc.id
  }, {
    state: 'active'
  });

}
},{"./ECILookup":1,"./add-marker":3,"./map-layer-config":8,"./query-layer-features":9}]},{},[6]);
