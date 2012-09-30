var fs = require('fs');

module.exports = JSON.parse(fs.readFileSync('states.json'));
