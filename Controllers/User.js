const User = require("../Models/User");
const profile = require("../Models/profile");



exports.getUserDetails = async(req, res) => {
    try{
        const userId = req.user.id;

        if(!userId){
            return res.status(404).json({
                success: false,
                message: "User Not Logged In"
            })
        }

        const userDetails = await User.findById(
            {_id: userId}
        )
        .populate({
            path: "profile",
            populate: {
                path: "disease"
            }
        })
        .populate("medication")
        .populate("bloodPressure")
        .populate("sugar")
        .exec();

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        return res.status(200).json({
            success: true,
            data: userDetails
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error Occured While Retrieving User Data"
        })
    }
}

exports.updateProfile = async(req, res) => {
    try{
        const {age = "", bloodGroup = "", gender = "", exercise = "", height = "", weight = ""} = req.body;
        const userId = req.user.id;

        const userDetails = await User.findById(id);
        const profile = await profile.findById(userDetails.additionalData);

        profile.age = age;
        profile.bloodGroup = bloodGroup;
        profile.gender = gender;
        profile.exercise = exercise;
        profile.height = height;
        profile.weight = weight;

        await profile.save();

        return res.json({
			success: true,
			message: "Profile updated successfully",
			profile,
		});
    }catch(error){
        console.log(error);
		return res.status(500).json({
			success: false,
			error: error.message,
		});
    }
}


//Delete Account
exports.deleteAccount = async(req, res) => {
    try{
        //fetch id
        const userId = req.user.id;

        //fetch user
        const userDetails = await User.findById(userId);

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        const additionalDataId = userDetails.additionalData;

        await profile.findByIdAndDelete(additionalDataId);

        await User.findByIdAndDelete(userId);
        
        return res.status(200).json({
            success: true,
            message: "User Deletes Successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message: "Error Occured While Deleting User, Please Try Again!"
        })
    }
}

exports.updateProfilePicture = async(req, res) => {
    try{
        const userId = req.user.id;
        const img = req.files.image;

        if(!img){
            return res.status(403).json({
                success: false,
                message:"please upload an image"
            })
        }
    }catch(error){

    }
}