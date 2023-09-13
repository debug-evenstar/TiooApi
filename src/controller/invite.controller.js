const ResponseStatus = require("../config/message.config");
const { validationResult, param } = require('express-validator');
const { Invite, ClassArm, Validation, Account, Class, Subject, Teacher, SchoolManagement, Student } = require("../database/connection");
const AuthController = require('../controller/auth.controller');
const TokenMiddleware = require('../middleware/token.middleware');



class InviteController {

    /*-----------------------------------| GENERATE REFERRAL CODE |-----------------------------------*/

    static generateReferralCode(length) {

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let referralCode = '';

        for (let i = 0; i < length; i++) {
            referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return referralCode;
    }

    /*-----------------------------------| GENERATE INVITE LINK |-----------------------------------*/

    static async generateLink(req, res) {

        try {

            req.body.code = InviteController.generateReferralCode(8);

            const inviteInstance = await Invite.create(req.body);

            console.log(inviteInstance);

            const link = `${process.env.WEB_URL}/${req.body.account_type}/${inviteInstance.code}`;

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: { link } });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    static async generateStudentLink(req, res) {

        try {

            const armInstance = await ClassArm.findByPk(req.body.arm);

            if (!armInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: 'Invalid class arms Id' });
            }

            const classInstance = await armInstance.getClass();

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: 'No class attached to this arms' });
            }

            const body = {
                "account_type": "student",
                "classes": [classInstance.id],
                "classarms": [armInstance.id],
                "subjects": [],
                "schoolId": req.body.schoolId,
                "code": InviteController.generateReferralCode(8)
            }

            const inviteInstance = await Invite.create(body);

            const link = `${process.env.WEB_URL}/${body.account_type}/${inviteInstance.code}`;

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: { link } });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    /*-----------------------------------| READ ALL INVITES |-----------------------------------*/

    static async invites(req, res) {

        try {

            const inviteInstance = await Invite.findAll();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: inviteInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    /*-----------------------------------| READ INVITE BY ID |-----------------------------------*/

    static async invite(req, res) {

        const { id } = req.params;

        try {

            const inviteInstance = await Invite.findByPk(id);

            if (!inviteInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: inviteInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    /*-----------------------------------| READ STUDENT INVITE BY ID |-----------------------------------*/

    static async studentInvite(req, res) {

        const { code } = req.params;

        try {

            const inviteInstance = await Invite.findOne({ where: { code: code } });

            if (!inviteInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            let invitedClassArms;

            if (process.env.ENVIRONMENT) {
                 invitedClassArms = JSON.parse(inviteInstance.classarms);
            } else {
                 invitedClassArms = inviteInstance.classarms;
            }

            const classArmInstance = await ClassArm.findByPk(invitedClassArms[0]);

            const classInstance = await classArmInstance.getClass();

            const payload = {
                "name": "",
                "email": "",
                "schoolId": inviteInstance.schoolId,
                "arm": invitedClassArms[0],
                "naming": classArmInstance.naming
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    /*-----------------------------------| READ BY INVITE CODE |-----------------------------------*/

    static async inviteByCode(req, res) {

        const { code } = req.params;

        try {

            const inviteInstance = await Invite.findOne({ where: { code: code } });


            if (!inviteInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            let invitedClasses;
            let invitedClassArms;

            if (process.env.ENVIRONMENT) {
                 invitedClasses = JSON.parse(inviteInstance.classes);
                 invitedClassArms = JSON.parse(inviteInstance.classarms);
            } else {
                 invitedClasses = inviteInstance.classes;
                 invitedClassArms = inviteInstance.classarms;
            }

            console.log(inviteInstance)

            const subjects = await Subject.findAll({ where: { id: [...inviteInstance.subjects] }, attributes: { exclude: ["SchoolManagementId"] } });

            const classes = await Class.findAll({where: {id: [...invitedClasses]}, attributes: {exclude: ["SchoolManagementId"]}});

            const classArms = await ClassArm.findAll({where: {id: [...invitedClassArms]}, attributes: {exclude: ["SchoolManagementId"]}});


            let payload;

            payload = {
                "name": "",
                "email": "",
                "account_type": inviteInstance.account_type,
                "flag": "invited",
                "classes": invitedClasses,
                "classarms": invitedClassArms,
                "class_naming": classes.map(data => ({'naming': data.naming})),
                "arms_naming": classArms.map(data => ({'naming': data.naming})),
                "Subjects": subjects,
                "schoolId": inviteInstance.schoolId
            }

            if (inviteInstance.account_type == 'teacher') {
                payload.teacher_type = inviteInstance.teacher_type;
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    /*-----------------------------------| DELETE INVITE BY ID |-----------------------------------*/

    static async delete(req, res) {

        const { id } = req.params;

        try {

            const inviteInstance = await Invite.findByPk(id);

            if (!inviteInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await inviteInstance.destroy();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: {} });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    /*-----------------------------------| TEACHER ACCEPT |-----------------------------------*/

    static async teacherAccept(req, res) {


        const errors = validationResult(req);
        const otp = Math.floor(Math.random() * 900000) + 100000;
        const data = req.body;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const emailExist = await AuthController.validateEmail(req.body.email);

            if (emailExist.pass) {
                return res.status(ResponseStatus.code.conflict).json({
                    error: true, message:
                        ResponseStatus.fail.account_conflict
                });
            }

            const schoolInstance = await SchoolManagement.findByPk(req.body.schoolId);

            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            req.body.status = "active",
            req.body.flag = "active",
            req.body.verification_status = 1;

            const registeredAccount = await Account.create(req.body);
            const newValidation = await Validation.create({ otp });
            await registeredAccount.setValidation(newValidation);

            const teacherInstance = await Teacher.create(req.body);
            await registeredAccount.setTeacher(teacherInstance);

            const classArmsInstance = await ClassArm.findAll({ where: { id: [...req.body.classes] } , include : [Class]});
            const subjectInstance = await Subject.findAll({ where: { id: [...req.body.subjects] } });

            let getClasses = classArmsInstance.map((arm) =>
                arm.Class
            );

            const classInstance = getClasses.filter((armclass, index) => {
                const classIds = getClasses.map((item)=> item.id);
                return classIds.indexOf(armclass.id) == index;
            });

            await schoolInstance.addTeacher(teacherInstance)
            await teacherInstance.addClassArms(classArmsInstance);
            await teacherInstance.addClasses(classInstance);
            await teacherInstance.addSubjects(subjectInstance);

            const userData = {
                id: registeredAccount.dataValues.id,
                email: registeredAccount.dataValues.email,
                account_type: registeredAccount.dataValues.account_type,
            };

            const generatedToken = TokenMiddleware.generate(userData)

            await AuthController.sendVerificationEmail(registeredAccount);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: { token: generatedToken } });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    /*-----------------------------------| TEACHER ACCEPT |-----------------------------------*/

    static async studentAccept(req, res) {


        const errors = validationResult(req);
        const otp = Math.floor(Math.random() * 900000) + 100000;
        const data = req.body;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const emailExist = await AuthController.validateEmail(req.body.email);

            if (emailExist.pass) {
                return res.status(ResponseStatus.code.conflict).json({
                    error: true, message:
                        ResponseStatus.fail.account_conflict
                });
            }

            const schoolInstance = await SchoolManagement.findByPk(req.body.schoolId);

            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const registeredAccount = await Account.create(req.body);
            const newValidation = await Validation.create({ otp });
            await registeredAccount.setValidation(newValidation);

            const studentInstance = await Student.create(req.body);
            await registeredAccount.setStudent(studentInstance);

            const classarmInstance = await ClassArm.findByPk(req.body.arm);

            if (!classarmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classInstance = await classarmInstance.getClass();
            await schoolInstance.addStudent(studentInstance);
            await classarmInstance.addStudent(studentInstance);
            await classInstance.addStudent(studentInstance);

            const userData = {
                id: registeredAccount.dataValues.id,
                email: registeredAccount.dataValues.email,
                account_type: registeredAccount.dataValues.account_type,
            };

            const generatedToken = TokenMiddleware.generate(userData)

            await AuthController.sendVerificationEmail(registeredAccount);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: { token: generatedToken } });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }
}

module.exports = InviteController;