const express = require('express');
router = express.Router();

/* -------------------------------| Validators |------------------------------- */

const { SigninValidator, SignupValidator, VerifyAccountValidator, SendOTPValidator, ChangePasswordValidator, SchoolSetupValidator, ResetPasswordValidator, VerifyResetPasswordValidator } = require("./validators/AuthValidators")

/*-----------------------------------| HOME |-----------------------------------*/

router.get('/', (req, res) => { res.json({ message: "NIMO SERVER RUNNING...." }) });

/*--------------------------------| CONTROLLERS |--------------------------------*/

const AuthenicationController = require('../controller/auth.controller');
const SchoolManagementController = require('../controller/school.controller');
const FreelancerController = require('../controller/freelancer.controller');
const ClassController = require('../controller/class.control');
const ClassArmsController = require('../controller/classArms.controller');
const SubjectController = require('../controller/subject.controller');
const TeacherController = require('../controller/teacher.controller');
const InviteController = require('../controller/invite.controller');
const LessonController = require('../controller/lesson.controller');
const ChapterController = require('../controller/chapter.controller');
const AdminController = require('../controller/admin/school.controller');
const HomeController = require('../controller/admin/home.controller');
const PriceController = require('../controller/admin/pricing.controller');
const CouponController = require('../controller/admin/coupon.controller');
const TioController = require('../controller/tio.controller');
const AdminSchoolController = require('../controller/admin/management/school.controller');
const AdminFreelancerController = require('../controller/admin/management/freelancer.controller');
const AdminLibraryController = require('../controller/admin/management/library.controller');


/*---------------------------------| MIDDLEWARE |---------------------------------*/

const AuthenticationMiddleware = require('../middleware/token.middleware');
const StudentController = require('../controller/student.controller');
const { InviteValidator, AcceptValidator } = require('./validators/StudentValidators');
const UploadService = require('../services/upload.service');
const AuthorizationController = require('../controller/admin/authorization.controller');
const { Authorization } = require('../database/connection');
const ErrorLogs = require('../controller/error.controller');
const LoggingController = require('../controller/error.controller');

/*------------------------------| OPEN ROUTES |------------------------------*/

const OpenRoutesGroup = (router) => {
    router.get('/error/logs', ErrorLogs.fetchErrors);
    router.post('/account/signin', SigninValidator, AuthenicationController.signInAccount);
    router.post('/account/signup', SignupValidator, AuthenicationController.createAccount);
    router.post('/account/verify', VerifyAccountValidator, AuthenicationController.verifyAccount);
    router.post('/account/send_otp', SendOTPValidator, AuthenicationController.requestVerificationOTP);
    router.post('/account/verify/resend', SendOTPValidator, AuthenicationController.resendVerification);
    router.put('/account/change_password', ChangePasswordValidator, AuthenicationController.changePassword);
    router.post('/account/resetpassword', ResetPasswordValidator, AuthenicationController.resetPassword);
    router.post('/account/verify_reset_password', VerifyResetPasswordValidator, AuthenicationController.verifyResetPassword);

    router.post('/new/account/send_otp', SendOTPValidator, AuthenicationController.sendTempOTP);
    router.post('/new/account/verify', VerifyAccountValidator, AuthenicationController.verifyTempEmail);

    router.post('/school/setup', SchoolSetupValidator, SchoolManagementController.setup);
    router.post('/freelancer/setup', SchoolSetupValidator, FreelancerController.setup);


    router.post('/teacher/invite/accept', TeacherController.acceptInvite);
    router.get('/teacher/invited/:id', TeacherController.fetchInvitedTeacher);

    router.get('/student/invited/:id', StudentController.fetchInvitedStudent);
    router.post('/student/invite/accept', AcceptValidator, StudentController.acceptInvitation);
    router.post('/student/parent/signup_first', StudentController.parentSignupOne);
    router.post('/student/parent/signup_second', StudentController.parentSignupTwo);

    /* --------------------------------- INVITES -------------------------------- */

    router.post('/invites/generate', InviteController.generateLink);
    router.post('/invites/student/generate', InviteController.generateStudentLink);
    router.get('/invites/read', InviteController.invites);
    router.get('/invites/read/:id', InviteController.invite);
    router.get('/invites/student/info/:code', InviteController.studentInvite);
    router.get('/invites/info/:code', InviteController.inviteByCode);
    router.delete('/invites/delete/:id', InviteController.delete);
    router.post('/invites/student/accept', InviteController.studentAccept);
    router.post('/invites/teacher/accept', InviteController.teacherAccept);

    router.post('/admin/login', AuthorizationController.login);


    router.post('/tio/setup', TioController.setup);
    router.get('/tio/classes', TioController.classes);
    router.get('/tio/subjects', TioController.subjects);
    router.get('/tio/subjectslessons', TioController.subjectsLessons);

};


/*------------------------------| AUTHORIZED ROUTES |------------------------------*/

