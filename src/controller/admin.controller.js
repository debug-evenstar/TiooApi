const ResponseStatus = require('../config/message.config');
const { Account, Validation, Teacher, SchoolManagement } = require('../database/connection');

class AdminController {

    /*-----------------------------------| SETUP SCHOOL |-----------------------------------*/

    static async schools(req, res) {

        try {

            const accountInstances = await Account.findAll({
                attributes: { exclude: ['password'] },
                where: {
                    account_type: 'school',
                    // '$Teacher.id$': { [Sequelize.Op.not]: null },
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

                const teacherInstances = await schoolInstance.getTeachers({attributes: { exclude: ['passportNumber', 'residentialAddress', 'nationality'] }, include: Account});

                const classInstances = await schoolInstance.getClasses();

                const studentInstances = await schoolInstance.getStudents();

                const subjectInstances = await schoolInstance.getSubjects();

                payload.account = account;
                payload.subjects = subjectInstances;
                payload.teachers = teacherInstances;
                payload.classes = classInstances;
                payload.students = studentInstances; 

                //const teachers = await profile.getAccount({ attributes: { exclude: ['password', 'createdAt'], include: '' } });
                return payload;

            }));

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: accountData });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    };

   
}


module.exports = AdminController;
