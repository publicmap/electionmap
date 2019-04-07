module.exports = highlightConstituency

function highlightConstituency(map, pc_id) {

  // Define style properties for the highlighted constituency
  var highlightProperties = {
    'line-gap-width': [
      "match",
      ["get", "pc_id"],
      [pc_id],
      1,
      0
    ],
    'line-color': [
      "match",
      ["get", "pc_id"],
      [pc_id],
      "hsl(62, 97%, 61%)",
      "hsl(22, 98%, 92%)"
    ]
  }

  // Set the style properties on the 'pc line border-highlight' layer in the map style
  for ( var property in highlightProperties){
    map.setPaintProperty('pc line border-highlight', property, highlightProperties[property])
  }

}