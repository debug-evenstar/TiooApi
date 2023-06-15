const ResponseStatus = require("../config/message.config");
const { validationResult, param } = require('express-validator');
const { Lesson } = require("../database/connection");


class LessonController {


    /*-----------------------------------| UPLOAD LESSON |-----------------------------------*/

    static async createLesson(req, res) {

       req.body.file = req.file.path;

        try {

             const lessonInstance = await Lesson.create(req.body);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: lessonInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }
}

module.exports = LessonController;