const AuthorizedRoutesGroup = (router) => {
    /* --------------------------------- ACCOUNT -------------------------------- */
    router.use(AuthenticationMiddleware.verify) //--use middleware--//
    router.get('/account/read_all', AuthenicationController.accounts);
    router.get('/account/read', AuthenicationController.accountProfile);
    router.put('/account/update', AuthenicationController.updateAccount);
    router.put('/account/flag', AuthenicationController.flagAccount);
    router.post('/account/auth/resetpassword', AuthenicationController.resetAuthPassword);
    router.get('/account/auth/account', AuthenicationController.authAccountByID);
    router.put('/account/update/:id', AuthenicationController.updateAccountById);
    router.get('/account/read/:id', AuthenicationController.accountByID);
    router.get('/account/exist/:email', AuthenicationController.accountExist);
    router.delete('/account/delete/:id', AuthenicationController.deleteAccount);

    /* --------------------------------- SCHOOL --------------------------------- */
    router.get('/school/classes/:id', SchoolManagementController.classes);
    router.get('/school/read/', SchoolManagementController.read);
    router.get('/school/profile/', SchoolManagementController.schoolProfile);
    router.get('/school/read/:id', SchoolManagementController.readById);
    router.get('/school/read/classes/:id', SchoolManagementController.readByIdWithClasses);
    router.post('/school/class/remove', SchoolManagementController.removeClassFromSchool);
    router.get('/school/class/read', SchoolManagementController.getClassBySidANDCid);
    router.get('/school/teachers/', SchoolManagementController.authSchoolTeachers);
    router.get('/school/teachers/:id', SchoolManagementController.schoolTeachers);
    /* ---------------------------------- CLASS --------------------------------- */
    router.post('/class/create', ClassController.create);
    router.post('/class/create_bulk', ClassController.bulkCreate);
    router.get('/class/read', ClassController.readAll);
    router.get('/class/readwitharms', ClassController.readAllWithArms);
    router.get('/class/students/teachers/:id', ClassController.readStudentsTeachers);
    router.get('/class/readwitharms/:classId', ClassController.readClassWithArms);
    router.get('/class/read/:id', ClassController.read);
    router.get('/class/subjects/read/:id', ClassController.readClassWithSubjects);
    router.get('/class/teachers/read/:id', ClassController.readClassWithTeachers);
    router.put('/class/update/:id', ClassController.update);
    router.get('/class/students/:id', ClassController.classStudent);
    router.delete('/class/delete/:id', ClassController.delete);
    router.post('/class/student', ClassController.addStudentToClass);
    router.post('/class/remove/student', ClassController.removeStudentFromClass);
    router.post('/class/teacher', ClassController.addTeacherToClass);
    router.post('/class/addSubject', ClassController.addSubjectToClass)
    router.post('/class/remove/subject', ClassController.removeSubjectFromClass)
    /* --------------------------------- CLASS ARMS -------------------------------- */
    router.post('/class/arms/create', ClassArmsController.create);
    router.post('/class/arms/create_bulk', ClassArmsController.createBulk);
    router.get('/class/arms/read', ClassArmsController.readAll);
    router.get('/class/:id/arms', ClassArmsController.readAllByClass);
    router.get('/class/arms/read/:id', ClassArmsController.readById);
    router.get('/class/arms/students/:id', ClassArmsController.classArmStudents);
    router.get('/class/arms/:id/subjects', ClassArmsController.classArmSubjects); // This is the a better route format /entity/:entityId/relationship
    router.put('/class/arms/update/:id', ClassArmsController.updateById);
    router.delete('/class/arms/delete/:id', ClassArmsController.deleteArmById);

    /* -------------------------------- SUBJECTS -------------------------------- */

    router.post('/subjects/create', SubjectController.create);
    router.get('/subjects/read', SubjectController.readAll);
    router.get('/subjects/school/read/:id', SubjectController.readSchoolSubjects);
    router.get('/subjects/school/lessons/:id', SubjectController.schoolSubjectLessons);
    router.get('/subjects/classes', SubjectController.subjectClasses);
    router.get('/subjects/classes/read/:id', SubjectController.readSubjectWithClasses);
    router.post('/subjects/classes/add', SubjectController.addClassesToSubjects);
    router.get('/subjects/teachers/read/:id', SubjectController.subjectTeachers);
    router.get('/subjects/students/read/:id', SubjectController.subjectStudents);
    router.get('/subjects/read/:id', SubjectController.readBySubjectId);
    router.put('/subjects/update', SubjectController.update);
    router.get('/subjects/lessons/', SubjectController.subjectsWithLessons);
    router.get('/subjects/lessons/count', SubjectController.subjectsWithLessonCount);
    router.get('/subjects/lessons/:subjectId', SubjectController.subjectLessons);
    router.delete('/subjects/delete/:id', SubjectController.delete);

    /* --------------------------------- TEACHERS -------------------------------- */

    router.post('/teacher/invite', TeacherController.sendInvite);
    router.get('/teacher/readall', TeacherController.allTeachers);
    router.get('/teacher/readInvited', TeacherController.invitedTeachers);
    router.post('/teacher/assignsubject', TeacherController.assignSubjectToTeacher);
    router.post('/teacher/unassignsubject', TeacherController.unAssignSubjectToTeacher);
    router.get('/teacher/students/:id', TeacherController.teacherStudents);
    router.get('/teacher/subjectswithLessons/:id', TeacherController.teacherSubjectsWithLessons)
    router.get('/teacher/subjectswithLessonscount/:id', TeacherController.teacherSubjectsWithLessonsCount)
    router.get('/teacher/classess/:id', TeacherController.teacherClasses);
    router.get('/teacher/subjects/:id', TeacherController.teacherSubjects);
    router.get('/teacher/:id', TeacherController.fetchTeacher);

    /* --------------------------------- STUDENT -------------------------------- */

    router.post('/student/invite', InviteValidator, StudentController.sendInvitation);
    router.get('/students/readall', StudentController.allStudents);
    router.get('/student/readinvited/:id', StudentController.invitedStudents);
    router.get('/students/classess/:id', StudentController.getStudentClass); //something is wrong with this controller Six;
    router.delete('/students/delete/:id', StudentController.deleteStudent);
    router.post('/students/bulk/invite', StudentController.sendBulkInvite);
    router.get('/student/subjects', StudentController.studentSubjects);
    router.get('/student/classteacher', StudentController.studentClassTeacher);
    router.get('/student/classmates', StudentController.studentMates);
    router.get('/student/classarmsmates', StudentController.studentArmsMates);
    router.get('/student/:id', StudentController.fetchStudent);

    router.get('/lesson/read', LessonController.nextWeeksLessons);
    router.get('/lesson/subjectlessons/:id', LessonController.subjectLessons);
    router.get('/lesson/check', LessonController.subjectGroupedLessons);

    router.post('/lesson/create',   UploadService.upload.array('files'), LessonController.createLesson);

    router.get('/chapter/subject/:id', ChapterController.read);

    router.get('/logging', LoggingController.read);
    router.delete('/logging', LoggingController.clear);


};


