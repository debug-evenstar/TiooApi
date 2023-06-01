const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Student, Class, ClassArm } = require('../database/connection');
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
            const primaryGrade = await Class.findAll({ where: { type: 'pry-grade' } });
            const secondaryGrade = await Class.findAll({ where: { type: 'sec-grade' } });


            if (registeredAccount.SchoolManagement) {

                return res.status(ResponseStatus.code.conflict).json({ error: false, message: ResponseStatus.fail.school_duplicate });
            }

            const [registeredSchoolManagement] = await SchoolManagement.findOrCreate({ where: parsedBody });

            const assignedAccount = await registeredAccount.setSchoolManagement(registeredSchoolManagement);


            /*-------------/ for standard school naming convention /-------------*/

            const action = req.body.naming_types;

            switch (action) {

                case 'nur-sec':

                    if (req.body.school_types.includes('Nursery') || req.body.school_types.includes('nursery')) {
                        await registeredSchoolManagement.setClasses(nurseryClasses);
                    }

                    if (req.body.school_types.includes('Primary') || req.body.school_types.includes('primary')) {
                        await registeredSchoolManagement.addClasses(primaryClasses);
                    }

                    if (req.body.school_types.includes('Secondary') || req.body.school_types.includes('secondary')) {
                        await registeredSchoolManagement.addClasses(secondaryClasses);
                    }
                    break;

                case 'grade':

                    if (req.body.school_types.includes('Nursery') || req.body.school_types.includes('nursery')) {
                        await registeredSchoolManagement.setClasses(primaryGrade);
                    }
                    if (req.body.school_types.includes('Secondary') || req.body.school_types.includes('secondary')) {
                        await registeredSchoolManagement.addClasses(secondaryGrade);
                    }
                    break;

                case 'custom':
                    // TODO
                    break;

                default:
                    console.log('Unknown action');
            }

            const registeredSchoolManagementWithClasses = await SchoolManagement.findOne({ where: { AccountId: emailExist.data.id }, include: [Class] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: registeredSchoolManagementWithClasses });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    };

    /*----------------------------------| ALL SCHOOLS |----------------------------------*/

    static async read(req, res) {

        try {

            const allSchools = await SchoolManagement.findAll();

            if (!allSchools) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: allSchools });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*----------------------------------| SCHOOLS BY ID |----------------------------------*/

    static async readById(req, res) {

        const { id } = req.params;

        try {

            const response = await SchoolManagement.findByPk(id);

            if (!response) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: response });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*----------------------------------| FETCH SCHOOLS BY ID WITH CLASSES |----------------------------------*/

    static async readByIdWithClasses(req, res) {

        const { id } = req.params;

        try {

            const response = await SchoolManagement.findByPk(id, { include: [Class] });

            if (!response) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: response });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*----------------------------------| FETCH CLASSES BY SCHOOL ID |----------------------------------*/

    static async classes(req, res) {

        const { id } = req.params;

        try {

            const schoolInstance = await SchoolManagement.findByPk(id);

            if (!schoolInstance) {

                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });

            }

            const classes = await schoolInstance.getClasses({ joinTableAttributes: [], include: [ClassArm]});

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classes });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*----------------------------------| REMOVE CLASS FROM SCHOOL |----------------------------------*/

    static async removeClassFromSchool(req, res) {

        const { schoolId, classId } = req.body;

        try {

            const schoolInstance = await SchoolManagement.findByPk(schoolId);

            if (!schoolInstance) {
                console.log("school instance", schoolId)
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classInstance = await Class.findByPk(classId);

            if (!classInstance) {
                console.log("class instance", classInstance)
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await schoolInstance.removeClass(classInstance);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

        /*----------------------------------| GET CLASS BY SID & CID |----------------------------------*/

        static async getClassBySidANDCid(req, res) {

            const { sid, cid } = req.query;
    
            try {
    
                const schoolInstance = await SchoolManagement.findByPk(sid);
    
                if (!schoolInstance) {
                    console.log("school instance", schoolId)
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
                }
    
                const classInstance = await Class.findByPk(cid);
    
                if (!classInstance) {
                    console.log("class instance", classInstance)
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
                }

                // -----------------------DOES THE SAME BUT RETURNS ARRAY--------------------------------------
                //const classes = await schoolInstance.getClasses({ joinTableAttributes: [], where: {id: cid} });

    
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: classInstance });
    
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Server Error' });
            };
        }

}


module.exports = SchoolManagementController;
