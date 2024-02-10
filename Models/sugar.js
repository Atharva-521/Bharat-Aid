const mongoose = require("mongoose");

const sugarSchema = new mongoose.Schema({
    fasting:{
        type: number,
        required: true
    },
    postmeal:{
        type: number,
        required: true
    }
}
)
    module.exports = mongoose.model("sugar",sugarSchema);
