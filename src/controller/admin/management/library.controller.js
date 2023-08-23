const AuthController = require('../../auth.controller');
const { validationResult } = require('express-validator');
const ResponseStatus = require("../../../config/message.config");
const { Account, Authorization, Permission, Validation, Admin, SchoolManagement, ClassArm, Subject, Lesson, Class, Library } = require('../../../database/connection');
const { use } = require('chai');
const AuthorizationSeed = require("../../../seeders/seed.authorization");
const TokenMiddleware = require('../../../middleware/token.middleware');




class AdminLibraryController {



    static async libraryMaterial(req, res) {

        const data = req.body;

        data.library = true;

        try {

            // --------------------------------------------------------- subject

            const classInstance = await Class.findByPk(data.class[0]);

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const accountInstance = await Account.findOne({ where: { email: ResponseStatus.tio.email } });
            const schoolInstance = await accountInstance.getSchoolManagement();

            const classarmInstances = await classInstance.getClassArms();
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