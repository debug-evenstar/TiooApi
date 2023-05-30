const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Student, Class } = require('../model/database');
const AuthController = require('../controller/auth.controller');

class SchoolManagementController {

    /*-----------------------------------| SETUP SCHOOL |-----------------------------------*/

    static async setup(req, res) {

        const errors = validationResult(req);

        const parsedBody = {
            school_types: JSON.stringify(req.body.school_types),
            naming_types: req.body.naming_types
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

            const compareIgnorCase = (item1, item2) => item1.toLowerCase() === item2.toLowerCase()
            const nurseryClasses = await Class.findAll({ where: { type: 'nursery' } });
            const primaryClasses = await Class.findAll({ where: { type: 'primary' } });
            const secondaryClasses = await Class.findAll({ where: { type: 'secondary' } });
            const primaryGrade = await Class.findAll({ where: { type: 'secondary' } })


            if (registeredAccount.SchoolManagement) {
                return res.status(ResponseStatus.code.conflict).json({ error: false, message: ResponseStatus.fail.school_duplicate });
            }

            const [registeredSchoolManagement] = await SchoolManagement.findOrCreate({ where: parsedBody });

            const assignedAccount = await registeredAccount.setSchoolManagement(registeredSchoolManagement);

            // /*-------------/ for standard school naming convention /-------------*/

            if (req.body.naming_types === 'nurs-sec') {

                if (req.body.school_types.includes('Nursery') || req.body.school_types.includes('nursery')) {

                    await registeredSchoolManagement.setClasses(nurseryClasses);

                }
                if (req.body.school_types.includes('Primary') || req.body.school_types.includes('primary')) {

                    await registeredSchoolManagement.addClasses(primaryClasses);

                }
                if (req.body.school_types.includes('Secondary') || req.body.school_types.includes('secondary')) {

                    await registeredSchoolManagement.addClasses(secondaryClasses);

                }

            }

            const registeredSchoolManagementWithClasses = await SchoolManagement.findOne({ where: { AccountId: emailExist.data.id }, include: [Class] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: registeredSchoolManagementWithClasses });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    };
}


module.exports = SchoolManagementController;
