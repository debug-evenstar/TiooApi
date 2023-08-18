const AuthController = require('../auth.controller');
const { validationResult } = require('express-validator');
const ResponseStatus = require("../../config/message.config");
const { Account, Authorization, Permission, Validation, Admin } = require('../../database/connection');
const { use } = require('chai');
const HashUtils = require('../../utils/hash.utilities');
const AuthorizationSeed = require("../../seeders/seed.authorization");
const TokenMiddleware = require('../../middleware/token.middleware');
const Mailer = require('../../services/mailer');




class AuthorizationController {

    /*-----------------------------------| ADD ADMIN USER |-----------------------------------*/

    static async addAdminUser(req, res) {

        const otp = Math.floor(Math.random() * 900000) + 100000;
        const data = req.body;
        const errors = validationResult(req);

        const password = HashUtils.generateRandomPassword(6)

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

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

            Mailer().to(data.email).from(process.env.MAIL_FROM, "Praxeum").subject("Admin Access").template("emails.InviteAdmin", { name: data.name, email: data.email, password: data.password }).send();

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.added,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }


    /*-----------------------------------| READ ADMIN USER |-----------------------------------*/

    static async readAdminUser(req, res) {

        try {

            const authorization = await Authorization.findAll();

            const authoorizedUsers = await Promise.all(authorization.map(async (auth) => {
                const userdata = await auth.getAdmin({ attributes: { exclude: ['password', 'createdAt'] } });
                let payload = {};
                payload.id = userdata.dataValues.id;
                payload.fullname = userdata.dataValues.name;
                payload.email = userdata.dataValues.email;
                payload.status = auth.status;
                payload.role = auth.role;
                payload.permissions = auth.permissions
                return payload;

            }));

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: authoorizedUsers
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }


    /*-----------------------------------| SIGNIN ACCOUNT |-----------------------------------*/

    static async login(req, res) {

        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {
            const user = await Admin.findOne({ where: { email: email } });

            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.login });
            }

            const isValidPassword = await user.comparePassword(password);

            if (!isValidPassword) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.login });
            }

            const userData = {
                id: user.dataValues.id,
                email: user.dataValues.email,
                account_type: user.dataValues.account_type,
            };

            const generatedToken = TokenMiddleware.generate(userData);

            const authorization = await user.getAuthorization();

            const payload = {
                AccountId: user.id,
                name: user.name,
                email: user.email,
                status: user.status === null ? "undefined" : user.status,
                phone: user.phone,
                account_type: user.account_type,
                verification_status: user.verification_status,
                flag: user.flag,
                authorization: authorization.dataValues.permissions
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.login, profile: payload, token: generatedToken });


        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }

    /*-----------------------------------| READ ADMIN USER |-----------------------------------*/

    static async readPermissions(req, res) {

        try {

            let permissions = await Permission.findAll();

            if (permissions.length === 0) {
                await AuthorizationSeed.permission();
                permissions = await Permission.findAll();
            }

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.read,
                data: permissions
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'server error' ,  extra: error.message });
        };

    }
    


        /*-----------------------------------| DELETE ADMIN |-----------------------------------*/

        static async deleteAdmin(req, res) {

            const { admin_id } = req.query;

            console.log(admin_id);
       
    
            try {
                const user = await Admin.findOne({ where: { id: admin_id } });

                console.log(user);
    
                if (!user) {
                    return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
                }

                const authorization = await user.getAuthorization();
                const deletedAuthorization = await authorization.destroy();
                const deletedAdmin = await user.destroy();
    
                return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: deletedAdmin });
    
    
            } catch (error) {
                console.log(error)
                res.status(500).json({ error: 'server error' ,  extra: error.message });
            };
    
        }


}


module.exports = AuthorizationController;