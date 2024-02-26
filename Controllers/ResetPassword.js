const User = require("../Models/User");
const sendMail = require("../Utils/sendMail")
const bcrypt = require("bcrypt");

//Send Reset Password Link
exports.resetPasswordLink = async (req,res) => {
    try{
        // fetch email
        const email = req.body.email;
        //validate
        if(!email){
            return res.status(401).json({
                success: false,
                message: "Please Enter Your Email Address"
            })
        }
        //user exists?
        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User Not Found, Please Register"
            })
        }
        // generate random token
        const token = crypto.randomUUID();
        //add token to user db
        const update = await User.findOneAndUpdate({email},{
            token: token,
            resetPasswordExpires: Date.now() + 5*60*1000,
        },{new: true})
        //create an url
        const url = `http://localhost:3000/resetpassword/${token}`
        //send mail
        const result = await sendMail(email,'Your Password Reset Link',url);
        if(!result){
            return res.status(401).json({
                success: false,
                message: "Something Went Wrong While Sending Mail"
            })
        }
        //send res
        return res.status(200).json({
            success: true,
            message: "Reset Email Sen Successfull"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed Sending Reset Mail"
        })
    }
}

//Reset Password
exports.resetPassword = async(req, res) => {
    try{
        const {password, confirmPassword, token} = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password Does Not Match"
            })
        }

        const userDetails = await User.findOne(
            {token: token}
        )

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        if(!(userDetails.resetPasswordExpires > Date.now())){
            return res.status(403).json({
                success: false,
                message: "Token Expired, Please Regenerate your token"
            })
        }

        const encryptedPassword = await bcrypt.hash(password,10);

        const updatedUser = await User.findOneAndUpdate(
            {token : token},
            {
                password: encryptedPassword
            },
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "Password Reset Successfully"
        })
    }catch(error){
        return res.json({
			error: error.message,
			success: false,
			message: `Some Error in Updating the Password`,
		});
    }
}