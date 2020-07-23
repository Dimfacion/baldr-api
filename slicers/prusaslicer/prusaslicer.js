var fs = require('fs'),
	childProcess = require('child_process'),
	
	nodePrusaSlicer = {}

function getShellCommand (o) {

	var shellCommand

	shellCommand = [
		'slic3r-prusa3d',
		'--output ' + o.outputFile,

		// Output options
		o.outputFilenameFormat ?
		'--output-filename-format ' + o.outputFilenameFormat : '',

		// Transform options
		o.scale ? '--scale ' + o.scale : '',
		o.rotate ? '--rotate ' + o.rotate : '',
		o.duplicate ? '--duplicate ' + o.duplicate : '',
		o.duplicateGrid ? '--duplicate-grid ' + o.duplicateGrid : '',
		o.duplicateDistance ? '--duplicate-distance ' + o.duplicateDistance : '',

        //Input options
		o.inputFile ? o.inputFile : '',
        
        //Load config file
		o.configFile ? '--load ' + o.configFile : ''
	]

	return shellCommand.join(' ')
}

nodePrusaSlicer.render = function (options, callback) {

	var shellCommand

	shellCommand = getShellCommand(options)

	if (options.verbose)
		console.log(shellCommand)

	childProcess.exec(
		shellCommand,
		function (error, stdout, stderr) {

			if (stderr){
				return callback({ message: stderr })
			}

			if (error)
				return callback(error)
			
			callback()
		}
	)
}

module.exports = nodePrusaSlicer;