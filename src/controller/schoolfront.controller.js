const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Permission, Admin, Authorization, Preference, Subject, } = require('../database/connection');
const SyncDB = require('../server/syncDatabase');
const AuthorizationSeed = require('../seeders/seed.authorization');

class SchoolFront {

    /*-----------------------------------| READ SCHOOL FRONT LIRARY LESSONS |-----------------------------------*/

    static async readLibraryLessons(req, res) {

        const { id } = req.params

        try {

            const subjectIinstance = await Subject.findByPk(id);

            if (!subjectIinstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const lessonInstance = await subjectIinstance.getLessons();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read, data: lessonInstance
            });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };


}


module.exports = SchoolFront;
