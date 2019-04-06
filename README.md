# electionmap

Simple tool to locate electoral constituency for voting and candidate details.

## Data

Constituency shapefiles sourced from [datameet maps](https://github.com/datameet/maps) and hosted on [Mapbox](https://www.mapbox.com)

**Mapbox tilesets**
- [India Electoral Boundaries `planemad.3picr4b8`](https://studio.mapbox.com/tilesets/planemad.3picr4b8/)
  - Parliamentary Constituencies `pc`
  - Assembly Constituencies `ac`
  - 2019 Polling schedule `polling-schedule`

**Constituency details API**
[`https://api.mapbox.com/v4/planemad.3picr4b8/tilequery/<LONGITUDE>,<LATITUDE>.json?limit=5&radius=0&dedupe=true&access_token=<MAPBOX_ACCESS_TOKEN>`](https://api.mapbox.com/v4/planemad.3picr4b8/tilequery/78.0714,32.2263.json?limit=5&radius=0&dedupe=true&access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiY2p1M3JuNnRjMGZ2NzN6bGVqN3Z4bmVtOSJ9.Fx0kmfg-7ll2Oi-7ZVJrfQ)

## Contributing

Get the code and start the development server with love preview. Requires [node](https://nodejs.org/en/download/).
```
git clone https://github.com/publicmap/electionmap.git
cd electionmap
npm install
npm run start
```

If you made changes to the `js` scripts, do `npm run build` to compile the final javascript file to `js/dist` and commit them before publishing.



