const { body } = require('express-validator');

module.exports = {
    CreateSubjectValidator : [
        body('naming')
          .notEmpty()
          .isString()
          .withMessage('Naming field is required and must be a string'),
      
        body('class')
          .notEmpty()
          .isArray({ min: 1 })
          .withMessage('Class field is required and must be a non-empty array')
          .custom((classes, { req }) => {
            const isValid = classes.every(cls => typeof cls === 'number');
            if (!isValid) {
              throw new Error('All elements in the class array must be numbers');
            }
            return true;
          }),
      
        body('classArm')
          .notEmpty()
          .isArray({ min: 1 })
          .withMessage('ClassArm field is required and must be a non-empty array')
          .custom((classArms, { req }) => {
            const isValid = classArms.every(arm => typeof arm === 'number');
            if (!isValid) {
              throw new Error('All elements in the classArm array must be numbers');
            }
            return true;
          }),
      
        body('description')
          .optional()
          .isString()
          .withMessage('Description must be a string'),
      
        body('SchoolManagementId')
          .notEmpty()
          .isInt({ min: 1 })
          .withMessage('SchoolManagementId field is required and must be a positive integer'),
      ]
}