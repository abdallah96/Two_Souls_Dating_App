
var userProfile = require('../models/profile');
var conversation = require('../models/chat');
var blindProfile = require('../models/blindDate')
var coffeeDateProfile = require('../models/coffeeDate')

require('dotenv/config');
module.exports = function(app) {
    
    app.post('/api/getblinddate/', async(req, res) => {
        try{
            var myData;
        var myId = req.body.myid;
        var blindData;
        var myblindData;
        var blindDateProfile;
        var genderPrefference
        myData = await userProfile.findOne({userid:req.body.myid}).clone();
        blindData = await  blindProfile.findOne({userid:req.body.myid}).select({ "userid": 1}).clone();
        if(!blindData){
            var blindObj = {
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
                Socialmedia:myData.Socialmedia,
                gender:myData.gender,
                preferredgender:myData.preferredgender,
                dob:myData.dob,
                img: myData.img
            }
            await blindProfile.create(blindObj)
            myblindData = await blindProfile.findOne({userid:req.body.myid}).select({"userid":1,"matches":1,"liked":1})
        }
        if(myData.preferredgender === 'everyone'){
            genderPrefference = ['man','everyone','woman']
        }
        else{
            genderPrefference = [myData.preferredgender]
        }
        blindDateProfile = await blindProfile.findOne({
           location:{
               $near:{
                $maxDistance: myData.findwithin * 1000,
                $geometry : {
                  type : 'Point',
                  coordinates:[49.409380, 8.683539]
                }
               }
           },
           gender:{$in:genderPrefference},
           $and:[{userid: {$nin: myData.liked}},{userid:{$nin: myData.disliked}},{userid:{ $ne: myId }}]
        }).select({ "liked": 1, "matches":1,"userid":1}).clone();
        if(blindDateProfile){
            blindDateProfile.matches.push(req.body.myid)
            blindDateProfile.liked.push(req.body.myid)
            myblindData.matches.push(blindDateProfile.userid);
            myblindData.liked.push(blindDateProfile.userid);
            await blindProfile.findOneAndUpdate({$and:[{userid:blindDateProfile.userid},{liked:{$ne:req.body.myid }},{matches:{$ne:req.body.myid }}]},blindDateProfile).clone()
            await blindProfile.findOneAndUpdate({$and:[{userid: req.body.myid},{liked:{$ne:blindDateProfile.userid }},{matches:{$ne:blindDateProfile.userid }}]},myblindData).clone()
            var obj = {members:[req.body.myid,blindDateProfile.userid],messages:[]}
            var createdAlready = await conversation.findOne({$and:[{members:blindDateProfile.userid},{members:req.body.myid }]})
            if(!createdAlready){await conversation.create(obj);}
            res.send("Found a date!!!")
        }
        else{
            res.send("You are added.")
        }
        }
        catch(er){
            res.send("Something went wrong.");
        }
        
    });
    app.post('/api/joincoffeedate/', async(req, res) => {
        try{
            var myCoffeData;
        var myUserData;
        myCoffeData = await  coffeeDateProfile.findOne({userid:req.body.myid}).select({ "userid": 1}).clone();
        if(!myCoffeData){
            myUserData = await userProfile.findOne({userid:req.body.myid}).clone();
            var coffeeObj = {
                name: myUserData.name,
                userid: myUserData.userid,
                about: myUserData.about,
                location: myUserData.location,
                findwithin:myUserData.findwithin,
                passion:myUserData.passion,
                bestdrink:myUserData.bestdrink,
                education:myUserData.education,
                foodpreferences:myUserData.foodpreferences,
                bestpets:myUserData.bestpets,
                smoking:myUserData.smoking,
                Socialmedia:myUserData.Socialmedia,
                gender:myUserData.gender,
                preferredgender:myUserData.preferredgender,
                dob:myUserData.dob,
                img: myUserData.img
            }
            await coffeeDateProfile.create(coffeeObj)
            res.send("user added to coffee date")
        }else{
            res.send("user already exists")
        }
        }
        catch(er){
            res.send("Something went wrong.");
        }
        
    });
    var likedUserData;
    app.post('/api/postcoffeedateuserliked', async(req, res)=>{
        try{
            var myData;
        myData = await coffeeDateProfile.findOne({userid:req.body.likedData.myid}).select({ "liked": 1, "matches":1}).clone();
        likedUserData = await coffeeDateProfile.findOne({userid:req.body.likedData.profileid,liked:req.body.likedData.myid}).select({ "liked": 1, "matches":1}).clone();
        if(likedUserData){
            likedUserData.matches.push(req.body.likedData.myid)
            myData.matches.push(req.body.likedData.profileid);
            await coffeeDateProfile.findOneAndUpdate({$and:[{userid:req.body.likedData.profileid},{matches:{$ne:req.body.likedData.myid }}]},likedUserData).clone()
            myData.liked.push(req.body.likedData.profileid);
            await coffeeDateProfile.findOneAndUpdate({$and:[{userid: req.body.likedData.myid},{liked:{$ne:req.body.likedData.profileid }},{matches:{$ne:req.body.likedData.profileid }}]},myData).clone()
            var obj = {members:[req.body.likedData.myid,req.body.likedData.profileid],messages:[]}
            var createdAlready = await conversation.findOne({$and:[{members:req.body.likedData.myid},{members:req.body.likedData.profileid}]})
            if(!createdAlready){
                await conversation.create(obj);
            }
            res.send("User matched")
        }
        else{
            myData.liked.push(req.body.likedData.profileid);
            await coffeeDateProfile.findOneAndUpdate({$and:[{userid: req.body.likedData.myid},{liked:{$ne:req.body.likedData.profileid }}]},myData).clone()
            res.send("User liked")
        }
        }
        catch(er){
            res.send("Something went wrong.");
        }
        

    })

    app.post('/api/postcoffeedateuserdisliked', async(req, res) =>{
        try{
            var myData;
            myData = await coffeeDateProfile.findOne({userid:req.body.dislikedData.myid}).select({ "disliked": 1}).clone();
            myData.disliked.push(req.body.dislikedData.profileid);
            await coffeeDateProfile.updateOne({$and:[{userid: req.body.dislikedData.myid},{disliked:{$ne:req.body.dislikedData.profileid }}]},myData).clone()
            res.send("User disliked")
        }
        catch(er){
            res.send("Something went wrong.");
        }
       

    })
    app.get('/api/getcoffeedateuserprofile/', async(req, res) => {
        try{
            var myData;
            var myId = req.query.myid;
            var genderPrefference
            myData = await coffeeDateProfile.findOne({userid:req.query.myid}).select({"disliked": 1, "liked": 1,"findwithin":1,"preferredgender":1,"location":1}).clone();
            if(myData.preferredgender === 'everyone'){
                genderPrefference = ['man','other','woman']
            }
            else{
                genderPrefference = [myData.preferredgender]
            }
            coffeeDateProfile.find({
               location:{
                   $near:{
                    $maxDistance: myData.findwithin * 1000,
                    $geometry : {
                      type : 'Point',
                      coordinates:[49.409380, 8.683539]
                    }
                   }
               },
               gender:{$in:genderPrefference},
               $and:[{userid: {$nin: myData.liked}},{userid:{$nin: myData.disliked}},{userid:{ $ne: myId }}]
    
            }, (err, items) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('An error occurred', err);
                }
                else {
                    var finalData = [];
                    for(var i=0;i<items.length;i++)
                    {
                        var obj = {
                            name: items[i].name,
                            userid: items[i].userid,
                            about: items[i].about,
                            location: items[i].location,
                            findwithin:items[i].findwithin,
                            passion:items[i].passion,
                            bestdrink:items[i].bestdrink,
                            education:items[i].education,
                            foodpreferences:items[i].foodpreferences,
                            bestpets:items[i].bestpets,
                            smoking:items[i].smoking,
                            Socialmedia:items[i].Socialmedia,
                            gender:items[i].gender,
                            preferredgender:items[i].preferredgender,
                            dob:items[i].dob,
                            img: Buffer.from(items[i].img.data).toString('base64')
                        }
                        finalData.push(obj)
                    }
                    res.send({data:finalData,mylocation:myData.location})
                }
            }).clone();
        }
        catch(er){
            res.send("Something went wrong.");
        }
       
    });
}