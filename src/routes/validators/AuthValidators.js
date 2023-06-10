const { body } = require('express-validator');

/* ----------------------- THIS IS FOR AUTH VALIDATION ---------------------- */
module.exports = {

    SigninValidator: [
        body('email').notEmpty().isString().isEmail().withMessage("email field is required"),
        body('password').notEmpty().isStrongPassword().withMessage("password field is required with strong password"),
    ],

    SignupValidator: [
        body('name').notEmpty().isString().withMessage("name field is required"),
        body('email').notEmpty().isString().isEmail().withMessage("email field is required"),
        body('phone').notEmpty().isLength({ max: 11 }).isNumeric().withMessage("phone field is required"),
        body('account_type').notEmpty().isString().withMessage("account type field is required"),
        body('password').notEmpty().isStrongPassword().withMessage("password field is required"),
    ],

    VerifyAccountValidator: [
        body('email').notEmpty().isString().isEmail().withMessage("email field is required"),
        body('otp').isLength({ max: 6 }).notEmpty().isNumeric().withMessage("otp field with is required"),
    ],

    SendOTPValidator: [
        body('email').notEmpty().isString().isEmail().withMessage("email field required"),
    ],

    ChangePasswordValidator: [
        body('password').notEmpty().isStrongPassword().withMessage("password field is required"),
    ],

    SchoolSetupValidator: [
        body('email').notEmpty().isString().isEmail().withMessage("email field required"),
        body('school_types').isArray().withMessage('School types must be an array.').custom((value) => {
            if (value.length === 0) {
                throw new Error('At least one school type must be selected.');
            }
            if (!value.every((element) => typeof element === 'string')) {
                throw new Error('School type must be a string.');
            }
            return true;
        }),
        body('naming_types').notEmpty().notEmpty().withMessage('Naming types is required.').isString().withMessage('Naming types must be a string.')
    ],




}