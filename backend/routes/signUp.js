var bodyParser = require('body-parser');
var userProfile = require('../models/profile');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
require('dotenv/config');
module.exports = function(app) {
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

    app.post('/api/addprofile', upload.single('file'), (req, res) => {
        try {
            if (!req.file) {
                res.send("No file uploaded");
            } else {
                var locationData = req.body.location.split(',');
                var obj = {
                    name: req.body.name,
                    userid: req.body.userid,
                    about: req.body.about,
                    location: {
                        type: "Point",
                        coordinates: [(Number)(locationData[1]), (Number)(locationData[0])]
                    },
                    findwithin: req.body.findwithin,
                    passion: req.body.passion.split(','),
                    bestdrink: req.body.bestdrink,
                    education: req.body.education,
                    foodpreferences: req.body.foodpreferences,
                    bestpets: req.body.bestpets.split(','),
                    smoking: req.body.smoking,
                    socialmedia: req.body.Socialmedia,
                    gender: req.body.gender,
                    preferredgender: req.body.preferredgender,
                    dob: req.body.dob,
                    img: {
                        data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
                        contentType: 'image/png'
                    }
                }
                userProfile.create(obj, (err, item) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("User Created")
                    }
                });
            }
        } catch (er) {
            res.send("Something went wrong.");
        }

    });
}