const { validationResult, body } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, SchoolManagement, Permission, Admin, Authorization, } = require('../database/connection');
const SyncDB = require('../server/syncDatabase');
const AuthorizationSeed = require('../seeders/seed.authorization');

class ActionController {

    /*-----------------------------------| SETUP SCHOOL |-----------------------------------*/

    static async syncDB(req, res) {

        console.log();

        if(req.headers['actionkey'] !== 'nR5cCI6IkpXVCJ9'){
            return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: 'Invalid action key' });
        }

        try {

            await SyncDB.run();

            return res.status(ResponseStatus.code.success).json({ error: false, message: 'DB Synced' });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };


    static async superAdmin(req, res) {

        const otp = Math.floor(Math.random() * 900000) + 100000;
        const data = req.body;
        const errors = validationResult(req);
        const password = "1234"

        try {

            const adminInstance = await Admin.findOne({ where: { email: data.email } });

            if (adminInstance) {
                return res.status(ResponseStatus.code.conflict).json({ error: true, message: "Already an admin user" });
            }

            data.password = password;
            const registeredAdmin = await Admin.create(req.body);
            const newValidation = await Validation.create({ otp });
            await registeredAdmin.setValidation(newValidation);


            let permissions = await Permission.findAll({ where: { id: data.permissions } });

            if (permissions.length === 0) {
                await AuthorizationSeed.permission();
                permissions = await Permission.findAll({ where: { id: data.permissions } });
            }

            const permission_code = permissions.map((permission) => permission.code);

            const authorizationData = {
                position: data.position,
                role: data.role,
                permissions: permission_code
            };

            const authorization = await Authorization.create(authorizationData);

            authorization.setAdmin(registeredAdmin);

            console.log(password);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.create,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error', extra: error.message });
        };

    };




}


module.exports = ActionController;
