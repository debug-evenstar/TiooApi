const express = require('express');
router = express.Router();


/*-----------------------------------| HOME |-----------------------------------*/

router.get('/', (req, res) => { res.json({ message: "NIMO SERVER RUNNING...." }) });


/*--------------------------------| CONTROLLERS |--------------------------------*/

const AuthenicationController = require('../controller/auth.controller');
const SchoolManagementController = require('../controller/school.controller');
const ClassController = require('../controller/class.control');
const ClassArmsController = require('../controller/classArms.controller');

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

    router.post('/new/account/send_otp', AuthenicationController.sendTempOTP);
    router.post('/new/account/verify', AuthenicationController.verifyTempEmail);

    router.post('/school/setup', SchoolManagementController.setup);

};

/*------------------------------| SECURED ROUTES |------------------------------*/

const adminAuthorizedRoutesGroup = (router) => {

    router.use(AuthenticationMiddleware.verify) //--use middleware--//
    router.get('/account/read_all', AuthenicationController.accounts);
    router.get('/account/read', AuthenicationController.accountProfile);
    router.put('/account/update', AuthenicationController.updateAccount);
    router.put('/account/flag', AuthenicationController.flagAccount);
    router.put('/account/update/:id', AuthenicationController.updateAccountById);
    router.get('/account/read/:id', AuthenicationController.accountByID);
    router.delete('/account/delete/:id', AuthenicationController.deleteAccount);


    router.get('/school/classes/:id', SchoolManagementController.classes);
    router.get('/school/read/', SchoolManagementController.read);
    router.get('/school/read/:id', SchoolManagementController.readById);
    router.get('/school/read/classes/:id', SchoolManagementController.readByIdWithClasses);
    router.post('/school/class/remove', SchoolManagementController.removeClassFromSchool);
    router.get('/school/class/read', SchoolManagementController.getClassBySidANDCid);

    router.post('/class/create', ClassController.create);
    router.post('/class/create_bulk', ClassController.bulkCreate);
    router.get('/class/read', ClassController.readAll);
    router.get('/class/read/:id', ClassController.read);
    router.put('/class/update/:id', ClassController.update);
    router.delete('/class/delete/:id', ClassController.delete);

    router.post('/class/arms/create', ClassArmsController.create);
    router.post('/class/arms/create_bulk', ClassArmsController.createBulk);
    router.get('/class/arms/read', ClassArmsController.readAll);
    router.get('/class/arms/read/:id', ClassArmsController.readById);
    router.put('/class/arms/update/:id', ClassArmsController.updateById);
    router.delete('/class/arms/delete/:id', ClassArmsController.deleteArmById);


};


allAuthorizedRoutesGroup(router);
adminAuthorizedRoutesGroup(router);

module.exports = router;

