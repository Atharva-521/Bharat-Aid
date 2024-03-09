const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    medicineName: {
        type: String, // Changed to String type
        required: true
    },
    buyDate: {
        type: Date,
        required: true
    },
    days: {
        type: Number,
        required: true
    },
    frequency: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("inventories", inventorySchema); // Changed model name to "inventory"
