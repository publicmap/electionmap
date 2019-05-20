module.exports = {
    'access-token' :'pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2p1M3JuNnRjMGZ2NzN6bGVqN3Z4bmVtOSJ9.Fx0kmfg-7ll2Oi-7ZVJrfQ',
     // Map innitialization
     map: {
        container: 'map',
        style: 'mapbox://styles/planemad/cjoescdh20cl62spey0zj3v19',
        bounds: [66, 7, 99, 37],
        maxBounds: [50, 5, 114, 40],
        pitchWithRotate: false,
        hash: true
      },
    // Queryable feature layers on click
    // for the queries to work, then need to be visible in the map style
    // to make innvisible queryable layers, set the paint opacity to 0
    'click-layer-ids': ['pc fill mask','ac fill mask'],
    // Corresponding tileset ids for feature querying
    'click-layer-tileset-ids': ['planemad.3picr4b8']
}