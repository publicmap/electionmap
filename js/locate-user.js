var Markers = require('./add-marker');
var mapLayers = require('./map-layer-config')

var browserLocated = false

module.exports = locateUser

function errorHandler(err) {
  console.log('error getting user location', err)
}

function locateUser(map, showDataAtPoint) {

  function showLocation(position) {

    // User has an active location clicked and thus we don't need Browser Geolocation
    if (Markers.userHasClicked()) {
      return;
    }

    browserLocated = true

    var lngLat = {
      lng: position.coords.longitude,
      lat: position.coords.latitude
    }

    // Abort if user coordinate is outside India
    if (!(lngLat.lng > mapLayers.map.bounds[0] && lngLat.lng < mapLayers.map.bounds[2] && lngLat.lat > mapLayers.map.bounds[1] && lngLat.lat < mapLayers.map.bounds[3])) {
      return
    }

    showDataAtPoint(map, {
      lngLat: lngLat
    })

  }

  if (navigator.geolocation) {
    // timeout at 60000 milliseconds (60 seconds)
    var options = {
      timeout: 60000
    }
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

          var lngLat = {
            lng: body.longitude,
            lat: body.latitude
          }

          // Abort if user coordinate is outside India
          if (!(lngLat.lng > 63 && lngLat.lng < 97 && lngLat.lat > 7 && lngLat.lat < 36)) {
            return
          }

          showDataAtPoint(map, {
            lngLat: lngLat
          })

          map.flyTo({
            center: [lngLat.lng, lngLat.lat],
            zoom: 9
          });

        }
      })
  }, 2000)
}