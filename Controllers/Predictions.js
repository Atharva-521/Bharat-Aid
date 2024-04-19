const bloodPressure = require("../Models/bloodPressure");
const sugar = require('../Models/sugar');
const inventory = require("../Models/inventory");
const User = require("../Models/User");


exports.addInventory = async(req, res) => {
    try{
        const {medicineName, buyDate, days, frequency} = req.body;
        const userId = req.user.id;

        //Validating Data
        if(!medicineName || !buyDate || !days || !frequency){
            return res.status(403).json({
                suceess: false,
                message: "All Fields Are Required In Order To Keep Track Of Medicine Usage"
            })
        }

        const inventory = await inventory.create({
            medicineName,
            buyDate,
            days,
            frequency
        });

        const userDetails = await User.findById(userId);
        const updatedUser = await User.findByIdAndUpdate(
            userDetails.additionalData,
            {
                $push: {
                    medication: inventory._id
                }
            },
            {new: true}
        );

        return res.status(200).json({
            success: true,
            message: "Medicine Added Successfully in inventory"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error While Creating Inventory Item"
        })
    }
}

//To-Do : Add controller that will calculate remaining days at every new day using node-cron library


exports.deleteInventory = async(req, res) => {
    try{
        const userId = req.user.id;
        if(!inventoryId){
            return res.status(403).json({
                success: false,
                message: "Inventory Id Required"
            })
        }

        const userDetails = await User.findById(userId);
        await User.findByIdAndUpdate(
            userDetails.additionalData,
            {
                $pull:{
                    medication: {eq: inventoryId}
                }
            }
        )

        await inventory.findByIdAndDelete(inventoryId);

        return res.status(200).json({
            success: true,
            message: "Inventory deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed To Delete Inventory"
        })
    }
};


exports.deleteAllInventoryItems = async (req, res) => {
    try {
        // Delete all items in the inventory
        await inventory.deleteMany({});

        return res.json({
            success: true,
            message: "All inventory items deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


//To-Do : Controller To Update The Inventory



exports.addBloodPressure = async(req, res) => {
    try{
        const {systolic, diastolic} = req.body;
        const userId = req.user.id;

        if(!systolic || !diastolic){
            return response.json({
                success: false,
                message: "Provide Values Of Blood Pressures"
            })
        }

        const userDetails = await User.findById(userId);

        const updatedBloodPressure = await bloodPressure.findByIdAndUpdate(
            userDetails.bloodPressure,
            {
                $push: {
                    systolic: systolic,
                    diastolic: diastolic
                }
            },
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "Blood Pressures added successfully",
            updatedBloodPressure
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed To Add Blood Pressure"
        })
    }
}


//To-Do : Add Cron Operation to bloodpressure that will automatically clear the data from 30 days array in bloodpressure model


exports.addSugar = async(req, res) => {
    try{
        const {fasting, postmeal} = req.body;
        const userId = req.user.id;

        if(!fasting || !postmeal){
            return response.json({
                success: false,
                message: "Provide Values Of Blood Pressures"
            })
        }

        const userDetails = await User.findById(userId);

        const updatedSugar = await bloodPressure.findByIdAndUpdate(
            userDetails.bloodPressure,
            {
                $push: {
                    fasting: fasting,
                    postmeal: postmeal
                }
            },
            {new: true}
        )

        return res.status(200).json({
            success: true,
            message: "Sugar Level added successfully",
            updatedSugar
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed To Add Sugar Level"
        })
    }
}


exports.getBPPredction = async(req, res) => {
    const user = req.user.id;
    try{
        // Get the users details from the database
        const userDetails = await User.findById(user)
        .select('bloodPressure')
        .populate('bloodPressure')
        .exec();

        console.log(userDetails);

        const systolic = userDetails.bloodPressure.systolic.toString();
        const diastolic = userDetails.bloodPressure.diastolic.toString();
        const days = userDetails.bloodPressure.systolic.map((item, index) => index + 1 ).toString();
        console.log("Systolic : ",systolic);
        console.log("Diastolic : ",diastolic);
        console.log("Days: ",days);

        const data = await fetch(`http://localhost:5000/get-prediction?date=${days}&systolic=${systolic}&diastolic=${diastolic}`);
        const response = await data.json();
        console.log(response);

        if(!response){
            return res.status(403).json({
                success: false,
                message: "Failed to Connect to API"
            })
        }

        //calculate avg
        let s_sum = userDetails.bloodPressure.systolic.reduce((acc, val) => acc + val, 0);
        let s_avg = s_sum / userDetails.bloodPressure.systolic.length;

        let d_sum = userDetails.bloodPressure.diastolic.reduce((acc, val) => acc + val, 0);
        let d_avg = d_sum / userDetails.bloodPressure.diastolic.length;

        let systolic_pred = response.systolic_predictions;
        let disatolic_pred = response.diastolic_predictions;
        let bp = response.blood_pressure;

        let s_low = false;
        let s_elevated = false;
        let s_high = false;
        let s_high2 = false;

        let d_low = false;
        let d_elevated = false;
        let d_high = false;
        let d_high2 = false;

        let s_status = -1; //normal
        let d_status = -1; //normal

        //Low - sys : <90  || dis : <60
        //Elevated - sys : >120 and < 129 || dis : >80
        //High - sys : >=130 and < 139 || dis : >80  && <=89
        //High stage 2 -  sys : >=140 or dis : >=90

        systolic_pred.forEach(element => {
            if(element < 90){
                s_low = true;
            }else if(element > 120 && element <= 129){
                s_elevated = true;
            }else if(element > 130 && element <= 139){
                s_high = true;
            }else if(element >= 140){
                s_high2 = true;
            }
        });

        disatolic_pred.forEach(element => {
            if(element <= 60){
                d_low = true;
            }else if(element > 80 && element <= 84){
                d_elevated = true;
            }else if(element > 85 && element <= 89){
                d_high = true;
            }else if(element >= 90){
                d_high2 = true;
            }
        });

        
        if(s_low){
            s_status = 0; //low
        }else if(s_elevated){
            s_status = 1; //elevated
        }else if(s_high){
            s_status = 2; //high
        }else if(s_high2){
            s_status = 3; //high2
        }

        
        if(d_low){
            d_status = 0; //low
        }else if(d_elevated){
            d_status = 1; //elevated
        }else if(d_high){
            d_status = 2; //high
        }else if(d_high2){
            d_status = 3; //high2
        }


        return res.status(200).json({
            success: true,
            s_status,
            d_status,
            s_avg,
            d_avg,
            message: "Predictions"
        })


    }catch(error){
        return res.status(500).json({
            sucess: false,
            message: error.message
        })
    }
}

exports.getLevels = async(req, res) => {
    try{
        const userId = req.user.id;

        const userDetails = await User.findById(userId);
        console.log(userDetails.bloodPressure);


        const userBP = await bloodPressure.findById(userDetails.bloodPressure);
        console.log(userBP);

        const userSugar = await sugar.findById(userDetails.sugar);
        console.log(userSugar);

        return res.status(200).json({
            success: true,
            BP : userBP,
            sugar : userSugar
        })

    }catch(error){
        res.status(500).json({
        success:false,
        message: error.message        
        })
    }
}

//To-Do : Add Cron Operation to sugar that will automatically clear the data from 30 days array in sugar model




//To-Do : create controller that returns systolic and disatolic arrays and then fetch them in ml model and use it