const { body } = require('express-validator');

/* ----------------------- THIS IS FOR STUDENT VALIDATION ---------------------- */

module.exports = {
    ClassRemoveValidator: [
        body('classId').notEmpty().isString().withMessage('Class ID field is required and must be a string'),
    ],
}