const express = require("express");
router = express.Router();

/* -------------------------------| Validators |------------------------------- */

const {
    SigninValidator,
    SignupValidator,
    VerifyAccountValidator,
    SendOTPValidator,
    ChangePasswordValidator,
    SchoolSetupValidator,
    ResetPasswordValidator,
    VerifyResetPasswordValidator,
    RegisterExternalStudentValidator,
    EmailValidator,
    LegacyResetPasswordValidator,
} = require("./validators/AuthValidators");

/*-----------------------------------| HOME |-----------------------------------*/

router.get("/", (req, res) => {
    res.json({ message: "NIMO SERVER RUNNING...." });
});

/*--------------------------------| CONTROLLERS |--------------------------------*/

const AuthenicationController = require("../controller/auth.controller");
const SchoolManagementController = require("../controller/school.controller");
const FreelancerController = require("../controller/freelancer.controller");
const ClassController = require("../controller/class.control");
const ClassArmsController = require("../controller/classArms.controller");
const SubjectController = require("../controller/subject.controller");
const TeacherController = require("../controller/teacher.controller");
const InviteController = require("../controller/invite.controller");
const LessonController = require("../controller/lesson.controller");
const ChapterController = require("../controller/chapter.controller");
const AdminController = require("../controller/admin/school.controller");
const HomeController = require("../controller/admin/home.controller");
const PriceController = require("../controller/admin/pricing.controller");
const CouponController = require("../controller/admin/coupon.controller");
const TioController = require("../controller/tio.controller");
const AdminSchoolController = require("../controller/admin/management/school.controller");
const AdminFreelancerController = require("../controller/admin/management/freelancer.controller");
const AdminLibraryController = require("../controller/admin/management/library.controller");
const ActionController = require("../controller/action.controller");
const StudentController = require("../controller/student.controller");
const AuthorizationController = require("../controller/admin/authorization.controller");
const LoggingController = require("../controller/error.controller");
const PreferenceController = require("../controller/preference.controller");
const BillingController = require("../controller/billing.controller");
const NotificationController = require("../controller/notification.controller");
const SchoolFront = require("../controller/schoolfront.controller");
const CartController = require("../controller/cart.controller");
const Library = require("../controller/library.controller");
const TextbookController = require("../controller/textbook.controller");

/*---------------------------------| MIDDLEWARE |---------------------------------*/

const AuthenticationMiddleware = require("../middleware/token.middleware");
const {
    InviteValidator,
    AcceptValidator,
} = require("./validators/StudentValidators");
const UploadService = require("../services/upload.service");
const { Authorization } = require("../database/connection");
const ErrorLogs = require("../controller/error.controller");
const ExternalSchoolController = require("../controller/external_school/auth.controller");
const TokenMiddleware = require("../middleware/token.middleware");
const OnboardingController = require("../controller/onboarding.controller");
const TextbookValidator = require("./validators/TextbookValidator");
const LibraryController = require("../controller/library.controller");
const ReferralController = require("../controller/referrals.controller");
const StudyPlanController = require("../controller/studyPlan.controller");

/*------------------------------| OPEN ROUTES |------------------------------*/

