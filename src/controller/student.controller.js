const ResponseStatus = require("../config/message.config");
const { validationResult } = require('express-validator');
const { Sequelize, where } = require('sequelize');
const TokenMiddleware = require('../middleware/token.middleware');
const { Account, SchoolManagement, Validation, Teacher, Class, Subject, Invite, Student, ClassArm } = require("../database/connection");

const AuthController = require('../controller/auth.controller');


const Mailer = require('../services/mailer');
const HashUtils = require('../utils/hash.utilities');
const { classArmStudents } = require("./classArms.controller");
const { lib } = require("crypto-js");


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
            const link = `${process.env.WEB_URL}/student/${hashedUser}`;

            console.log('this is the invite link url', link);

            //TODO: Create a Proper Invitation mail Template;

            Mailer().to(data.email).from(process.env.MAIL_FROM, "Praxeum").subject("Invitation").template("emails.InviteStudent", { name: data.name, school: schoolInstance.school_name, Link: link }).send();
            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.create, response: ResponseStatus.pass.send_invite,
                class_arm: classarmInstance,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
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

            let schoolInstance;

            if (!schoolAccountInstance) {

                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.unauthorized });
            }

            schoolInstance = await schoolAccountInstance.getSchoolManagement();


            if (!schoolInstance) {

                const teacherInstance = await schoolAccountInstance.getTeacher();

                if (!teacherInstance) {
                    //return not found
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });

                }

                schoolInstance = await teacherInstance.getSchoolManagement();

                if (!schoolInstance) {
                    //return not found
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
                }

            }

            // console.log(schoolInstance);

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

                    const hashedUser = HashUtils.encrypt(registeredStudent.id.toString());

                    const link = `${process.env.DEV}/student/${hashedUser}`;

                    //TODO: Create a Proper Invitation mail Template;

                    Mailer().to(data.email).from(process.env.MAIL_FROM, "Praxeum").subject("Invitation").template("emails.InviteStudent", { name: data.name, school: schoolInstance.school_name, Link: link }).send();

                }

                return res.status(ResponseStatus.code.success).json({
                    error: false, message: ResponseStatus.pass.create, response: ResponseStatus.pass.send_invite,
                    class_arm: classarmInstance,
                });

            }


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
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

            data.flag = "active";
            data.status = "active";

            data.verification_status = 1

            const studentInstances = await accountInstance.getStudent({ joinTableAttributes: [] });

            const schoolId = studentInstances.dataValues.SchoolManagementId;
            const school = await SchoolManagement.findByPk(schoolId, { attributes: { exclude: ['password'] } });

            const schoolAccount = await school.getAccount({ joinTableAttributes: [] });

            const response = await accountInstance.update(data);
            const link = `${process.env.BASE_URL}/api/account/signin`;

            Mailer().to(accountInstance.email).from(process.env.MAIL_FROM, "Praxeum").subject("Thank You").template("emails.welcomeStudent", { name: data.name, school: school.school_name, Link: link }).send();

            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.invite,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
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
            res.status(500).json({ error: 'server error', extra: error.message });
        }
    }

    static async studentSubjects(req, res) {

        const { id } = req.userData;

        try {

            const studentAccount = await Account.findByPk(id);

            if (!studentAccount) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            if (studentAccount.account_type !== 'student') {

                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.bad_request });
            }

            const studentInstance = await studentAccount.getStudent();

            const studentClass = await studentInstance.getClass();

            const classSubjects = await studentClass.getSubjects();

            const subjectsData = classSubjects.map(subject => {
                const { naming, description, id } = subject;
                return { naming, description, id, image: 'https://images.unsplash.com/photo-1488229297570-58520851e868' };
            });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, subjects: subjectsData });

        } catch (error) {
            console.log(error);

            res.status(500).json({ error: 'server error', extra: error.message });
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
                const studentInstance = await Student.findOne({ where: { AccountId: id } });
                await studentInstance.destroy();
                await accountInstance.destroy();
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: {} });
            }

        } catch (error) {
            res.status(500).json({ error: 'server error', extra: error.message });
        }

    }



    /*-----------------------------------| STUDENTS CLASS TEACHER |-----------------------------------*/

    static async studentClassTeacher(req, res) {

        const { id } = req.userData;

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {


            const studentAccountInstance = await Account.findByPk(account_id);

            const classStudents = await studentAccountInstance.getStudent();

            if (!classStudents) {
                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.unauthorized });
            }

            const studentClass = await classStudents.getClass();

            const classTeachers = await studentClass.getTeachers({ where: { teacher_type: 'class' } });

            const teachersAccount = await Promise.all(classTeachers.map(async (profile) => {
                const teachers = await profile.getAccount({ attributes: { exclude: ['password', 'createdAt'], include: '' } });
                return teachers;

            }));


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: teachersAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }



    /*-----------------------------------| STUDENTS CLASS MATES |-----------------------------------*/

    static async studentMates(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const studentAccountInstance = await Account.findByPk(account_id);

            const classStudents = await studentAccountInstance.getStudent();

            if (!classStudents) {
                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.unauthorized });
            }

            const studentClass = await classStudents.getClass();

            const classMates = await studentClass.getStudents({
                include: [{
                    model: Account,
                    where: { verification_status: 1, status: "active", flag: "active" }
                }]
            });

            const filterclassMates = classMates.filter((element) => element.id != classStudents.id)

            const classMatesAccount = await Promise.all(filterclassMates.map(async (profile) => {

                const teachers = await profile.getAccount({ attributes: { exclude: ['password', 'createdAt'], include: '' } });
                return teachers;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classMatesAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }



    /*-----------------------------------| STUDENTS CLASS ARMS MATES |-----------------------------------*/

    static async studentArmsMates(req, res) {

        const { id } = req.userData;

        try {

            const classStudents = await Student.findByPk(id);

            const studentClass = await classStudents.getClassArm();

            const classMates = await studentClass.getStudents();

            const classMatesAccount = await Promise.all(classMates.map(async (profile) => {
                const teachers = await profile.getAccount({ attributes: { exclude: ['password', 'createdAt'], include: '' } });
                return teachers;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classMatesAccount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }



    /*-----------------------------------| STUDENTS CLASS TEACHERS AND MATES |-----------------------------------*/

    static async studentClassTeachersAndMates(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const studentAccountInstance = await Account.findByPk(account_id);

            const classStudents = await studentAccountInstance.getStudent();

            if (!classStudents) {
                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.unauthorized });
            }

            const studentClass = await classStudents.getClass();

            const classMates = await studentClass.getStudents({
                include: [{
                    model: Account,
                    where: { verification_status: 1, status: "active", flag: "active" }
                }]
            });

            const filterclassMates = classMates.filter((element) => element.id != classStudents.id)

            const classMatesAccount = await Promise.all(filterclassMates.map(async (profile) => {

                const teachers = await profile.getAccount({ attributes: { exclude: ['password', 'createdAt'], include: '' } });
                return teachers;

            }));

            const classTeachers = await studentClass.getTeachers({ where: { teacher_type: 'class' } });

            const teachersAccount = await Promise.all(classTeachers.map(async (profile) => {
                const teachers = await profile.getAccount({ attributes: { exclude: ['password', 'createdAt'], include: '' } });
                return teachers;

            }));


            const payload = {
                class_teachers: teachersAccount,
                class_mates: classMatesAccount
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    /*-----------------------------------| PARENT TEACHER SIGNUP |-----------------------------------*/

    static async parentSignupOne(req, res) {

        const errors = validationResult(req);
        const otp = Math.floor(Math.random() * 900000) + 100000;
        const random_hash = StudentController.generateRandomPassword(6);

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


            const registeredAccount = await Account.create(req.body);
            // const newValidation = await Validation.create({ otp: random_hash });
            // await registeredAccount.setValidation(newValidation);

            const userData = {
                id: registeredAccount.dataValues.id,
                email: registeredAccount.dataValues.email,
                account_type: registeredAccount.dataValues.account_type,
            };

            await AuthController.sendVerificationEmail(registeredAccount);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: {} });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    /*-----------------------------------| TEACHER ACCEPT |-----------------------------------*/

    static async parentSignupTwo(req, res) {

        const data = req.body;

        try {

            const validationInstance = await Validation.findOne({ where: { token: data.token } });

            if (!validationInstance) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.not_found
                });
            }

            const registeredAccount = await validationInstance.getAccount();

            registeredAccount.status = 'active';
            registeredAccount.flag = 'active';
            registeredAccount.verification_status = 1;

            const studentInstance = await Student.create({
                ...req.body,
                parent: registeredAccount.name
            });

            registeredAccount.name = req.body.name
            await registeredAccount.save();

            await registeredAccount.setStudent(studentInstance);

            const userData = {
                id: registeredAccount.dataValues.id,
                email: registeredAccount.dataValues.email,
                account_type: registeredAccount.dataValues.account_type,
            };

            const generatedToken = TokenMiddleware.generate(userData);

            // BIND STUDENT TO TIO ACADEMY

            const tiooAccount = await Account.findOne({ where: { email: ResponseStatus.tio.email } });

            if (tiooAccount) {

                const classInstance = await Class.findByPk(data.class);
                const armInstance = await classInstance.getClassArms();
                const tioo = await tiooAccount.getSchoolManagement();

                await tioo.addStudent(studentInstance);
                await classInstance.addStudent(studentInstance);
                await armInstance[0].addStudent(studentInstance);

            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: { token: generatedToken } });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }



    /*-----------------------------------| READ KYC DATA |-----------------------------------*/

    static async personalInformation(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(parseInt(account_id));

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const studentInstance = await accountInstance.getStudent({ include: [SchoolManagement, Class] });

            if (!studentInstance) {
                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.unauthorized });
            }

            const payload = {
                account_id: accountInstance.id,
                fullname: accountInstance.name,
                phone: accountInstance.phone,
                school: studentInstance.SchoolManagement.school_name,
                class: studentInstance.Class.naming,
                age: studentInstance.age !== null ? studentInstance.age : 0,
                address: studentInstance.residentialAddress,
                gender: studentInstance.gender,
                country: studentInstance.country,
                nationality: studentInstance.nationality
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    /*-----------------------------------| READ PERSONAL INFORMATION |-----------------------------------*/

    static async updatePersonalInformation(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(parseInt(account_id));

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const studentInstance = await accountInstance.getStudent({ include: [SchoolManagement, Class] });

            if (!studentInstance) {
                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.unauthorized });
            }

            await accountInstance.update(req.body);
            await studentInstance.update(req.body);

            const payload = {
                account_id: accountInstance.id,
                fullname: accountInstance.name,
                phone: accountInstance.phone,
                school: studentInstance.SchoolManagement.school_name,
                class: studentInstance.Class.naming,
                age: studentInstance.age !== null ? studentInstance.age : 0,
                address: studentInstance.residentialAddress,
                gender: studentInstance.gender,
                country: studentInstance.country,
                nationality: studentInstance.nationality
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    static async independentStudentLibrary(req, res) {

        try {

            const { id } = req.userData
            const account_id = 7;
            //req.query.account_id ? req.query.account_id : id;


            const accountInstance = await Account.findByPk(account_id);

            const studentInstance = await accountInstance.getStudent()

            const studentClass = await studentInstance.getClass();

            const studentLibrary = await Subject.findAll();
            
            // await studentClass.getSubjects({where: {library: true}, through: []});

            const response = await Promise.all(studentLibrary.map( async (library)=>{

                const lessons = await library.getLessons();

                delete library.dataValues.ClassSubjects;
                delete library.dataValues.ages;

              const payload = {
                ...library.dataValues,
                lessons: lessons.length,
                class: studentClass.id,

            };


              return payload;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    static async independentStudentNetwork(req, res) {

        try {

            const { id } = req.userData
            const account_id = req.query.account_id ? req.query.account_id : id;

            const accountInstance = await Account.findByPk(account_id);

            const studentInstance = await accountInstance.getStudent()

            const school = await studentInstance.getSchoolManagement();

            const students = await school.getStudents();

            const response = await Promise.all(students.map( async (student)=>{

                const studentAccount = await student.getAccount();

               const {name, email, phone } = studentAccount;

                return  {name, email, phone, age: student.age, school: school.school_name };

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

}

module.exports = StudentController;