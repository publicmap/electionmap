var Markers = require('./add-marker');
var Fetch = require('fetch-retry');

// Flag set to true after user has been located
var browserLocated = false

module.exports = locateUser

// Mapbox GL plugin to locate the user using geolocation or fallback to geoip

function locateUser(map, geolocateControl, {
  bounds = mapLayers.map.bounds,
  zoom = mapLayers.map.zoom
}, cb) {

  function errorHandler(err) {
    console.log('Location error:', err);
  }

  // Checks if a given coordinate is within the default map area
  function isPointWithinBounds(lngLat){
    if (lngLat.lng > bounds[0] && lngLat.lng < bounds[2] && lngLat.lat > bounds[1] && lngLat.lat < bounds[3]) {
      return true;
    }else{
      return false;
    }
  }

  // Display user location on the map
  function showLocation(lngLat, options) {

    // User has an active location clicked and thus we don't need Browser Geolocation
    if (Markers.userHasClicked()) {
      return;
    }

    // Abort if user coordinate is outside map area
    if (!isPointWithinBounds(lngLat)) {
      console.log('Geolocate is outside map area', lngLat, options);
      return
    }

    // Callback on success
    cb(map, lngLat, options)

  }

  // Try to determinne accurate user location using HTML5 geolocation
  
  if (!Markers.userHasClicked()) {
    
    // On finding GPS location
  geolocateControl.trigger();

  // Handle geolocation outside map area
  // https://bl.ocks.org/andrewharvey/6c6282db4a7c9b316ebd51421160c5e4
  (function() {
    var proxied = geolocateControl._updateCamera;
    geolocateControl._updateCamera = function() {
        // get geolocation
        var location = new mapboxgl.LngLat(arguments[0].coords.longitude, arguments[0].coords.latitude);

        var bounds = map.getMaxBounds();

        if (bounds) {
            // if geolocation is within maxBounds
            var lngLat = {
              lng: location.longitude,
              lat: location.latitude
            }
            if (isPointWithinBounds(lngLat)) {
                return proxied.apply( this, arguments );
            } else {
                return null;
            }
        }
        return proxied.apply( this, arguments );
    };
})();
  geolocateControl.on('geolocate', function(e) {

    browserLocated = true;

    showLocation({
      lng: e.coords.longitude,
      lat: e.coords.latitude
    }, {
      source: 'geolocation',
      accuracy: e.coords.accuracy,
      details: e.coords
    })
  });

  } else {
    console.log("Browser does not support geolocation!")
  }

  // we fire the IP location request after 2 seconds
  // if the browser location has not worked until then
  // if the user clicked, do not fire the request
  //                      do not display if the user clicked in between
  setTimeout(() => {
    if (browserLocated || Markers.userHasClicked()) return
    Fetch('https://publicmap-freegeoip.herokuapp.com/json/',{
      retries: 3,
      retryDelay: 100
    })
      .then((response)=>{
        // Catch failed location response
        if (!response.ok) {
            throw errorHandler(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then(body => {
        if (!browserLocated && !Markers.userHasClicked()) {

          browserLocated = true;

          var lngLat = {
            lng: body.longitude,
            lat: body.latitude
          };

          map.flyTo({
            center: lngLat,
            zoom: 10
          })

          showLocation(lngLat, {
            zoom: 10,
            source: 'geoip',
            details: body
          })
        }
      })
  }, 2000)
}