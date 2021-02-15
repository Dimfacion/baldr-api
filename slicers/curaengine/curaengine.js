var fs = require('fs');
var Docker = require('dockerode');
var docker = new Docker(); //defaults to above if env variables are not used

var nodeCuraEngine = {};

nodeCuraEngine.render = function (options, callback) {

	if (options.verbose)
		console.log(options)

	docker.pull('dimfacion/curaengine:latest', function (err, stream) {
		docker.run('dimfacion/curaengine:latest', ['slice', '-j', '/usr/definitions/creality_ender3.def.json', '-l', options.inputFile, '-o', options.outputFile], process.stdout, {"Binds": [ "/tmp:/tmp:rw" ]}, function (err, data, container) {
			if (err){
				return callback({ message: err })
			}
			
			callback()
		});
	});
}

module.exports = nodeCuraEngine;