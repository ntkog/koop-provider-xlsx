# koop-provider-xlsx

A simple Koop provider for consuming **xlsx** files (Excel Files) thru nodejs streams.

## Installation


```bash
git clone https://github.com/ntkog/koop-provider-xlsx.git
cd koop-provider-xlsx
npm install
```

> WARNING : The following method is not working yet. The reason is **koop-cli** expects a npm package published and we're not publishing it yet.

with [Koop CLI](https://github.com/koopjs/koop-cli) for your Koop app

```bash
koop add ntkog/koop-provider-xlsx
```

## Usage

Once installed, this provider enables routes like

```
/koop-provider-xlsx/:id/FeatureServer/*
```

where `id` is the unique ID for a  XLSX source defined in the configuration file.

For example, this route allows to query a CSV file with ID `gasolineras`:

```
/koop-provider-xlsx/gasolineras/FeatureServer/0/query
```

## Configuration

This provider is configured with [config](https://github.com/lorenwest/node-config) and all configuration files are in the `config` directory.

A configuration looks like this:

```javascript
{
  // configuration namespace for this provider plugin
  "koop-provider-xlsx": {
    // define one or multiple CSV sources
    "sources": {
      // a unique ID for each source, which is used in the query route
      "my-data": {
        // [required] a file path or a URL for the XLSX source file.
        // Path is relative to process.cwd() .
        "url": "path_to_xlsx",
        "sheetName" : "sheet_name_of_the_workbook",
        // [optional] point coordinate columns
        "geometryColumns": {
          "longitude": "longitude_column_name",
          "latitude": "latitude_column_name"
        },
        // [optional] ArcGIS service metadata
        "metadata": {
          "idField": "id_column_name",
          "name": "your_geoservice_name",
          "description": "your_description",
        }
      }
    }
  }
}

```

See `config/example.json` for a full example.

## Development

### Run dev server

```bash
$ npm start
```

A dev server will be running at `http://localhost:8000`. By default, it will use with `NODE_ENV=dev` and the dev configuration `config/default.json` should be created beforehand.



## License

MIT
