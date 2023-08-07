const AuthController = require('../auth.controller');
const { validationResult } = require('express-validator');
const ResponseStatus = require("../../config/message.config");
const { Account, Authorization, Permission, Validation } = require('../../database/connection');
const { use } = require('chai');
const HashUtils = require('../../utils/hash.utilities');


class AuthorizationController {

    /*-----------------------------------| CREATE ACCOUNT |-----------------------------------*/

    static async addAdminUser(req, res) {

        const otp = Math.floor(Math.random() * 900000) + 100000;
        const data = req.body;
        const errors = validationResult(req);

        const password = HashUtils.generateRandomPassword(6)

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const emailExist = await AuthController.validateEmail(data.email);

            let user;

            if (!emailExist.pass) {
                    data.account_type = 'admin';
                    data.password = password;
                    data.status = 'active';
                    data.flag = 'active';
                    data.verification_status = 1;
                    const registeredAccount = await Account.create(req.body);
                    const newValidation = await Validation.create({ otp });
                    const response = await registeredAccount.setValidation(newValidation);
                    user = registeredAccount;
            }else{

                user = await Account.findByPk(emailExist.data.id);

            }

            const permissions = await Permission.findAll({where : {id: data.access_level}});
            const permission_code = permissions.map((permission) => permission.code);

            const authorizationData = {
                status: data.status,
                role: data.role,
                access_level: permission_code
            };

           const isAuthorizedAdmin = await user.getAuthorization();
           
           if(isAuthorizedAdmin){
            return res.status(ResponseStatus.code.conflict).json({ error: true, message: "Already and admin user"});
           }

           const authorization = await Authorization.create(authorizationData);

           authorization.setAccount(user);

            console.log(password);  // TODO - Notify User of previlage

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.added,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

}


module.exports = AuthorizationController;