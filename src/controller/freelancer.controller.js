const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, } = require('../database/connection');
const AuthController = require('../controller/auth.controller');
const ClassSeeds = require('../utils/class.utilities');
const SchoolUtils = require('./helper/assignClass.helper');

class FreelancerController {

    /*-----------------------------------| SETUP SCHOOL |-----------------------------------*/

    static async setup(req, res) {

        const parsedBody = {
            school_types: JSON.stringify(['Custome']),
            naming_types: req.body.naming_types
        }

        try {

            const userExist = await Validation.findOne({where: {token: req.body.token}});

            console.log(userExist);

            const registeredAccount = await userExist.getAccount();

            if (!userExist) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }


            if (registeredAccount.account_type === 'student' || registeredAccount.account_type === 'teacher') {
                return res.status(ResponseStatus.code.unauthorized).json({
                    error: true, message:
                        ResponseStatus.fail.school_setup
                });
            }

            const registeredSchoolManagement = await registeredAccount.getSchoolManagement();

            const updated = await registeredSchoolManagement.update(parsedBody);

            registeredAccount.status = 'active';
            
            await registeredAccount.save();

            /*-------------/ for standard school naming convention /-------------*/

            const action = req.body.naming_types;
            const schoolChoice = req.body.school_types;
            const schoolId = registeredSchoolManagement.dataValues.id;
            const customClassNaming = req.body.class_namings ?? [];

            await SchoolUtils.processClassesForSchool(action, schoolChoice, schoolId, customClassNaming);


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: registeredSchoolManagement });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    };

   
}


module.exports = FreelancerController;
