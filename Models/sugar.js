const mongoose = require("mongoose");

const sugarSchema = new mongoose.Schema({
    //TO-Do : Add Fields that wil take data for only 30 days and then reset 
    fasting:[{
        type: Number,
        required: true
    }],
    postmeal:[{
        type: Number,
        required: true
    }]
}
)
    module.exports = mongoose.model("sugars",sugarSchema);
