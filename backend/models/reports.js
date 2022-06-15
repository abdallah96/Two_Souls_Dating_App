var mongoose = require('mongoose');
var reports = new mongoose.Schema({
    userid:String,
    count:Number
});
//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('reports', reports);