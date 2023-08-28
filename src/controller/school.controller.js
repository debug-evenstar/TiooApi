const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Student, Class, ClassArm, Subject } = require('../database/connection');
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

            registeredAccount.status = 'active';
            await registeredAccount.save();

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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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

            const schoolTeachersProfile = await schoolInstance.getTeachers({ include: [Account, Subject, Class, ClassArm] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: schoolTeachersProfile });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    static async schoolTerms(req, res) {

        const { id } = req.userData;

        try {

            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password', 'createdAt'], include: '' } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const schoolInstance = await accountInstance.getSchoolManagement();

            // Check for configured school terms
            // OR

            const defaultTerms = SchoolManagementController.bootstrapTerms();
            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: defaultTerms });

        } catch (error) {
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    static bootstrapTerms() {
        return [
            {
                id: 1,
                label: "1st Term/Semester"
            },
            {
                id: 2,
                label: "2nd Term/Semester"
            },
            {
                id: 3,
                label: "3rd Term/Semester"
            }
        ];
    }



    static async kyc(req, res) {

        let filePaths = [];

        if (req.files && req.files.length > 0) {
            filePaths = req.files.map((file) => file.path);
            req.body.files = filePaths;
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const registeredSchoolManagement = await registeredAccount.SchoolManagement.update(req.body);


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: registeredSchoolManagement });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };


    /*-----------------------------------| READ PROFILE |-----------------------------------*/

    static async readProfile(req, res) {

        const { id } = req.userData;
        delete req.body.email;

        try {

            const accountInstance = await Account.findByPk(id);

            const schoolInstance = await accountInstance.getSchoolManagement();

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const payload = {
                id: accountInstance.id,
                name: accountInstance.name,
                phone: accountInstance.phone,
                email: accountInstance.email,
                website: schoolInstance.website,
                profile_picture: accountInstance.display_image ?? "https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png"
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }

    /*-----------------------------------| UPDATE PROFILE |-----------------------------------*/

    static async updateProfile(req, res) {

        const { id } = req.userData;
        delete req.body.email;

        try {

            const accountInstance = await Account.findByPk(id);

            const schoolInstance = await accountInstance.getSchoolManagement();

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            accountInstance.name = req.body.name;
            accountInstance.phone = req.body.phone;
            schoolInstance.website = req.body.website;
            schoolInstance.school_name = req.body.name;

            const account = await accountInstance.save();
            const school =  await schoolInstance.save();

            const payload = {
                id: account.id,
                name: account.name,
                phone: account.phone,
                email: account.email,
                profile_picture: account.display_image ?? "https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png",
                website: school.website,
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }
}


module.exports = SchoolManagementController;
