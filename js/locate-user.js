var Markers = require('./add-marker');
var Fetch = require('fetch-retry');

// Flag set to true after user has been located
var browserLocated = false

module.exports = locateUser

// Mapbox GL plugin to locate the user using geolocation or fallback to geoip

function locateUser(map, geolocateControl, cb) {

  function errorHandler(err) {
    console.log('Location error:', err);
  }

  // Checks if a given coordinate is within the default map area
  function isPointWithinBounds(lngLat){
    var bounds = map.getMaxBounds();
    if (lngLat.lng > bounds.getWest() && lngLat.lng < bounds.getEast() && lngLat.lat > bounds.getSouth() && lngLat.lat < bounds.getNorth()) {
      return true;
    }else{
      return false;
    }
  }

  // Display user location on the map
  function showLocation(lngLat, options) {

    // Check if coordinate is within map bounds
    if (!isPointWithinBounds(lngLat)) {
      console.log('Location is outside map area', lngLat, options);
      return
    }

    // Callback on success
    cb(map, lngLat, options)

  }

  // Try to determine accurate user location using HTML5 geolocation
  
  if (!Markers.userHasClicked()) {
 
    // On finding GPS location
    geolocateControl.trigger();
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