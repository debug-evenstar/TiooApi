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

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.create, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }


    static async read(req, res) {

        try {

            const libraryInstance = await Library.findAll();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: libraryInstance });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }



}


module.exports = AdminLibraryController;