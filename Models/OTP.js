const mongoose = require("mongoose");
const sendMail = require("../Utils/sendMail");


const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    otp:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5 * 60
    }
})

async function sendverificationMail(email,otp){
    try{
        const info = await sendMail(email,"Verification Mail For Sign In To Bharat Aid ",otp)
        console.log("Email Sent Successfully");
    }catch(error){
        console.log("Failed To Send Email ",error);
    }
}


otpSchema.pre('save',function(next){
    sendverificationMail(this.email,this.otp)
});

module.exports = mongoose.model("otp",otpSchema);