const mongoose = require("mongoose");

require("dotenv").config()

exports.connectdb = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(console.log("DB connected successfully")).catch((error) => console.log("DB connection issues"));
}