var bodyParser = require('body-parser');
var conversation = require('../models/chat');
var userProfile = require('../models/profile');
var cors = require('cors');
require('dotenv/config');
module.exports = function(app){
    app.use(cors())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    app.post('/api/sendmessage', async(req, res) =>{
        try{var myData;
            var obj = {
                text:req.body.sentMsgData.text,
                senderid:req.body.sentMsgData.myid,
                receiverid:req.body.sentMsgData.profileid,
            }
            myData = await conversation.findOne({$and:[{members:{ $elemMatch: {$eq: req.body.sentMsgData.myid} }},{members:{ $elemMatch: {$eq: req.body.sentMsgData.profileid} }}]}).clone();
            myData.messages.push(obj);
            await conversation.findOneAndUpdate({$and:[{members:{ $elemMatch: {$eq: req.body.sentMsgData.myid} }},{members:{ $elemMatch: {$eq: req.body.sentMsgData.profileid} }}]},myData).clone();
            res.send("message sent");
        }
        catch(ex){
            res.send("Something went wrong.");
        }
        

    })
    app.get('/api/getmymessages/', async(req, res) => {
        try{
            var myData;
            var singleMessagesData;
            var finalDataToSend=[];
            var images;
            var image;
            myData = await conversation.find({members:{ $elemMatch: {$eq: req.query.myid} }}).clone();
            for(var i=0; i<myData.length;i++){
                image = null;
                if(myData[i].members[0]===req.query.myid){
                    images = await userProfile.findOne({userid:myData[i].members[1]}).select({"img":1,"name":1});
                    singleMessagesData = {
                        members:myData[i].members,
                        messages:myData[i].messages,
                        image:Buffer.from(images.img.data).toString('base64'),
                        profilename:images.name
                    };
                }
                else{
                    image = await userProfile.findOne({userid:myData[i].members[0]}).select({"img":1,"name":1});
                    singleMessagesData = {
                        members:myData[i].members,
                        messages:myData[i].messages,
                        image:Buffer.from(image.img.data).toString('base64'),
                        profilename:image.name
                    };                }
                finalDataToSend.push(singleMessagesData);
            }
            res.send(finalDataToSend);

        }
        catch{
            res.send("Something went wrong.");
        }
            
    });
}
