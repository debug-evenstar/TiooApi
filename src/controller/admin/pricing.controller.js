const ResponseStatus = require('../../config/message.config');
const { Account, Validation, Teacher, Price, SchoolManagement } = require('../../database/connection');

class PriceController {

    /*-----------------------------------| CREATE PRICING |-----------------------------------*/

    static async create(req, res) {

        const data = req.body;

        try {

            if (!data.accounts) {
                data.tag = 'all';
            } else {
                const accountInstance = await Account.findByPk(data.accounts);

                if (!accountInstance) {
                    return res.status(ResponseStatus.code.not_found).json({ error: false, message: ResponseStatus.fail.no_user, data: {} });
                }

                if (!data.tab.includes(accountInstance.account_type)) {

                    return res.status(ResponseStatus.code.bad_request).json({ error: false, message: ResponseStatus.fail.unauthorized, data: {} });
                }
            }

            const priceInstance = await Price.create(data);

            if (!priceInstance) {
                return res.status(ResponseStatus.code.bad_request).json({ error: false, message: ResponseStatus.fail.create, data: {} });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: data });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    };

    /*-----------------------------------| READ PRICING |-----------------------------------*/

    static async read(req, res) {

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

            delete schoolPricing[0].dataValues.accounts;
            delete freelancerPricing[0].dataValues.accounts

            /*-----------------------------------| SCHOOL TEACHERS & STUDENTS DISCOUNTS  |-----------------------------------*/

            schoolPricing[0].dataValues.teachers_quater_discount = schoolPricing[0].teachers_price - 500;
            schoolPricing[0].dataValues.teachers_semannual_discount = schoolPricing[0].teachers_price - 1000;
            schoolPricing[0].dataValues.teachers_annual_discount = schoolPricing[0].teachers_price - 1500

            schoolPricing[0].dataValues.students_quater_discount = schoolPricing[0].student_price - 500;
            schoolPricing[0].dataValues.students_semannual_discount = schoolPricing[0].student_price - 1000;
            schoolPricing[0].dataValues.students_annual_discount = schoolPricing[0].student_price - 1500;

            /*-----------------------------------| FREELANCER TEACHERS & STUDENTS DISCOUNTS  |-----------------------------------*/

            freelancerPricing[0].dataValues.teachers_quater_discount = freelancerPricing[0].teachers_price - 500;
            freelancerPricing[0].dataValues.teachers_semannual_discount = freelancerPricing[0].teachers_price - 1000;
            freelancerPricing[0].dataValues.teachers_annual_discount = freelancerPricing[0].teachers_price - 1500

            freelancerPricing[0].dataValues.students_quater_discount = freelancerPricing[0].student_price - 500;
            freelancerPricing[0].dataValues.students_semannual_discount = freelancerPricing[0].student_price - 1000;
            freelancerPricing[0].dataValues.students_annual_discount = freelancerPricing[0].student_price - 1500;

            payload.schools = schoolPricing[0];
            payload.freelancers = freelancerPricing[0];
            payload.students = independentStudentPricing[0];

            payload.exceptionedSchools = exceptionedSchoolsPricing;
            payload.exceptionedFreelancers = exceptionedF;
            payload.exceptionedIndependentsStudents = exceptionedIS;




            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: payload });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    };


    static async update(req, res) {

        try {

            const data = req.body;

            const priceInstance = await Price.findByPk(data.id);

            if (!priceInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: false, message: ResponseStatus.fail.no_user, data: {} });
            }

            const updatedInstance = await priceInstance.update(data);

            if (!updatedInstance) {
                return res.status(ResponseStatus.code.bad_request).json({ error: false, message: ResponseStatus.fail.bad_request, data: {} });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: updatedInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };
    }

    static async delete(req, res) {

        const {id} = req.params;

        try {

            const priceInstance = await Price.findByPk(id);

            if (!priceInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: false, message: ResponseStatus.fail.not_found, data: {} });
            }

            const deletedInstance = await priceInstance.destroy();

            if (!deletedInstance) {
                return res.status(ResponseStatus.code.bad_request).json({ error: false, message: ResponseStatus.fail.bad_request, data: {} });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: {} });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }


}


module.exports = PriceController;
