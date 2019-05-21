var ECILookup = require('./ECILookup')
var Markers = require('./add-marker')
var mapLayers = require('./map-layer-config')
var queryLayerFeatures = require('./query-layer-features')

module.exports = showDataAtPoint

function showDataAtPoint(map, lngLat) {

  // Add a map marker at clicked location and move the map to center it
  Markers.addMarker(map, lngLat);
  map.flyTo({
    center: lngLat
  })

  queryLayerFeatures(map,lngLat,mapLayers["click-layer-ids"], updateInfoPanel)

}

function updateInfoPanel(map, featuresAtPoint) {

  console.log('Features at queried point:', featuresAtPoint);

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