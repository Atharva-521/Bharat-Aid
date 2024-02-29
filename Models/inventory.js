const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    medicineName:{
        type: number,
        required: true
    },
    buyDate:{
        type: Date,
        required: true
    },
    days:{
        type: number,
        required: true
    },
    frequency:{
        type:number,
        required:true
    }
}
)
module.exports = mongoose.model("inventory",inventorySchema);
