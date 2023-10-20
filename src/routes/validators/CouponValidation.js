const { body, validationResult } = require('express-validator');

module.exports = {

    CreateCouponValidator: [
        body('campaign')
            .notEmpty()
            .isString()
            .withMessage('Campaign field is required and must be a string'),

        body('code')
            .notEmpty()
            .isString()
            .withMessage('Code field is required and must be a string'),

        body('status')
            .notEmpty()
            .isString()
            .withMessage('Status field is required and must be a string'),

        body('amount')
            .notEmpty()
            .isNumeric()
            .withMessage('Amount field is required and must be a number'),

        body('users')
            .notEmpty()
            .isArray()
            .withMessage('Users field is required and must be an array'),

        body('users.*')
            .isInt({ min: 1 })
            .withMessage('Each user ID in the array must be a positive integer'),
    ],

    UpdateCouponValidator : [
        body('campaign')
          .notEmpty()
          .isString()
          .withMessage('Campaign field is required and must be a string'),
      
        body('code')
          .notEmpty()
          .isString()
          .withMessage('Code field is required and must be a string'),
      
        body('status')
          .notEmpty()
          .isString()
          .withMessage('Status field is required and must be a string'),
      
        body('amount')
          .notEmpty()
          .isNumeric()
          .withMessage('Amount field is required and must be a number'),
      
        body('users')
          .notEmpty()
          .isArray()
          .withMessage('Users field is required and must be an array'),
      
        body('users.*')
          .isInt({ min: 1 })
          .withMessage('Each user ID in the array must be a positive integer'),
      ]

}