/*------------------------------| Admin ROUTES |------------------------------*/

const AdminRoutesGroup = (router) => {

    router.use(AuthenticationMiddleware.admin) //--use middleware--//
    router.get('/admin/schools', AdminController.schools);
    router.get('/admin/home/dashboard', HomeController.dashboard);
    router.get('/admin/home/dashboard/activeusers', HomeController.activeUser);

    /* --------------------------------- PRICING -------------------------------- */

    router.post('/admin/settings/pricing', PriceController.create);
    router.get('/admin/settings/pricing', PriceController.read);
    router.put('/admin/settings/pricing', PriceController.update);
    router.delete('/admin/settings/pricing/:id', PriceController.delete);

    router.post('/admin/user', AuthorizationController.addAdminUser);
    router.get('/admin/user', AuthorizationController.readAdminUser);
    router.delete('/admin/user', AuthorizationController.deleteAdmin);
    router.get('/admin/permissions', AuthorizationController.readPermissions);

    router.get('/admin/freelancer', AdminController.freeLancers);
    router.get('/admin/freelancer/:id', AdminController.freeLancersById);

    router.post('/admin/coupon', CouponController.create);
    router.get('/admin/coupon', CouponController.read);
    router.delete('/admin/coupon', CouponController.delete);
    router.put('/admin/coupon', CouponController.update);
    router.post('/admin/coupon/activate', CouponController.activate);

    router.get('/admin/management/schools', AdminSchoolController.read);
    router.get('/admin/management/groupedLessons', AdminSchoolController.lessonsGroupedByClasses);
    router.get('/admin/management/subjects/lessons', AdminSchoolController.lessonsGroupedBySubjects);
    router.get('/admin/management/subject/lessons', AdminSchoolController.lessonsBySubjectId);
    router.get('/admin/management/lessons', AdminSchoolController.lessons);
    router.get('/admin/management/schools/extra', AdminSchoolController.readWithExtra);

    router.get('/admin/management/freelancers', AdminFreelancerController.read);
    router.get('/admin/management/freelancers/extra', AdminFreelancerController.readWithExtra);

    router.get('/admin/school/dashboard/home', AdminSchoolController.dashboardHome);
    router.get('/admin/school/dashboard/subjects', AdminSchoolController.dashboardSubject);

    router.post('/admin/library',  UploadService.upload.single('file'), AdminLibraryController.create);
    router.get('/admin/library',  UploadService.upload.single('file'), AdminLibraryController.read);
};


OpenRoutesGroup(router);
AuthorizedRoutesGroup(router);
AdminRoutesGroup(router);

module.exports = router;

