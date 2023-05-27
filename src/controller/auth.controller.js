const { validationResult } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation } = require('../model/database');

class AuthController {

    static async createAccount(req, res) {

        const otp = Math.floor(Math.random() * 900000) + 100000;
        const { username, email, account_type } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {
            
            const emailExist = await AuthController.validateEmail(email);

            if(emailExist){
                return res.status(ResponseStatus.code.conflict).json({ error: true, message: ResponseStatus.fail.account_conflict});
            }
            
            const registeredAccount = await Account.create(req.body);
            const newValidation = await Validation.create({ otp });
            const response = await registeredAccount.setValidation(newValidation);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.register, data: response });

            // TODO send otp

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }


    static async verifyOTP(req, res) {

        const { username, email, account_type } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {
            
         

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }





    static async validateEmail(email) {
        const user = await Account.findOne({ where: { email: email } });

        return user ? true: false;
    }


    static createSchoolProfile() {
        //TODO
        return Promise.resolve(evenNumber);
    }

    static async createTeacherProfile() {
        //TODO
        return evenNumber;
    }

}

module.exports = AuthController;