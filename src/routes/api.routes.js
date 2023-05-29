const express = require('express');
router = express.Router();


/*-----------------------------------| HOME |-----------------------------------*/

router.get('/', (req, res) => { res.json({ message: "NIMO SERVER RUNNING...." }) });


/*--------------------------------| CONTROLLERS |--------------------------------*/

const AuthenicationController = require('../controller/auth.controller');
const SchoolManagementController = require('../controller/school.controller');


/*---------------------------------| MIDDLEWARE |---------------------------------*/

const AuthenticationMiddleware = require('../middleware/token.middleware');

/*------------------------------| AUTHORIZED ROUTES |------------------------------*/

const allAuthorizedRoutesGroup = (router) => {

    router.post('/account/signin', AuthenicationController.signInAccount);
    router.post('/account/signup', AuthenicationController.createAccount);
    router.post('/account/verify', AuthenicationController.verifyAccount);
    router.post('/account/send_otp', AuthenicationController.requestVerificationOTP);
    router.post('/account/verify', AuthenicationController.verifyOTP);
    router.put('/account/change_password', AuthenicationController.changePassword);
    router.put('/account/change_password', AuthenicationController.changePassword);
    router.post('/account/school/setup', SchoolManagementController.setup);

    router.post('/new/account/send_otp', AuthenicationController.sendTempOTP);
    router.post('/new/account/verify', AuthenicationController.verifyTempEmail);

};

/*------------------------------| SECURED ROUTES |------------------------------*/

const adminAuthorizedRoutesGroup = (router) => {

    router.use(AuthenticationMiddleware.verify) //--use middleware--//
    router.get('/account/fetch', AuthenicationController.accounts);
    router.get('/account/profile', AuthenicationController.accountProfile);
    router.put('/account/update', AuthenicationController.updateAccount);
    router.put('/account/flag', AuthenicationController.flagAccount);
    router.put('/account/update/:id', AuthenicationController.updateAccountById);
    router.delete('/account/delete/:id', AuthenicationController.deleteAccount);
    router.get('/account/:id', AuthenicationController.accountByID);

};


allAuthorizedRoutesGroup(router);
adminAuthorizedRoutesGroup(router);

module.exports = router;

