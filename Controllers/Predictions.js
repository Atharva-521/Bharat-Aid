const bloodPressure = require("../Models/bloodPressure");
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
        const {inventoryId} = req.body;
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


//To-Do : Controller to delete all the Inventory


//Program to delete inventory items by item id

router.delete('/inventory/:itemId', inventoryController.deleteInventoryItem);

exports.deleteInventoryItem = async (req, res) => {
    try {
        const itemId = req.params.itemId; // Assuming itemId is part of the route parameters

        // Check if itemId is provided
        if (!itemId) {
            return res.json({
                success: false,
                message: "Provide Item ID for deletion"
            });
        }

        // Check if the item exists
        const existingItem = await Inventory.findById(itemId);

        if (!existingItem) {
            return res.json({
                success: false,
                message: "Inventory item not found"
            });
        }

        // Delete the item
        await Inventory.findByIdAndDelete(itemId);

        return res.json({
            success: true,
            message: "Inventory item deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};


// Define the route for deleting all inventory items
router.delete('/inventory', inventoryController.deleteAllInventoryItems);


exports.deleteAllInventoryItems = async (req, res) => {
    try {
        // Delete all items in the inventory
        await Inventory.deleteMany({});

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



exports.updateBloodPressure = async(req, res) => {
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


exports.updateSugar = async(req, res) => {
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

//To-Do : Add Cron Operation to sugar that will automatically clear the data from 30 days array in sugar model




//To-Do : create controller that returns systolic and disatolic arrays and then fetch them in ml model and use it