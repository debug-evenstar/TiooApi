const express = require('express');
router = express.Router();


/* -------------------------------| Validators |------------------------------- */

const { SigninValidator, SignupValidator, VerifyAccountValidator, SendOTPValidator, ChangePasswordValidator, SchoolSetupValidator, ResetPasswordValidator, VerifyResetPasswordValidator } = require("./validators/AuthValidators")

/*-----------------------------------| HOME |-----------------------------------*/

router.get('/', (req, res) => { res.json({ message: "NIMO SERVER RUNNING...." }) });


/*--------------------------------| CONTROLLERS |--------------------------------*/

const AuthenicationController = require('../controller/auth.controller');
const SchoolManagementController = require('../controller/school.controller');
const ClassController = require('../controller/class.control');
const ClassArmsController = require('../controller/classArms.controller');
const SubjectController = require('../controller/subject.controller');
const TeacherController = require('../controller/teacher.controller');
const InviteController = require('../controller/invite.controller');
const LessonController = require('../controller/lesson.controller');

/*---------------------------------| MIDDLEWARE |---------------------------------*/

const AuthenticationMiddleware = require('../middleware/token.middleware');
const StudentController = require('../controller/student.controller');
const { InviteValidator, AcceptValidator } = require('./validators/StudentValidators');

const UploadService = require('../services/upload.service');

/*------------------------------| AUTHORIZED ROUTES |------------------------------*/

const allAuthorizedRoutesGroup = (router) => {

    router.post('/account/signin', SigninValidator, AuthenicationController.signInAccount);
    router.post('/account/signup', SignupValidator, AuthenicationController.createAccount);
    router.post('/account/verify', VerifyAccountValidator, AuthenicationController.verifyAccount);
    router.post('/account/send_otp', SendOTPValidator, AuthenicationController.requestVerificationOTP);
    router.post('/account/verify', VerifyAccountValidator, AuthenicationController.verifyOTP);
    router.put('/account/change_password', ChangePasswordValidator, AuthenicationController.changePassword);
    router.post('/account/resetpassword',ResetPasswordValidator,  AuthenicationController.resetPassword);
    router.post('/account/verify_reset_password', VerifyResetPasswordValidator ,AuthenicationController.verifyResetPassword);

    router.post('/new/account/send_otp', SendOTPValidator, AuthenicationController.sendTempOTP);
    router.post('/new/account/verify', VerifyAccountValidator, AuthenicationController.verifyTempEmail);

    router.post('/school/setup', SchoolSetupValidator, SchoolManagementController.setup);

    router.post('/teacher/invite/accept', TeacherController.acceptInvite);
    router.get('/teacher/invited/:id', TeacherController.fetchInvitedTeacher);


    router.get('/student/invited/:id', StudentController.fetchInvitedStudent);
    router.post('/student/invite/accept', AcceptValidator, StudentController.acceptInvitation);
};


/*------------------------------| SECURED ROUTES |------------------------------*/

const adminAuthorizedRoutesGroup = (router) => {

    router.use(AuthenticationMiddleware.verify) //--use middleware--//
    router.get('/account/read_all', AuthenicationController.accounts);
    router.get('/account/read', AuthenicationController.accountProfile);
    router.put('/account/update', AuthenicationController.updateAccount);
    router.put('/account/flag', AuthenicationController.flagAccount);
    router.put('/account/update/:id', AuthenicationController.updateAccountById);
    router.get('/account/read/:id', AuthenicationController.accountByID);
    router.get('/account/exist/:email', AuthenicationController.accountExist);
    router.delete('/account/delete/:id', AuthenicationController.deleteAccount);

    router.get('/school/classes/:id', SchoolManagementController.classes);
    router.get('/school/read/', SchoolManagementController.read);
    router.get('/school/read/:id', SchoolManagementController.readById);
    router.get('/school/read/classes/:id', SchoolManagementController.readByIdWithClasses);
    router.post('/school/class/remove', SchoolManagementController.removeClassFromSchool);
    router.get('/school/class/read', SchoolManagementController.getClassBySidANDCid);
    router.get('/school/teachers/:id', SchoolManagementController.schoolTeachers);

    router.post('/class/create', ClassController.create);
    router.post('/class/create_bulk', ClassController.bulkCreate);
    router.get('/class/read', ClassController.readAll);
    router.get('/class/readwitharms', ClassController.readAllWithArms);
    router.get('/class/readwitharms/:classId', ClassController.readClassWithArms);
    router.get('/class/read/:id', ClassController.read);
    router.get('/class/subjects/read/:id', ClassController.readClassWithSubjects);
    router.get('/class/teachers/read/:id', ClassController.readClassWithTeachers);
    router.put('/class/update/:id', ClassController.update);
    router.delete('/class/delete/:id', ClassController.delete);

    router.post('/class/arms/create', ClassArmsController.create);
    router.post('/class/arms/create_bulk', ClassArmsController.createBulk);
    router.get('/class/arms/read', ClassArmsController.readAll);
    router.get('/class/arms/read/:id', ClassArmsController.readById);
    router.put('/class/arms/update/:id', ClassArmsController.updateById);
    router.delete('/class/arms/delete/:id', ClassArmsController.deleteArmById);

    router.post('/subjects/create', SubjectController.create);
    router.get('/subjects/read', SubjectController.readAll);
    router.get('/subjects/school/read/:id', SubjectController.readSchoolSubjects);
    router.get('/subjects/school/lessons/:id', SubjectController.schoolSubjectLessons);
    router.get('/subjects/classes/read/:id', SubjectController.readSubjectWithClasses);
    router.get('/subjects/teachers/read/:id', SubjectController.subjectTeachers);
    router.get('/subjects/read/:id', SubjectController.readBySubjectId);
    router.put('/subjects/update', SubjectController.update);
    router.get('/subjects/lessons/', SubjectController.subjectsWithLessons);
    router.get('/subjects/lessons/count', SubjectController.subjectsWithLessonCount);
    router.get('/subjects/lessons/:subjectId', SubjectController.subjectLessons);
    router.delete('/subjects/delete/:id', SubjectController.delete);

    router.post('/teacher/invite', TeacherController.sendInvite);
    router.get('/teacher/readall', TeacherController.allTeachers);
    router.get('/teacher/readInvited', TeacherController.invitedTeachers);
    router.get('/teacher/:id', TeacherController.fetchTeacher)

    router.post('/invites/generate', InviteController.generateLink);
    router.get('/invites/read', InviteController.invites);
    router.get('/invites/read/:id', InviteController.invite);
    router.get('/invites/info/:code', InviteController.inviteByCode);
    router.delete('/invites/delete/:id', InviteController.delete);

    router.post('/student/invite', InviteValidator, StudentController.sendInvitation);
    router.get('/student/:id', StudentController.fetchStudent);
    router.get('/students/readall', StudentController.allStudents);
    router.get('/students/readinvited', StudentController.invitedStudents);

    router.post('/lesson/create', UploadService.upload.single('file'), LessonController.createLesson);

};


allAuthorizedRoutesGroup(router);
adminAuthorizedRoutesGroup(router);

module.exports = router;

