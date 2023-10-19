const { body, validationResult } = require('express-validator');

/* ----------------------- THIS IS FOR STUDENT VALIDATION ---------------------- */

module.exports = {


    CreateClass: [
        body('type').notEmpty().isString().withMessage('Type field is required and must be a string'),
        body('naming').notEmpty().isString().withMessage('Naming field is required and must be a string'),
        body('school_id').notEmpty().isInt({ min: 1 }).withMessage('School ID field is required '),
    ],

    BulkCreateClass: [
        body()
            .isArray()
            .withMessage('Input must be an array'),
        body('*')
            .isObject()
            .withMessage('Each element in the array must be an object'),

        body('*')
            .custom(obj => {
                if (!obj.hasOwnProperty('type') || typeof obj.type !== 'string') {
                    throw new Error('Each object in the array must have a "type" property as a string.');
                }
                if (!obj.hasOwnProperty('naming') || typeof obj.naming !== 'string') {
                    throw new Error('Each object in the array must have a "naming" property as a string.');
                }
                if (!obj.hasOwnProperty('school_id') || !Number.isInteger(obj.school_id) || obj.school_id < 1) {
                    throw new Error('Each object in the array must have a "school_id" property as a positive integer.');
                }
                return true;
            }),
    ],

    ClassArmTeacherValidator: [
        body('arm')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Arm field is required and must be a positive integer'),

        body('teacher_id')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Teacher ID field is required and must be a positive integer'),
    ],

    ClassAddSubjectValidator: [
        body('classId')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Class ID field is required and must be a positive integer'),

        body('subjectId')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Subject ID field is required and must be a positive integer'),
    ],

    UpdateClassValidator: [
        body('type')
            .notEmpty()
            .isString()
            .withMessage('Type field is required and must be a string'),

        body('naming')
            .notEmpty()
            .isString()
            .withMessage('Naming field is required and must be a string'),
    ],

    AddStudentToClassValidator:
        [
            body('arm')
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('Arm field is required and must be a positive integer'),

            body('student_id')
                .notEmpty()
                .isInt({ min: 1 })
                .withMessage('Student ID field is required and must be a positive integer'),
        ]

}
