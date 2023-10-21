const { body } = require('express-validator');
const multer = require('multer');

const upload = multer();

module.exports = {
    LessonValidator: [
        body('class')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Class field is required and must be a positive integer'),

        body('age')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Age field is required and must be a positive integer'),

        body('name')
            .notEmpty()
            .isString()
            .withMessage('Name field is required and must be a string'),

        body('description')
            .notEmpty()
            .isString()
            .withMessage('Description field is required and must be a string'),

        body('category')
            .notEmpty()
            .isInt({ min: 1 })
            .withMessage('Category field is required and must be a positive integer'),


        body('file')
            .custom((value, { req }) => {
                //    console.log([value, req.file, !req.file, req.body])
                if (req.file == undefined) {
                    throw new Error('Image file is required');
                    return
                }
                // console.log(req.file.mimetype)

                if (!req.file.mimetype.toLowerCase() == 'image/jpeg') {
                    throw new Error('File must be an image');
                }
                // if (req.file.mimetype.startsWith('image/')) {
                //     throw new Error('File must be an image');
                // }

                return true;
            }),
    ],

    CreateLessonValidator: [
        body('topic')
            .notEmpty()
            .isString()
            .withMessage('Topic field is required and must be a string'),

        body('duration')
            .notEmpty()
            .isString()
            .withMessage('Duration field is required and must be a string'),

        body('curriculumn')
            .isString()
            .optional()
            .withMessage('Curriculumn must be a string'),

        body('subject')
            .notEmpty()
            .isString()
            .withMessage('Subject field is required and must be a string'),

        body('start_date')
            .isString()
            .optional()
            .withMessage('Start Date must be a string'),

        body('end_date')
            .isString()
            .optional()
            .withMessage('End Date must be a string'),

        body('objective')
            .isString()
            .optional()
            .withMessage('Objective must be a string'),

        body('additional_instruction')
            .isString()
            .optional()
            .withMessage('Additional Instruction must be a string'),

        body('week')
            .notEmpty()
            .isString()
            .withMessage('Week field is required and must be a string'),

        body('status')
            .notEmpty()
            .isString()
            .withMessage('Status field is required and must be a string'),

        body('term')
            .notEmpty()
            .isString()
            .withMessage('Term field is required and must be a string'),

        body('class')
            .notEmpty()
            .isString()
            .withMessage('Class field is required and must be a string'),

        body('class_arms')
            .isString()
            .custom((value) => {
                console.log(typeof JSON.parse(value))
               
                console.log(typeof JSON.parse(value).length)
                if (JSON.parse(value).length === 0) {
                    throw new Error('At least one class arm must be selected');
                }
                return true;
            }
            ),

        body('file')
            .custom((files, { req }) => {
                if (req.files == undefined) {
                    throw new Error('Image file is required');
                    return
                }

                if (!Array.isArray(req.files)) {
                    throw new Error('Files must be an array');
                }

                for (const file of req.files) {
                    if (!file.mimetype.startsWith('image/')) {
                        throw new Error('All files must be images');
                    }
                }

                return true;
            }),


    ]

}
