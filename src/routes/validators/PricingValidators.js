const { body } = require('express-validator');



module.exports = {

    PricingValidator: [
        body('teachers_price')
            .isFloat({ min: 0 })
            .withMessage('Teachers Price must be a non-negative floating-point number'),

        body('student_price')
            .isFloat({ min: 0 })
            .withMessage('Student Price must be a non-negative floating-point number'),
        body('accounts'),

        body('tab')
            .notEmpty()
            .isString()
            .withMessage('Tab field is required and must be a string'),

        body('students_breakdown')
            .isObject()
            .withMessage('Students Breakdown must be an object'),

        body('students_breakdown.quater')
            .isFloat({ min: 0 })
            .withMessage('Quaterly Student Price must be a non-negative floating-point number'),

        body('students_breakdown.half')
            .isFloat({ min: 0 })
            .withMessage('Half-Year Student Price must be a non-negative floating-point number'),

        body('students_breakdown.yearly')
            .isFloat({ min: 0 })
            .withMessage('Yearly Student Price must be a non-negative floating-point number'),

        body('teachers_breakdown')
            .isObject()
            .withMessage('Teachers Breakdown must be an object'),

        body('teachers_breakdown.quater')
            .isFloat({ min: 0 })
            .withMessage('Quaterly Teacher Price must be a non-negative floating-point number'),

        body('teachers_breakdown.half')
            .isFloat({ min: 0 })
            .withMessage('Half-Year Teacher Price must be a non-negative floating-point number'),

        body('teachers_breakdown.yearly')
            .isFloat({ min: 0 })
            .withMessage('Yearly Teacher Price must be a non-negative floating-point number'),
    ],


    UpdatePricingValidator: [
        body('teachers_price')
            .optional()
            .isNumeric()
            .withMessage('Teachers price must be a number'),

        body('student_price')
            .optional()
            .isNumeric()
            .withMessage('Student price must be a number'),

        body('accounts')
            .optional()
            .isJSON()
            .withMessage('Accounts must be a valid JSON object'),

        body('tab')
            .optional()
            .isString()
            .withMessage('Tab must be a string'),

        body('students_breakdown')
            .optional()
            .isObject()
            .withMessage('Students breakdown must be an object'),

        body('students_breakdown.quater')
            .optional()
            .isNumeric()
            .withMessage('Quarterly price for students must be a number'),

        body('students_breakdown.half')
            .optional()
            .isNumeric()
            .withMessage('Half-year price for students must be a number'),

        body('students_breakdown.yearly')
            .optional()
            .isNumeric()
            .withMessage('Yearly price for students must be a number'),

        body('teachers_breakdown')
            .optional()
            .isObject()
            .withMessage('Teachers breakdown must be an object'),

        body('teachers_breakdown.quater')
            .optional()
            .isNumeric()
            .withMessage('Quarterly price for teachers must be a number'),

        body('teachers_breakdown.half')
            .optional()
            .isNumeric()
            .withMessage('Half-year price for teachers must be a number'),

        body('teachers_breakdown.yearly')
            .optional()
            .isNumeric()
            .withMessage('Yearly price for teachers must be a number'),

        body('id')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('ID field is required and must be a positive integer'),
    ]


}
