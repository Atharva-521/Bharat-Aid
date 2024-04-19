const express = require('express');
const router = express.Router();

const {
    getUserDetails,
    updateProfile,
    deleteAccount,
    updateProfilePicture,
    updateUserDetails
} = require('../Controllers/User');

const {auth} = require( '../Middlewares/auth' );

router.post('/getuserdetails',auth,getUserDetails);
router.put('/updateprofile',auth,updateProfile);
router.delete( '/deleteaccount', auth , deleteAccount );
router.put( "/uploadpicture",auth,updateProfilePicture);
router.post("/updateuserdetails", auth, updateUserDetails)

module.exports = router;