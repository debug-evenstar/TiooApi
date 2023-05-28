const express = require('express');
router = express.Router();


/*-----------------------------------| HOME |-----------------------------------*/

router.get('/', (req, res) => { res.json({ message: "NIMO SERVER RUNNING...." }) });


/*--------------------------------| CONTROLLERS |--------------------------------*/

const AuthenicationController = require('../controller/auth.controller');


/*---------------------------------| MIDDLEWARE |---------------------------------*/

const AuthenticationMiddleware = require('../middleware/token.middleware');


/*------------------------------| AUTHORIZED ROUTES |------------------------------*/

const allAuthorizedRoutesGroup = (router) => {

    router.post('/account/signin', AuthenicationController.signInAccount);
    router.post('/account/signup', AuthenicationController.createAccount);
    router.post('/account/verify', AuthenicationController.verifyAccount);
    router.post('/account/resend_otp', AuthenicationController.resendVerificationOTP);

};

/*------------------------------| SECURED ROUTES |------------------------------*/

const adminAuthorizedRoutesGroup = (router) => {

    router.use(AuthenticationMiddleware.verify) //--use middleware--//
    router.get('/account/fetch', AuthenicationController.accounts);
    router.get('/account/profile', AuthenticationMiddleware.verify, AuthenicationController.accountProfile);
    router.get('/account/profile', AuthenticationMiddleware.verify, AuthenicationController.accountProfile);
    router.put('/account/flag', AuthenicationController.flagAccount);
    router.put('/account/update/:id', AuthenicationController.updateAccountById);
    router.delete('/account/delete/:id', AuthenicationController.deleteAccount);
    router.get('/account/:id', AuthenicationController.accountByID);

};


allAuthorizedRoutesGroup(router);
adminAuthorizedRoutesGroup(router);

module.exports = router;

