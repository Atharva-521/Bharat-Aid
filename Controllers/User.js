const User = require("../Models/User");
const Profile = require("../Models/profile");
const Inventory = require("../Models/inventory")
const {uploadToCloudinary} = require("../Utils/uploadToCloudinary");



exports.getUserDetails = async(req, res) => {
    try{
        const userId = req.user.id;
        console.log("User Id : ", userId);
        if(!userId){
            return res.status(404).json({
                success: false,
                message: "User Not Logged In"
            })
        }

        const userDetails = await User.findById(
            userId
        )
        .populate({
            path: "additionalData",
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
        console.log("User Details : ", userDetails)
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

exports.updateUserDetails = async(req, res) => {
    try{
        const {Name, phoneNumber, email} = req.body;

        
            const firstName = Name.split(' ')[0];
            const lastName = Name.split(' ')[1];
        
        
        const userId = req.user.id;

        if(!userId){
            return res.status(403).json({
                success: false,
                message: 'User not logged in! Please login to continue.'
            })
        }

        const updatedProfile = await User.findByIdAndUpdate(userId, {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email
        }, {new: true})

        console.log(updatedProfile);

        if(!updatedProfile){
            return res.status(403).json({
                success: false,
                message: 'error occured while updating user details'
            })
        }

        return res.status(200).json({
            success: true,
            updatedProfile
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.updateProfile = async(req, res) => {
    try{
        const {age , bloodGroup , gender , exercise , height , weight} = req.body;
        const userId = req.user.id;

        const userDetails = await User.findById(userId).populate("additionalData");
        console.log(userDetails.additionalData._id)
        const profile = await Profile.findById(userDetails.additionalData._id);
        console.log("Profile : ", profile)

        age != "" ? profile.age = age : profile.age = "";
        bloodGroup != "" ? profile.bloodGroup = bloodGroup : profile.bloodGroup = "";
        gender != "" ? profile.gender = gender : profile.gender = "";
        exercise != "" ? profile.exercise = exercise : profile.exercise = "";
        height != "" ? profile.height = height : profile.height = "";
        weight != "" ? profile.weight = weight : profile.weight = "";

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
        console.log(img)

        if(!img){
            return res.status(403).json({
                success: false,
                message:"please upload an image"
            })
        }

        const userDetails = await User.findById(userId);
        

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }

        const uploadDetails = await uploadToCloudinary(img, process.env.FOLDER);
        console.log(uploadDetails)

        userDetails.image = uploadDetails.secure_url;

        await userDetails.save();

        return res.status(200).json({
            success: true,
            message: "Profile Image Uploaded Succeessfully",
            userDetails
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error Occured While Uploading Profile Details"
        })
    }
}