const OpenRoutesGroup = (router) => {
    router.get("/error/logs", ErrorLogs.fetchErrors);
    router.post(
        "/account/signin",
        SigninValidator,
        AuthenicationController.signInAccount
    );
    router.post(
        "/account/signin/external/student",
        SigninValidator,
        ExternalSchoolController.loginExeternalStudent
    );
    router.post(
        "/account/signup",
        SignupValidator,
        AuthenicationController.createAccount
    );
    router.post(
        "/account/verify",
        VerifyAccountValidator,
        AuthenicationController.verifyAccount
    );
    router.get(
        "/account/email/exits/:email",
        AuthenicationController.userExist
    );
    router.post(
        "/account/student/external",
        RegisterExternalStudentValidator,
        AuthenicationController.registerExternalStudent
    );
    router.post(
        "/delete/account/student/external",
        AuthenicationController.deleteExternalStudent
    );
    router.post(
        "/account/send_otp",
        SendOTPValidator,
        AuthenicationController.requestVerificationOTP
    );
    router.post(
        "/account/verify/resend",
        SendOTPValidator,
        AuthenicationController.resendVerification
    );
    router.put(
        "/account/change_password",
        ChangePasswordValidator,
        AuthenicationController.changePassword
    );
    router.post(
        "/account/resetpassword",
        ResetPasswordValidator,
        AuthenicationController.resetPassword
    );
    router.post(
        "/account/verify_reset_password",
        VerifyResetPasswordValidator,
        AuthenicationController.verifyResetPassword
    );

    router.post(
        "/new/account/send_otp",
        SendOTPValidator,
        AuthenicationController.sendTempOTP
    );
    router.post(
        "/new/account/verify",
        VerifyAccountValidator,
        AuthenicationController.verifyTempEmail
    );

    router.post(
        "/school/setup",
        SchoolSetupValidator,
        SchoolManagementController.setup
    );
    router.post(
        "/freelancer/setup",
        SchoolSetupValidator,
        FreelancerController.setup
    );

    router.post("/teacher/invite/accept", TeacherController.acceptInvite);
    router.get("/teacher/invited/:id", TeacherController.fetchInvitedTeacher);

    router.get("/student/invited/:id", StudentController.fetchInvitedStudent);
    router.post(
        "/student/invite/accept",
        AcceptValidator,
        StudentController.acceptInvitation
    );
    router.post(
        "/student/parent/signup_first",
        StudentController.parentSignupOne
    );
    router.post(
        "/student/parent/signup_second",
        StudentController.parentSignupTwo
    );

    /* --------------------------------- INVITES -------------------------------- */

    router.post("/invites/generate", InviteController.generateLink);
    router.post(
        "/invites/student/generate",
        InviteController.generateStudentLink
    );
    router.get("/invites/read", InviteController.invites);
    router.get("/invites/read/:id", InviteController.invite);
    router.get("/invites/student/info/:code", InviteController.studentInvite);
    router.get("/invites/info/:code", InviteController.inviteByCode);
    router.delete("/invites/delete/:id", InviteController.delete);
    router.post("/invites/student/accept", InviteController.studentAccept);
    router.post("/invites/teacher/accept", InviteController.teacherAccept);

    router.post("/tio/setup", TioController.setup);
    router.get("/tio/classes", TioController.classes);
    router.get("/tio/subjects", TioController.subjects);
    router.get("/tio/subjectslessons", TioController.subjectsLessons);

    router.post("/tio/updateclass/:id", TioController.updateClassName);
    router.post("/tio/bulkcreate", TioController.bulkClassCreate);

    router.post("/actions/superadmin", ActionController.superAdmin);
    router.delete("/actions/superadmin", ActionController.cleanAdmin);

    router.post("/coupon/apply", CouponController.apply);

    router.get("/open/lesson/:id/template", LessonController.lessonTemplate);
    router.delete("/slides/:id", LessonController.deleteLessonSlide);
    router.put(
        "/open/lesson/template/:id",
        LessonController.updateLessonTemplate
    );
    router.post("/open/lesson/:id/slide", LessonController.createLessonSlide);
    router.put(
        "/open/lesson/templateimage/:id",
        UploadService.uploadTemplateImage.array("image"),
        LessonController.updateTemplateImage
    );
    router.put(
        "/open/media/:type/upload",
        UploadService.uploadTemplateImage.array("image"),
        LessonController.updateTemplateImage
    );
    router.get("/open/pricing/", SchoolFront.openPricing);
    router.get("/open/textbooks", Library.getLibraryTextbooks);
    router.get("/open/textbook/:id", Library.getLibraryTextbook);
    router.get("/open/subjects/:id/topics", SubjectController.getTopics);
    router.get("/open/subjects/topics",SubjectController.getSubjectsWithTopics);
    router.post("/open/lesson/asktutor", LessonController.askAITutor);
};

/*------------------------------| AUTHORIZED ROUTES |------------------------------*/

