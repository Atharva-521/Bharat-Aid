const express = require('express')
const router = express.Router();

const {
    sendOTP,
    signUp,
    login,
    changePassword
} = require('../Controllers/Auth');

const {auth} = require('../Middlewares/auth')

router.post('/sendotp',sendOTP);
router.post('/signup',signUp);
router.post('/login',login);
router.post('/changepass',changePassword);

module.exports = router;
