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
                console.log([value,req.file,!req.file, req.body])
                if (req.file == undefined) {
                    throw new Error('Image file is required');
                    return
                }
                console.log(req.file.mimetype)
                
                if (!req.file.mimetype.toLowerCase() == 'image/jpeg') {
                    throw new Error('File must be an image');
                }
                // if (req.file.mimetype.startsWith('image/')) {
                //     throw new Error('File must be an image');
                // }

                return true;
            }),
    ]

}
