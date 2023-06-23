const ResponseStatus = require("../config/message.config");
const { validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const { Account, SchoolManagement, Teacher, Validation, Class, Subject, Invite } = require("../database/connection");


class TeacherController {

    /*-----------------------------------| SEND INVITE TO TEACHERS |-----------------------------------*/

    static async sendInvite(req, res) {

        const errors = validationResult(req);
        const otp = Math.floor(Math.random() * 900000) + 100000;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const existingInstance = await Account.findOne({ where: { email: req.body.email } });

            if (existingInstance) {
                return res.status(ResponseStatus.code.conflict).json({ error: true, message: ResponseStatus.fail.account_conflict });
            }

            const schoolInstance = await SchoolManagement.findByPk(req.body.schoolId);

            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const registeredAccount = await Account.create(req.body);
            const newValidation = await Validation.create({ otp });
            await registeredAccount.setValidation(newValidation);

            const teacherInstance = await Teacher.create(req.body);
            await registeredAccount.setTeacher(teacherInstance);

            const classInstance = await Class.findAll({ where: { id: [...req.body.classes] } });
            const subjectInstance = await Subject.findAll({ where: { id: [...req.body.Subjects] } });

            await schoolInstance.addTeacher(teacherInstance)
            await teacherInstance.addClasses(classInstance);
            await teacherInstance.addSubjects(subjectInstance);

            const link = `http://127.0.0.1:8085/api/teacher/invited/${registeredAccount.id}`;

            console.log(link);

            //TODO: Send Invite Email with this response id or email;

            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.create,
                classes: classInstance, subject: subjectInstance
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| READ CLASS WITH ALL ASSIGNED TEACHERS |-----------------------------------*/

    static async fetchInvitedTeacher(req, res) {

        const { id } = req.params;

        try {

            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password'] } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            if (accountInstance.flag !== 'invited') {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.accepted });
            }

            const teacherInstance = await accountInstance.getTeacher({ joinTableAttributes: [] });
            if (!teacherInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classInstance = await teacherInstance.getClasses({ joinTableAttributes: [] });
            const subjectInstance = await teacherInstance.getSubjects({ joinTableAttributes: [] });

            const payload = {
                account: accountInstance,
                classes: classInstance,
                subjects: subjectInstance
            };

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| READ TEACHER |-----------------------------------*/

    static async fetchTeacher(req, res) {

        const { id } = req.params;

        try {

            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password'] } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const payload = {
                account: accountInstance,
            };

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ ALL TEACHERS |-----------------------------------*/

    static async allTeachers(req, res) {

        try {

            const teachersAccount = await Account.findAll({ attributes: { exclude: ['password'] }, where: { account_type: 'teacher' }, include: [Teacher] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: teachersAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| READ INVITED TEACHERS |-----------------------------------*/

    static async invitedTeachers(req, res) {

        try {
            const teachersAccount = await Account.findAll({
                attributes: { exclude: ['password'] },
                where: {
                    account_type: 'teacher',
                    '$Teacher.id$': { [Sequelize.Op.not]: null },
                },
                include: [Teacher],
            });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: teachersAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| ACCEPT INVITE |-----------------------------------*/

    static async acceptInvite(req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {


            const accountInstance = await Account.findByPk(req.body.accountId);

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            if (accountInstance.flag !== 'invited') {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.accepted });
            }

            req.body.password = await accountInstance.hashPassword(req.body.password);
            req.body.flag = 'active';

            const response = await accountInstance.update(req.body);

            //TODO: Send Invite Email with this response id or email;

            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.invite,
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| READ TEACHER CLASSES |-----------------------------------*/

    static async teacherClasses(req, res) {

        const { id } = req.params;

        try {

            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password'] } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }


            const teacherInstance = await accountInstance.getTeacher({ joinTableAttributes: [] });

            if (!teacherInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classInstance = await teacherInstance.getClasses({ joinTableAttributes: [] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| READ TEACHER SUBJECTS |-----------------------------------*/

    static async teacherSubjects(req, res) {

        const { id } = req.params;

        try {

            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password'] } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const teacherInstance = await accountInstance.getTeacher({ joinTableAttributes: [] });

            if (!teacherInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const subjectInstance = await teacherInstance.getSubjects({ joinTableAttributes: [] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

}

module.exports = TeacherController;