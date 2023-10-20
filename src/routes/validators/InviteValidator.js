const { body, validationResult } = require('express-validator');

module.exports = {
    TeacherInviteValidator : [
        body('account_type')
          .notEmpty()
          .isString()
          .withMessage('Account type field is required and must be a string'),
      
        body('classes')
          .notEmpty()
          .isArray({ min: 1 })
          .withMessage('Classes field is required and must be a non-empty array')
          .custom((classes, { req }) => {
            const isValid = classes.every(cls => typeof cls === 'number');
            if (!isValid) {
              throw new Error('All classes must be numbers');
            }
            return true;
          }),
      
        body('subjects')
          .notEmpty()
          .isArray({ min: 1 })
          .withMessage('Subjects field is required and must be a non-empty array')
          .custom((subjects, { req }) => {
            const isValid = subjects.every(subj => typeof subj === 'number');
            if (!isValid) {
              throw new Error('All subjects must be numbers');
            }
            return true;
          }),
      
        body('schoolId')
          .notEmpty()
          .isInt({ min: 1 })
          .withMessage('School ID field is required and must be a positive integer'),
      ]

}