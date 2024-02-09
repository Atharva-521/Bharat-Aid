const mongoose = require("mongoose");

const sugarSchema = new mongoose.Schema({
    fasting:{
        type: int,
        required: true
    },
    postmeal:{
        type: int,
        required: true
    }
}
)
    module.exports = mongoose.model("sugar",sugarSchema);