module.exports = queryLayerFeatures;

// Mapbox GL utility function to query for features at a point 
// Extends queryRenderedFeatures by using the tilequery API to fetch features not in view
function queryLayerFeatures(map, location, layers, cb, options) {

  // Find the tileset ids of the layers
  var tilesetIds = []
  layers.forEach(layer=>{
    // Extract the tileset id from the source id
    tilesetIds.push(map.getLayer(layer).source.slice(9));
  })
  tilesetIds = [...new Set(tilesetIds)];

  // Create object to hold query results of map features at a point
  var featuresAtPoint = {queryLocation: location};

  // Attempt to query the visible tile layers directly instead of using a request to the tilequery API
  map.queryRenderedFeatures(map.project(location), {
    layers: layers
  }).forEach(feature => {
    featuresAtPoint[feature.sourceLayer] = feature;
  })

  // If not successful in getting the results directly from loaded tiles
  // fetch the features at that point using the tilequery API
  if (Object.keys(featuresAtPoint).length == 1) {

    // Fetch features from the array of tileset ids using the Mapbox tilequery API
    // Create an array of tilequery  urls and fetch them using promises
    var fetchRequests = tilesetIds.map(tileset =>
      // Mapbox tilequery API: https://docs.mapbox.com/help/interactive-tools/tilequery-api-playground/
      fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${location.lng},${location.lat}.json?limit=5&radius=0&dedupe=true&access_token=${mapboxgl.accessToken}`)
      .then(resp => resp.json())
    )

    // Fetch and bundle all the results
    Promise.all(fetchRequests)
    .then(response => {
      // Add all features from the tilequery results to the result object
      response.forEach(featureCollection => {
        featureCollection.features.forEach(feature => {
          featuresAtPoint[feature.properties.tilequery.layer] = feature;
        })
      });

      // Update panel with results
      cb(map, featuresAtPoint);

    })
  }else{
    // Update panel with results
    cb(map, featuresAtPoint);
  }

  return featuresAtPoint;

}