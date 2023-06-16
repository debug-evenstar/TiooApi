const ResponseStatus = require("../config/message.config");
const { validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const { Account, SchoolManagement, Teacher, Validation, Class, Subject, Invite, Student, ClassArm } = require("../database/connection");
const Mailer = require('../services/mailer');

class StudentController {

    /* ------------------------ SENDS INVITE TO Student ------------------------ */
    static async sendInvitation(req, res) {

        function generateRandomPassword(length) {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]};:,<.>/?';
            let password = '';

            for (let i = 0; i < length; i++) {
                let randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }

            return password;
        }

        const random_password = generateRandomPassword(8);
        const errors = validationResult(req);
        const otp = Math.floor(Math.random() * 900000) + 100000;
        const data = req.body

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }
        try {
            const existingInstance = await Account.findOne({ where: { email: data.email } });

            if (existingInstance) {
                return res.status(ResponseStatus.code.conflict).json({ error: true, message: ResponseStatus.fail.account_conflict });
            }

            const schoolInstance = await SchoolManagement.findByPk(data.schoolId);

            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const schoolAccount = await Account.findByPk(schoolInstance.AccountId)

            /* ---------------------- CREATE A NEW STUDENT ACCOUNT ---------------------- */
            const registeredStudent = await Account.create({
                ...{
                    account_type: "student",
                    password: random_password,
                    flag: "invited",
                    verification_status: 0

                },
                ...data
            })


            const newValidation = await Validation.create({ otp });

            await registeredStudent.setValidation(newValidation);

            /* -------------------- CREATES AND BIND STUDENT PROFILE -------------------- */

            const studentInstance = await Student.create(data);

            await registeredStudent.setStudent(studentInstance);

            /* ------------------------------ FIND CLASS ARMS ----------------------------- */
            const classarmInstance = await ClassArm.findByPk(data.arm);

            if (!classarmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            await schoolInstance.addStudent(studentInstance);

            await classarmInstance.addStudent(studentInstance);

            const link = `${process.env.BASE_URL}/api/student/invited/${registeredStudent.id}`;

            //TODO: Create a Proper Invitation mail Template;

            Mailer().to(data.email).from(process.env.MAIL_FROM, "SabiKid").subject("Invitation").template("emails.InviteStudent", { name: data.name, school: schoolAccount.name, Link: link }).send();

            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.create, response: ResponseStatus.pass.send_invite,
                class_arm: classarmInstance,

            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }


    /* ------------------------------ ACCEPT INVITE ----------------------------- */

    static async acceptInvitation(req, res) {

        const errors = validationResult(req);
        const data = req.body;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const accountInstance = await Account.findByPk(data.accountId);

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            if (accountInstance.flag !== 'invited' && accountInstance.account_type == 'student' && accountInstance.verification_status == 1) {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.accepted });
            }

            data.password = await accountInstance.hashPassword(data.password);

            data.flag = "active"

            data.verification_status = 1

            const studentInstances = await accountInstance.getStudent({ joinTableAttributes: [] });

            const schoolId = studentInstances.dataValues.SchoolManagementId;
            const school = await SchoolManagement.findByPk(schoolId, { attributes: { exclude: ['password'] } });

            const schoolAccount = await school.getAccount({ joinTableAttributes: [] });

            const response = await accountInstance.update(data);
            const link = `${process.env.BASE_URL}/api/account/signin`;

            Mailer().to(accountInstance.email).from(process.env.MAIL_FROM, "SabiKid").subject("Thank You").template("emails.welcomeStudent", { name: data.name, school: schoolAccount.dataValues.name, Link: link }).send();

            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.invite,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }

    /* ----------------------- FETCH  INVITED STUDENTS ----------------------- */

    static async fetchInvitedStudent(req, res) {

        const { id } = req.params;

        try {

            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password'] } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            if (accountInstance.flag !== 'invited' && accountInstance.account_type == "student") {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.accepted });
            }

            const studentInstance = await accountInstance.getStudent({
                joinTableAttributes: []
            });


            if (!studentInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classArmsInstance = await studentInstance.getClassArm({ joinTableAttributes: [] });

            const payload = {
                account: accountInstance,
                class_arm: classArmsInstance,
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.sucess, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }


    /* ----------------------------- FETCH STUDENTS ACCOUNT----------------------------- */

    static async fetchStudent(req, res) {
        const { id } = req.params;
        try {
            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password'] } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const payload = {
                account: accountInstance,
            }; fetchStudent

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.status, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }

    /* --------------------------- FETCH ALL STUDENTS ACCOUNT --------------------------- */

    static async allStudents(req, res) {

        try {
            const studentAccount = await Account.findAll({
                attributes: { exclude: ['password'] }, where: {
                    account_type: 'student',
                    '$Student.id$': { [Sequelize.Op.not]: null },

                }, include: [Student, SchoolManagement]
            });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: studentAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }

    /* -------------------------- READ INVITED TEACHERS ------------------------- */

    static async invitedStudents(req, res) {
        try {
            console.log("yeah")
            const studentAccount = await Account.findAll({
                attributes: { exclude: ['password'] },
                where: {
                    account_type: 'student',
                    '$Student.id$': { [Sequelize.Op.not]: null },
                },
                include: [Student],
            });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: studentAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }

}

module.exports = StudentController;