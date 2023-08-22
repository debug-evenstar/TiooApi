const ResponseStatus = require("../config/message.config");
const { validationResult, param } = require('express-validator');
const { Lesson, Subject, Chapter, Class, ClassArm, Group, LessonSlide, Account } = require("../database/connection");


class LessonController {


    /*-----------------------------------| UPLOAD LESSON |-----------------------------------*/

    static async createLesson(req, res) {

        let filePaths = [];
        const today = new Date();
        const threeDaysAhead = new Date();
        threeDaysAhead.setDate(today.getDate() + 3);

        if (req.files && req.files.length > 0) {
            filePaths = req.files.map((file) => file.path);
            req.body.files = filePaths;
        }

        if (!req.body.start_date) {
            req.body.start_date = today;
        }

        if (!req.body.end_date) {
            req.body.end_date = threeDaysAhead;
        }

        try {

            const lessonInstance = await Lesson.create(req.body);
            const subjectInstance = await Subject.findByPk(req.body.subject);

            if (!subjectInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: false, message: ResponseStatus.fail.not_found, data: {} });

            }


            await subjectInstance.addLesson(lessonInstance);

            // Create a new chapter instance
            const chapter = new Chapter();
            chapter.name = "undefined";
            chapter.title = "undefined";

            const chapterInstance = await chapter.save();

            const classInstance = await Class.findByPk(req.body.class);

            const classarmInstances = await ClassArm.findAll({ where: { id: [...JSON.parse(req.body.class_arms)] } });

            await subjectInstance.addChapter(chapterInstance);

