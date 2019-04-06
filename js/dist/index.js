(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {"1":{"ECI_code":"S09","state":"Jammu & Kashmir"},"2":{"ECI_code":"S08","state":"Himachal Pradesh"},"3":{"ECI_code":"S19","state":"Punjab"},"4":{"ECI_code":"U02","state":"Chandigarh"},"5":{"ECI_code":"S28","state":"Uttarakhand"},"6":{"ECI_code":"S07","state":"Haryana"},"7":{"ECI_code":"U05","state":"NCT OF Delhi"},"8":{"ECI_code":"S20","state":"Rajasthan"},"9":{"ECI_code":"S24","state":"Uttar Pradesh"},"10":{"ECI_code":"S04","state":"Bihar"},"11":{"ECI_code":"S21","state":"Sikkim"},"12":{"ECI_code":"S02","state":"Arunachal Pradesh"},"13":{"ECI_code":"S17","state":"Nagaland"},"14":{"ECI_code":"S14","state":"Manipur"},"15":{"ECI_code":"S16","state":"Mizoram"},"16":{"ECI_code":"S23","state":"Tripura"},"17":{"ECI_code":"S15","state":"Meghalaya"},"18":{"ECI_code":"S03","state":"Assam"},"19":{"ECI_code":"S25","state":"West Bengal"},"20":{"ECI_code":"S27","state":"Jharkhand"},"21":{"ECI_code":"S18","state":"Odisha"},"22":{"ECI_code":"S26","state":"Chhattisgarh"},"23":{"ECI_code":"S12","state":"Madhya Pradesh"},"24":{"ECI_code":"S06","state":"Gujarat"},"25":{"ECI_code":"U04","state":"Daman & Diu"},"26":{"ECI_code":"U03","state":"Dadra & Nagar Haveli"},"27":{"ECI_code":"S13","state":"Maharashtra"},"29":{"ECI_code":"S10","state":"Karnataka"},"30":{"ECI_code":"S05","state":"Goa"},"31":{"ECI_code":"U06","state":"Lakshadweep"},"32":{"ECI_code":"S11","state":"Kerala"},"33":{"ECI_code":"S22","state":"Tamil Nadu"},"34":{"ECI_code":"U07","state":"Puducherry"},"35":{"ECI_code":"U01","state":"Andaman & Nicobar Islands"},"36":{"ECI_code":"S29","state":"Telangana"},"37":{"ECI_code":"S01","state":"Andhra Pradesh"}};
},{}],2:[function(require,module,exports){
/*
 * Mapbox GL Tools - Add Default Mapbox Controls
 * Adds a set of UI controls for Mapbox Maps
 */

function addMapControls(map, accessToken, options) {

  map.on('load', () => {
    geolocateControl.trigger();
  })

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


  var geolocateControl = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
      timeout: 4000
    },
    trackUserLocation: true,
    fitBoundsOptions: {
      maxZoom: 6
    }
  })

  // Add geolocate control on mobile devices else fallback to IP geolocation
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

    map.addControl(geolocateControl, 'bottom-left');

    geolocateControl.on('trackuserlocationstart', () => fetchFeaturesInView());

    geolocateControl.on('error', (e) => {

      // Try IP Geolocation
      fetch(options.geoip.server)
        .then(response => response.json())
        .then(body => {
          map.flyTo({
            center: [body.longitude, body.latitude],
            zoom: 6
          });
          fetchFeaturesInView();
        })

      if (e.PERMISSION_DENIED == 1) {
        map.removeControl(geolocateControl);
      }

    })

  } else {
    console.log('1')
    map.on('load', () => {
      // Try IP Geolocation
      console.log('2')
      fetch(options.geoip.server)
        .then(response => response.json())
        .then(body => {
          map.flyTo({
            center: [body.longitude, body.latitude],
            zoom: 6
          });
        })
    })
  }

  map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right');

  return {
    NavigationControl : nav,
    MapboxGeocoder : geocoder,
    GeolocateControl : geolocateControl,
    ScaleControl : scale
  }
}

module.exports = addMapControls;

},{}],3:[function(require,module,exports){
'use strict';

var addMapControls = require('./addMapControls')
var ECILookup = require('./ECILookup')

function getTilserverURL (lngLat) {
  return `https://api.mapbox.com/v4/planemad.3picr4b8/tilequery/${lngLat.lng},${lngLat.lat}.json?limit=5&radius=0&dedupe=true&access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2p1MzBiMGtzMGF1NTRkanR6eXdkOGg5MiJ9.vuDqyahjLB1Bk_5bGp2YUw`
}

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

map.on('click', (e) => {
  const tileserverUrl = getTilserverURL(e.lngLat)
  document.getElementById('infoPanel').innerHTML = 'Loading...'
  fetch(tileserverUrl)
    .then(response => response.json())
    .then(data => {
      // In states, our data will be in second place in features array. For Union Territories, first.
      var holder = {};
      if( data.features.length > 1) {
        holder = data.features[1];
      } else {
        holder = data.features[0];
      }

      var ECI_code = ECILookup[String(holder.properties.st_code)]['ECI_code'];
      console.log(`state code lookup: ${holder.properties.st_code} maps to ${ECI_code}`);

      // Composing link to Official ECI candidates affidavits page: https://affidavit.eci.gov.in/showaffidavit/1/S13/34/PC
      var ECIAffidavit_URL = `https://affidavit.eci.gov.in/showaffidavit/1/${ECI_code}/${String(holder.properties.pc_no)}/PC`;

      // Composing info
      var info = `<big>2019 Lok Sabha Elections</big><br>
      Your Constituency: <b>${holder.properties.pc_name}</b> (${holder.properties.pc_no})<br>
      Election Date: <b>${holder.properties['2019_election_date'].split('T')[0]}</b> (Phase ${holder.properties['2019_election_phase']})<br>
      <a href="${ECIAffidavit_URL}" target="_blank">Click here to see the Candidates</a> <br>
      State: ${holder.properties.st_name} (${ECI_code})<br>
      `;
      document.getElementById('infoPanel').innerHTML = info
    })
    

})

},{"./ECILookup":1,"./addMapControls":2}]},{},[3]);
