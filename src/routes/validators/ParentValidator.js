const { body } = require('express-validator');

module.exports = {
    InviteParentValidator: [
        body('name')
            .notEmpty()
            .isString()
            .withMessage('Name field is required and must be a string'),

        body('email')
            .notEmpty()
            .isString()
            .isEmail()
            .withMessage('Email field is required and must be a valid email address'),

        body('account_type')
            .notEmpty()
            .isString()
            .equals('parent')
            .withMessage('Account type field is required and must be "parent"'),

        body('password')
            .optional()
            .isString()
            .isLength({ min: 4 })
            .withMessage('Password must be at least 4 characters long'),

        body('flag')
            .notEmpty()
            .isString()
            .withMessage('Flag field is required and must be a string'),
    ],

    RegisterParentValidator: [
        body('name')
            .notEmpty()
            .isString()
            .withMessage('Name field is required and must be a string'),

        body('email')
            .notEmpty()
            .isString()
            .isEmail()
            .withMessage('Email field is required and must be a valid email address'),

        body('account_type')
            .notEmpty()
            .isString()
            .equals('parent')
            .withMessage('Account type field is required and must be "parent"'),

        body('password')
            .notEmpty()
            .isString()
            .isLength({ min: 4 })
            .withMessage('Password field is required and must be at least 4 characters long'),

        body('flag')
            .notEmpty()
            .isString()
            .withMessage('Flag field is required and must be a string'),
    ]
}