            await chapterInstance.setLessons(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            const instance1 = await lessonInstance.addClassArms(classarmInstances);

            await classInstance.addLesson(lessonInstance);

            const groupInstance = await Group.create({
                naming: classInstance.naming,
                ref_cid: classInstance.id
            });

            await groupInstance.addLesson(lessonInstance);
            const instance2 = await groupInstance.addClassArms(classarmInstances);
            const subjejctGroup = await subjectInstance.addGroup(groupInstance);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: groupInstance });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    static async addLessonToGroup(req, res) {

        let filePaths = [];

        if (req.files && req.files.length > 0) {
            filePaths = req.files.map((file) => file.path);
            req.body.files = filePaths;
        }

        try {

            const lessonInstance = await Lesson.create(req.body);
            const groupInstance = await Group.findByPk(req.params.id);
            const subjectInstance = await Subject.findByPk(groupInstance.SubjectId);

            // Create a new chapter instance
            const chapter = new Chapter();
            chapter.name = "undefined";
            chapter.title = "undefined";

            const chapterInstance = await chapter.save();

            const classInstance = await Class.findByPk(groupInstance.ref_cid);

            await subjectInstance.addChapter(chapterInstance);

            await chapterInstance.setLessons(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            await groupInstance.addLesson(lessonInstance);

            await subjectInstance.addGroup(groupInstance);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: groupInstance });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }



    static async editGroupArms(req, res) {
        try {

            const groupInstance = await Group.findByPk(req.params.id);

            const classArms = await groupInstance.getClassArms();

            await groupInstance.removeClassArms(classArms);

            const classarmInstances = await ClassArm.findAll({ where: { id: [...req.body.class_arms] } });

            await groupInstance.addClassArms(classarmInstances);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: groupInstance });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }


    static async updateLesson(req, res) {

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



    static async subjectGroupedLessons(req, res) {

        try {

            const subjectInstance = await Subject.findByPk(req.query.subject_id);


            const whereClause = req.query.class_id ? { ref_cid: req.query.class_id } : {};

            const lessonInstances = await subjectInstance.getGroups({
                where: whereClause,
                include: [
                    {
                        model: ClassArm,
                        attributes: ['id', 'naming'],
                        through: { attributes: [] },
                    }, Lesson]
            });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: lessonInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }



    static async addLesson(req, res) {

        let filePaths = [];
        const today = new Date();
        const threeDaysAhead = new Date();
        threeDaysAhead.setDate(today.getDate() + 3);

        if (req.files && req.files.length > 0) {
            filePaths = req.files.map((file) => file.path);
            req.body.files = filePaths;
        }

        if (!req.body.start_date) {
            req.body.start_date = today;
        }

        if (!req.body.end_date) {
            req.body.end_date = threeDaysAhead;
        }

        try {

            const selectedGroup = await Group.findByPk(req.query.group_id, { include: [ClassArm] });

            const classarms = selectedGroup.ClassArms.map((element) => element.id);

            const body = {
                topic: req.body.topic,
                duration: "45 Minutes",
                curriculum: "",
                subject: selectedGroup.SubjectId,
                start_date: req.body.start_date,
                end_date: req.body.end_date,
                objective: "",
                additioinal_instruction: "",
                week: "Week 3",
                status: "locked",
                term: 1,
                class: selectedGroup.ref_cid,
                class_arms: classarms,
                files: req.body.files
            }

            const lessonInstance = await Lesson.create(body);

            const subjectInstance = await Subject.findByPk(body.subject);

            if(!subjectInstance){
                return res.status(ResponseStatus.code.not_found).json({ error: false, message: ResponseStatus.fail.not_found, data: {} });

            }


            await subjectInstance.addLesson(lessonInstance);

            // Create a new chapter instance
            const chapter = new Chapter();
            chapter.name = "undefined";
            chapter.title = "undefined";

            const chapterInstance = await chapter.save();

            const classInstance = await Class.findByPk(body.class);

            const classarmInstances = await ClassArm.findAll({ where: { id: [...body.class_arms] } });

            await subjectInstance.addChapter(chapterInstance);

            await chapterInstance.setLessons(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            const instance1 = await lessonInstance.addClassArms(classarmInstances);

            await classInstance.addLesson(lessonInstance);

            // const groupInstance = await Group.create({
            //     naming: classInstance.naming,
            //     ref_cid: classInstance.id
            // });

            await selectedGroup.addLesson(lessonInstance);
            // const instance2 = await selectedGroup.addClassArms(classarmInstances);
            // const subjejctGroup = await subjectInstance.addGroup(groupInstance);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: body });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }

    static async subjectGroups(req, res) {

        try {

            const subjectInstance = await Subject.findByPk(req.query.subject_id);

            const lessonInstances = await subjectInstance.getGroups({
                include: [
                    {
                        model: ClassArm,
                        attributes: ['id', 'naming'],
                        through: { attributes: [] },
                    }]
            });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: lessonInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }







    /*-----------------------------------| NEXT WEEKS LESSON |-----------------------------------*/

    static async upcomingNextWeeksLessons(req, res) {

        const today = new Date();
        const daysUntilNextMonday = (1 - today.getDay() + 7) % 7;
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilNextMonday);

        const daysUntilNextSunday = (7 - nextMonday.getDay()) % 7;
        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextMonday.getDate() + daysUntilNextSunday);

        try {

            const allLessons = await Lesson.findAll({ attributes: ['topic', 'description', 'start_date', 'end_date'], });

            const lessonsWithinNextWeek = allLessons.filter((lesson) => {
                const lessonStartDate = new Date(lesson.start_date);
                const lessonEndDate = new Date(lesson.end_date);
                return lessonStartDate >= nextMonday && lessonStartDate <= nextSunday;
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read, data: lessonsWithinNextWeek
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }

        /*-----------------------------------| NEXT WEEKS LESSON |-----------------------------------*/

        static async studentUpcomingNextWeeksLessons(req, res) {

            const today = new Date();
            const daysUntilNextMonday = (1 - today.getDay() + 7) % 7;
            const nextMonday = new Date(today);
            nextMonday.setDate(today.getDate() + daysUntilNextMonday);
    
            const daysUntilNextSunday = (7 - nextMonday.getDay()) % 7;
            const nextSunday = new Date(nextMonday);
            nextSunday.setDate(nextMonday.getDate() + daysUntilNextSunday);
    
            try {

                const{id} = req.userData;

                const accountInstance  = await Account.findByPk(id);

                const studentInstance = await accountInstance.getStudent();

                const classInstance = await studentInstance.getClass();
    
                const allLessons = await classInstance.getLessons({ attributes: ['topic', 'description', 'start_date', 'end_date'], });
    
                const lessonsWithinNextWeek = allLessons.filter((lesson) => {
                    const lessonStartDate = new Date(lesson.start_date);
                    const lessonEndDate = new Date(lesson.end_date);
                    return lessonStartDate >= nextMonday && lessonStartDate <= nextSunday;
                });
    
                return res.status(ResponseStatus.code.success).json({
                    error: false,
                    message: ResponseStatus.pass.read, data: lessonsWithinNextWeek
                });
    
    
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'server error', extra: error.message });
            };
    
        }



    /*-----------------------------------| FETCH SUBJECT LESSONS |-----------------------------------*/

    static async subjectLessons(req, res) {

        const { id } = req.params;

        try {

            const subjectInstance = await Subject.findByPk(id, { include: [ClassArm, Lesson, Class] });

            const payload = {
                id: 2,
                naming: subjectInstance.naming,
                description: subjectInstance.description,
                SchoolManagementId: subjectInstance.SchoolManagementId,
                classArms: subjectInstance.ClassArms.map(item => ({ id: item.id, naming: item.naming, classId: item.ClassId })),
                classes: subjectInstance.Classes.map(item => ({ id: item.id, naming: item.naming })),
                lessons: subjectInstance.Lessons
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read, data: payload
            });


        } catch (error) {
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    static async removeLessonFromGroup(req, res) {

        const { id } = req.params;

        try {

            const groupInstance = await Group.findByPk(id);

            const lessonInstance = await Lesson.findByPk(req.params.lesson);

            if(!lessonInstance){
                res.status(400).json({error : "Lesson not found" });
            }

            await groupInstance.removeLesson(lessonInstance);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.removed
            });


        } catch (error) {
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }


    static async lessonTemplate(req, res){

        const {id} = req.params;

            try {
                
            const lessonInstance = await Lesson.findByPk(id, {
                include : [
                    { 
                        model : LessonSlide,
                        orderBy : {slide_index : "asc"}
                    }, Subject
                ]
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: lessonInstance
            });

        } catch (error) {
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }

    static async updateLessonStatus(req, res){

        const {id} = req.params;
        const data = req.query;

        try {
            
        const lessonInstance = await Lesson.findByPk(id);

         const response = await lessonInstance.update({status: data.status});

        return res.status(ResponseStatus.code.success).json({
            error: false,
            message: ResponseStatus.pass.read,
            data: response
        });



        } catch (error) {
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    }

}

module.exports = LessonController;