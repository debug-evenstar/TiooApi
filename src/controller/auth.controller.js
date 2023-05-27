const { validationResult } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation } = require('../model/database');

class AuthController {

    /*-----------------------------------| CREATE ACCOUNT |-----------------------------------*/

    static async createAccount(req, res) {

        const otp = Math.floor(Math.random() * 900000) + 100000;
        const { email } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const emailExist = await AuthController.validateEmail(email);

            if (emailExist.pass) {
                return res.status(ResponseStatus.code.conflict).json({
                    error: true, message:
                        ResponseStatus.fail.account_conflict
                });
            }

            const registeredAccount = await Account.create(req.body);
            const newValidation = await Validation.create({ otp });
            const response = await registeredAccount.setValidation(newValidation);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.register,
                data: response
            });

            // TODO send otp

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| VERIFY ACCOUNT |-----------------------------------*/

    static async verifyAccount(req, res) {

        const { otp, email, } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const registerdAccount = await Account.findOne({ where: { email: email } });

            if (!registerdAccount) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found
                });
            }

            const setValidation = await Validation.findOne({ where: { accountId: registerdAccount.dataValues.id } });

            const isValidOTP = await setValidation.compareOTP(otp);

            const isExpired = await setValidation.compareExpiryDate();

            if (isExpired) {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.expired_token });
            }

            if (!isValidOTP) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.incorrect_otp });
            }

            await registerdAccount.update({ verification_status: 1, });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.verify });


        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------| RESEND VERIFICATION OTP |-----------------------------*/

    static async resendVerificationOTP(req, res) {

        const { email } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const emailExist = await AuthController.validateEmail(email);

            if (!emailExist.pass) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.not_found });
            }

            const AccountId = emailExist.data.id;

            await AuthController.sendOTP(AccountId);

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.resend_otp });


        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*---------------------------------| VALIDATE EMAIL |---------------------------------*/

    static async validateEmail(email) {

        const user = await Account.findOne({ where: { email: email } });

        return user ? { pass: true, data: user.dataValues } : { pass: false, data: {} };
    }

    /*------------------------------------| SEND OTP  |------------------------------------*/

    static async sendOTP(AccountId) {

        const otp = Math.floor(Math.random() * 900000) + 100000;
        const resetValidation = await Validation.findOne({ where: { accountId: AccountId } });

        resetValidation.otp = otp;

        await resetValidation.save();

        // TODO send otp

        return;
    }





}

module.exports = AuthController;