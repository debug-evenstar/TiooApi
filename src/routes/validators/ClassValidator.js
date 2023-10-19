const { body, validationResult } = require('express-validator');

/* ----------------------- THIS IS FOR STUDENT VALIDATION ---------------------- */

module.exports = {


    CreateClass: [
        body('type').notEmpty().isString().withMessage('Type field is required and must be a string'),
        body('naming').notEmpty().isString().withMessage('Naming field is required and must be a string'),
        body('school_id').notEmpty().isInt({ min: 1 }).withMessage('School ID field is required '),
    ],

     BulkCreateClass : [
        body()
          .isArray()
          .withMessage('Input must be an array'),
        body('*')
          .isObject()
          .withMessage('Each element in the array must be an object'),
      
        body('*')
          .custom(obj => {
            if (!obj.hasOwnProperty('type') || typeof obj.type !== 'string') {
              throw new Error('Each object in the array must have a "type" property as a string.');
            }
            if (!obj.hasOwnProperty('naming') || typeof obj.naming !== 'string') {
              throw new Error('Each object in the array must have a "naming" property as a string.');
            }
            if (!obj.hasOwnProperty('school_id') || !Number.isInteger(obj.school_id) || obj.school_id < 1) {
              throw new Error('Each object in the array must have a "school_id" property as a positive integer.');
            }
            return true;
          }),
      ],


    // BulkClassValidator: () => {
    //     console.log("classList")
    //     return [

    //         (req, res, next) => {
    //             console.log("classList")

    //             const classList = req.body;

    //             if (!Array.isArray(classList)) {
    //                 return res.status(400).json({ error: 'class list should be an array' });
    //             }
    //             const validateClass = classList.map((element) => {
    //                 return Promise.all([
    //                     body('type').notEmpty().isString().withMessage('Type field is required and must be a string').run(element),
    //                     body('naming').notEmpty().isString().withMessage('Naming field is required and must be a string').run(element),
    //                     body('school_id').notEmpty().withMessage('School ID field is required').withMessage('School ID is required').run(element),
    //                 ]);
    //             });

    //             // Promise.all(validateClass)
    //             //     .then(() => {
    //             //         const errors = validationResult(req);

    //             //         if (!errors.isEmpty()) {
    //             //             return res.status(400).json({ errors: errors.array() });
    //             //         }

    //             //         next();
    //             //     })

    //             // for (const element of classList) {
    //             //     body('type').notEmpty().isString().withMessage('Type field is required and must be a string').run(element);
    //             //     body('naming').notEmpty().isString().withMessage('Naming field is required and must be a string').run(element);
    //             //     body('school_id').notEmpty().withMessage('School ID field is required').run(element);
    //             // }

    //             // next();
    //         },
    //     ];
    // },


    UpdateClassValidator: [
        body('type')
            .notEmpty()
            .isString()
            .withMessage('Type field is required and must be a string'),

        body('naming')
            .notEmpty()
            .isString()
            .withMessage('Naming field is required and must be a string'),
    ],

}
