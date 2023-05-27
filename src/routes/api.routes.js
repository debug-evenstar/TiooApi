const express = require('express');
router = express.Router();


/*-----------------------------------| HOME |-----------------------------------*/

router.get('/', (req, res)=>{ res.json({ message: "NIMO SERVER RUNNING...." })});



/*--------------------------------| CONTROLLERS |--------------------------------*/

const AuthenicationController = require('../controller/auth.controller');


/*-----------------------------| MIDDLEWARE |-----------------------------*/

const TokenMiddleware = require('../middleware/token.middleware');


/*------------------------------| ROUTES |------------------------------*/

router.post('/account/signin', AuthenicationController.signInAccount);
router.post('/account/signup', AuthenicationController.createAccount);
router.post('/account/verify', AuthenicationController.verifyAccount);
router.post('/account/resend_otp', AuthenicationController.resendVerificationOTP);


/*------------------------------| SECURED ROUTES |------------------------------*/

router.get('/account/fetch', AuthenicationController.accounts);
router.get('/account/profile', TokenMiddleware.verify, AuthenicationController.accountProfile);
router.get('/account/update/:id',  AuthenicationController.updateAccount);
router.get('/account/:id', AuthenicationController.accountByID);




module.exports = router;

