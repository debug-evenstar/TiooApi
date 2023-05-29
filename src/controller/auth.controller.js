const { validationResult } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, TempValidation } = require('../model/database');
const TokenMiddleware = require('../middleware/token.middleware');

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
                message: ResponseStatus.pass.register
            });

        } catch (error) {
            console.log(error);
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
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------| RESEND VERIFICATION OTP |-----------------------------*/

    static async requestVerificationOTP(req, res) {

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

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.send_otp });


        } catch (error) {
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

        console.log(otp);

        await resetValidation.save();

        // TODO send otp

        return;
    }

    /*------------------------------------| VERIFY OTP |------------------------------------*/

    static async verifyOTP(req, res) {

        const { otp, email, } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const emailExist = await AuthController.validateEmail(email);

            if (!emailExist.pass) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const validation = await Validation.findOne({ where: { accountId: emailExist.data.id } });

            const isValidOTP = await validation.compareOTP(otp);

            const isExpired = await validation.compareExpiryDate();

            if (isExpired) {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.expired_token });
            }

            if (!isValidOTP) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.incorrect_otp });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.verify, data: { email: emailExist.data.email } });


        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| SIGNIN ACCOUNT |-----------------------------------*/

    static async signInAccount(req, res) {

        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const user = await Account.findOne({ where: { email: email } });

            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.login });
            }

            const isValidPassword = await user.comparePassword(password)

            const isVerifedUser = user.dataValues.verification_status;

            if (!isValidPassword) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.login });
            }

            if (isVerifedUser === 0) {
                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.verify });
            }

            const userData = {
                id: user.dataValues.id,
                email: user.dataValues.email,
                account_type: user.dataValues.account_type,
            };

            const generatedToken = TokenMiddleware.generate(userData)

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.login, data: {}, token: generatedToken });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }


    /*-----------------------------------| FETCH ALL ACCOUNTS |-----------------------------------*/

    static async accounts(req, res) {

        try {

            const users = await Account.findAll({ attributes: { exclude: ['password'], include: '' } });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: users });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| FETCH ACCOUNT BY ID |-----------------------------------*/

    static async accountByID(req, res) {

        const id = req.params.id;

        try {

            const user = await Account.findByPk(id, { attributes: { exclude: ['password', 'createdAt'], include: '' } });

            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: user });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| FETCH ACCOUNT AS PROFILE |-----------------------------------*/

    static async accountProfile(req, res) {

        const { id } = req.userData;

        try {

            const user = await Account.findByPk(id, { attributes: { exclude: ['password', 'createdAt'], include: '' } });

            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: user });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }


    /*-----------------------------------| UPDATE ACCOUNT |-----------------------------------*/

    static async updateAccount(req, res) {

        const { id } = req.userData;
        delete req.body.email;

        try {

            const user = await Account.findByPk(id);

            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            await user.update(req.body, { exclude: ['password'] });

            console.log(user);

            const { name, email, phone, account_type, verification_status, flag } = user;

            const response = { name, email, phone, account_type, verification_status, flag };

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }



    /*-----------------------------------| UPDATE ACCOUNT |-----------------------------------*/

    static async updateAccountById(req, res) {

        const id = req.params.id;
        delete req.body.email;
        delete req.verification_status;
        try {

            const user = await Account.findByPk(id, { attributes: { exclude: ['password', 'createdAt'], include: '' } });

            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            await user.update(req.body, { exclude: ['password', 'verification_status'] });

            console.log(user);

            const { name, email, phone, account_type, verification_status, flag } = user;

            const response = { name, email, phone, account_type, verification_status, flag };

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: response });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }


    /*-----------------------------------| DELETE ACCOUNT |-----------------------------------*/

    static async deleteAccount(req, res) {

        const id = req.params.id;

        try {

            const user = await Account.findByPk(id);

            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const response = await user.destroy();

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.delete, data: {} });


        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }


    /*-----------------------------------| FLAG ACCOUNT |-----------------------------------*/

    static async flagAccount(req, res) {

        const { id, flag } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const user = await Account.findByPk(id);

            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const response = await user.update({ flag: flag });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: {} });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| CHANGE ACCOUNT |-----------------------------------*/

    static async changePassword(req, res) {

        const { email, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const user = await Account.findOne({ where: { email: email } });

            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const hashPassword = await user.hashPassword(password);
            const response = await user.update({ password: hashPassword });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update, data: {} });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error x' });
        };

    }

    /*-----------------------------------| SEND TEMP. OTP |-----------------------------------*/

    static async sendTempOTP(req, res) {

        const { email } = req.body;
        const errors = validationResult(req);
        const otp = Math.floor(Math.random() * 900000) + 100000;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const availability = await TempValidation.findOne({ where: { email: email } });

            if (!availability) {
                const tempUser = new TempValidation();
                tempUser.email = email;
                tempUser.otp = otp;
                const response = await tempUser.save();
                console.log(otp);
                return res.status(ResponseStatus.code.success).json({ error: true, message: ResponseStatus.pass.send_otp });
            }

            availability.otp = otp;

            await availability.save();
            console.log(otp);

            return res.status(ResponseStatus.code.success).json({ error: true, message: ResponseStatus.pass.send_otp });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error x' });
        };

    }

  /*-----------------------------------| VALIDATE TEMP. OTP |-----------------------------------*/

    static async verifyTempEmail(req, res) {

        const { email, otp } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const availability = await TempValidation.findOne({ where: { email: email } });

            if (!availability) {

                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }

            const isValidOTP = await availability.compareOTP(otp);

            const isExpired = await availability.compareExpiryDate();

            if (isExpired) {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.expired_token });
            }

            if (!isValidOTP) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.incorrect_otp });
            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.verify });


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error x' });
        };

    }x



}

module.exports = AuthController;