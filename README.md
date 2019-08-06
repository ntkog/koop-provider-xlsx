# koop-provider-xlsx

A simple Koop provider for consuming **xlsx** files (Excel Files) thru nodejs streams.

## Installation

with npm

```bash
npm install ntkog/koop-provider-xlsx
```

with [Koop CLI](https://github.com/koopjs/koop-cli) for your Koop app

```bash
koop add koop-provider-xlsx
```

## Usage

Once installed, this provider enables routes like

```bash
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
        "url": "path_to_csv",
        "sheetName" : "sheet_name_of_the_workbook",
        // [required] point coordinate columns
        "geometryColumns": {
          "longitude": "longitude_column_name",
          "latitude": "latitude_column_name"
        },
        // [optional] ArcGIS service metadata
        "metadata": {
          "idField": "id_column_name"
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
