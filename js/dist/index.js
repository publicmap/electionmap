(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {"1":{"ECI_code":"S09","state":"Jammu & Kashmir"},"2":{"ECI_code":"S08","state":"Himachal Pradesh"},"3":{"ECI_code":"S19","state":"Punjab"},"4":{"ECI_code":"U02","state":"Chandigarh"},"5":{"ECI_code":"S28","state":"Uttarakhand"},"6":{"ECI_code":"S07","state":"Haryana"},"7":{"ECI_code":"U05","state":"NCT OF Delhi"},"8":{"ECI_code":"S20","state":"Rajasthan"},"9":{"ECI_code":"S24","state":"Uttar Pradesh"},"10":{"ECI_code":"S04","state":"Bihar"},"11":{"ECI_code":"S21","state":"Sikkim"},"12":{"ECI_code":"S02","state":"Arunachal Pradesh"},"13":{"ECI_code":"S17","state":"Nagaland"},"14":{"ECI_code":"S14","state":"Manipur"},"15":{"ECI_code":"S16","state":"Mizoram"},"16":{"ECI_code":"S23","state":"Tripura"},"17":{"ECI_code":"S15","state":"Meghalaya"},"18":{"ECI_code":"S03","state":"Assam"},"19":{"ECI_code":"S25","state":"West Bengal"},"20":{"ECI_code":"S27","state":"Jharkhand"},"21":{"ECI_code":"S18","state":"Odisha"},"22":{"ECI_code":"S26","state":"Chhattisgarh"},"23":{"ECI_code":"S12","state":"Madhya Pradesh"},"24":{"ECI_code":"S06","state":"Gujarat"},"25":{"ECI_code":"U04","state":"Daman & Diu"},"26":{"ECI_code":"U03","state":"Dadra & Nagar Haveli"},"27":{"ECI_code":"S13","state":"Maharashtra"},"29":{"ECI_code":"S10","state":"Karnataka"},"30":{"ECI_code":"S05","state":"Goa"},"31":{"ECI_code":"U06","state":"Lakshadweep"},"32":{"ECI_code":"S11","state":"Kerala"},"33":{"ECI_code":"S22","state":"Tamil Nadu"},"34":{"ECI_code":"U07","state":"Puducherry"},"35":{"ECI_code":"U01","state":"Andaman & Nicobar Islands"},"36":{"ECI_code":"S29","state":"Telangana"},"37":{"ECI_code":"S01","state":"Andhra Pradesh"}};
},{}],2:[function(require,module,exports){
/**
 * Mapbox Marker
 * Add a marker upon user click
 * Remove any existing marker before adding one
 */

// Track marker so that we can remove on the next user click
var marker;

function addMarker(map, lngLat) {

  // Remove existing marker
  if (marker) {
    marker.remove();

    // Quick hack so that it is easy to check whether user has clicked
    marker = undefined;
  }

  // Add marker on user click
  marker = new mapboxgl.Marker()
    .setLngLat(lngLat)
    .addTo(map)
  ;

}

function userHasClicked() {
  return marker !== undefined;
}

module.exports = { addMarker, userHasClicked, };

},{}],3:[function(require,module,exports){
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
      country: options.MapboxGeocoder.country,

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

},{}],4:[function(require,module,exports){
module.exports = getTilequeryURL

function getTilequeryURL (lngLat) {
  return `https://api.mapbox.com/v4/planemad.3picr4b8/tilequery/${lngLat.lng},${lngLat.lat}.json?limit=5&radius=0&dedupe=true&access_token=${mapboxgl.accessToken}`
}
},{}],5:[function(require,module,exports){
module.exports = highlightConstituency

function highlightConstituency(map, pc_id) {

  // Define style properties for the highlighted constituency
  var highlightProperties = {
    'line-gap-width': [
      "match",
      ["get", "pc_id"],
      [pc_id],
      1,
      0
    ],
    'line-color': [
      "match",
      ["get", "pc_id"],
      [pc_id],
      "hsl(62, 97%, 61%)",
      "hsl(22, 98%, 92%)"
    ]
  }

  // Set the style properties on the 'pc line border-highlight' layer in the map style
  for ( var property in highlightProperties){
    map.setPaintProperty('pc line border-highlight', property, highlightProperties[property])
  }

}
},{}],6:[function(require,module,exports){
'use strict';

var addMapControls = require('./addMapControls')
var showDataAtPoint = require('./show-data-at-point')
var locateUser = require('./locate-user')
var Markers = require('./add-marker');

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

map.on('load', ()=>{
  locateUser(map)
  addMapControls(map, mapboxgl.accessToken, {
    MapboxGeocoder: {
      position:'top-right',
      country: 'in',
      bbox: _app.map.bounds
    }
  });
});

map.on('click', (e) => {
  showDataAtPoint(map, e.lngLat) 
  Markers.addMarker(map, e.lngLat);
})


},{"./add-marker":2,"./addMapControls":3,"./locate-user":7,"./show-data-at-point":9}],7:[function(require,module,exports){
var showDataAtPoint = require('./show-data-at-point')
var Markers = require('./add-marker');
var browserLocated = false

module.exports = locateUser

function errorHandler (err) {
  console.log('error getting user location', err)
}

function locateUser (map) {

  function showLocation (position) {

    // User has an active location clicked and thus we don't need Browser Geolocation
    if (Markers.userHasClicked()) {
      return;
    }

    browserLocated = true
    var lngLat = {
      lng: position.coords.longitude,
      lat: position.coords.latitude
    }
    map.flyTo({
      center: [lngLat.lng, lngLat.lat],
      zoom: 8
    })
    showDataAtPoint(lngLat)
  }
    
  if(navigator.geolocation) {         
    // timeout at 60000 milliseconds (60 seconds)
    var options = {timeout:60000}
    navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options)
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
          map.flyTo({
            center: [body.longitude, body.latitude],
            zoom: 8
          });
          showDataAtPoint(map,{
            lng: body.longitude,
            lat: body.latitude
          })
        }
      })
  }, 2000)
}

},{"./add-marker":2,"./show-data-at-point":9}],8:[function(require,module,exports){
if (typeof Object.assign != 'function') {
  console.log('This polyfill for Object.assign command is being run in a browser that has an incompatibility issue. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Browser_compatibility .');
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}

},{}],9:[function(require,module,exports){
var getTilequeryURL = require('./get-tilequery-url')
var ECILookup = require('./ECILookup')
var highlightConstituency = require('./highlight-constituency')
require('./object-assign-polyfill')

module.exports = showDataAtPoint

function showDataAtPoint (map, lngLat) {
  const tilequeryURL = getTilequeryURL(lngLat)

  // Add a loading spinner to the infoPanel while we fetch data
  document.getElementById('infoPanel').innerHTML = '';
  document.getElementById('infoPanel').classList.add('loading','loading--s');

  // use fetch to fetch data - this maintains consistency with using fetch elsewhere
  // if we have browser considerations where `fetch` does not work,
  // we can replace this with $.getJSON or so
  fetch(tilequeryURL)
    .then(response => response.json())
    .then(data => {
      // merge the damn properies
      var holder = Object.assign({}, data.features[0].properties, data.features[1].properties);

      var ECI_code = ECILookup[String(holder.st_code)]['ECI_code'];

      // Composing link to Official ECI candidates affidavits page: https://affidavit.eci.gov.in/showaffidavit/1/S13/34/PC
      var ECIAffidavit_URL = `https://affidavit.eci.gov.in/showaffidavit/1/${ECI_code}/${String(holder.pc_no)}/PC`;

      // Composing info
      var info = `<span class='txt-light'>2019 Lok Sabha Elections</span><br>
      <span class='txt-light'>Your Constituency: </span><b>${holder.pc_name}</b> (${holder.pc_no})<br>
      <span class='txt-light'>Voting is on: </span><b>${holder['2019_election_date'].split('T')[0]}</b> (Phase ${holder['2019_election_phase']})<br>
      <a href="${ECIAffidavit_URL}" target="_blank" class="link">Click here to see the Candidates</a> <br>
      State: ${holder.st_name} (${ECI_code})<br>
      `;
      document.getElementById('infoPanel').classList.remove('loading');
      document.getElementById('infoPanel').innerHTML = info;

      // Highlight constituency containing point
      highlightConstituency(map, holder.pc_id);

    })
    .catch(err => {
      document.getElementById('infoPanel').classList.remove('loading');
      document.getElementById('infoPanel').innerHTML = `Error while fetching data for that location`;
    })
}
},{"./ECILookup":1,"./get-tilequery-url":4,"./highlight-constituency":5,"./object-assign-polyfill":8}]},{},[6]);
