const mongoose = require("mongoose");

const bloodPressureSchema = new mongoose.Schema({
    //TO-Do : Add Fields that wil take data for only 30 days and then reset 
    systolic:[{
        type: Number
    }],
    diastolic:[{
        type: Number
    }]
})

module.exports = mongoose.model("bloodPressures",bloodPressureSchema);