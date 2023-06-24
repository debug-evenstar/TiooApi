const ResponseStatus = require("../config/message.config");
const { validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const { Account, SchoolManagement, Teacher, Validation, Class, Subject, Invite } = require("../database/connection");
const Mailer = require('../services/mailer');
const crypto = require("crypto")

class TeacherController {

    /*-----------------------------------| SEND INVITE TO TEACHERS |-----------------------------------*/

    static async sendInvite(req, res) {

        const encrypt = (plainText) => {
            try {
                const iv = crypto.randomBytes(16);
                const key = crypto.createHash('sha256').update("secret123456").digest('base64').substr(0, 32);
                const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
                let encrypted = cipher.update(plainText);
                encrypted = Buffer.concat([encrypted, cipher.final()])
                return iv.toString('hex') + ':' + encrypted.toString('hex');
            } catch (error) {
                console.log(error);
            }
        }

        const errors = validationResult(req);
        const otp = Math.floor(Math.random() * 900000) + 100000;
        const data = req.body;

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

            const hashedUser = encrypt(registeredAccount.id.toString());

            const link = `${process.env.DEV}/teacher/invite/${hashedUser}`;

            const schoolAccount = await Account.findByPk(schoolInstance.AccountId);

            Mailer().to(data.email).from(process.env.MAIL_FROM, "Praxeum").subject("Invitation").template("emails.InviteTeacher", { name: data.name, school: schoolAccount.name, Link: link }).send();
            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.create, response: ResponseStatus.pass.send_invite,
                class: classInstance,
                subject: subjectInstance,
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

        const decrypt = (encryptedText) => {
            try {
                const textParts = encryptedText.split(':');
                const iv = Buffer.from(textParts.shift(), 'hex');

                const encryptedData = Buffer.from(textParts.join(':'), 'hex');
                const key = crypto.createHash('sha256').update("secret123456").digest('base64').substr(0, 32);
                const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

                const decrypted = decipher.update(encryptedData);
                const decryptedText = Buffer.concat([decrypted, decipher.final()]);
                return decryptedText.toString();
            } catch (error) {
                console.log(error)
            }
        }



        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {
            const decryptHash = decrypt(req.body.accountId)


            const accountInstance = await Account.findByPk(Number(decryptHash));

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
    /*-----------------------------------| GENERATE TEACHER INVITE LIKE |-----------------------------------*/

}

module.exports = TeacherController;