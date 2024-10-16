const multer = require('multer');
const express = require('express');
var fs = require('fs');
const Constants = require('../utils/constants');

class UploadService {

    static allowedDocMimeTypes = ['application/pdf'];
    static allowedImageMimeTypes = ['image/png', 'image/jpg'];

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

    static createFileFilter(req, file, callback) {
        if (file.fieldname === Constants.LESSON_SG_FILE_UPLOAD_FIELDNAME) {
            if (UploadService.allowedDocMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const error = new Error(`Unsupported file type. Supported file types are ${UploadService.allowedDocMimeTypes.join}.`)
                callback(error);
            }
        }
        if (file.fieldname === Constants.ILLUSTRATIONS_FILE_UPLOAD_FIELDNAME) {
            if (UploadService.allowedImageMimeTypes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                const error = new Error(`Unsupported file type. Supported file types are ${UploadService.allowedDocMimeTypes.join}.`)
                callback(error);
            }
        }
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

    static uploadLessonContentPDF = multer( { storage: UploadService.createStorage(Constants.LESSON_PDF_FILE_LOCATION), fileFilter: UploadService.createFileFilter});

    static uploadIllustrations = multer( { storage: UploadService.createStorage(Constants.ILLUSTRATIONS_FILE_LOCATION), fileFilter: UploadService.createFileFilter});
}

module.exports = UploadService;