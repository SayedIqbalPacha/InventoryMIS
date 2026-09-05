const express = require('express');

const authController = require('../controllers/authCon');

const router = express.Router();


// SIGN UP
router.post('/signup',authController.signup);


// LOGIN
router.post('/login',authController.login);


// FORGOT PASSWORD
router.post('/forgotPassword',authController.forgotPassword);


// RESET PASSWORD
router.patch('/resetPassword/:token',authController.resetPassword);


// UPDATE CURRENT USER
router.patch('/updateMe',authController.protect,authController.updateMe);


// DELETE CURRENT USER
router.delete('/deleteMe',authController.protect,authController.deleteMe);

module.exports = router;