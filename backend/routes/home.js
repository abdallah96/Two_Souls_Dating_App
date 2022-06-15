var bodyParser = require("body-parser");
var userProfile = require("../models/profile");
var conversation = require("../models/chat");
var report = require("../models/reports");

require("dotenv/config");
module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  var likedUserData;
  app.post("/api/postuserliked", async (req, res) => {
      
    try {
      var myData;
      myData = await userProfile
        .findOne({ userid: req.body.likedData.myid })
        .select({ liked: 1, matches: 1 })
        .clone();
      likedUserData = await userProfile
        .findOne({
          userid: req.body.likedData.profileid,
          liked: req.body.likedData.myid,
        })
        .select({ liked: 1, matches: 1 })
        .clone();
      if (likedUserData) {
        likedUserData.matches.push(req.body.likedData.myid);
        myData.matches.push(req.body.likedData.profileid);
        await userProfile
          .findOneAndUpdate(
            {
              $and: [
                { userid: req.body.likedData.profileid },
                { matches: { $ne: req.body.likedData.myid } },
              ],
            },
            likedUserData
          )
          .clone();
        myData.liked.push(req.body.likedData.profileid);
        await userProfile
          .findOneAndUpdate(
            {
              $and: [
                { userid: req.body.likedData.myid },
                { liked: { $ne: req.body.likedData.profileid } },
                { matches: { $ne: req.body.likedData.profileid } },
              ],
            },
            myData
          )
          .clone();
        var obj = {
          members: [req.body.likedData.myid, req.body.likedData.profileid],
          messages: [],
        };
        var createdAlready = await conversation.findOne({
          $and: [
            { members: req.body.likedData.myid },
            { members: req.body.likedData.profileid },
          ],
        });
        if (!createdAlready) {
          await conversation.create(obj);
        }
        res.send("User matched");
      } else {
        myData.liked.push(req.body.likedData.profileid);
        await userProfile
          .findOneAndUpdate(
            {
              $and: [
                { userid: req.body.likedData.myid },
                { liked: { $ne: req.body.likedData.profileid } },
              ],
            },
            myData
          )
          .clone();
        res.send("User liked");
      }} catch (er) {
        res.send("Something went wrong.");
      }
  });

  app.post("/api/postuserdisliked", async (req, res) => {
    try {
      var myData;
      myData = await userProfile
        .findOne({ userid: req.body.dislikedData.myid })
        .select({ disliked: 1 })
        .clone();
      myData.disliked.push(req.body.dislikedData.profileid);
      await userProfile
        .updateOne(
          {
            $and: [
              { userid: req.body.dislikedData.myid },
              { disliked: { $ne: req.body.dislikedData.profileid } },
            ],
          },
          myData
        )
        .clone();
      res.send("User disliked");
    } catch (er) {
      res.send("Something went wrong.");
    }
  });
  app.get("/api/getuserprofile/", async (req, res) => {
    try {
      var myData;
      var myId = req.query.myid;
      var genderPrefference;
      myData = await userProfile
        .findOne({ userid: req.query.myid })
        .select({
          disliked: 1,
          liked: 1,
          findwithin: 1,
          preferredgender: 1,
          location: 1,
        })
        .clone();
      if (myData.preferredgender === "everyone") {
        genderPrefference = ["man", "other", "woman"];
      } else {
        genderPrefference = [myData.preferredgender];
      }
      userProfile
        .find(
          {
            location: {
              $near: {
                $maxDistance: myData.findwithin * 1000,
                $geometry: {
                  type: "Point",
                  coordinates: [49.40938, 8.683539],
                },
              },
            },
            gender: { $in: genderPrefference },
            $and: [
              { userid: { $nin: myData.liked } },
              { userid: { $nin: myData.disliked } },
              { userid: { $ne: myId } },
            ],
          },
          (err, items) => {
            if (err) {
              console.log(err);
              res.status(500).send("An error occurred", err);
            } else {
              var finalData = [];
              for (var i = 0; i < items.length; i++) {
                var obj = {
                  name: items[i].name,
                  userid: items[i].userid,
                  about: items[i].about,
                  location: items[i].location,
                  findwithin: items[i].findwithin,
                  passion: items[i].passion,
                  bestdrink: items[i].bestdrink,
                  education: items[i].education,
                  foodpreferences: items[i].foodpreferences,
                  bestpets: items[i].bestpets,
                  smoking: items[i].smoking,
                  Socialmedia: items[i].Socialmedia,
                  gender: items[i].gender,
                  preferredgender: items[i].preferredgender,
                  dob: items[i].dob,
                  img: Buffer.from(items[i].img.data).toString("base64"),
                };
                finalData.push(obj);
              }
              res.send({ data: finalData, mylocation: myData.location });
            }
          }
        )
        .clone();
    } catch (er) {
      res.send("Something went wrong.");
    }
  });
  app.post("/api/reportuser", async (req, res) => {
    try {
      var user;
      var userdataStore;
     
      user = await report.findOne({ userid: req.body.reporteddata.profileid });
      if (!user) {
        userdataStore = {
          userid: req.body.reporteddata.profileid,
          count: 1,
        };
        await report.create(userdataStore);
      } else {
        user.count = user.count + 1;
        await report.findOneAndUpdate({ userid: req.body.reporteddata.profileid }, user);
      }
      res.send("User Reported");
    } catch (er) {
      res.send("Something went wrong.");
    }
  });
  
  app.get("/api/getuserprofilebyid/", async (req, res) => {
    try {
      var myData;
      myData = await userProfile.findOne({ userid: req.query[0] });
      if (myData) {
        var obj = {
          name: myData.name,
          userid: myData.userid,
          about: myData.about,
          location: myData.location,
          findwithin: myData.findwithin,
          passion: myData.passion,
          bestdrink: myData.bestdrink,
          education: myData.education,
          foodpreferences: myData.foodpreferences,
          bestpets: myData.bestpets,
          smoking: myData.smoking,
          Socialmedia: myData.Socialmedia,
          gender: myData.gender,
          preferredgender: myData.preferredgender,
          dob: myData.dob,
          img: Buffer.from(myData.img.data).toString("base64"),
        };
        res.send(obj);
      }
    } catch (er) {
      res.send("Something went wrong.");
    }
  });
};
