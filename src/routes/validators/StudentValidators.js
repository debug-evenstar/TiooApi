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
        body('phone').notEmpty().isLength({ max: 11 }).isNumeric().withMessage("phone field is required"),
        body('password').notEmpty().withMessage("password field is required"),
        body('accountId').notEmpty().isString().withMessage("accountId field is required and its numeric"),
    ],
}