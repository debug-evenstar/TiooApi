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
    ]


}
