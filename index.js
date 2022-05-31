const express= require('express');
const mongoose =require('mongoose');
const serverConfig= require('./configs/server.config');
const dbConfig= require('./configs/db.config');
const bodyParser=require('body-parser');
const User = require("./models/user.model");
const bcrypt = require("bcrypt");



const app= express();
app.use(bodyParser.json({strict:false}));
app.use(bodyParser.urlencoded({extended:true}));

app.listen(serverConfig.PORT,()=>{
  console.log(`CRM is running on ${serverConfig.PORT}`);
});

mongoose.connect(dbConfig.db_url,()=>{
  console.log("connected to mongodb");
  init();
},err => {console.log(err);});



async function init() {

    var user = await User.findOne({ userId: "admin" });

    if (user) {
      console.log("admin is already present");
        return;
    } else {

        //Create the admin user

        const user = await User.create({
            name: "Vamsi",
            userId: "admin",
            email: "pvamsi@gmail.com",
            userType: "ADMIN",
            password: bcrypt.hashSync("Welcome", 8)
        });
        console.log("admin user is created");

    }
}

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/ticket.routes')(app);
