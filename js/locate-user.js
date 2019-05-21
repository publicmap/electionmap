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

    showDataAtPoint(map, lngLat)

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