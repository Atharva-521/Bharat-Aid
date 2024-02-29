const mongoose = require("mongoose");

const sugarSchema = new mongoose.Schema({
    //TO-Do : Add Fields that wil take data for only 30 days and then reset 
    fasting:[{
        type: number,
        required: true
    }],
    postmeal:[{
        type: number,
        required: true
    }]
}
)
    module.exports = mongoose.model("sugar",sugarSchema);
