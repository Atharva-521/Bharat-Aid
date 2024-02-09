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
        ref:'profile'
    },
    image:{
        type: String,
        required: true
    },
    medication:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'inventory'
    },
    bloodPressure:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'bloodPressure'
    },
    sugar:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sugar'
    },
    relativeEmail:{
        type: String  //TODO : To add in profile or to keep in user only
    }
})

module.exports = mongoose.model("user",userSchema);