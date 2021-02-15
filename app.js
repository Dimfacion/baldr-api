const http = require("http");
const fileUpload = require("express-fileupload");

const hostname = "127.0.0.1";
const port = 3000;

const nodeSlicer = require("./slicers/slic3r/slic3r");
const prusaSlicer = require("./slicers/prusaslicer/prusaslicer");
const curaEngine = require("./slicers/curaengine/curaengine");
const converter = require("./utils/converter");
const database = require("./utils/database");

const express = require("express");
const app = express();
const fs = require("fs-extra");
const compression = require("compression");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

// compress responses
app.use(compression());
// default options
app.use(fileUpload());
app.use(cors());

app.get("/", function (req, res) {
  res.send("Baldr is awake and shining !");
});

app.post("/upload/:slicerType", function (req, res) {
  for (var i = 0; i < Object.keys(req.files).length; i++) {
    var nameObject = Object.keys(req.files)[i];
    var sampleFile = req.files[nameObject];
    sampleFile.id = uuidv4();
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv("/tmp/" + sampleFile.id + ".stl", function (err) {
      if (err) return res.status(500).send(err);

      var options = {
        inputFile: "/tmp/" + sampleFile.id + ".stl",
        // For more options check out the configSchema.yaml file,
        // configFile: './default/slic3r.ini',
        outputFile: "/tmp/" + sampleFile.id + ".gcode",
      };

      var callback = function (error) {
        if (error) console.error(error.message);
        else {
          let name = sampleFile.name.substring(0, sampleFile.name.lastIndexOf("."));
          res.download("/tmp/" + sampleFile.id + ".gcode", name + ".gcode", () => {
            fs.remove("/tmp/" + sampleFile.id + ".gcode");
            fs.remove("/tmp/" + sampleFile.id + ".stl");
          });
        }
      };

      var slicerToUse;

      if (req.params.slicerType === "slic3r") {
        slicerToUse = nodeSlicer;
      } else if (req.params.slicerType === "prusaslicer") {
        slicerToUse = prusaSlicer;
      } else if (req.params.slicerType === "curaengine") {
        slicerToUse = curaEngine;
      } else {
        return res.status(500).send("Wrong parameter");
      }
      slicerToUse.render(options, callback);
    });
  }
});

app.get("/config", function (req, res) {
  console.log(
    converter.fromIniToJson("./default/slic3r.ini", (result) => {
      console.log(result);
      res.status(200).send(result);
    })
  );
});

app.get("/public/profiles", function (req, res) {
  fs.readFile("./public/availableProfiles.json", (err, data) => {
    res.status(200).send(data);
  });
});

app.listen(port, hostname, () => {
  database.init(undefined, () => {});
  console.log(`Server running at http://${hostname}:${port}/`);
});
