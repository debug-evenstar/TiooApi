const multer = require('multer');
var fs = require('fs');

class UploadService {

    static createStorage (storageLocation) {
        UploadService.verifyStorageLocation(storageLocation);
        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, storageLocation );
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const fileExtension = file.originalname.split('.').pop();
                cb(null, `${uniqueSuffix}.${fileExtension}`);
            },
        });
    }

    static verifyStorageLocation (location) {
        if (!fs.existsSync(location)){
            fs.mkdirSync(location, { recursive: true });
        }
    }

    static uploadLesson = multer({ storage: UploadService.createStorage('public/lessons')});

    static uploadDisplayPicture = multer({ storage: UploadService.createStorage('public/profile')});

    static uploadLessonTemplate = multer({ storage: UploadService.createStorage('public/templates/lessons')});

    static uploadTemplateImage = multer({ storage: UploadService.createStorage('public/templates/images')});
}

module.exports = UploadService;