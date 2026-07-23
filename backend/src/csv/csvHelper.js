const fs = require('fs');
const path = require('path');
const fastCsv = require('fast-csv');

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    if (!fs.existsSync(filePath)) {
      resolve([]);
      return;
    }

    fs.createReadStream(filePath)
      .pipe(fastCsv.parse({ headers: true, ignoreEmpty: true }))
      .on('error', reject)
      .on('data', (row) => results.push(row))
      .on('end', () => resolve(results));
  });
}

function writeCSV(filePath, rows, headers) {
  return new Promise((resolve, reject) => {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const writeStream = fs.createWriteStream(filePath);
    const csvStream = fastCsv.format({ headers: headers || true });

    writeStream.on('finish', resolve);
    writeStream.on('error', reject);
    csvStream.on('error', reject);

    csvStream.pipe(writeStream);

    if (Array.isArray(rows)) {
      rows.forEach((row) => csvStream.write(row));
    }

    csvStream.end();
  });
}

module.exports = {
  readCSV,
  writeCSV,
};
