# electionmap

Simple tool to locate electoral constituency for voting and candidate details.

## Map Data

### Constituency boundaries
Constituency shapefiles sourced from [datameet maps](https://github.com/datameet/maps) and hosted on [Mapbox](https://www.mapbox.com)

**Mapbox tilesets**
- [India Electoral Boundaries `planemad.3picr4b8`](https://studio.mapbox.com/tilesets/planemad.3picr4b8/)x
  - Parliamentary Constituencies `pc`
  - Assembly Constituencies `ac`
  - 2019 Polling schedule `polling-schedule`

Constituency details API use [Mapbox Tilequey API](https://docs.mapbox.com/help/interactive-tools/tilequery-api-playground/)

[`https://api.mapbox.com/v4/planemad.3picr4b8/tilequery/<LONGITUDE>,<LATITUDE>.json?limit=5&radius=0&dedupe=true&access_token=<MAPBOX_ACCESS_TOKEN>`](https://api.mapbox.com/v4/planemad.3picr4b8/tilequery/78.0714,32.2263.json?limit=5&radius=0&dedupe=true&access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2p1M3JuNnRjMGZ2NzN6bGVqN3Z4bmVtOSJ9.Fx0kmfg-7ll2Oi-7ZVJrfQ)

### Basemap data

Place locations and street level details are from the [OpenStreetMap Project](https://www.openstreetmap.org/#map=5/22.938/78.464). Data updates on OSM are reflected on the map in a week.

## Map style

Basemap showing constituency boundaries with street details designed in [Mapbox Studio](https://www.mapbox.com/mapbox-studio/). 

[Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) [style id `planemad/cjoescdh20cl62spey0zj3v19`](https://api.mapbox.com/styles/v1/planemad/cjoescdh20cl62spey0zj3v19.html?fresh=true&title=true&access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ#13.9/33.160859/74.247901/0)

## Contributing

Get the code and start the development server with live preview. Requires [node](https://nodejs.org/en/download/).
```
git clone https://github.com/publicmap/electionmap.git
cd electionmap
npm install
npm run start
```

If you made changes to the `js` scripts, do `npm run build` to compile the final javascript file to `js/dist` and commit them before publishing.



