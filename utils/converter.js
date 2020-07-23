const once = require('once');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');

var converter = {};

converter.fromIniToJson = async function(path, callback) {
    try {
        const rl = createInterface({
            input: createReadStream(path),
            crlfDelay: Infinity
        });

        var result = {};

        rl.on('line', (line) => {
            console.log(line);
            // Process the line.
            var parts = line.split('=');
            result[parts[0]] = parts[1];
        });

        rl.once('close', () => {
            callback(result);
        });
    } catch (err) {
        console.error(err);
        callback(undefined, err);
    }
}

converter.fromJsonToIni = function(config, callback) {
    callback();
}

module.exports = converter;