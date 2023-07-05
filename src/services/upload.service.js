const multer = require('multer');

class UploadService {

    static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/lessons/');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const fileExtension = file.originalname.split('.').pop();
            console.log(fileExtension)
            cb(null, `${uniqueSuffix}.${fileExtension}`);
        },
    });

    static upload = multer({ storage: UploadService.storage });
}

module.exports = UploadService;