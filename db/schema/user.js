var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var user = {};

var userSchema = new Schema({
  name: String,
  mail: String
});

user.schema = userSchema;

module.exports = user;
