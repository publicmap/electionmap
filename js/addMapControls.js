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
