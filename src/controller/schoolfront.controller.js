const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Permission, Admin, Authorization, Preference, Subject, Textbook, CartItem, Class, Price, } = require('../database/connection');
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
            const response = await Promise.all(textBooks.map(async (item) => {


                const classsInstances = await Class.findAll({ where: { id: item.grades } });

                const data = {
                    id: item.id,
                    subject_pair: item.subject_pair,
                    material_id: item.Subject.id,
                    naming: item.Subject.naming,
                    description: item.Subject.description,
                    ages: item.Subject.ages,
                    grades: classsInstances.map((element) => ({ id: element.id, type: element.type, naming: element.naming }))
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

        const { sid } = req.params;

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(account_id);

            const textBooks = await accountInstance.getTextbooks({
                where: {
                    SubjectId: {
                        [Op.not]: null
                    },
                    subject_pair: sid
                },
                include: [Subject]
            });
            const response = await Promise.all(textBooks.map(async (item) => {


                const classsInstances = await Class.findAll({ where: { id: item.grades } });

                const data = {
                    id: item.id,
                    subject_pair: item.subject_pair,
                    material_id: item.Subject.id,
                    naming: item.Subject.naming,
                    description: item.Subject.description,
                    ages: item.Subject.ages,
                    grades: classsInstances.map((element) => ({ id: element.id, type: element.type, naming: element.naming }))
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

            if (!textbookInstance) {
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


    static async openPricing(req, res) {

        const { cc } = req.query;

        try {


            const payload = {};

            const priceInstance = await Price.findAll();

            const schoolPricing = priceInstance.filter((price) => price.tab === 'schools' && price.tag === 'all');
            const freelancerPricing = priceInstance.filter((price) => price.tab === 'freelancers' && price.tag === 'all');
            const independentStudentPricing = priceInstance.filter((price) => price.tab === 'students' && price.tag === 'all');

            const exceptionedSchoolsPricing = priceInstance.filter((price) => price.tab === 'schools' && price.tag === 'exceptions');
            const exceptionedFreelancersPricing = priceInstance.filter((price) => price.tab === 'freelancers' && price.tag === 'exceptions');
            const exceptionedIndependentsStudentPricing = priceInstance.filter((price) => price.tab === 'students' && price.tag === 'exceptions');

            const exceptionedS = await Promise.all(exceptionedSchoolsPricing.map(async (element) => {
                const account = await Account.findByPk(element.accounts);
                element.dataValues.school_name = account.name;
                delete element.dataValues.tab;
                return element;

            }));

            const exceptionedF = await Promise.all(exceptionedFreelancersPricing.map(async (element) => {
                const account = await Account.findByPk(element.accounts);
                element.dataValues.school_name = account.name;
                delete element.dataValues.tab;
                return element;

            }));

            const exceptionedIS = await Promise.all(exceptionedIndependentsStudentPricing.map(async (element) => {
                const account = await Account.findByPk(element.accounts);
                element.dataValues.student_name = account.name;
                delete element.dataValues.tab;
                return element;

            }));

            payload.schools = schoolPricing[0];
            payload.freelancers = freelancerPricing[0];
            payload.students = independentStudentPricing[0];

            payload.exceptionedSchools = exceptionedSchoolsPricing;
            payload.exceptionedFreelancers = exceptionedF;
            payload.exceptionedIndependentsStudents = exceptionedIS;


            const exchangeRates = { // Replace with actual exchange rates
                'USD': 1.23,  
                'EUR': 1.0,
                'GBP': 0.85,
                'NGN': 1.00,
            };

            console.log(exchangeRates[cc]);

            const studentData = {
                currency: exchangeRates[cc] ? cc : 'NGN',
                pricing: [
                    { 'monthly': exchangeRates[cc] ? payload.schools.student_price * exchangeRates[cc] : payload.schools.student_price},
                    { 'quaterly': exchangeRates[cc] ? payload.schools.students_breakdown.quater * exchangeRates[cc]  : payload.schools.students_breakdown.quater },
                    { 'yearly': exchangeRates[cc] ? payload.schools.students_breakdown.yearly * exchangeRates[cc]  : payload.schools.students_breakdown.yearly },
                ]
            };

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: studentData });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error', extra: error.message });
        }
    }

}


module.exports = SchoolFront;
