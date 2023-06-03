const ResponseStatus = require("../config/message.config");
const { validationResult } = require('express-validator');
const { Account, SchoolManagement, Teacher, Validation, Class, Subject } = require("../database/connection");


class TeacherController {

    /*-----------------------------------| SEND INVITE TO TEACHERS |-----------------------------------*/

    static async sendInvite(req, res) {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {


            const schoolInstance = await SchoolManagement.findByPk(req.body.schoolId);

            if (!schoolInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const otp = Math.floor(Math.random() * 900000) + 100000;
            const existingInstance = await Account.findOne({ where: { email: req.body.email } });


            if (existingInstance) {

                return res.status(ResponseStatus.code.conflict).json({ error: true, message: ResponseStatus.fail.account_conflict });

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
}

module.exports = TeacherController;