const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    phoneNumber:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    additionalData:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'profiles'
    },
    medication:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'inventories'
    }],
    bloodPressure:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'bloodPressures'
    },
    sugar:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sugars'
    },
    relativeEmail:{
        type: String  //TODO : To add in profile or to keep in user only
    },
    image:{
        type: String,
    },
})

module.exports = mongoose.model("users",userSchema);