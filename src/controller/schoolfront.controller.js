const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Permission, Admin, Authorization, Preference, Subject, Textbook, } = require('../database/connection');
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



    static async addLessonToSchool(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            for (var item of req.body.cart) {

                item.account = accountInstance.id;

                const subjectInstance = await Subject.findByPk(item.textbook)

                const textbookInstance = await Textbook.create(item); 

                const data =  await accountInstance.addTextbook(textbookInstance);

                await subjectInstance.addTextbook(textbookInstance)

                console.log(subjectInstance);

            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read, data: {}
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };

}


module.exports = SchoolFront;
