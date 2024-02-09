const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    age:{
        type: String,
        required: true
    },
    bloodGroup:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    disease:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'disease'
    },
    exercise:{
        type: String
    },
    height:{
        type: String,
        required: true
    },
    weight:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("profile",profileSchema);