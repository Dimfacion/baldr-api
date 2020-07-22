const http = require('http');
const fileUpload = require('express-fileupload');

const hostname = '127.0.0.1';
const port = 3000;

const nodeSlicer = require('node-slic3r');

const express = require('express')
const app = express()
const fs = require('fs');
const compression = require('compression')
const cors = require('cors')
// compress responses
app.use(compression())
// default options
app.use(fileUpload());
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/upload', function(req, res) {
  console.log(req.files);

  for(var i = 0 ; i < Object.keys(req.files).length; i++) {
    var nameObject = Object.keys(req.files)[i];
    var sampleFile = req.files[nameObject];
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/tmp/' + sampleFile.name, function(err) {
      if (err)
        return res.status(500).send(err);

      var options = {
        inputFile: '/tmp/' + sampleFile.name
        // For more options check out the configSchema.yaml file
      };

      nodeSlicer.render(options, function (error, bufferData) {
        if (error)
            console.error(error.message)
        else {
          console.log(sampleFile.name);
          let name = sampleFile.name.substring(0, sampleFile.name.lastIndexOf('.'));
          console.log(name);
          fs.writeFile('/tmp/' + name + '.gcode', bufferData, function (err) {
            if (err) throw err;
            res.download('/tmp/' + name + '.gcode', name + '.gcode'); 
          }); 
        }
      })
    });
  }
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});