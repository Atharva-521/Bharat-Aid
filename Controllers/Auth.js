const User = require("../Models/User");
const OTP = require("../Models/OTP");
const otpGenerator = require('otp-generator');

//OTP Creation/generation
exports.sendOTP = async (req,res) => {
    try{
        //fetch data
        const {email} = req.body;
        //validate data
        if(!email){
            return res.status(400).json({
                success: false,
                message: "Please Provide email for OTP"
            })
        }
        //check if user already exists
        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                success: false,
                message: "User is already registered, please log in"
            })
        }
        //generate otp
        let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, 
                                                specialChars: false, 
                                                lowerCaseAlphabets: false});
        //check uniqueness of otp
        let result = await OTP.findOne({otp});

        while(result){
            otp = otpGenerator.generate(6, { upperCaseAlphabets: false, 
                specialChars: false, 
                lowerCaseAlphabets: false});

            result = await OTP.findOne({otp});
        }
        //create a db entry
        const payload = {
            email,
            otp
        }
        const response = await OTP.create(payload);
        //send a response
        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully On Email"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "OTP Generation Failed, Try Again"
        })
    }
}
//signUp

//Login

//changePassword