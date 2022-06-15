var mongoose = require('mongoose');
var conversation = new mongoose.Schema({
    members: [],
    messages: [{
        text:String,
        senderid:String,
        receiverid:String,
      },{timestamp:true}],
});
//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('conversation', conversation);