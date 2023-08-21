const AuthController = require('../../auth.controller');
const { validationResult } = require('express-validator');
const ResponseStatus = require("../../../config/message.config");
const { Account, Authorization, Permission, Validation, Admin, SchoolManagement, ClassArm, Subject, Lesson, Class } = require('../../../database/connection');
const { use } = require('chai');
const AuthorizationSeed = require("../../../seeders/seed.authorization");
const TokenMiddleware = require('../../../middleware/token.middleware');
const LessonTemplateProvider = require("../../../providers/AI/lesson.template");




class AdminSchoolController {

    /*----------------------------------| ALL SCHOOLS |----------------------------------*/


    static async read(req, res) {

        try {

            const accountInstances = await Account.findAll({
                attributes: { exclude: ['password'] },
                where: {
                    account_type: 'school',
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

                let school = { ...account.dataValues, school_name: schoolInstance.school_name, address: schoolInstance.residentialAddress };

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
                    account_type: 'school',
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

                let school = { ...account.dataValues, school_name: schoolInstance.school_name, address: schoolInstance.residentialAddress }

                const teacherInstances = await schoolInstance.getTeachers({ attributes: { exclude: ['passportNumber', 'residentialAddress', 'nationality'] }, include: Account });

                const hybridTeachers = await schoolInstance.getTeachers({ where: { teacher_type: 'subject' } }, { attributes: { exclude: ['passportNumber', 'residentialAddress', 'nationality'] }, include: Account });

                const classInstances = await schoolInstance.getClasses();

                const studentInstances = await schoolInstance.getStudents({ attributes: { exclude: ['residentialAddress', 'passportNumber', 'dateOfBirth', 'parent', 'class', 'school',] }, include: Account });

                const subjectInstances = await schoolInstance.getSubjects();

                const extraData = {
                    gender: 'undefined',
                    website: 'undefine',
                    est_date: 'undefine',
                    school_type: school.account_type,
                    ownership_type: 'undefine',
                    bank_name: 'undefine',
                    account_number: 'undefine',
                    valid_id: 'undefine',
                    proof: 'undefined',
                }

                school = { ...school, ...extraData };

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

    static async lessonsGroupedBySubjects(req, res) {

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

            const ClassInstances = await SchoolInstances.getSubjects({ attributes: { exclude: ['SchoolManagementId'] }, include: [Lesson] });


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: ClassInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }


    static async lessonsBySubjectId(req, res) {

        /*---------------------------------------------------------------------------
        THIS IS STILL IN PROGRESS AWAITING CLARITY.
        LET IT BE KNOWN THAT WE DON'T ASSIGN MULTIPLE CLASSARMS ON LESSON UPLOAD
        BUT WE DO UNDER SUBJECT CREATION.
        ----------------------------------------------------------------------*/ 

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

            const subjectInstance = await SchoolInstances.getSubjects({ where: { id: data.subject_id }, include: [ClassArm, Lesson, Class] });

            const response = await Promise.all(subjectInstance.map(async (instance) => {

                const payload = {
                    id: 2,
                    naming: instance.naming,
                    description: instance.description,
                    arms:  instance.ClassArms.map(item => ({ naming: item.naming, ClassId: item.ClassId })),
                    lessons: instance.Lessons

                }
                return payload;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: subjectInstance });

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


    static async uploadLessonTemplate(req, res) {

        try {
            let filePath = "";
            if (req.file) {
                filePath = req.file.path;
            } else {
                res.status(400).json({ error: 'No uploaded file'});
            }

            const { id } = req.params;

            const slides = await LessonTemplateProvider.loadLessonSlidesFromTemplate(filePath);

            console.log('this is the slide response', slides);

            const parseSlides = [];

            const lessonInstance = await Lesson.findByPk(id);

            const previousSlides = await lessonInstance.getLessonSlides({
                orderBy : {slide_index : "asc"}
            });


            console.log("loading", previousSlides, id);

            if(previousSlides && previousSlides.length > 0 && previousSlides.length > slides.data.length) {
                for (let i = slides.data.length; i < previousSlides.length; i++) {
                    const slide = previousSlides[i];
                    await slide.destroy();
                }
            }

            for (let index = 0; index < slides.data.length; index++) {
                const slide = slides.data[index];
                if( previousSlides && previousSlides.length > index){
                    const updated = previousSlides[index];
                    updated.slide_data = slide;
                    updated.save();
                }else{
                    const created = await LessonSlide.create({
                        slide_index : index,
                        slide_data : slide
                    });
                    parseSlides.push(created);
                }
            };

            await lessonInstance.addLessonSlides(parseSlides);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.added
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    static async updateLessonStatus(req, res) {

        try {

            const lesson = await Lesson.findByPk(req.params.id);

            if(!lesson) {
                res.status(400).json({error : "Lesson not found" });
            }

            const lessonUpdate = await Lesson.update(req.body,{ where : {id : req.params.id} });



            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: lessonUpdate });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


}


module.exports = AdminSchoolController;