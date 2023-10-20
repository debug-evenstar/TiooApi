const { body } = require('express-validator');

/* ----------------------- THIS IS FOR STUDENT VALIDATION ---------------------- */

module.exports = {
    InviteValidator: [
        body('name').notEmpty().isString().withMessage("name field is required"),
        body('email').notEmpty().isString().isEmail().withMessage("email field is required"),
        body('arm').notEmpty().isNumeric().withMessage("arm field is required and its numberic"),
        body('schoolId').notEmpty().isNumeric().withMessage("schoolId field is required and its numeric"),
    ],

    AcceptValidator: [
        body('name').notEmpty().isString().withMessage("name field is required"),
        body('phone').notEmpty().isLength({ max: 22 }).isNumeric().withMessage("phone field is required"),
        body('password').notEmpty().withMessage("password field is required"),
        body('accountId').notEmpty().isString().withMessage("accountId field is required and its numeric"),
    ],

    BulkStudentValidator: [
        body('email').isEmail()
            .notEmpty()
            .isArray({ min: 1 })
            .withMessage('Email field is required and must be a non-empty array')
            .custom((emails, { req }) => {
                console.log(req.body)
                const isValid = emails.every(email => typeof email === 'string');
                if (!isValid) {
                    throw new Error('All elements in the email array must be valid email addresses');
                }
                return true;
            }),

        body('arm')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Arm field is required and must be a positive integer'),
    ],


    AcceptInviteStudentValidator: [
        body('name')
            .notEmpty()
            .isString()
            .withMessage('Name field is required and must be a string'),

        body('phone')
            .notEmpty()
            .isString()
            .isMobilePhone()
            .withMessage('Phone field is required and must be a valid phone number'),

        body('password')
            .notEmpty()
            .isString()
            .isLength({ min: 4 })
            .withMessage('Password field is required and must be at least 4 characters long'),

        body('accountId')
            .notEmpty()
            .isString()
            .withMessage('Account ID field is required and must be a string'),
    ],


    ParentSignupValidator1: [
        body('name')
            .notEmpty()
            .isString()
            .withMessage('Name field is required and must be a string'),

        body('email')
            .notEmpty()
            .isString()
            .isEmail()
            .withMessage('Email field is required and must be a valid email address'),

        body('phone')
            .notEmpty()
            .isString()
            .isMobilePhone()
            .withMessage('Phone field is required and must be a valid phone number'),

        body('password')
            .notEmpty()
            .isString()
            .isLength({ min: 4 })
            .withMessage('Password field is required and must be at least 4 characters long'),

        body('account_type')
            .notEmpty()
            .isString()
            .equals('student')
            .withMessage('Account type field is required and must be "student"'),
    ],
    ParentValidator: [
        body('token')
            .notEmpty()
            .isString()
            .withMessage('Token field is required and must be a string'),

        body('parent')
            .notEmpty()
            .isString()
            .withMessage('Parent field is required and must be a string'),

        body('class')
            .notEmpty()
            .isString()
            .withMessage('Class field is required and must be a string'),

        body('school')
            .notEmpty()
            .isString()
            .withMessage('School field is required and must be a string'),

        body('age')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Age field is required and must be a positive integer'),
    ]
}