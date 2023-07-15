const ResponseStatus = require("../config/message.config");
const { validationResult } = require('express-validator');
const { Sequelize, where } = require('sequelize');
const { Account, SchoolManagement, Teacher, Validation, Class, Subject, Invite, Student, ClassArm } = require("../database/connection");
const Mailer = require('../services/mailer');
const HashUtils = require('../utils/hash.utilities');


class StudentController {

    static generateRandomPassword(length) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]};:,<.>/?';
        let password = '';

        for (let i = 0; i < length; i++) {
            let randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        return password;
    }

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

            // const newValidation = await Validation.create({ otp });

            // await registeredStudent.setValidation(newValidation);

            /* -------------------- CREATES AND BIND STUDENT PROFILE -------------------- */

            const studentInstance = await Student.create(data);
            await registeredStudent.setStudent(studentInstance);

            /* ------------------------------ FIND CLASS ARMS ----------------------------- */
            const classarmInstance = await ClassArm.findByPk(data.arm);

            if (!classarmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classInstance = await classarmInstance.getClass();
            await schoolInstance.addStudent(studentInstance);
            await classarmInstance.addStudent(studentInstance);
            await classInstance.addStudent(studentInstance);

            const response = await classInstance.addStudent(studentInstance);

            const hashedUser = HashUtils.encrypt(registeredStudent.id.toString());
            console.log(hashedUser)
            const link = `${process.env.DEV}/student/${hashedUser}`;

            console.log(link);

            //TODO: Create a Proper Invitation mail Template;

            Mailer().to(data.email).from(process.env.MAIL_FROM, "Praxeum").subject("Invitation").template("emails.InviteStudent", { name: data.name, school: schoolAccount.name, Link: link }).send();
            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.create, response: ResponseStatus.pass.send_invite,
                class_arm: classarmInstance,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }


    /* ------------------------ SENDS BULK Student ------------------------ */


    static async sendBulkInvite(req, res) {

        const random_password = StudentController.generateRandomPassword(8);
        const errors = validationResult(req);
        const otp = Math.floor(Math.random() * 900000) + 100000;
        const data = req.body
        const { id } = req.userData;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const schoolAccountInstance = await Account.findByPk(id);

            const schoolInstance = await schoolAccountInstance.getSchoolManagement();

            if (!schoolAccountInstance) {
                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.unauthorized });
            }


            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const createdRecords = [];

            for (let i = 0; i < req.body.email.length; i++) {

                const newStudentRecord = {
                    name: "undefined",
                    email: req.body.email[i],
                    account_type: "student",
                    password: random_password,
                    flag: "invited",
                    verification_status: 0
                };

                createdRecords.push(newStudentRecord);
            }

            const classarmInstance = await ClassArm.findByPk(data.arm);
            console.log(classarmInstance)
            if (!classarmInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }


            for (let i = 0; i < createdRecords.length; i++) {

                const [accountInstance, created] = await Account.upsert(createdRecords[i]);

                if (created) {

                    const studentInstance = await Student.create(createdRecords[i]);

                    await accountInstance.setStudent(studentInstance);

                    const classInstance = await classarmInstance.getClass();
                    await schoolInstance.addStudent(studentInstance);
                    await classarmInstance.addStudent(studentInstance);
                    await classInstance.addStudent(studentInstance);
                    await classInstance.addStudent(studentInstance);

                    const hashedUser = HashUtils.encrypt(accountInstance.id.toString());
                    console.log(hashedUser)
                    const link = `${process.env.DEV}/student/${hashedUser}`;

                    comsole.log(link);

                    Mailer().to(data.email).from(process.env.MAIL_FROM, "Praxeum").subject("Invitation").template("emails.InviteStudent", { name: data.name, school: accountInstance.name, Link: link }).send();
                }

            }

            const allStudentInstance = await classarmInstance.getStudents()

            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.create, response: ResponseStatus.pass.send_invite
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

            const decryptHash = HashUtils.decrypt(data.accountId)
            const accountInstance = await Account.findByPk(Number(decryptHash))

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

            Mailer().to(accountInstance.email).from(process.env.MAIL_FROM, "Praxeum").subject("Thank You").template("emails.welcomeStudent", { name: data.name, school: schoolAccount.dataValues.name, Link: link }).send();

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
        const decryptedId = HashUtils.decrypt(id);

        try {

            const accountInstance = await Account.findByPk(Number(decryptedId), { attributes: { exclude: ['password'] } });

            console.log(accountInstance)
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
            };

            if (accountInstance.account_type != "student") {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.student });
            } else {
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: payload });

            }

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

    /* -------------------------- READ INVITED STUDENT ------------------------- */

    static async invitedStudents(req, res) {
        const { id } = req.params;
        try {
            console.log(id)
            const studentAccount = await Account.findOne({
                id,
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

    static async studentClasses(req, res) {
        const { id } = req.params;
        try {

            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password'] } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const studentInstance = await accountInstance.getStudent({ joinTableAttributes: [] });

            if (!studentInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classInstance = await studentInstance.getClass({ joinTableAttributes: [] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, student_profile: studentInstance, account: accountInstance, class: classInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }


    }


    static async getStudentClass(req, res) {
        const { id } = req.params;
        try {
            const classInstance = await Class.findOne({
                where: {
                    id: 16
                }
            });

            const student = await classInstance.getStudents({ joinTableAttributes: [] });
            console.log(student)
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }


    static async deleteStudent(req, res) {
        const { id } = req.params;
        try {
            const accountInstance = await Account.findByPk(id, { attributes: { exclude: ['password'] } });

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            if (accountInstance.account_type != "student") {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.student });
            } else {
                const response = await accountInstance.destroy();
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: {} });
            }

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        }

    }




}

module.exports = StudentController;