const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    age:{
        type: String,
    },
    bloodGroup:{
        type: String,
    },
    gender:{
        type: String,
    },
    disease:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'disease'  //ToDo : should we add this as object or normal array after this update updateProfile controller in user.js
    },
    exercise:{
        type: String
    },
    height:{
        type: String,
    },
    weight:{
        type: String,
    },
    
   
})

module.exports = mongoose.model("profile",profileSchema);