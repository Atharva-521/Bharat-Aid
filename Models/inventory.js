const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    medicineName:{
        type: int,
        required: true
    },
    buyDate:{
        type: Date,
        required: true
    },
    days:{
        type: int,
        required: true
    },
    frequency{
        type:int,
        required:true
    }
}
)
    module.exports = mongoose.model("inventory",inventorySchema);