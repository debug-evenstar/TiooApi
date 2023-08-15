const AuthController = require('../../auth.controller');
const { validationResult } = require('express-validator');
const ResponseStatus = require("../../../config/message.config");
const { Account, Authorization, Permission, Validation, Admin, SchoolManagement, ClassArm, Subject, Lesson, Class, Library } = require('../../../database/connection');
const { use } = require('chai');
const AuthorizationSeed = require("../../../seeders/seed.authorization");
const TokenMiddleware = require('../../../middleware/token.middleware');




class AdminLibraryController {


    static async create(req, res) {

        const data = req.body;

        if (req.file) {
            req.body.file = req.file.path;
        }

        try {

            const classInstance = await Class.findByPk(data.class);

            if (!classInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const libraryInstance = await Library.create(req.body);

            const response = await classInstance.addLibrary(libraryInstance);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }



    static async lessonsGroupedByClasses(req, res) {

        const data = req.query;

        try {

            const AccountInstance = await Account.findByPk(data.school_id, { include: [SchoolManagement] });
            if (!AccountInstance) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            const SchoolInstances = await AccountInstance.getSchoolManagement();
            if (!SchoolInstances) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const ClassInstances = await SchoolInstances.getClasses({ attributes: { exclude: ['SchoolManagementId', 'type'] }, include: [Lesson] });


            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: ClassInstances });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }



}


module.exports = AdminLibraryController;