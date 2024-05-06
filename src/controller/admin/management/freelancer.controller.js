const AuthController = require('../../auth.controller');
const { validationResult } = require('express-validator');
const ResponseStatus = require("../../../config/message.config");
const { Account, Authorization, Permission, Validation, Admin, SchoolManagement, ClassArm, Subject, Lesson } = require('../../../database/connection');
const { use } = require('chai');
const AuthorizationSeed = require("../../../seeders/seed.authorization");
const TokenMiddleware = require('../../../middleware/token.middleware');




class AdminFreelancerController {

    /*----------------------------------| ALL SCHOOLS |----------------------------------*/


    static async read(req, res) {

        try {

            const accountInstances = await Account.findAll({
                attributes: { exclude: ['password'] },
                where: {
                    account_type: 'freelancer',
                },
            });

            if (!accountInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }

            const accountData = await Promise.all(accountInstances.map(async (account) => {

                const schoolInstance = await account.getSchoolManagement();

                let school = { ...account.dataValues, school_name: schoolInstance.school_name, address: schoolInstance.residential_address };

                school.subscription = 'Active'; //This will be gotten from the subscription table

                return school;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: accountData });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }



    /*----------------------------------| ALL SCHOOLS |----------------------------------*/


    static async readWithExtra(req, res) {

        try {

            const accountInstances = await Account.findAll({
                attributes: { exclude: ['password'] },
                where: {
                    account_type: 'freelancer',
                },
            });

            if (!accountInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }

            const accountData = await Promise.all(accountInstances.map(async (account) => {
                const payload = {};
                const schoolInstance = await account.getSchoolManagement();

                let school = { ...account.dataValues, school_name: schoolInstance.school_name, address: schoolInstance.residential_address }

                const teacherInstances = await schoolInstance.getTeachers({ attributes: { exclude: ['passportNumber', 'residential_address', 'nationality'] }, include: Account });

                const hybridTeachers = await schoolInstance.getTeachers({ where: { teacher_type: 'subject' } }, { attributes: { exclude: ['passportNumber', 'residential_address', 'nationality'] }, include: Account });

                const classInstances = await schoolInstance.getClasses();

                const studentInstances = await schoolInstance.getStudents({ attributes: { exclude: ['residential_address', 'passportNumber', 'dob', 'parent', 'class', 'school',] }, include: Account });

                const subjectInstances = await schoolInstance.getSubjects();

                payload.school = school;
                payload.subjects = subjectInstances.length;
                payload.teachers = teacherInstances.length;
                payload.hybrid_teachers = hybridTeachers.length;
                payload.students = studentInstances.length;
                payload.classes = classInstances.length;

                return payload;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: accountData });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    };


    static async dashboardHome(req, res) {

        const data = req.query;

        try {

            const AccountInstance = await Account.findByPk(data.school_id, { include: [SchoolManagement] });
            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();
            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }


            const ClassInstances = await SchoolInstances.getClasses();

            const classsWithArmsCounts = await Promise.all(ClassInstances.map(async (instance) => {
                const arms = await instance.getClassArms({ attributes: { exclude: ['ClassId', 'id'] }, });

                const payload = {
                    ...instance.dataValues,
                    arms: arms

                }
                return payload;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: classsWithArmsCounts });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }


    static async dashboardSubject(req, res) {

        const data = req.query;

        try {

            const AccountInstance = await Account.findByPk(data.school_id, { include: [SchoolManagement] });
            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();
            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }


            const subjectInstance = await SchoolInstances.getSubjects();

            const lessonsInstance = await Promise.all(subjectInstance.map(async (instance) => {

                const lessons = await instance.getLessons({ attributes: { exclude: [] }, });

                const payload = {
                    ...instance.dataValues,
                    lessons: lessons.length

                }
                return payload;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: lessonsInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }



    static async lessonsGroupedByClasses(req, res) {

        const data = req.query;

        try {

            const AccountInstance = await Account.findByPk(data.school_id, { include: [SchoolManagement] });
            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();
            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const ClassInstances = await SchoolInstances.getClasses({ attributes: { exclude: ['SchoolManagementId', 'type'] }, include: [Lesson] });


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: ClassInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }



    static async lessons(req, res) {

        const data = req.query;

        try {

            const AccountInstance = await Account.findByPk(data.school_id, { include: [SchoolManagement] });
            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();
            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const classWithLessons = await SchoolInstances.getClasses();

            let lessonsInstances = []

            const allSchoolLessons = await Promise.all(classWithLessons.map(async (instance) => {
                const lessons = await instance.getLessons();
                return lessons;

            }));

            for (let i = 0; i < allSchoolLessons.length; i++) {
                lessonsInstances.push(...allSchoolLessons[i]);
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: lessonsInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }


}


module.exports = AdminFreelancerController;