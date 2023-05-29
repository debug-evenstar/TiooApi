const { validationResult } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Student } = require('../model/database');
const AuthController = require('../controller/auth.controller');

class SchoolManagementController {

    /*-----------------------------------| SETUP SCHOOL |-----------------------------------*/

    static async setup(req, res) {

        const errors = validationResult(req);

        const parsedBody = {
            school_types: JSON.stringify(req.body.school_types),
            naming_types: JSON.stringify(req.body.naming_types)
        }

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const emailExist = await AuthController.validateEmail(req.body.email);
            const registeredAccount = await Account.findByPk(emailExist.data.id, { include: [SchoolManagement, Student] });

            if (!emailExist.pass) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }

            if (!emailExist.data.verification_status === 1) {
                return res.status(ResponseStatus.code.unauthorized).json({
                    error: true, message:
                        ResponseStatus.fail.verify
                });
            }

            if (emailExist.data.account_type === 'student' || emailExist.data.account_type === 'teacher') {
                return res.status(ResponseStatus.code.unauthorized).json({
                    error: true, message:
                        ResponseStatus.fail.school_setup
                });
            }

            if (registeredAccount.SchoolManagement) {
                return res.status(ResponseStatus.code.conflict).json({ error: false, message: ResponseStatus.fail.school_deplicate });
            }

            const registeredSchoolManagement = await SchoolManagement.create(parsedBody);

            const response = await registeredAccount.setSchoolManagement(registeredSchoolManagement);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: registeredAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    };
}


module.exports = SchoolManagementController;
