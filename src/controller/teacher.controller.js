const ResponseStatus = require("../config/message.config");
const { validationResult } = require('express-validator');
const { Sequelize } = require('sequelize');
const { Account, SchoolManagement, Teacher, Validation, Class, Subject, Invite, Lesson, Student, ClassArm } = require("../database/connection");
const Mailer = require('../services/mailer');
const HashUtils = require('../utils/hash.utilities');

class TeacherController {

    /*-----------------------------------| SEND INVITE TO TEACHERS |-----------------------------------*/

    static async sendInvite(req, res) {

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
            const classArmsInstance = await ClassArm.findAll({ where: { id: [...req.body.classarms] } });
            const subjectInstance = await Subject.findAll({ where: { id: [...req.body.Subjects] } });

            await schoolInstance.addTeacher(teacherInstance)
            await teacherInstance.addClasses(classInstance);
            await teacherInstance.addClassArms(classArmsInstance);
            await teacherInstance.addSubjects(subjectInstance);

            const hashedUser = HashUtils.encrypt(registeredAccount.id.toString());
     
            const link = `${process.env.WEB_URL}/teacher/${hashedUser}`;

            const schoolAccount = await schoolInstance.getAccount();

            if (!schoolAccount) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: "School is not tied to account" });
            }

            Mailer().to(data.email).from(process.env.MAIL_FROM, "Praxeum").subject("Invitation").template("emails.InviteTeacher", { name: data.name, school: schoolInstance.name, Link: link }).send();

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

        const decryptedId = HashUtils.decrypt(id);
        console.log(id)

        try {
            const accountInstance = await Account.findByPk(Number(decryptedId), { attributes: { exclude: ['password'] } });

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

            if (accountInstance.account_type != "teacher") {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.teacher });
            } else {
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: payload });
            }

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
        const data = req.body;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const decryptHash = HashUtils.decrypt(req.body.accountId)

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

            const link = `${process.env.BASE_URL}/api/account/signin`;

            const teacherInstances = await accountInstance.getTeacher({ joinTableAttributes: [] });

            const schoolId = teacherInstances.dataValues.SchoolManagementId;

            const school = await SchoolManagement.findByPk(schoolId, { attributes: { exclude: ['password'] } });

            const schoolAccount = await school.getAccount({ joinTableAttributes: [] });

            Mailer().to(accountInstance.email).from(process.env.MAIL_FROM, "Praxeum").subject("Thank You").template("emails.welcomeStudent", { name: data.name, school: schoolAccount.dataValues.name, Link: link }).send();

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

            const classInstance = await teacherInstance.getClasses({ joinTableAttributes: [], include: [ClassArm] });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| READ TEACHER CLASSES |-----------------------------------*/

    static async teacherStudents(req, res) {

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

            const classIds = classInstance.map(classes => classes.id);

            const teachersStudent = await Student.findAll({ where: { classId: [...classIds] }, include: [Class] });

            const filter = await Promise.all(teachersStudent.map(async (each) => {

                const account = await each.getAccount({ attributes: { exclude: ['password'] } });

                account.dataValues.class = each.dataValues.Class;

                console.log(account);

                return account;
            }));

            //   console.log(filter)


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: filter });

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


    /*-----------------------------------| READ TEACHER SUBJECTS WITH LESSONS |-----------------------------------*/

    static async teacherSubjectsWithLessons(req, res) {

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

            // const subjectInstance = await teacherInstance.getSubjects({ joinTableAttributes: [], include: [Lesson] });

            const subjectInstance = await teacherInstance.getSubjects({
                joinTableAttributes: [],
                include: [
                    {
                        model: Lesson,
                        attributes: { exclude: ['ClassId', 'ClassArmId', 'file', 'SubjectId'] },
                    },
                ],
            });


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| READ TEACHER SUBJECTS WITH LESSONS COUNT |-----------------------------------*/

    static async teacherSubjectsWithLessonsCount(req, res) {

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

            const subjectInstance = await teacherInstance.getSubjects({
                joinTableAttributes: [],
                include: [
                    {
                        model: Lesson,
                        attributes: { exclude: ['ClassId', 'ClassArmId', 'file', 'SubjectId'] },
                    },
                ],
            });

            const subjectsWithLessonCount = subjectInstance.map(subject => {
                const subjectObj = { ...subject.toJSON(), lessonCount: subject.Lessons.length };
                delete subjectObj.Lessons;
                return subjectObj;
              });
              
            

            console.log(subjectsWithLessonCount);


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectsWithLessonCount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| ASSIGN SUBJECT TO TEACHER |-----------------------------------*/

    static async assignSubjectToTeacher(req, res) {

        const { subject, teacher } = req.body;

        try {

            const teacherAccountInstance = await Account.findByPk(teacher);

            const teacherInstance = await teacherAccountInstance.getTeacher();

            console.log(teacherInstance);

            if (!teacherInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }



            const subjectInstance = await Subject.findOne({ where: { id: subject } });

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const teacherSubject = await teacherInstance.addSubject(subjectInstance);

            const fecth = await teacherInstance.getSubjects();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    /*-----------------------------------| ASSIGN SUBJECT TO TEACHER |-----------------------------------*/

    static async unAssignSubjectToTeacher(req, res) {

        const { subject, teacher } = req.body;

        try {

            const teacherAccountInstance = await Account.findByPk(teacher);

            const teacherInstance = await teacherAccountInstance.getTeacher();

            if (!teacherInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const subjectInstance = await Subject.findOne({ where: { id: subject } });

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const removalResponse = await teacherInstance.removeSubject(subjectInstance);

            console.log(removalResponse);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.removed });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    // await teacherInstance.addSubjects(subjectInstance);

}

module.exports = TeacherController;