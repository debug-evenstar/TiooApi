const express = require('express');
router = express.Router();


const AuthorizationController = require('../controller/admin/authorization.controller');
const SubjectController = require('../controller/subject.controller');
const AdminController = require('../controller/admin/school.controller');
const HomeController = require('../controller/admin/home.controller');
const PriceController = require('../controller/admin/pricing.controller');
const CouponController = require('../controller/admin/coupon.controller');
const TioController = require('../controller/tio.controller');
const AdminSchoolController = require('../controller/admin/management/school.controller');
const AdminFreelancerController = require('../controller/admin/management/freelancer.controller');
const AdminLibraryController = require('../controller/admin/management/library.controller');
const { mode } = require('crypto-js');
const SubjectValidator = require('./validators/SubjectValidator');


/*---------------------------------| MIDDLEWARE |---------------------------------*/

const AuthenticationMiddleware = require('../middleware/token.middleware');
const { InviteValidator, AcceptValidator } = require('./validators/StudentValidators');
const UploadService = require('../services/upload.service');
const { Authorization } = require('../database/connection');
const ErrorLogs = require('../controller/error.controller');
const ExternalSchoolController = require('../controller/external_school/auth.controller');
const TokenMiddleware = require('../middleware/token.middleware');
const TextbookValidator = require('./validators/TextbookValidator');
const LessonValidator = require('./validators/LessonValidator');
const LessonController = require('../controller/lesson.controller');
const TextbookController = require('../controller/admin/management/textbook.controller');
const TeacherController = require('../controller/teacher.controller');
const LibraryController = require('../controller/library.controller');



const OpenRoutesGroup = (router) => {
    router.post('/login', AuthorizationController.login);
};
/*------------------------------| Admin ROUTES |------------------------------*/

