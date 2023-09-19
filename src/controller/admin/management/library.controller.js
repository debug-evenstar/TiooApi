const AuthController = require('../../auth.controller');
const { validationResult } = require('express-validator');
const ResponseStatus = require("../../../config/message.config");
const { Account, Authorization, Permission, Validation, Admin, SchoolManagement, ClassArm, Subject, Lesson, Class, Library, LessonSlide } = require('../../../database/connection');
const { use } = require('chai');
const AuthorizationSeed = require("../../../seeders/seed.authorization");
const TokenMiddleware = require('../../../middleware/token.middleware');
const LessonTemplateProvider = require('../../../providers/AI/lesson.template')





class AdminLibraryController {

    static async libraryMaterial(req, res) {

        const data = req.body;

        data.library = true;

        try {

            // --------------------------------------------------------- subject

            const classInstance = await Class.findAll({ where: { id: [...req.body.class] } });

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const accountInstance = await Account.findOne({ where: { email: ResponseStatus.tio.email } });

            const schoolInstance = await accountInstance.getSchoolManagement();

            const classIds = classInstance.map((element)=> element.id);

            console.log(classIds);

            const classarmInstances = await ClassArm.findAll({ where: { id: [...classInstance.map((element)=> element.id)] } });


            const subjectInstance = await Subject.create(req.body);

            await schoolInstance.addSubjects(subjectInstance);

            const newItems = await subjectInstance.addClasses(classInstance);

            const subjectArms = await subjectInstance.addClassArms(classarmInstances);

            // ------------------------------------------

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: {} });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    static async readLibraryMaterial(req, res) {

        const data = req.body;

        data.library = true;

        try {

            // --------------------------------------------------------- subject

            const accountInstance = await Account.findOne({ where: { email: ResponseStatus.tio.email } });

            const schoolInstance = await accountInstance.getSchoolManagement();

            const subjectInstance = await schoolInstance.getSubjects(
                {
                    where: { library: true }, joinTableAttributes: [],
                    include: [
                        {
                            model: Lesson,
                            attributes: { exclude: ['LibraryId'] },
                        },
                    ],
                }
            );


            const subjectsWithLessonCount = subjectInstance.map(subject => {
                const subjectObj = { ...subject.toJSON(), lessonCount: subject.Lessons.length };
                delete subjectObj.Lessons;
                return subjectObj;
            });


            // ------------------------------------------

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: subjectsWithLessonCount });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    static async create(req, res) {

        const data = req.body;

        if (req.file) {
            req.body.file = req.file.path;
        }

        try {

            const classInstance = await Class.findByPk(data.class);

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const libraryInstance = await Library.create(req.body);

            // const response = await classInstance.addLibrary(libraryInstance);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: {} });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    static async createLibraryLesson(req, res) {

        const today = new Date();
        const threeDaysAhead = new Date();
        threeDaysAhead.setDate(today.getDate() + 3);

        if (req.file) {
            req.body.files = [req.file.path];

            console.log(req.body.files);
        }

        req.body.start_date = today;
        req.body.end_date = threeDaysAhead;



        try {

            const lessonInstance = await Lesson.create(req.body);

            const subjectInstance = await Subject.findByPk(req.body.subject);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: false, message: ResponseStatus.fail.not_found, data: {} });

            }


            await subjectInstance.addLesson(lessonInstance);


            const classInstance = await Class.findByPk(req.body.class);

            const classarmInstances = await classInstance.getClassArms();

            const instance1 = await lessonInstance.addClassArms(classarmInstances);

            await classInstance.addLesson(lessonInstance);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: lessonInstance });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    static async subjectGroupedLessons(req, res) {

        try {

            const subjectInstance = await Subject.findByPk(req.query.subject_id);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: false, message: 'No subject found', data: {} });
            }

            const whereClause = req.query.class_id ? { ClassId: req.query.class_id } : {};

            const lessonInstances = await subjectInstance.getLessons({
                where: whereClause,
                include: [
                    {
                        model: ClassArm,
                        attributes: ['id', 'naming'],
                        through: { attributes: [] },
                    }, Class]
            });


            const classes = await subjectInstance.getClasses();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: lessonInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    static async adminLibraryLessonUploadTemplate(req, res) {

        try {

            const today = new Date();
            const threeDaysAhead = new Date();
            threeDaysAhead.setDate(today.getDate() + 3);
            let filePath = "";

            let payload =  {
                topic: req.body.title,
                objective: req.body.objective,
                age: req.body.age,
            };

            if (req.file) {
                payload.files = [req.file.path];
                filePath = req.file.path;

                console.log(payload.files);
            }

            payload.start_date = today;
            payload.end_date = threeDaysAhead;

            const lessonInstance = await Lesson.create(payload);

            const subjectInstance = await Subject.findByPk(req.body.subject);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: false, message: ResponseStatus.fail.not_found, data: {} });

            }

            const classInstance = await Class.findByPk(req.body.class);

            await classInstance.addLesson(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);



            const grade = `{reference:${classInstance.id},name:"${classInstance.naming}"}`;

            const subject = subjectInstance.naming;

            

            const slides = await LessonTemplateProvider.loadLessonSlidesFromTemplate(filePath, grade, subject);

            console.log('this is the slide response', slides);

            const parseSlides = [];

            const previousSlides = await lessonInstance.getLessonSlides({
                orderBy: { slide_index: "asc" }
            });


            if (previousSlides && previousSlides.length > 0 && previousSlides.length > slides.data.length) {
                for (let i = slides.data.length; i < previousSlides.length; i++) {
                    const slide = previousSlides[i];
                    await slide.destroy();
                }
            }

            for (let index = 0; index < slides.data.length; index++) {
                const slide = slides.data[index];
                if (previousSlides && previousSlides.length > index) {
                    const updated = previousSlides[index];
                    updated.slide_data = slide;
                    updated.save();
                } else {
                    const created = await LessonSlide.create({
                        slide_index: index,
                        slide_data: slide
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



    static async deleteLibrary(req, res) {

        const { id } = req.params;

        try {

            const libraryInstance = await Subject.findByPk(id, { where: { library: true } });

            if (!libraryInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await libraryInstance.destroy();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }



    static async libraryClasses(req, res) {

        const { id } = req.params;

        try {

            const libraryInstance = await Subject.findByPk(id, { where: { library: true } });

            if (!libraryInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await libraryInstance.getClasses();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }






    static async read(req, res) {

        try {

            const libraryInstance = await Library.findAll();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: libraryInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }



}


module.exports = AdminLibraryController;