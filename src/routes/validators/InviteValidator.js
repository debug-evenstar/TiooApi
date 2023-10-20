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
    ],
    
    StudentInviteValidator : [
        body('arm')
          .notEmpty()
          .isInt({ min: 1 })
          .withMessage('Arm field is required and must be a positive integer'),
      
        body('schoolId')
          .notEmpty()
          .isInt({ min: 1 })
          .withMessage('School ID field is required and must be a positive integer'),
    ],
    

    AcceptTeacherValidator : [
        body('name')
          .notEmpty()
          .isString()
          .withMessage('Name field is required and must be a string'),
      
        body('email')
          .notEmpty()
          .isString()
          .isEmail()
          .withMessage('Email field is required and must be a valid email address'),
      
        body('phone')
          .notEmpty()
          .isString()
          .isMobilePhone()
          .withMessage('Phone field is required and must be a valid phone number'),
      
        body('account_type')
          .notEmpty()
          .isString()
          .withMessage('Account type field is required and must be a string'),
      
        body('password')
          .notEmpty()
          .isString()
          .isLength({ min: 4 })
          .withMessage('Password field is required and must be at least 4 characters long'),
      
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
    ],
    

    AcceptStudentValidator : [
        body('name')
          .notEmpty()
          .isString()
          .withMessage('Name field is required and must be a string'),
      
        body('email')
          .notEmpty()
          .isString()
          .isEmail()
          .withMessage('Email field is required and must be a valid email address'),
      
        body('phone')
          .notEmpty()
          .isString()
          .isMobilePhone()
          .withMessage('Phone field is required and must be a valid phone number'),
      
        body('password')
          .notEmpty()
          .isString()
          .isLength({ min: 4 })
          .withMessage('Password field is required and must be at least 4 characters long'),
      
        body('account_type')
          .notEmpty()
          .isString()
          .withMessage('Account type field is required and must be a string')
          .equals('student')
          .withMessage('Account type must be "student"'),
      
        body('arm')
          .notEmpty()
          .isInt({ min: 1 })
          .withMessage('Arm field is required'),
      
        body('schoolId')
          .notEmpty()
          .isInt({ min: 1 })
          .withMessage('School ID field is required and must be a positive integer'),
      ]

}