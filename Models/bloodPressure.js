const mongoose = require("mongoose");

const bloodPressureSchema = new mongoose.Schema({
    systolic:{
        type: Number
    },
    diastolic:{
        type: Number
    }
})

module.exports = mongoose.model("bloodPressure",bloodPressureSchema);