const transform = require('./src/transform');
const readGeojson = require('./src/readGeojson');
const writeGtfs = require('./src/writeGtfs');
const constants = require('./src/constants');

function geojsonToGtfs(geojson, outputDir = null, userConfig = {}) {
  const input = typeof geojson === "string"
    ? readGeojson(geojson)
    : geojson;

  // Handle userConfig passed in as second argument
  if (typeof outputDir === "object") {
    outputDir = null;
    userConfig = outputDir;
  }

  if (userConfig.prepareInput) {
    userConfig.prepareInput(input);
  }

  const data = transform(input, userConfig);

  if (userConfig.prepareOutput) {
    userConfig.prepareOutput(data);
  }

  if (outputDir) {
    writeGtfs(data, outputDir);
  }

  return data;
};

Object.assign(geojsonToGtfs, constants);

module.exports = geojsonToGtfs;
