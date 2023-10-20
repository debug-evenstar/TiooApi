const { body } = require('express-validator');





module.exports = {

    CreateAdminValidator :[
        body('role')
          .notEmpty()
          .isString()
          .withMessage('Role field is required and must be a string'),
      
        body('position')
          .notEmpty()
          .isString()
          .withMessage('Position field is required and must be a string'),
      
        body('permissions')
          .notEmpty()
          .isArray()
          .withMessage('Permissions field is required and must be an array'),
      
        body('permissions.*')
          .isInt({ min: 1 })
          .withMessage('Each permission ID in the array must be a positive integer'),
      
        body('name')
          .notEmpty()
          .isString()
          .withMessage('Name field is required and must be a string'),
      
        body('email')
          .notEmpty()
          .isEmail()
          .withMessage('Email field is required and must be a valid email address'),
    ],

    
    

};
