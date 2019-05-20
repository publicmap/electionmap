var ECILookup = require('./ECILookup')
var Markers = require('./add-marker')
var mapLayers = require('./map-layer-config')
require('./object-assign-polyfill')

module.exports = showDataAtPoint

function showDataAtPoint(map, e) {

  // Create object to hold query results of map features at a point
  var featuresAtPoint = {lngLat:e.lngLat};

  // Add a map marker at clicked location and move the map to center it
  Markers.addMarker(map, e);
  map.flyTo({
    center: [e.lngLat.lng, e.lngLat.lat]
  })

  // Detect if there is a screen point location from a click event, in which case we can query the 
  // visible tile layers directly instead of using a request to the tilequery API
  if(e.point !== undefined){
    map.queryRenderedFeatures(e.point, {
      layers: mapLayers["click-layer-ids"]
    }).forEach(feature => {
      featuresAtPoint[feature.sourceLayer] = feature;
    })
  }

  // If not successful in getting the results directly from loaded tiles
  // fetch the features at that point using the tilequery API
  if (Object.keys(featuresAtPoint).length == 1) {

    // Fetch features from the array of tileset ids using the Mapbox tilequery API
    // Create an array of tilequery  urls and fetch them using promises
    var fetchRequests = mapLayers['click-layer-tileset-ids'].map(tileset =>
      // Mapbox tilequery API: https://docs.mapbox.com/help/interactive-tools/tilequery-api-playground/
      fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${e.lngLat.lng},${e.lngLat.lat}.json?limit=5&radius=0&dedupe=true&access_token=${mapboxgl.accessToken}`)
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
      updateInfoPanel(map, featuresAtPoint);

    })
  }else{
    // Update panel with results
    updateInfoPanel(map, featuresAtPoint);
  }

}

function updateInfoPanel(map, featuresAtPoint) {

  console.log('Features at queries point:', featuresAtPoint);

  // Add a loading spinner to the infoPanel while we fetch data
  document.getElementById('infoPanel').innerHTML = '';
  document.getElementById('infoPanel').classList.add('loading', 'loading--s');

  var ECI_code = ECILookup[String(featuresAtPoint.pc.properties.st_code)]['ECI_code'];

  // Composing link to Official ECI candidates affidavits page: https://affidavit.eci.gov.in/showaffidavit/1/S13/34/PC
  var ECIAffidavit_URL = `https://affidavit.eci.gov.in/showaffidavit/1/${ECI_code}/${String(featuresAtPoint.pc.properties.pc_no)}/PC`;

  // Composing info
  var info = `<span class='txt-light'>2019 Lok Sabha Elections</span><br>
    <span class='txt-light'>Your Constituency: </span><b>${featuresAtPoint.pc.properties.pc_name}</b> (${featuresAtPoint.pc.properties.pc_no})<br>
    <span class='txt-light'>Voting is on: </span><b>${featuresAtPoint.pc.properties['2019_election_date'].split('T')[0]}</b> (Phase ${featuresAtPoint.pc.properties['2019_election_phase']})<br>
    <a href="${ECIAffidavit_URL}" target="_blank" class="link">Click here to see the Candidates</a> <br>
    State: ${featuresAtPoint.pc.properties.st_name} (${ECI_code})<br>
    `;
  document.getElementById('infoPanel').classList.remove('loading');
  document.getElementById('infoPanel').innerHTML = info;

  // Clear previous and set the feature-state of the selected constieuncy feature id in the style layer as 'active'
  map.removeFeatureState({
    source: 'mapbox://planemad.3picr4b8',
    sourceLayer: 'pc'
  });
  map.setFeatureState({
    source: 'mapbox://planemad.3picr4b8',
    sourceLayer: 'pc',
    id: featuresAtPoint.pc.id
  }, {
    state: 'active'
  });

}