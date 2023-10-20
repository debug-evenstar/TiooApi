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

    BulkStudentValidator : [
        body('email').isEmail()
          .notEmpty()
          .isArray({ min: 1 })
          .withMessage('Email field is required and must be a non-empty array')
          .custom((emails, { req }) => {
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
      ]
}