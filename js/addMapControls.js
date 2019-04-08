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
