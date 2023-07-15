const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Student, Class, ClassArm } = require('../database/connection');
const AuthController = require('../controller/auth.controller');
const ClassSeeds = require('../utils/class.utilities');
const SchoolUtils = require('./helper/assignClass.helper');

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


            const registeredSchoolManagement = await registeredAccount.SchoolManagement.update(parsedBody);


            /*-------------/ for standard school naming convention /-------------*/

            const action = req.body.naming_types;
            const schoolChoice = req.body.school_types;
            const schoolId = registeredSchoolManagement.dataValues.id;
            const customClassNaming = req.body.class_namings ?? [];

            await SchoolUtils.processClassesForSchool(action, schoolChoice, schoolId, customClassNaming);

            const registeredSchoolManagementWithClasses = await SchoolManagement.findOne({ where: { AccountId: emailExist.data.id }, include: [Class] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: registeredSchoolManagement });

        } catch (error) {
            console.log(error);
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


    /*----------------------------------| FETCH SCHOOLS BY ID WITH Teachers |----------------------------------*/

    static async schoolTeachers(req, res) {

        const { id } = req.params;

        try {

            const schoolInstance = await SchoolManagement.findByPk(id);

            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const schoolTeachersProfile = await schoolInstance.getTeachers();

            const teacherAccountIds = schoolTeachersProfile.map(teacher => teacher.AccountId);

            let teachersAccount = [];

            if (teacherAccountIds.length !== 0) {
                teachersAccount = await Account.findAll({ where: { id: [...teacherAccountIds] }, attributes: { exclude: ['password'] } });
            }


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: teachersAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }



        /*----------------------------------| FETCH AUTH SCHOOLS TEACHERS |----------------------------------*/

        static async authSchoolTeachers(req, res) {

            try {
    
                const AccountInstance = await Account.findByPk(req.userData.id, { include: [SchoolManagement] });
                if (!AccountInstance) {
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
                }
                const SchoolInstances = await AccountInstance.getSchoolManagement();
                if (!SchoolInstances) {
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
                }
    
                const schoolInstance = await SchoolManagement.findByPk(SchoolInstances.id);
    
                if (!schoolInstance) {
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
                }
    
                const schoolTeachersProfile = await schoolInstance.getTeachers();
    
                const teacherAccountIds = schoolTeachersProfile.map(teacher => teacher.AccountId);
    
                let teachersAccount = [];
    
                if (teacherAccountIds.length !== 0) {
                    teachersAccount = await Account.findAll({ where: { id: [...teacherAccountIds] }, attributes: { exclude: ['password'] } });
                }
        
    
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: teachersAccount });
    
            } catch (error) {
                console.log(error);
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

            const classes = await schoolInstance.getClasses({ joinTableAttributes: [], include: [ClassArm] });

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

            const classInstance = await Class.findByPk(classId);

            if (!classInstance) {
                console.log("class instance", classInstance)
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await classInstance.destroy();

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

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: classInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| FETCH AUTHORIZED ACCOUNT |-----------------------------------*/

    static async schoolProfile(req, res) {

        const { id } = req.userData;

        try {

            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password', 'createdAt'], include: '' } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const schoolInstance = await accountInstance.getSchoolManagement();

            accountInstance.dataValues.schoolManagementId = schoolInstance.id;

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: accountInstance });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }

}


module.exports = SchoolManagementController;
