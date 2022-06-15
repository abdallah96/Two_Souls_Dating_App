var bodyParser = require('body-parser');
var userProfile = require('../models/profile');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
require('dotenv/config');
module.exports = function(app){ 
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });
      
    var upload = multer({ storage: storage });
    app.get('/api/getmyprofile/', async(req, res) => {
        try{var myData;
            myData = await userProfile.findOne({userid:req.query.myid});
            var obj = {
                name: myData.name,
                userid: myData.userid,
                about: myData.about,
                location: myData.location,
                findwithin:myData.findwithin,
                passion:myData.passion,
                bestdrink:myData.bestdrink,
                education:myData.education,
                foodpreferences:myData.foodpreferences,
                bestpets:myData.bestpets,
                smoking:myData.smoking,
                socialmedia:myData.socialmedia,
                gender:myData.gender,
                preferredgender:myData.preferredgender,
                dob:myData.dob,
                img: Buffer.from(myData.img.data).toString('base64')
            }
            res.send(obj)
        }
        catch(er){
            res.send("Something went wrong.");
        }
        
    });
    
    app.post('/api/updateprofiledetails', upload.single('file'), async(req, res) => {
        try{
            var locationData = req.body.location.split(',');
            if(req.file!= undefined)
            {
                var obj = {
                    name: req.body.name,
                    about: req.body.about,
                    location: {
                        type:"Point",
                        coordinates: [(Number)(locationData[1]),(Number)(locationData[0])]
                    },
                    findwithin:req.body.findwithin,
                    gender:req.body.gender,
                    preferredgender:req.body.preferredgender,
                    dob:req.body.dob,
                    img: {
                        data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
                        contentType: 'image/png'
                    }
                }
            }
            else{

            var obj = {
                name: req.body.name,
                about: req.body.about,
                location: {
                    type:"Point",
                    coordinates: [(Number)(locationData[1]),(Number)(locationData[0])]
                },
                findwithin:req.body.findwithin,
                gender:req.body.gender,
                preferredgender:req.body.preferredgender,
                dob:req.body.dob
            }
            }
            await userProfile.findOneAndUpdate({userid:req.body.userid},obj)
            res.send("Profile Updated")
        }
        catch(er){
            res.send("Something went wrong.");
        }
    });
    app.post('/api/updateprofilequestionaire',  async(req, res) => {
        try{
                var obj = {
                    passion:req.body.passion,
                    bestdrink:req.body.bestdrink,
                    education:req.body.education,
                    foodpreferences:req.body.foodpreferences,
                    bestpets:req.body.bestpets,
                    smoking:req.body.smoking,
                    socialmedia:req.body.Socialmedia,
                }
                await userProfile.findOneAndUpdate({userid:req.body.userid},obj)
                res.send("Profile Updated")
        }
        catch(er){
            res.send("Something went wrong.");
        }
    });
    app.get('/api/getmypicture/', async(req,res) =>{
        try{
            var profilepic;
        profilepic = await userProfile.findOne({userid:req.query.myid}).select({"img":1});
        res.send(Buffer.from(profilepic.img.data).toString('base64'))
        }
        catch(er){
            res.send("Something went wrong.");
        }
        
    })
}
