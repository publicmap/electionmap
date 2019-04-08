module.exports = addStyleLayers

// Add styling to map layers to show active and hover constituencies

function addStyleLayers(map) {

    map.setPaintProperty('pc line border-highlight', 'line-color', [
        "match", ["feature-state", "state"], 'active',
        "hsl(62, 97%, 61%)",
        "match", ["feature-state", "state"], 'hover',
        "hsl(62, 97%, 61%)",
        "hsl(22, 98%, 92%)"
    ])

    map.setPaintProperty('pc line border-highlight', 'line-gap-width', [
        "match", ["feature-state", "state"], 'active',
        1,
        "match", ["feature-state", "state"], 'hover',
        0,
        0
    ])

    map.setPaintProperty('pc fill mask', 'fill-opacity', [
        "match", ["feature-state", "state"], 'active',
        0,
        "match", ["feature-state", "state"], 'hover',
        0.2,
        0.6
    ])

}