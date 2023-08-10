const ResponseStatus = require("../config/message.config");
const { validationResult, param } = require('express-validator');
const { Lesson, Subject, Chapter, Class, ClassArm } = require("../database/connection");


class LessonController {


    /*-----------------------------------| UPLOAD LESSON |-----------------------------------*/

    static async createLesson(req, res) {

        if (req.file) {
            req.body.file = req.file.path;
        }

        try {
            const lessonInstance = await Lesson.create(req.body);
            const subjectInstance = await Subject.findByPk(req.body.subject);


            // await subjectInstance.addLesson(lessonInstance);

            // Create a new chapter instance
            const chapter = new Chapter();
            chapter.name = req.body.chapter_name;
            chapter.title = req.body.chapter_title;

            const chapterInstance = await chapter.save();

            const classInstance = await Class.findByPk(req.body.class);

            const classarmInstance = await ClassArm.findByPk(req.body.class_arms);

            await subjectInstance.addChapter(chapterInstance);

            await chapterInstance.setLessons(lessonInstance);

            await subjectInstance.addLesson(lessonInstance);

            await classarmInstance.addLesson(lessonInstance);

            await classInstance.addLesson(lessonInstance)

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: lessonInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }


    /*-----------------------------------| NEXT WEEKS LESSON |-----------------------------------*/

    static async nextWeeksLessons(req, res) {

        const today = new Date();
        const daysUntilNextMonday = (1 - today.getDay() + 7) % 7;
        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilNextMonday);
        
        const daysUntilNextSunday = (7 - nextMonday.getDay()) % 7;
        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextMonday.getDate() + daysUntilNextSunday);

        try {

            const allLessons = await Lesson.findAll({ attributes: ['topic', 'description', 'start_date', 'end_date'],});

            const lessonsWithinNextWeek = allLessons.filter((lesson) => {
                const lessonStartDate = new Date(lesson.start_date);
                const lessonEndDate = new Date(lesson.end_date);
                return lessonStartDate >= nextMonday && lessonStartDate <= nextSunday;
            });

            return res.status(ResponseStatus.code.success).json({ error: false, 
                message: ResponseStatus.pass.read, data: lessonsWithinNextWeek });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }



        /*-----------------------------------| FETCH SUBJECT LESSONS |-----------------------------------*/

        static async subjectLessons(req, res) {

            const {id} = req.params;

            try {
    
                const subjectInstance = await Subject.findByPk(id);
                const lessons = await subjectInstance.getLessons({
                    attributes: ['topic', 'description'],
                });
    
                return res.status(ResponseStatus.code.success).json({ error: false, 
                    message: ResponseStatus.pass.read, data: lessons });
    
    
            } catch (error) {
                console.log(error);
                res.status(500).json({ error: 'Server Error' });
            };
    
        }

}

module.exports = LessonController;