const AuthorizedRoutesGroup = (router) => {
    router.use(AuthenticationMiddleware.verify); //--use middleware--//

    /* --------------------------------- ACCOUNT REFERRALS -------------------------------- */
    router.get("/account/referrals", ReferralController.getUserReferrals)


    /* --------------------------------- ACCOUNT -------------------------------- */


    router.get("/account/read_all", AuthenicationController.accounts);
    router.get("/account/read", AuthenicationController.accountProfile);
    router.put("/account/update", AuthenicationController.updateAccount);
    router.put("/account/flag", AuthenicationController.flagAccount);

    router.post(
        "/account/legacy-resetpassword",
        // LegacyResetPasswordValidator,
        AuthenicationController.legacyPasswordReset
    );


    router.post(
        "/account/auth/resetpassword",
        AuthenicationController.resetAuthPassword
    );

    router.get("/account/auth/account", AuthenicationController.authAccountByID);
    router.put("/account/update/:id", AuthenicationController.updateAccountById);
    router.get("/account/read/:id", AuthenicationController.accountByID);
    router.get("/account/exist/:email", AuthenicationController.accountExist);
    router.post(
        "/account/profile/upload",
        UploadService.uploadDisplayPicture.single("file"),
        AuthenicationController.uploadDisplayPicture
    );
    router.delete("/account/delete/:id", AuthenicationController.deleteAccount);
    router.delete(
        "/account/email/delete/:email",
        AuthenicationController.deleteAccountByEmail
    );

    /* --------------------------------- SCHOOL --------------------------------- */
    router.get("/school/classes/:id", SchoolManagementController.classes);
    router.get("/school/read/", SchoolManagementController.read);
    router.get("/school/profile/", SchoolManagementController.schoolProfile);
    router.get("/school/read/:id", SchoolManagementController.readById);
    router.get(
        "/school/keypairs/read/:id",
        SchoolManagementController.readKeysById
    );
    router.get(
        "/school/read/classes/:id",
        SchoolManagementController.readByIdWithClasses
    );
    router.post(
        "/school/class/remove",
        SchoolManagementController.removeClassFromSchool
    );
    router.get(
        "/school/class/read",
        SchoolManagementController.getClassBySidANDCid
    );
    router.get(
        "/school/teachers/",
        SchoolManagementController.authSchoolTeachers
    );
    router.get(
        "/school/teachers/:id",
        SchoolManagementController.schoolTeachers
    );
    router.get("/school/:id/terms", SchoolManagementController.schoolTerms);
    router.post(
        "/school/kyc",
        UploadService.uploadLesson.array("files"),
        SchoolManagementController.updateKyc
    );
    router.post("/school/admin", SchoolManagementController.addSchoolAdminUser);
    router.delete("/school/admin/:id", SchoolManagementController.removeAdmin);
    router.get("/school/admin", SchoolManagementController.readSchoolAdmins);
    router.get(
        "/school/admin/roles",
        SchoolManagementController.readSchoolRoles
    );
    router.post(
        "/school/admin/:id/deactivate",
        SchoolManagementController.deactivateAdmin
    );

    /* ---------------------------------- CLASS --------------------------------- */

    router.post("/classes/create", ClassController.create);
    router.post("/classes/create_bulk", ClassController.bulkCreate);
    router.get("/classes", ClassController.readAll);
    router.get("/classes/readwitharms", ClassController.readAllWithArms);
    router.get(
        "/classes/students/teachers/:id",
        ClassController.readStudentsTeachers
    );
    router.get(
        "/classes/readwitharms/:classId",
        ClassController.readClassWithArms
    );
    router.get("/classes/:id", ClassController.read);
    router.get(
        "/classes/subjects/read/:id",
        ClassController.readClassWithSubjects
    );
    router.get(
        "/classes/teachers/read/:id",
        ClassController.readClassWithTeachers
    );
    router.put("/classes/update/:id", ClassController.update);
    router.get("/classes/students/:id", ClassController.classStudent);
    router.delete("/classes/delete/:id", ClassController.delete);
    router.post("/classes/student", ClassController.addStudentToClass);
    router.post(
        "/classes/remove/student",
        ClassController.removeStudentFromClass
    );
    router.post("/classes/teacher", ClassController.addTeacherToClass);
    router.post("/classes/addSubject", ClassController.addSubjectToClass);
    router.post(
        "/classes/remove/subject",
        ClassController.removeSubjectFromClass
    );

    /* --------------------------------- CLASS ARMS -------------------------------- */
    router.post("/classes/arms/create", ClassArmsController.create);
    router.post("/classes/arms/create_bulk", ClassArmsController.createBulk);
    router.get("/classes/arms/read", ClassArmsController.readAll);
    router.get("/classes/:id/arms", ClassArmsController.readAllByClass);
    router.get("/classes/arms/read/:id", ClassArmsController.readById);
    router.get(
        "/classes/arms/students/:id",
        ClassArmsController.classArmStudents
    );
    router.get(
        "/classes/arms/teachers/:id",
        ClassArmsController.classArmTeachers
    );
    router.get(
        "/classes/arms/:id/subjects",
        ClassArmsController.classArmSubjects
    ); // This is the a better route format /entity/:entityId/relationship
    router.put("/classes/arms/update/:id", ClassArmsController.updateById);
    router.get("/classes/classarms", ClassArmsController.classArmsByClass);
    router.delete(
        "/classes/arms/delete/:id",
        ClassArmsController.deleteArmById
    );

    /* -------------------------------- SUBJECTS -------------------------------- */

    router.post("/subjects/create", SubjectController.create);
    router.get("/subjects", SubjectController.readAll);
    router.get(
        "/subjects/school/read/:id",
        SubjectController.readSchoolSubjects
    );
    router.get(
        "/subjects/school/lessons/:id",
        SubjectController.schoolSubjectLessons
    );
    router.get("/subjects/classes", SubjectController.subjectClasses);
    router.get(
        "/subjects/classes/read/:id",
        SubjectController.readSubjectWithClasses
    );
    router.post(
        "/subjects/classes/add",
        SubjectController.addClassesToSubjects
    );
    router.get(
        "/subjects/teachers/read/:id",
        SubjectController.subjectTeachers
    );
    router.get(
        "/subjects/students/read/:id",
        SubjectController.subjectStudents
    );
    router.get("/subjects/:id", SubjectController.readBySubjectId);
    router.put("/subjects/update", SubjectController.update);
    router.get("/subjects/lessons/", SubjectController.subjectsWithLessons);
    router.get(
        "/subjects/lessons/count",
        SubjectController.subjectsWithLessonCount
    );
    router.get(
        "/subjects/lessons/:subjectId",
        SubjectController.subjectLessons
    );
    router.get(
        "/subjects/:id/student/lessons",
        SubjectController.studentLessons
    );
    router.delete("/subjects/delete/:id", SubjectController.delete);
    router.get(
        "/schoolfront/librarysubject",
        SubjectController.schoolfrontLibraryMaterial
    );

    /* --------------------------------- TEACHERS -------------------------------- */

    router.post("/teacher/invite", TeacherController.sendInvite);
    router.get("/teacher/readall", TeacherController.allTeachers);
    router.get("/teacher/readInvited", TeacherController.invitedTeachers);
    router.post(
        "/teacher/assignsubject",
        TeacherController.assignSubjectToTeacher
    );
    router.post(
        "/teacher/unassignsubject",
        TeacherController.unAssignSubjectToTeacher
    );
    router.get("/teacher/students/:id", TeacherController.teacherStudents);
    router.get(
        "/teacher/subjectswithLessons/:id",
        TeacherController.teacherSubjectsWithLessons
    );
    router.get(
        "/teacher/subjectswithLessonscount/:id",
        TeacherController.teacherSubjectsWithLessonsCount
    );
    router.get("/teacher/classess/:id", TeacherController.teacherClasses);
    router.get("/teacher/subjects/:id", TeacherController.teacherSubjects);
    router.get("/teacher/:id", TeacherController.fetchTeacher);
    router.post(
        "/teacher/kyc",
        UploadService.uploadLesson.array("files"),
        TeacherController.kyc
    );
    router.get("/teacher/read/kyc", TeacherController.readTeacherKYC);

    /* --------------------------------- STUDENT -------------------------------- */

    router.post(
        "/student/invite",
        InviteValidator,
        StudentController.sendInvitation
    );
    router.get("/students/readall", StudentController.allStudents);
    router.get("/student/readinvited/:id", StudentController.invitedStudents);
    router.get("/students/classess/:id", StudentController.getStudentClass); //something is wrong with this controller Six;
    router.delete("/students/delete/:id", StudentController.deleteStudent);
    router.post("/students/bulk/invite", StudentController.sendBulkInvite);
    router.get("/student/subjects", StudentController.studentSubjects);
    router.get("/student/classteacher", StudentController.studentClassTeacher);
    router.get("/student/classmates", StudentController.studentMates);
    router.get(
        "/student/classteachersandmates",
        StudentController.studentClassTeachersAndMates
    );
    router.get("/student/classarmsmates", StudentController.studentArmsMates);
    router.get("/student/personalinfo", StudentController.personalInformation);
    router.put(
        "/student/personalinfo",
        StudentController.updatePersonalInformation
    );
    router.get("/student/library", StudentController.independentStudentLibrary);

    router.get("/student/network", StudentController.independentStudentNetwork);
    router.get("/student/:id", StudentController.fetchStudent);

    router.get("/front/material/:id/lessons", SchoolFront.readLibraryLessons);
    router.post(
        "/front/textbook/addtoschool",
        SchoolFront.addLibraryMaterialTextBookToSchool
    );
    router.get(
        "/front/school/librarytextbooks",
        SchoolFront.readSchoolLibraryMaterialTextBooks
    );
    router.get(
        "/front/school/librarytextbooks/:sid",
        SchoolFront.readSchoolLibraryMaterialTextBooksBySubject
    );
    router.delete(
        "/front/librarytextbooks/:id/remove",
        SchoolFront.removeTextbookFromSchool
    );

    /* --------------------------------- NEW STUDENT FRONT   -------------------------------- */

    router.get(
        "/front/student/textbook/librarytextbooks",
        Library.getLibraryTextbooks
    );
    router.get(
        "/front/student/shelf/librarytextbooks",
        Library.getLibraryTextbooks
    );
    router.post("/front/student/shelf/add-book", Library.addTextbookToShelf);
    router.get("/front/student/shelf/get-books", Library.getStudentShelf);
    router.get("/front/student/textbook/:id", TextbookController.fetchTextbookStudyInfo);
    router.post(
        "/front/student/shelf/remove-book",
        Library.removeTextbookFromShelf
    );

    /* -------------------------------- TEXTBOOKS ------------------------------- */

    router.get("/library/textbooks", LibraryController.fetchLibraryTextbooks);
    router.post(
        "/library/textbooks",
        [
            UploadService.uploadLesson.single("cover"),
            TextbookValidator.CreateTextbook,
        ],
        LibraryController.createLibraryTextbook
    );
    router.put(
        "/library/textbooks/:id",
        [
            UploadService.uploadLesson.single("cover"),
            TextbookValidator.UpdateTextbook,
        ],
        LibraryController.updateLibraryTextbook
    );
    router.delete("/library/textbooks/:id", LibraryController.deleteTextbook);
    router.post(
        "/library/textbooks/:id/publish",
        LibraryController.togglePublishLibraryTextbook
    );
    router.post(
        "/library/textbooks/:id/unpublish",
        LibraryController.togglePublishLibraryTextbook
    );

    router.get(
        "/library/textbooks/:id/chapters",
        TextbookController.fetchChapters
    );
    router.post(
        "/library/textbooks/:id/chapters",
        TextbookValidator.CreateTextbookChapter,
        TextbookController.createChapter
    );
    router.put(
        "/library/textbooks/:id/chapters/:chapterid",
        TextbookValidator.CreateTextbookChapter,
        TextbookController.updateChapter
    );
    router.delete(
        "/library/textbooks/:id/chapters/:chapterid",
        TextbookController.deleteChapter
    );

    router.get(
        "/library/textbooks/:id/lessons",
        TextbookController.fetchTextbookLessons
    );
    router.post(
        "/library/textbooks/:id/lessons",
        [
            UploadService.uploadLesson.array("preview"),
            TextbookValidator.CreateTextbookLesson,
        ],
        TextbookController.createTextbookLesson
    );
    router.put(
        "/library/textbooks/:id/lessons/:lessonid",
        [
            UploadService.uploadLesson.array("preview"),
            TextbookValidator.CreateTextbookLesson,
        ],
        TextbookController.updateTextbookLesson
    );
    router.delete(
        "/library/textbooks/:id/lessons/:lessonid",
        TextbookController.deleteTextbookLesson
    );

    router.post('/library/textbooks/progress', TextbookController.updateProgressRecord);
    router.get('/library/textbooks/progress/:textbook_id/:lesson_id', TextbookController.getOrCreateProgressRecord);


    /* --------------------------------- LESSON -------------------------------- */

    router.get("/lesson/alllessons", LessonController.allLessons);
    router.get("/lesson/read", LessonController.upcomingNextWeeksLessons);
    router.get("/lesson/student/read", LessonController.studentUpcomingNextWeeksLessons);
    router.get("/lesson/subjectlessons/:id", LessonController.subjectLessons);
    router.get("/lesson/groups", LessonController.subjectGroups);
    router.post(
        "/lesson/groups/:id/add",
        UploadService.uploadLesson.array("files"),
        LessonController.addLessonToGroup
    );
    router.post("/lesson/generate/groups/:id", LessonController.generateLessonWithGroup);
    router.post("/lesson/groups/:id/editarms", LessonController.editGroupArms);
    router.delete(
        "/lesson/groups/:id/lesson/:lesson",
        LessonController.removeLessonFromGroup
    );
    router.put("/lesson/:id", LessonController.updateLesson);
    router.delete("/lesson/:id", LessonController.deleteLesson);
    router.get("/lesson/:id/template", LessonController.lessonTemplate);
    router.put("/lesson/:id/status", LessonController.updateLessonStatus);
    router.get("/lesson/check", LessonController.subjectGroupedLessons);
    router.post("/lesson/generate", LessonController.generateLesson);
    router.post(
        "/lesson/:id/generate/extra",
        LessonController.generateLessonWithExtra
    );
    router.get("/lesson/generated/:id", LessonController.readGeneratedLesson);
    router.put("/lesson/generated/:id", LessonController.updateGeneratedLesson);
    router.post(
        "/lesson/create",
        UploadService.uploadLesson.array("files"),
        LessonController.createLesson
    );
    router.post(
        "/lesson/add",
        UploadService.uploadLesson.array("files"),
        LessonController.addLesson
    );
    router.put("/lesson/template/:id", LessonController.updateLessonTemplate);
    router.post("/lesson/:id/slide", LessonController.createLessonSlide);
    router.put(
        "/lesson/templateimage/:id",
        UploadService.uploadTemplateImage.single("image"),
        LessonController.updateTemplateImage
    );

    router.get("/lessons/:id", LessonController.lessonTemplate);
    router.post("/lessons/:id/slides", LessonController.createLessonSlide);
    router.get("/lessons/check", LessonController.subjectGroupedLessons);
    router.post("/lesson/asktutor", LessonController.askAITutor);

    router.get("/chapter/subject/:id", ChapterController.read);

    router.get("/logging", LoggingController.read);
    router.delete("/logging", LoggingController.clear);

    router.post("/settings/preference", PreferenceController.create);

    router.post(
        "/settings/teacher/preference",
        PreferenceController.teachearCreate
    );
    router.get(
        "/settings/teacher/preference",
        PreferenceController.teacherRead
    );
    router.put("/settings/teacher/preference", PreferenceController.update);

    router.put("/settings/preference", PreferenceController.update);
    router.get("/settings/preference", PreferenceController.read);
    router.post(
        "/settings/student/preference",
        PreferenceController.setStudentPreference
    );
    router.get("/settings/billing/school", BillingController.school);
    router.get("/settings/billing/freelancer", BillingController.freelancer);
    router.get("/settings/billing/student", BillingController.student);
    router.post(
        "/settings/billing/teacher/generate",
        BillingController.generateIndependentTeachersBill
    );
    router.get(
        "/settings/billing/teacher",
        BillingController.independentTeacher
    );
    router.post("/settings/billing/generate", BillingController.generateBill);
    router.post(
        "/settings/account/changepassword",
        AuthenicationController.accountChangePassword
    );

    router.get(
        "/settings/school/profile",
        SchoolManagementController.readProfile
    );
    router.put(
        "/settings/school/profile",
        SchoolManagementController.updateProfile
    );

    router.get("/settings/notification", NotificationController.subscription);
    router.put("/settings/notification", NotificationController.update);

    router.post("/cart/add", CartController.add);
    router.delete("/cart/:id/remove", CartController.remove);
    router.get("/cart/read", CartController.read);
    router.delete("/cart/clear", CartController.clearCart);

    /* ---------------------------- Onboarding Routes -----------------------------*/

    router.get(
        "/onboarding/questions",
        OnboardingController.getOnboardingQuestions
    );
    router.get(
        "/onboarding/questions/seed",
        OnboardingController.seedQuestions
    );
    router.post(
        "/onboarding/account-types",
        OnboardingController.addAccountType
    );
    
    router.post(
        "/onboarding/account-type/:id/questions",
        OnboardingController.addAccountQuestion
    );

    router.get(
        "/onboarding/account-type/:id/questions",
        OnboardingController.getAccountQuestions
    );

    router.get("/onboarding/metadata",
        OnboardingController.getMetaData
    );

    router.post(
        "/onboarding/save-metadata/",
        OnboardingController.saveMetaData
    );

    router.post('/onboarding/save-exam-metadata',
        OnboardingController.saveExamMetaData
    );


    /* ---------------------------- External Schools ---------------------------- */
    router.post(
        "/resetpassword/account/student/external",
        ExternalSchoolController.ResetPassword
    );




    /* ------------------------- Study Plan ---------------------------- */
    router.post("/account/studyplan/target-score",StudyPlanController.setTargetScore);

    







};


OpenRoutesGroup(router);
AuthorizedRoutesGroup(router);

module.exports = router;
