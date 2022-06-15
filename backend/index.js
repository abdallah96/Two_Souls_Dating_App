var express = require('express')
var app = express()
const cookieParser = require("cookie-parser");
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
var cors = require('cors');

app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
require('./routes/home')(app);
require('./routes/authroutes')(app);


require('./routes/profile')(app);
require('./routes/chat')(app);
require('./routes/admin')(app);
require('./routes/signUp')(app);
require('./routes/profile')(app);
require('./routes/events')(app);
require('dotenv/config');
mongoose.connect(process.env.MONGO_URL,
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });
      app.use(cookieParser());
      
      app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var port = process.env.PORT || '5000'
app.listen(port, err => {
    if (err)
        throw err
    console.log('Server listening on port', port)
})