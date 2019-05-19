var getTilequeryURL = require('./get-tilequery-url')
var ECILookup = require('./ECILookup')
var Markers = require('./add-marker')
var mapLayers = require('./map-layer-config')
require('./object-assign-polyfill')

module.exports = showDataAtPoint

function showDataAtPoint(map, e) {

  // Create object to hold query results of map features at a point
  var featuresAtPoint = {lngLat:e.lngLat};

  // Query rendered features at clicked point and store results into an object
  map.queryRenderedFeatures(e.point, {
    layers: mapLayers["click-layer-ids"]
  }).forEach(feature => {
    featuresAtPoint[feature.sourceLayer] = feature;
  })

  // Add marker at clicked location
  Markers.addMarker(map, e);

  map.flyTo({
    center: [e.lngLat.lng, e.lngLat.lat]
  })

  // If event object has tile features from clicked event, use it to update the info panel
  // Else fetch the features at that point using the tilequery API
  if (Object.keys(featuresAtPoint>1)) {
    updateInfoPanel(map, featuresAtPoint);
  } else {
    // use fetch to fetch data - this maintains consistency with using fetch elsewhere
    // if we have browser considerations where `fetch` does not work,
    // we can replace this with $.getJSON or so
    const tilequeryURL = getTilequeryURL(e.lngLat)
    function fetchFeaturesAtPoint(lngLat){
      var fetchCalls = []
      mapLayers['click-layer-tileset-ids'].forEach(tileset=>{
        fetchCalls.push(fetch(`https://api.mapbox.com/v4/${tileset}/tilequery/${lngLat.lng},${lngLat.lat}.json?limit=5&radius=0&dedupe=true&access_token=${mapboxgl.accessToken}`))
      })
      return fetchCalls

    }
    fetchFeaturesAtPoint(e.lngLat)
      .then(response => response.json())
      .then(data => {

        // merge the damn properies
        // var holder = Object.assign({}, data.features[0].properties, data.features[1].properties);

        var featuresAtPoint = {}
        data.features.forEach(feature => {
          featuresAtPoint[feature.properties.tilequery.layer] = feature;
        });

        console.log('from API:',featuresAtPoint)

        updateInfoPanel(map, featuresAtPoint);

      })
      .catch(err => {
        document.getElementById('infoPanel').classList.remove('loading');
        document.getElementById('infoPanel').innerHTML = `Error while fetching data for that location`;
      })
  }
}

var activeFeatureId = null;

function updateInfoPanel(map, featuresAtPoint) {

  console.log('Features at Point:', featuresAtPoint);

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