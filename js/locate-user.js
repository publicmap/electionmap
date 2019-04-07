var showDataAtPoint = require('./show-data-at-point')
var browserLocated = false

module.exports = locateUser

function errorHandler (err) {
  console.log('error getting user location', err)
}

function locateUser (map) {

  function showLocation (position) {
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
  setTimeout(() => {
    if (browserLocated) return
    fetch('https://publicmap-freegeoip.herokuapp.com/json/')
      .then(response => response.json())
      .then(body => {
        if (!browserLocated) {
          map.flyTo({
            center: [body.longitude, body.latitude],
            zoom: 6
          });
          showDataAtPoint({
            lng: body.longitude,
            lat: body.latitude
          })
        }
      })
  }, 2000)
}
