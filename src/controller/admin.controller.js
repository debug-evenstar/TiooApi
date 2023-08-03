const ResponseStatus = require('../config/message.config');
const { Account, Validation } = require('../database/connection');

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
                include: [Teacher],
            });

            if (!userExist) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true, message:
                        ResponseStatus.fail.no_user
                });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: registeredSchoolManagement });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    };

   
}


module.exports = AdminController;
