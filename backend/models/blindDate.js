var mongoose = require('mongoose');
var blindProfile = new mongoose.Schema({
    name: String,
    about: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    location: {
        type: { type: String },
        coordinates: []
       },
    findwithin:Number,
    passion:[String],
    bestdrink:String,
    education:String,
    foodpreferences:String,
    bestpets:[String],
    smoking:String,
    socialmedia:String,
    gender:String,
    preferredgender:String,
    dob:String,
    liked:[],
    matches:[],
    disliked:[],
    userid:String
});
blindProfile.index({ location: "2dsphere" });
//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('blindDate', blindProfile);