/*
 * Mapbox GL Tools - Add Default Mapbox Controls
 * Adds a set of UI controls for Mapbox Maps
 */

function addMapControls(map, accessToken, {
  geolocate = {
    zoom : 10
  },
  search = {
    position: 'top-left',
    countries : undefined,
    bbox : undefined
  }
}) {

  var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: false,
      timeout: 4000
    },
    fitBoundsOptions: {
      maxZoom: geolocate.zoom
    }
  });

  //  BUG: Handle geolocation outside map bounds 
  // https://github.com/mapbox/mapbox-gl-js/issues/4872
  // https://bl.ocks.org/andrewharvey/6c6282db4a7c9b316ebd51421160c5e4
  (function() {
    var proxied = geolocate._updateCamera;
    geolocate._updateCamera = function() {
        // get geolocation
        var location = new mapboxgl.LngLat(arguments[0].coords.longitude, arguments[0].coords.latitude);
        var bounds = map.getMaxBounds();

        if (bounds) {
            // if geolocation is within maxBounds
            if (location.lng >= bounds.getWest() && location.lng <= bounds.getEast() &&
                location.lat >= bounds.getSouth() && location.lat <= bounds.getNorth()) {
                return proxied.apply( this, arguments );
            } else {
                return null;
            }
        }
        return proxied.apply( this, arguments );
    };
})();

  map.addControl(geolocate, geolocate.position);

  // Add  map UI controls
  var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-right');

  if (typeof accessToken !== 'undefined') {
    var geocoder = new MapboxGeocoder({
      accessToken: accessToken,

      // limit results 
      countries: search.countries,

      // further limit results to the geographic bounds representing the region
      bbox: search.bbox

    });
    map.addControl(geocoder, search.position);

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
    geolocate: geolocate,
    directions : nav,
    search : geocoder,
    scale : scale
  }
}

module.exports = addMapControls;
