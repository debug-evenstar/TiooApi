const { body } = require('express-validator');

/* ----------------------- THIS IS FOR STUDENT VALIDATION ---------------------- */

module.exports = {
    SchoolClassRemoveValidator: [
        body('classId').notEmpty().isString().withMessage('Class ID field is required and must be a string'),
    ],

    // UpdateClassValidator: [
    //     body('type')
    //         .notEmpty()
    //         .isString()
    //         .withMessage('Type field is required and must be a string'),

    //     body('naming')
    //         .notEmpty()
    //         .isString()
    //         .withMessage('Naming field is required and must be a string'),
    // ],

}
