var fs = require('fs');
var Docker = require('dockerode');
var docker = new Docker(); //defaults to above if env variables are not used
	
nodePrusaSlicer = {}

nodePrusaSlicer.render = function (options, callback) {

	if (options.verbose)
		console.log(options)

	docker.pull('dimfacion/prusaslicer', function (err, stream) {
		docker.run('dimfacion/prusaslicer', ['-g', options.inputFile], process.stdout, {"Binds": [ "/tmp:/tmp:rw" ]}, function (err, data, container) {
			if (err){
				return callback({ message: err })
			}
			
			callback()
		});
	});
}

module.exports = nodePrusaSlicer;