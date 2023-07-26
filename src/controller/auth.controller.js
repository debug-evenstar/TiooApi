const { validationResult } = require('express-validator');
const ResponseStatus = require('../config/message.config');
const { Account, Validation, TempValidation, Teacher, SchoolManagement } = require('../database/connection');
const TokenMiddleware = require('../middleware/token.middleware');
const Mailer = require('../services/mailer');
require('dotenv').config();
const { scryptSync, randomBytes, } = require('crypto');

const crypto = require('crypto');
const { link } = require('fs');
const { MD5 } = require('crypto-js');
const { log } = require('console');

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

            // Create school record if account type is school
            if(req.body.account_type === "school"){
                const registeredSchoolManagement = await SchoolManagement.create({
                    school_name : req.body.name
                });
    
                await registeredAccount.setSchoolManagement(registeredSchoolManagement);
            }

            if(req.body.account_type === "freelancer"){
                const registeredSchoolManagement = await SchoolManagement.create({
                    school_name : req.body.name,
                    school_types: '[Custome]',
                    naming_types: 'C'
                });
    
                await registeredAccount.setSchoolManagement(registeredSchoolManagement);
            }


            const userData = {
                id: registeredAccount.dataValues.id,
                email: registeredAccount.dataValues.email,
                account_type: registeredAccount.dataValues.account_type,
            };

            const generatedToken = TokenMiddleware.generate(userData)

            await AuthController.sendVerificationEmail(registeredAccount);

            return res.status(ResponseStatus.code.success).json({
                error: false,
                message: ResponseStatus.pass.register,
                token: generatedToken,
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        };

    }

    /*-----------------------------------| VERIFY ACCOUNT |-----------------------------------*/

    static async verifyAccount(req, res) {

        const { token } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {
            const validation = await Validation.findOne({ where : { token } });

            if(!validation){
                return res.status(ResponseStatus.code.forbidden).json({
                    error: true,
                    message: ResponseStatus.fail.forbidden
                });
            }

            const registerdAccount = await Account.findOne({ where: { id: validation.accountId } });

            if (!registerdAccount) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found
                });
            }

            const isExpired = await validation.compareExpiryDate();

            const isTokenValid = await validation.isTokenValid(token);

            if (isExpired) {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.expired_token });
            }

            if (!isTokenValid) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.forbidden });
            }

            await registerdAccount.update({ verification_status: 1, status: 'verified' });

            return res.status(ResponseStatus.code.success).json({ error: false, data: registerdAccount,message: ResponseStatus.pass.verify });


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

        Mailer().to(email).from(process.env.MAIL_FROM, "Praxeum").subject("OTP").template("emails.OTPTempEmail", { code: otp }).send();

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
            const user = await Account.findOne({ where: { email: email }, include: [SchoolManagement]});
            if (!user) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.login });
            }
          
            if (user.flag === 'invited') {
                return res.status(ResponseStatus.code.unauthorized).json({ error: true, message: ResponseStatus.fail.invite });
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

            const payload  = {
                AccountId: user.id,
                name: user.name,
                email: user.email,
                status: user.status ? user.status : "undefined",
                phone: user.phone,
                account_type: user.account_type,
                verification_status: user.verification_status,
                flag: user.flag,
            }

            if(user.account_type === "school"){
                payload.school = user.SchoolManagement.school_name;
                payload.redirect = "https://dashboard.tioo.ng";
            }

            if (user.account_type === "teacher") {
                const profile = await user.getTeacher();
                payload.profileId = profile.id;
                payload.teacher_type = profile.teacher_type;
                payload.schoolManagement = profile.SchoolManagementId;
                payload.redirect = "https://dashboard.tioo.ng";

              }else if(user.account_type === 'student'){
                
                const profile  = await user.getStudent(); 
                const schoolManagementId = profile.SchoolManagementId;
                
                const studentSchool = await SchoolManagement.findByPk(schoolManagementId);
                const studentSchoolAccount = await studentSchool.getAccount();
                const classData = await profile.getClass();
                const studentSubject = await classData.getSubjects();
                
                payload.schoolName = studentSchoolAccount.name;
                payload.studentClass =  classData.naming;
                payload.subjectsCount = studentSubject.length;
                payload.term = "undefined";
                payload.redirect = "https://student.tioo.ng";

                payload.status = payload.flag === 'active' ? "On Track" : "??";
              }else{

                payload.admin = user.admin;
              }
              
            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.login, profile: payload, token: generatedToken });


        } catch (error) {
            console.log(error)
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

            const payload = {...user.dataValues};

            if(payload.account_type === 'student'){

                const profile  = await user.getStudent(); 
                const schoolManagementId = profile.SchoolManagementId;
                
                const studentSchool = await SchoolManagement.findByPk(schoolManagementId);
                const studentSchoolAccount = await studentSchool.getAccount();
                const classData = await profile.getClass();
                const studentSubject = await classData.getSubjects();
                
                payload.schoolName = studentSchoolAccount.name;
                payload.studentClass =  classData.naming;
                payload.subjectsCount = studentSubject.length;
                payload.term = "undefined";

                payload.status = payload.flag === 'active' ? "On Track" : "??";

            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        };

    }



    /*-----------------------------------| ACCOUNT EXIST |-----------------------------------*/

    static async accountExist(req, res) {

        const email = req.params.email;

        try {

            const emailExist = await AuthController.validateEmail(email);

            if (!emailExist.pass) {

                return res.status(ResponseStatus.code.not_found).json({ error: false, message: ResponseStatus.fail.no_user, data: false });
            }
            

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: true });

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

            const payload = {...user.dataValues};

            if(payload.account_type === 'student'){

                const profile  = await user.getStudent(); 
                const schoolManagementId = profile.SchoolManagementId;
                
                const studentSchool = await SchoolManagement.findByPk(schoolManagementId);
                const studentSchoolAccount = await studentSchool.getAccount();
                const classData = await profile.getClass();
                const studentSubject = await classData.getSubjects();
                
                payload.schoolName = studentSchoolAccount.name;
                payload.studentClass =  classData.naming;
                payload.subjectsCount = studentSubject.length;
                payload.term = "undefined";

                payload.status = payload.flag === 'active' ? "On Track" : "??";

            }

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.read, data: payload });

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

        const { token, password } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const validationInstance = await Validation.findOne({where: {otp: token}});

            if(!validationInstance){
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.bad_request });
            }

            

            const user = await validationInstance.getAccount();

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
                return res.status(ResponseStatus.code.success).json({ error: true, message: ResponseStatus.pass.send_otp });
            }

            availability.otp = otp;

            await availability.save();

            Mailer().to(email).from(process.env.MAIL_FROM, "Praxeum").subject("OTP").template("emails.OTPTempEmail", { code: otp }).send();

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

    }

    /* ------------------------------ RESET PASWORD ----------------------------- */

    static async resetPassword(req, res) {
        function generateRandomPassword(length) {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let password = '';

            for (let i = 0; i < length; i++) {
                let randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }

            return password;
        }
        const random_hash = generateRandomPassword(6);

        const data = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const account = await Account.findOne({ where: { email: data.email } });
            if (!account) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.no_user });
            }
            let validation;
            validation = await Validation.findOne({ where: { accountId: account.id } });

            if (!validation) {
                const newValidation = await Validation.create({ otp: random_hash });
                validation = await account.setValidation(newValidation);
            } else {
                const newValidation = await validation.update({ otp: random_hash });
            }

            const link = `${process.env.DEV}/new-password/${validation.otp}/${account.email}`;

            Mailer().to(account.email).from(process.env.MAIL_FROM, "Praxeum").subject("Reset Passord").template("emails.RestPassword", { resetLink: link }).send();
            
            console.log(link);
            
            return res.status(ResponseStatus.code.success).json({
                error: false, message: ResponseStatus.pass.sucess,
                response: ResponseStatus.pass.reset
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }




    }

    /* -------------------------- VERIFY RESET PASSWORD ------------------------- */

    static async verifyResetPassword(req, res) {
        const data = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {
            const account = await Account.findOne({ where: { email: data.email } });

            if (!account) {
                return res.status(ResponseStatus.code.not_found).json({
                    error: true,
                    message: ResponseStatus.fail.not_found
                });
            }

            const validation = await Validation.findOne({ where: { accountId: account.id } });

            const isCodeValid = await validation.compareOTP(data.code);

            const isExpired = await validation.compareExpiryDate();

            if (isExpired) {
                return res.status(ResponseStatus.code.bad_request).json({ error: true, message: ResponseStatus.fail.expired_token });
            }

            if (!isCodeValid) {
                return res.status(ResponseStatus.code.not_found).json({ error: true, message: ResponseStatus.fail.incorrect_otp });
            }

            const hashPassword = await account.hashPassword(data.password);

            const response = await account.update({ password: hashPassword });

            return res.status(ResponseStatus.code.success).json({ error: false, message: ResponseStatus.pass.update });



        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server Error' });
        }
    }



    /*-----------------------------------| CHANGE ACCOUNT |-----------------------------------*/

    static async resetAuthPassword(req, res) {

        const { password } = req.body;
        const errors = validationResult(req);
        const {id} = req.userData;

        if (!errors.isEmpty()) {
            return res.status(ResponseStatus.code.bad_request).json({ errors: errors.array() });
        }

        try {

            const user = await Account.findByPk(id);

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


    static async sendVerificationEmail(account){

        const expiry = (new Date(Date.now() + 30 * 60 * 1000));
        const hash = MD5(account.id + expiry).toString();
        const tokenRecord = await Validation.findOne({ where: { accountId: account.id } });

        if (!tokenRecord) {
            const validate = new Validation();
            validate.accountId = account.id
            validate.token = hash
            validate.expires_at = expiry;
            const response = await validate.save();
        }

        tokenRecord.token = hash;
        tokenRecord.expires_at = expiry;

        await tokenRecord.save();

        const link = `${process.env.WEB_URL}/account/verify/${hash}`;

        console.log(link);

        Mailer().to(account.email).from(process.env.MAIL_FROM, "Praxeum").subject("Verify Email").template("emails.VerificationEmail", { link }).send();
    }


}

module.exports = AuthController;