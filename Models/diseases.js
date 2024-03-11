const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema({
    diseaseName:[{
        type: String,
        required: true
    }]
}
)
    module.exports = mongoose.model("diseases",diseaseSchema);