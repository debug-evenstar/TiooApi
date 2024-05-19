const { body } = require('express-validator');

/* ----------------------- THIS IS FOR SUBJECT VALIDATION ---------------------- */

module.exports = {

    Subject: [
        body('name').notEmpty().isString().withMessage("Name field is required"),
        body('description').isString().withMessage("Description must be a string"),
        body('default').isBoolean().withMessage("Default must be true or false"),
        body('classes').isArray().notEmpty().withMessage("At least one class must be enrolled"),
        body('classArms').isArray().withMessage("List of class arms required"),
    ],
}

