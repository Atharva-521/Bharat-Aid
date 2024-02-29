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