const AdminRoutesGroup = (router) => {

    router.use(AuthenticationMiddleware.admin) //--use middleware--//

    /* ------------------------------- TIOO ROUTES ------------------------------ */

    router.post('/tio/setup', TioController.setup);
    router.get('/tio/classes', TioController.classes);
    router.get('/tio/subjects', TioController.subjects);
    router.get('/tio/subjectslessons', TioController.subjectsLessons);

    router.post('/tio/updateclass/:id', TioController.updateClassName);
    router.post('/tio/bulkcreate', TioController.bulkClassCreate);



    router.get('/schools', AdminController.schools);
    router.get('/home/dashboard', HomeController.dashboard);
    router.get('/home/dashboard/activeusers', HomeController.activeUser);

    /* -------------------------------- SUBJECTS -------------------------------- */
    
    router.post('/subjects', SubjectValidator.CreateSubject, SubjectController.create);
    router.put('/subjects/:id', SubjectValidator.UpdateSubject, SubjectController.update);
    router.delete('/subjects/:id', SubjectController.delete);
    router.get('/subjects',SubjectController.readAll);
    router.get('/subjects/:id/topics',SubjectController.getTopics);
    router.post('/subjects/:id/topics',SubjectController.addSubjectTopic);

    /* --------------------------------- TOPICS --------------------------------- */
    router.delete('/topics/:id',SubjectController.deleteTopic);



    /* --------------------------------- PRICING -------------------------------- */

    router.post('/settings/pricing', PriceController.create);
    router.get('/settings/pricing', PriceController.read);
    router.put('/settings/pricing', PriceController.update);
    router.delete('/settings/pricing/:id', PriceController.delete);

    // router.get('/user',  TokenMiddleware.checkAuthorization(['manage_admin']), AuthorizationController.readAdminUser);
    router.post('/user', AuthorizationController.addAdminUser);
    router.get('/user', AuthorizationController.readAdminUser);
    router.delete('/user', AuthorizationController.deleteAdmin);
    router.get('/permissions', AuthorizationController.readPermissions);
    router.post('/permissions', AuthorizationController.createPermissions);


    router.get('/freelancer', AdminController.freeLancers);
    router.get('/freelancer/:id', AdminController.freeLancersById);

    router.post('/coupon', CouponController.create);
    router.get('/coupon', CouponController.read);
    router.delete('/coupon', CouponController.delete);
    router.put('/coupon', CouponController.update);
    router.post('/coupon/activate', CouponController.activate);

    router.get('/management/schools', AdminSchoolController.read);
    router.get('/management/groupedLessons', AdminSchoolController.lessonsGroupedByClasses);
    router.get('/management/lessons', AdminSchoolController.lessons);
    router.get('/management/schools/extra', AdminSchoolController.readWithExtra);
    router.post('/management/lessons/:id/template', UploadService.uploadLessonTemplate.single('template'), AdminSchoolController.uploadLessonTemplate);
    router.get('/management/lesson/:id/download', AdminSchoolController.downloadLessons)
    router.get('/management/subject/groups', AdminSchoolController.subjectGroups)
    router.get('/management/lesson/check', AdminSchoolController.subjectGroupedLessons);
    router.put('/management/lesson/:id/status', AdminSchoolController.adminUpdateLessonStatus);
    router.put('/management/librarylesson/:id/status', AdminLibraryController.updateLibraryLessonStatus);

    router.get('/management/subjects/lessons', AdminSchoolController.lessonsGroupedBySubjects);
    router.get('/management/subject/lessons', AdminSchoolController.lessonsBySubjectId);
    // router.get('/management/subjects/lessons/count', AdminLibraryController.readLibraryMaterial);

    router.get('/management/class/:id/arms', AdminSchoolController.readAllByClass);
    router.get('/management/class/readwitharms', AdminSchoolController.readAllWithArms);

    router.get('/management/freelancers', AdminFreelancerController.read);
    router.get('/management/freelancers/extra', AdminFreelancerController.readWithExtra);

    router.get('/school/dashboard/home', AdminSchoolController.dashboardHome);
    router.get('/school/dashboard/subjects', AdminSchoolController.dashboardSubject);




    /* ---------------------------------------------------------------------------------------------- */
    /*                                             LIBRARY                                            */
    /* ---------------------------------------------------------------------------------------------- */
    router.get('/shelf', LibraryController.getStudentShelf);


   /* ------------------------------------------ TEXTBOOKS ----------------------------------------- */

    router.get('/library/textbooks', AdminLibraryController.fetchLibraryTextbooks);
    router.post('/library/textbooks', [UploadService.uploadLesson.single('cover'), TextbookValidator.CreateTextbook], AdminLibraryController.createLibraryTextbook);
    router.put('/library/textbooks/:id',[UploadService.uploadLesson.single('cover'), TextbookValidator.UpdateTextbook],AdminLibraryController.updateLibraryTextbook);
    router.delete('/library/textbooks/:id', AdminLibraryController.deleteTextbook);

    router.get('/library/textbooks/:id/chapters', TextbookController.fetchChapters);
    router.post('/library/textbooks/:id/chapters', TextbookValidator.CreateTextbookChapter, TextbookController.createChapter);
    router.put('/library/textbooks/:id/chapters/:chapterid', TextbookValidator.CreateTextbookChapter, TextbookController.updateChapter);
    router.delete('/library/textbooks/:id/chapters/:chapterid', TextbookController.deleteChapter);

    router.get('/library/textbooks/:id/lessons', TextbookController.fetchTextbookLessons);
    router.post('/library/textbooks/:id/lessons', [UploadService.uploadLesson.array('preview'), TextbookValidator.CreateTextbookLesson], TextbookController.createTextbookLesson);
    router.put('/library/textbooks/:id/lessons/:lessonid', [UploadService.uploadLesson.array('preview'), TextbookValidator.CreateTextbookLesson], TextbookController.updateTextbookLesson);
    router.delete('/library/textbooks/:id/lessons/:lessonid', TextbookController.deleteTextbookLesson);


    /* ------------------------------------------- LESSONS ------------------------------------------ */
    router.get('/lessons/:id', LessonController.lessonTemplate)
    router.post('/lessons/:id/slides', LessonController.createLessonSlide)


    router.get('/lessons/check', LessonController.subjectGroupedLessons);

    // router.post('/library', UploadService.uploadLesson.single('file'), AdminLibraryController.create);
    // router.get('/library', AdminLibraryController.read);
    // router.delete('/librarylesson/:id', AdminLibraryController.deleteLibraryLesson);
    // router.post('/library/subject', UploadService.uploadTemplateImage.single('cover'), AdminLibraryController.libraryMaterial);
    // router.put('/library/subject/:id', UploadService.uploadTemplateImage.single('cover'), AdminLibraryController.updateLibraryMaterial);

    // router.put('/librarylesson/:id', AdminLibraryController.updateLibraryLesson);

     
    // router.post('/library/lesson', UploadService.uploadLesson.single('file'), AdminLibraryController.createLibraryLesson);
    
    router.get('/library/lesson/check', AdminLibraryController.subjectGroupedLessons);
    router.get('/librarysubject/:id/classes', AdminLibraryController.libraryClasses);
    router.post('/librarysubject/status/:id', AdminLibraryController.toggleLibrarySubjectStatus);
    router.post('/publish/librarylesson/:id', AdminLibraryController.togglePublishLibraryLesson);

    router.post('/librarylesson/template', UploadService.uploadLesson.fields([{ name: 'template' }, { name: 'preview' }, { name: 'cover' }]), AdminLibraryController.adminLibraryLessonUploadTemplate);
    router.put('/updatelibrarylesson/template', UploadService.uploadLessonTemplate.single('template'), AdminLibraryController.adminUpdateLibraryLessonUploadTemplate);
    router.put('/librarylesson/template', UploadService.uploadLessonTemplate.single('template'), AdminLibraryController.addLibraryLesson);
    router.put('/librarylesson/template/:id',  AdminLibraryController.updateLibraryLessonTemplate);


};

OpenRoutesGroup(router);
AdminRoutesGroup(router);

module.exports = router;