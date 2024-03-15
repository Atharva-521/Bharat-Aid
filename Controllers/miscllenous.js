const User = require("../Models/User");
const diseases = require("../Models/diseases");
const profile = require("../Models/profile");


exports.addDiseease = async(req, res) => {
    try{
        const {diseaseName} = req.body;
        const userId = req.user.id;

        if(!diseaseName){
            return res.status(403).json({
                success: false,
                message: "Please Enter A Disease"
            })
        }

        const userDetails = await User.findById(userId);
        const profileDetails = await profile.findById(userDetails.additionalData);

        const diseaseDetails = await diseases.findByIdAndUpdate(
            profileDetails.disease,
            {
                $push:{
                    diseaseName: diseaseName
                }
            },
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "Disease Added Successfully",
            diseaseDetails
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed To Add The Disease"
        })
    }
}


//TO-Do : Delete Disease controller

exports.deleteDisease = async (req, res) => {
    try {
        const userId = req.user.id;
        const { diseaseId } = req.params; // Assuming diseaseId is passed in the request params

        // Check if user ID and disease ID are provided
        if (!userId || !diseaseId) {
            return res.status(400).json({
                success: false,
                message: "User ID and Disease ID are required"
            });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Find the user's profile
        const profile = await Profile.findById(user.additionalData);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Find the disease in the profile and remove it
        const index = profile.disease.indexOf(diseaseId);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Disease not found in user's profile"
            });
        }

        profile.disease.splice(index, 1); // Remove the disease
        await profile.save(); // Save the updated profile

        // Delete the disease from the diseases collection
        await Disease.findByIdAndDelete(diseaseId);

        return res.status(200).json({
            success: true,
            message: "Disease deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete the disease"
        });
    }
};