var getTilequeryURL = require('./get-tilequery-url')
var ECILookup = require('./ECILookup')

module.exports = showDataAtPoint

function showDataAtPoint (lngLat) {
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
      // In states, our data will be in second place in features array. For Union Territories, first.
      var holder = {};
      if( data.features.length > 1) {
        holder = data.features[1];
      } else {
        holder = data.features[0];
      }

      var ECI_code = ECILookup[String(holder.properties.st_code)]['ECI_code'];

      // Composing link to Official ECI candidates affidavits page: https://affidavit.eci.gov.in/showaffidavit/1/S13/34/PC
      var ECIAffidavit_URL = `https://affidavit.eci.gov.in/showaffidavit/1/${ECI_code}/${String(holder.properties.pc_no)}/PC`;

      // Composing info
      var info = `<big>2019 Lok Sabha Elections</big><br>
      <span class='txt-light'>Your Constituency: </span><b>${holder.properties.pc_name}</b> (${holder.properties.pc_no})<br>
      <span class='txt-light'>Voting is on: </span><b>${holder.properties['2019_election_date'].split('T')[0]}</b> (Phase ${holder.properties['2019_election_phase']})<br>
      <a href="${ECIAffidavit_URL}" target="_blank">Click here to see the Candidates</a> <br>
      State: ${holder.properties.st_name} (${ECI_code})<br>
      `;
      document.getElementById('infoPanel').classList.remove('loading');
      document.getElementById('infoPanel').innerHTML = info
    })
    .catch(err => {
      document.getElementById('infoPanel').classList.add('loading');
      document.getElementById('infoPanel').innerHTML = 'Error while fetching data for ${e.lngLat.lng},${e.lngLat.lat}'
    })
}