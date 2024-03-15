const express = require('express');
const router = express.Router();

const {
    getUserDetails,
    updateProfile,
    deleteAccount,
    updateProfilePicture
} = require('../Controllers/User');

const {auth} = require( '../Middlewares/auth' );

router.get('/getuserdetails',auth,getUserDetails);
router.put('/updateprofile',auth,updateProfile);
router.delete( '/deleteaccount', auth , deleteAccount );
router.put( "/uploadpicture",auth,updateProfilePicture);

module.exports = router;