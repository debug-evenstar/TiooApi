const ResponseStatus = require("../config/message.config");
const { validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const { Account, SchoolManagement, Teacher, Validation, Class, Subject, Invite, Student, ClassArm } = require("../database/connection");

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

            //CREATE A NEW STUDENT ACCOUNT
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

            //CREATES AND BIND STUDENT PROFILE
            const studentInstance = await Student.create(data);


            await registeredStudent.setStudent(studentInstance);
            console.log(data.classId)
            //FIND CLASSESS
            const classarmInstance = await ClassArm.findAll({ where: { classId: data.classId } });

            await schoolInstance.addStudent(studentInstance)
            await studentInstance.addClassArm(classarmInstance);



            // const link = `http://127.0.0.1:8085/api/teacher/invited/${registeredStudent.id}`;

            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.create,
                // classes: classInstance, subject: classarmInstance
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }


}

module.exports = StudentController;