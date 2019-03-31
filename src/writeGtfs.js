const debug = require('debug')('geojson-to-gtfs');
const fs = require('fs');
const path = require('path');

module.exports = function writeGtfs(data, outputDir) {
  Object.keys(data).forEach(name => {
    const filename = `${name}.txt`;
    const outputPath = path.join(outputDir, filename);

    debug(`Writing ${filename}`);
    writeCsv(data[name], outputPath);
  });
};

// Simple CSV file writer
function writeCsv(entries, outputPath) {
  const firstRow = entries[0];
  const keys = Object.keys(firstRow)
    .filter(key => key[0] !== '_')
    .filter(key => firstRow[key] != null);
  const headRow = keys.join(',');
  const rows = [headRow];

  entries.forEach(entry => {
    const row = keys.map(key => entry[key]);
    const quotedRow = row.map(d => {
      if (d && d.match && d.match(/,/)) {
        return `"${d}"`;
      }

      return d;
    });
    rows.push(quotedRow.join(','));
  });

  try {
    if (!fs.existsSync(path.dirname(outputPath))) {
      throw new Error(`Output directory does not exist`);
    }

    fs.writeFileSync(outputPath, rows.join('\n'));
  } catch (error) {
    throw new Error(`Could not write output file: ${error.message}`);
  }
}
