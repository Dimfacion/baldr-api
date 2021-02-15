var fs = require('fs');
var Docker = require('dockerode');
var docker = new Docker(); //defaults to above if env variables are not used

var nodeSlicer = {};

nodeSlicer.render = function (options, callback) {

	if (options.verbose)
		console.log(options)

	docker.pull('dimfacion/slic3r', function (err, stream) {
		docker.run('dimfacion/slic3r', ['--no-gui', options.inputFile], process.stdout, {"Binds": [ "/tmp:/tmp:rw" ]}, function (err, data, container) {
			if (err){
				return callback({ message: err })
			}
			
			callback()
		});
	});
}

module.exports = nodeSlicer;