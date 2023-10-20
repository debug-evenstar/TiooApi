const { body } = require('express-validator');

module.exports = {

    InviteTeacherValidator: [
        body('name')
            .optional()
            .isString()
            .withMessage('Name must be a string'),

        body('email')
            .notEmpty()
            .isString()
            .isEmail()
            .withMessage('Email field is required and must be a valid email address'),

        body('account_type')
            .notEmpty()
            .isString()
            .equals('teacher')
            .withMessage('Account type field is required and must be "teacher"'),

        body('password')
            .optional()
            .isString()
            .isLength({ min: 4 })
            .withMessage('Password must be at least 4 characters long'),

        body('flag')
            .notEmpty()
            .isString()
            .withMessage('Flag field is required and must be a string'),

        body('classes')
            .notEmpty()
            .isArray({ min: 1 })
            .withMessage('Classes field is required and must be a non-empty array')
            .custom((classes, { req }) => {
                const isValid = classes.every(cls => typeof cls === 'number');
                if (!isValid) {
                    throw new Error('All elements in the classes array must be numbers');
                }
                return true;
            }),

        body('Subjects')
            .notEmpty()
            .isArray({ min: 1 })
            .withMessage('Subjects field is required and must be a non-empty array')
            .custom((subjects, { req }) => {
                const isValid = subjects.every(subj => typeof subj === 'number');
                if (!isValid) {
                    throw new Error('All elements in the Subjects array must be numbers');
                }
                return true;
            }),

        body('schoolId')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('School ID field is required and must be a positive integer'),
    ],

    AcceptTeacherValidator: [
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

        body('account_type')
            .notEmpty()
            .isString()
            .equals('teacher')
            .withMessage('Account type field is required and must be "teacher"'),

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

    UnAssignSubjectTeacherValidator: [
        body('teacher')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Teacher field is required and must be a positive integer'),

        body('subject')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Subject field is required and must be a positive integer'),
    ],

    UnAssignSubjectTeacherValidator: [
        body('teacher')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Teacher field is required and must be a positive integer'),

        body('subject')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Subject field is required and must be a positive integer'),
    ]
}

