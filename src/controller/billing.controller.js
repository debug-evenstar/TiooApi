const ResponseStatus = require("../config/message.config");
const { Account, Chapter, Price, Billing } = require("../database/connection");

class BillingController {

    static async school(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            let pricing;

            const payload = {};

            const priceInstance = await Price.findAll();

            const schoolPricing = priceInstance.filter((price) => price.tab === 'schools' && price.tag === 'all');
            const exceptionedSchoolsPricing = priceInstance.filter((price) => price.tab === 'schools' && price.tag === 'exceptions');

            payload.schools = schoolPricing[0];
            payload.exceptionedSchools = exceptionedSchoolsPricing;

            const exceptionedSchool = payload.exceptionedSchools.filter(item => item.accounts == account_id);

            if (exceptionedSchool.length !== 0) {
                pricing = exceptionedSchool;
            } else {
                pricing = payload.schools;
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: pricing });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }

    static async freelancer(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;


        try {

            let pricing = {};

            const payload = {};

            const priceInstance = await Price.findAll();

            const freelancerPricing = priceInstance.filter((price) => price.tab === 'freelancers' && price.tag === 'all');
            const exceptionedFreelancersPricing = priceInstance.filter((price) => price.tab === 'freelancers' && price.tag === 'exceptions');

            const exceptionedF = await Promise.all(exceptionedFreelancersPricing.map(async (element) => {
                const account = await Account.findByPk(element.accounts);
                element.dataValues.school_name = account.name;
                delete element.dataValues.tab;
                return element;

            }));

            payload.freelancers = freelancerPricing[0];
            payload.exceptionedFreelancers = exceptionedF;

            console.log(payload.freelancers);

            const exceptionedFreelancer = payload.exceptionedFreelancers.filter(item => item.accounts == account_id);

            if (exceptionedFreelancer.length !== 0) {
                pricing = exceptionedFreelancer;
            } else {
                pricing = payload.freelancers;
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: pricing });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }



    /*-----------------------------------| READ PERSONAL INFORMATION |-----------------------------------*/

    static async student(req, res) {

        const { id } = req.userData

        const account_id = req.query.account_id ? req.query.account_id : id;

        try {

            const accountInstance = await Account.findByPk(parseInt(account_id));

            if (!accountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const studentInstance = await accountInstance.getStudent();

            if (!studentInstance) {
                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.unauthorized });
            }

            const schoolInstance = await studentInstance.getSchoolManagement();

            const schoolAccount_id = schoolInstance.AccountId;

            let pricing;

            const response = {};

            const priceInstance = await Price.findAll();

            if (schoolInstance.naming_types == 'C') {
                //READ PRICING FOR FREELANCERS STUDENT

                const freelancerPricing = priceInstance.filter((price) => price.tab === 'freelancers' && price.tag === 'all');
                const exceptionedFreelancersPricing = priceInstance.filter((price) => price.tab === 'freelancers' && price.tag === 'exceptions');

                const exceptionedF = await Promise.all(exceptionedFreelancersPricing.map(async (element) => {
                    const account = await Account.findByPk(element.accounts);
                    element.dataValues.school_name = account.name;
                    delete element.dataValues.tab;
                    return element;

                }));

                response.freelancers = freelancerPricing[0];
                response.exceptionedFreelancers = exceptionedF;

                const exceptionedFreelancer = response.exceptionedFreelancers.filter(item => item.accounts == schoolAccount_id);

                if (exceptionedFreelancer.length !== 0) {

                    pricing = {
                        students_breakdown: exceptionedFreelancer[0].students_breakdown,
                        id: exceptionedFreelancer[0].id,
                        student_price: exceptionedFreelancer[0].student_price,
                        tag: exceptionedFreelancer[0].exceptions,
                    };

                } else {

                    pricing = {
                        students_breakdown: response.freelancers.students_breakdown,
                        id: response.freelancers.id,
                        student_price: response.freelancers.student_price,
                        tag: response.freelancers.exceptions ?? 'null',
                    };
                }

            } else {

                //READ PRICING FOR SCHOOL STUDENT

                const schoolPricing = priceInstance.filter((price) => price.tab === 'schools' && price.tag === 'all');
                const exceptionedSchoolsPricing = priceInstance.filter((price) => price.tab === 'schools' && price.tag === 'exceptions');

                response.schools = schoolPricing[0];
                response.exceptionedSchools = exceptionedSchoolsPricing;

                const exceptionedSchool = response.exceptionedSchools.filter(item => item.accounts == schoolAccount_id);

                if (exceptionedSchool.length !== 0) {

                    pricing = {
                        students_breakdown: exceptionedSchool[0].students_breakdown,
                        id: exceptionedSchool[0].id,
                        student_price: exceptionedSchool[0].student_price,
                        tag: exceptionedSchool[0].exceptions,
                    };
                } else {
                    pricing = {
                        students_breakdown: response.schools.students_breakdown,
                        id: response.schools.id,
                        student_price: response.schools.student_price,
                        tag: response.schools.exceptions ?? 'null',
                    };
                }
            }

            console.log(schoolInstance)



            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: pricing });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }




    static async generateBill(req, res) {

        const today = new Date();
        const studentDaysAhead = new Date();
        const teacherDaysAhead = new Date();
        studentDaysAhead.setDate(today.getDate() + req.body.student_month_convered);
        teacherDaysAhead.setDate(today.getDate() + req.body.teachers_month_convered);

        req.body.student_expiry = teacherDaysAhead;
        req.body.teacher_expiry = studentDaysAhead;

        console.log(req.body.student_expiry);
        console.log(req.body.teacher_expiry);

        try {

            const accountInstance = await Account.findByPk(req.body.account);

            const billingInstance = await Billing.create(req.body);

            const response = await accountInstance.addBillings(billingInstance);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: billingInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };
    }



}

module.exports = BillingController;