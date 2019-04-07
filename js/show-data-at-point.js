var getTilequeryURL = require('./get-tilequery-url')
var ECILookup = require('./ECILookup')
var highlightConstituency = require('./highlight-constituency')
require('./object-assign-polyfill')

module.exports = showDataAtPoint

function showDataAtPoint (map, lngLat) {
  const tilequeryURL = getTilequeryURL(lngLat)

  // Add a loading spinner to the infoPanel while we fetch data
  document.getElementById('infoPanel').innerHTML = '';
  document.getElementById('infoPanel').classList.add('loading','loading--s');

  // use fetch to fetch data - this maintains consistency with using fetch elsewhere
  // if we have browser considerations where `fetch` does not work,
  // we can replace this with $.getJSON or so
  fetch(tilequeryURL)
    .then(response => response.json())
    .then(data => {
      // merge the damn properies
      var holder = Object.assign({}, data.features[0].properties, data.features[1].properties);

      var ECI_code = ECILookup[String(holder.st_code)]['ECI_code'];

      // Composing link to Official ECI candidates affidavits page: https://affidavit.eci.gov.in/showaffidavit/1/S13/34/PC
      var ECIAffidavit_URL = `https://affidavit.eci.gov.in/showaffidavit/1/${ECI_code}/${String(holder.pc_no)}/PC`;

      // Composing info
      var info = `<span class='txt-light'>2019 Lok Sabha Elections</span><br>
      <span class='txt-light'>Your Constituency: </span><b>${holder.pc_name}</b> (${holder.pc_no})<br>
      <span class='txt-light'>Voting is on: </span><b>${holder['2019_election_date'].split('T')[0]}</b> (Phase ${holder['2019_election_phase']})<br>
      <a href="${ECIAffidavit_URL}" target="_blank" class="link">Click here to see the Candidates</a> <br>
      State: ${holder.st_name} (${ECI_code})<br>
      `;
      document.getElementById('infoPanel').classList.remove('loading');
      document.getElementById('infoPanel').innerHTML = info;

      // Highlight constituency containing point
      highlightConstituency(map, holder.pc_id);

    })
    .catch(err => {
      document.getElementById('infoPanel').classList.remove('loading');
      document.getElementById('infoPanel').innerHTML = `Error while fetching data for that location`;
    })
}