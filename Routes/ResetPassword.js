const express = require('express');
const router = express.Router();

const {
    resetPasswordLink,
    resetPassword
} = require("../Controllers/ResetPassword");

router.post('/send-reset-link', resetPasswordLink);
router.post('/reset-password', resetPassword);

module.exports = router;