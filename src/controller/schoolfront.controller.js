const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Permission, Admin, Authorization, Preference, Subject, Textbook, CartItem, } = require('../database/connection');
const SyncDB = require('../server/syncDatabase');
const AuthorizationSeed = require('../seeders/seed.authorization');

const { Op } = require('sequelize');

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



    static async addLibraryMaterialTextBookToSchool(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            for (var item of req.body.cart) {

                item.account = accountInstance.id;

                const subjectInstance = await Subject.findByPk(item.textbook)

                const textbookInstance = await Textbook.create(item);

                const data = await accountInstance.addTextbook(textbookInstance);

                await subjectInstance.addTextbook(textbookInstance)

                console.log(subjectInstance);

            }

            await CartItem.destroy({
                where: {
                    AccountId: account_id,
                },
            });

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.added, data: {}
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };


    static async readSchoolLibraryMaterialTextBooks(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            const textBooks = await accountInstance.getTextbooks({
                where: {
                    SubjectId: {
                        [Op.not]: null
                    }
                },
                include: [Subject]
            });
            const response = await Promise.all(textBooks.map((item) => {


                const data = {
                    id: item.id,
                    subject_pair: item.subject_pair,
                    material_id: item.Subject.id,
                    naming: item.Subject.naming,
                    description: item.Subject.description,
                    ages: item.Subject.ages,
                    grades: item.grades
                }

                return data
            }))

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read, data: response
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };



    static async readSchoolLibraryMaterialTextBooksBySubject(req, res) {

        const {sid} = req.params;

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            const textBooks = await accountInstance.getTextbooks({
                where: {
                    SubjectId: {
                        [Op.not]: null
                    },
                    subject_pair:  sid},
                include: [Subject]
            });
            const response = await Promise.all(textBooks.map((item) => {


                const data = {
                    id: item.id,
                    subject_pair: item.subject_pair,
                    material_id: item.Subject.id,
                    naming: item.Subject.naming,
                    description: item.Subject.description,
                    ages: item.Subject.ages,
                    grades: item.grades
                }

                return data
            }))

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read, data: response
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };


    static async removeTextbookFromSchool(req, res) {

        const { id } = req.params;
        
        try {

            const textbookInstance = await Textbook.findByPk(id);

            if(!textbookInstance){
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const response = await textbookInstance.destroy();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: 'Textbook deleted successfully',
                data: response
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error', extra: error.message });
        }
    }

}


module.exports = SchoolFront;
