const { body, validationResult } = require('express-validator');

module.exports = {

    CreateClassArm: [
        body('classId')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Class ID field is required and must be a positive integer'),

        body('arms')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Subject ID field is required and must be a positive integer'),
    ],


    UpdateClassArm : [
        body('naming')
          .notEmpty()
          .isString()
          .withMessage('Naming field is required and must be a string'),
    ],

    CreateBulkClassArmValidator : [
        body('classId')
          .notEmpty()
          .isInt({ min: 1 })
          .withMessage('Class ID field is required and must be a positive integer'),
      
        body('arms')
          .notEmpty()
          .isArray({ min: 1 })
          .withMessage('Arms field is required')
          .custom((arms, { req }) => {
            const isValid = arms.every(arm => typeof arm === 'string' && arm != null);
            if (!isValid) {
              throw new Error('All arms must be strings');
            }
            return true;
          }),
      ],
      
    
    
};
