const ResponseStatus = require('../../config/message.config');
const { Account, Validation, Teacher, SchoolManagement, Authorization } = require('../../database/connection');

class AdminController {

    /*-----------------------------------| SCHOOL RELATIONAL DATA |-----------------------------------*/

    static async schools(req, res) {

        try {

            const data = req.userData;

            const authorization = await Authorization.findByPk(data.id);

            let montisoryManager;

            if (authorization.permissions) {
                if (authorization.permissions.includes('manage_prax_school') && JSON.parse(authorization.permissions).length == 1) {
                    montisoryManager = 'support@hellotioo.com';
                }
            }


            const whereClause = montisoryManager ? { account_type: 'school', email: montisoryManager } : { account_type: 'school', };


            const accountInstances = await Account.findAll({
                attributes: { exclude: ['password'] },
                where: whereClause
            });

            if (!accountInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }


            const accountData = await Promise.all(accountInstances.map(async (account) => {
                const payload = {};
                const schoolInstance = await account.getSchoolManagement();

                let school = { ...account.dataValues, school_name: schoolInstance.school_name, address: schoolInstance.residentialAddress }

                const teacherInstances = await schoolInstance.getTeachers({ attributes: { exclude: ['passportNumber', 'residentialAddress', 'nationality'] }, include: Account });

                const hybridTeachers = await schoolInstance.getTeachers({ where: { teacher_type: 'subject' } }, { attributes: { exclude: ['passportNumber', 'residentialAddress', 'nationality'] }, include: Account });

                const classInstances = await schoolInstance.getClasses();

                const studentInstances = await schoolInstance.getStudents({ attributes: { exclude: ['nationality', 'residentialAddress', 'passportNumber', 'dateOfBirth', 'gender', 'parent', 'class', 'school', 'age'] }, include: Account });

                const subjectInstances = await schoolInstance.getSubjects();

                payload.school = school;
                payload.subjects = subjectInstances.length;
                payload.teachers = teacherInstances.length;
                payload.hybrid_teachers = hybridTeachers.length;
                payload.students = studentInstances.length;
                payload.classes = classInstances.length;

                return payload;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: accountData });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    };

    static async freeLancers(req, res) {

        try {
            const accountInstances = await Account.findAll({
                attributes: { exclude: ['password'] },
                where: {
                    account_type: 'freelancer',
                },
            });

            if (!accountInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }

            const accountData = await Promise.all(accountInstances.map(async (account) => {
                const payload = {};
                const schoolInstance = await account.getSchoolManagement();
                let freelancer = { ...account.dataValues, school_name: schoolInstance.school_name, address: schoolInstance.residentialAddress }

                const classInstances = await schoolInstance.getClasses();
                console.log(classInstances)
                const subjectInstances = await schoolInstance.getSubjects();
                const studentInstances = await schoolInstance.getStudents({ attributes: { exclude: ['nationality', 'residentialAddress', 'passportNumber', 'dateOfBirth', 'gender', 'parent', 'class', 'school', 'age'] }, include: Account });
                payload.freelancer = freelancer;
                payload.subjects = { subjectInstances, "count": subjectInstances.length };
                payload.students = { studentInstances, "count": studentInstances.length };
                payload.classes = { classInstances, "count": classInstances.length };
                return payload;
            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: accountData });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

    static async freeLancers(req, res) {
        try {
            
            const accountInstances = await Account.findAll({
                attributes: { exclude: ['password'] },
                where: {
                    account_type: 'freelancer',
                },
            });

            if (!accountInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }

            const accountData = await Promise.all(accountInstances.map(async (account) => {
                const payload = {};
                const schoolInstance = await account.getSchoolManagement();
                let freelancer = { ...account.dataValues, school_name: schoolInstance.school_name, address: schoolInstance.residentialAddress }

                const classInstances = await schoolInstance.getClasses();
                console.log(classInstances)
                const subjectInstances = await schoolInstance.getSubjects();
                const studentInstances = await schoolInstance.getStudents({ attributes: { exclude: ['nationality', 'residentialAddress', 'passportNumber', 'dateOfBirth', 'gender', 'parent', 'class', 'school', 'age'] }, include: Account });
                payload.freelancer = freelancer;
                payload.subjects = { subjectInstances, "count": subjectInstances.length };
                payload.students = { studentInstances, "count": studentInstances.length };
                payload.classes = { classInstances, "count": classInstances.length };
                return payload;
            }));
            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: accountData });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }


    static async freeLancersById(req, res) {
        const { id } = req.params;
        try {

            const accountInstances = await Account.findByPk(id, {
                attributes: { exclude: ['password'] },
                where: {
                    account_type: 'freelancer',
                },
            });

            if (!accountInstances) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }

            if (accountInstances.account_type != 'freelancer') {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }

            const accountData = await Promise.all([accountInstances].map(async (account) => {
                const payload = {};
                const schoolInstance = await account.getSchoolManagement();
                let freelancer = { ...account.dataValues, school_name: schoolInstance.school_name, address: schoolInstance.residentialAddress }
                const classInstances = await schoolInstance.getClasses();
                const subjectInstances = await schoolInstance.getSubjects();
                const studentInstances = await schoolInstance.getStudents({ attributes: { exclude: ['nationality', 'residentialAddress', 'passportNumber', 'dateOfBirth', 'gender', 'parent', 'class', 'school', 'age'] }, include: Account });
                payload.freelancer = freelancer;
                payload.subjects = { subjectInstances, "count": subjectInstances.length };
                payload.students = { studentInstances, "count": studentInstances.length };
                payload.classes = { classInstances, "count": classInstances.length };
                return payload;
            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: accountData });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        }
    }

}


module.exports = AdminController;
