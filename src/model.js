/*
  model.js

  This file is required. It must export a class with at least one public function called `getData`

  Documentation: http://koopjs.github.io/docs/specs/provider/
*/
const util = require("util");
const koopConfig = require("config");
const fs = require("fs");
const fetch = require("node-fetch");
const XlsxStreamReader = require("xlsx-stream-reader");
// It won't chain, so it not has to be read on each getData call
const CONFIG = koopConfig["koop-provider-xlsx"];
const GEOJSON_TEMPLATE = {
  type: "FeatureCollection",
  features: [],
  metadata : null
}
const FEATURE_TEMPLATE = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Point",
    coordinates: []
  }
};

function Model(koop) {}

function isUrl (str) {
  return /^http[s]?:\/\//.test(str);
}


// Public function to return data from the
// Return: GeoJSON FeatureCollection
Model.prototype.getData = async function(req, callback) {
  var features = [];

  const sourceConfig = CONFIG.sources[req.params.id];
  const fileOrigin = sourceConfig.url;
  const sheetName = sourceConfig.sheetName;
  var workBookReader = new XlsxStreamReader({
        verbose: true,
        formatting: false
  });


  workBookReader.on('worksheet', function (workSheetReader) {
    if (workSheetReader.name !== sheetName){
      workSheetReader.skip();
      return;
    }

    var headers;
    var latColIdx,lonColIdx;
    // if we do not listen for rows we will only get end event
    // and have infor about the sheet like row count
    workSheetReader.on('row', function (row) {
      if (row.attributes.r == 1){
          // do something with row 1 like save as column names
          headers = row.values.slice(1);
          latColIdx = headers.indexOf(sourceConfig.geometryColumns.latitude);
          lonColIdx = headers.indexOf(sourceConfig.geometryColumns.longitude);
          idFieldColIdx = headers.indexOf(sourceConfig.metadata.idField);
          console.log(`ENCONTRADO: ${idFieldColIdx}`);

      } else {
        // second param to forEach colNum is very important as
        // null columns are not defined in the array, ie sparse array
        row.values.splice(0,1);

        //console.log(util.inspect(row.values, { compact: true, depth: 5, breakLength: 80 }));
        let currentGeometry = {
          type : "Point",
          coordinates : [0,0]
        };
        let currentProperties = {};
        row.values.forEach(function(rowVal, colNum){
            // do something with row values
            if(![latColIdx,lonColIdx,idFieldColIdx].includes(colNum)) {
              currentProperties[headers[colNum]] = rowVal === undefined ? "" : rowVal;
            } else {
              if (colNum === latColIdx) {
                currentGeometry.coordinates[1] = parseFloat(rowVal);
              }
              if (colNum === lonColIdx) {
                currentGeometry.coordinates[0] = parseFloat(rowVal);
              }
              if (colNum === idFieldColIdx) {
                currentProperties[sourceConfig.metadata.idField] = parseInt(rowVal);
              }
            }
        });

        features.push({
          ...FEATURE_TEMPLATE,
          geometry : {
            ...currentGeometry
          },
          properties: {
            ...currentProperties
          }
        });
      }

    });

    workSheetReader.on('end', function () {
        console.log(workSheetReader.rowCount);
    });

    // call process after registering handlers
    workSheetReader.process();
  });

  workBookReader.on('end', function () {
    // end of workbook reached
    callback(null, {
      ...GEOJSON_TEMPLATE,
      features : features,
      metadata : sourceConfig.metadata
    });
  });

  workBookReader.on('error', function (error) {
    callback(error);
  });

  let startStream = isUrl(fileOrigin)
      ? await fetch(fileOrigin).then(res => res)
      : fs.createReadStream(`${process.cwd()}/${fileOrigin}`);
  startStream.pipe(workBookReader);

};

module.exports = Model;
