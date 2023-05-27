const express = require('express');
router = express.Router();


/*-----------------------------------| HOME |-----------------------------------*/

router.get('/', (req, res)=>{ res.json({ message: "NIMO SERVER RUNNING...." })});

/*--------------------------------| CONTROLLERS |--------------------------------*/

const AuthenicationController = require('../controller/auth.controller');

/*-----------------------------| REQUEST VALIDATOR |-----------------------------*/


/*------------------------------| TOKEN VALIDATOR |------------------------------*/


router.post('/account/signup', AuthenicationController.createAccount);
router.post('/account/verify', AuthenicationController.verifyAccount);
router.post('/account/resend_otp', AuthenicationController.resendVerificationOTP);


module.exports = router;

