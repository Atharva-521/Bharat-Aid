const User = require("../Models/User");
const OTP = require("../Models/OTP");
const Profile = require("../Models/profile")
const otpGenerator = require('otp-generator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bloodPressure = require("../Models/bloodPressure");
const sugar = require("../Models/sugar")
const diseases = require("../Models/diseases")
require("dotenv").config()

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
        console.log(response);
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
//signUp ToDo : Add Dicebear Api image to profile
exports.signUp = async(req, res) => {
    try{
        // fetch data from req
        const {firstName,lastName,email,phoneNumber,password,confirmPassword,otp} = req.body;
        //validate data
        if(!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword || !otp){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })}
        //user exists
        const user = await User.findOne({email});

        if(user){
            return res.status(401).json({
                success: false,
                message: "User Already Registered, Please Log In To Proceed"
            })
        }
        //otp match
        const recentOTP = await OTP.find({email}).sort({createdAt: -1}).limit(1);
            console.log("recent OTP : ",recentOTP[0].otp);
            console.log("Otp : ",otp);
            console.log("Match?", recentOTP[0].otp !== otp)

        if(recentOTP[0].otp !== otp){
            return res.status(403).json({
                success: false,
                message: "OTP Doesn't Match, Try Again"
            })
        }
        //password validate
        if(password !== confirmPassword){
            return res.status(403).json({
                success: false,
                message: "Password and Confirm Password Does Not Match, Try Again"
            })
        }
        // hash
        const hashedPassword = await bcrypt.hash(password,10);
        //create entry in db
        const disease = await diseases.create({});
        const profile = await Profile.create({
            age: null,
            bloodGroup: null,
            gender: null,
            disease: disease._id,
            exercise: null,
            height: null,
            weight: null
            
        })

        const bloodPressureDetails = await bloodPressure.create({});
        const sugarDetails = await sugar.create({});
        
        const result = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: hashedPassword,
            additionalData: profile._id,
            bloodPressure: bloodPressureDetails._id,
            sugar: sugarDetails._id
        })

        return res.status(200).json({
            success: true,
            message: "User Registered Successfully!"
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error Occurred While registering, Please Try Again"
        })
    }
}
//Login
exports.login = async (req,res) => {
    try{
        //fetch data - email and password
        const {email,password} = req.body;
        //data validation
        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        //user Exists?
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }
        // password match with password present in db - await bcrypt.compare(password,user.password)
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(403).json({
                success: false,
                message: "Incorrect Password"
            })
        }

        const payload = {
            id: user._id,
            email,
            exp: Date.now() + 5 * 24 * 60 * 60 * 1000
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET);

        if(!token){
            return res.status(403).json({
                success: false,
                message: "Failed To Generate Token"
            })
        }

        const options = {
            expiresIn: Date.now() + 5 * 24 * 60 * 60 * 1000,
            httpOnly: true
        }

        res.cookie("token",token,options).status(200).json({
            success: true,
            message: "User Logged In Successfully",
            token,
            user
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error Occurred While Logging In, Please Try Again"
        })
    }
}

//changePassword
exports.changePassword = async (req, res) => {
    try {
        const { email, password, newpassword, confirmPassword } = req.body;

        if (!password || !newpassword) {
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not registered, please sign up"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(403).json({
                success: false,
                message: "Incorrect Password"
            });
        }

        if (newpassword !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Password and Confirm Password Do Not Match, Try Again"
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        const result = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Password successfully updated"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating the password, please try again"
        });
    }
};

