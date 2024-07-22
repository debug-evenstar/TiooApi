const { Topic, Question } = require(".");

class Relationships {
    static group(
        Account,
        Validation,
        Subject,
        Class,
        SchoolManagement,
        Student,
        Teacher,
        TempValidation,
        ClassArm,
        Lesson,
        Chapter,
        Authorization,
        Admin,
        Coupon,
        Library,
        Group,
        LessonSlide,
        Preference,
        Shelf,
        Billing,
        Notification,
        Subscription,
        Keypairs,
        Textbook,
        CartItem,
        OnboardingQuestion,
        AccountType,
        Topic,
        Question
    ) {
        //------------------/ ONE-TO-ONE - ACCOUNT -*- VALIDATION | SHCOOL | TEACHER | STUDENT  /--------------------

        Account.hasOne(Validation, {
            foreignKey: "account_id",
            as: "validation",
        });
        Validation.belongsTo(Account, {
            foreignKey: "account_id",
            as: "account",
        });

        Account.hasOne(SchoolManagement, {
            allowNull: true,
            onDelete: "CASCADE",
        });

        SchoolManagement.belongsTo(Account, {
            allowNull: true,
            foreignKey: "account_id",
        });

        Account.hasOne(Teacher, {
            allowNull: true,
            onDelete: "CASCADE",
            foreignKey: "account_id",
        });
        Teacher.belongsTo(Account, {
            allowNull: true,
            foreignKey: "account_id",
        });

        Account.hasOne(Student, {
            allowNull: true,
            onDelete: "CASCADE",
            foreignKey: "account_id",
        });
        Student.belongsTo(Account, {
            allowNull: true,
            foreignKey: "account_id",
        });

        Account.hasOne(Authorization, {
            allowNull: true,
            onDelete: "CASCADE",
            foreignKey: "account_id",
        });
        Authorization.belongsTo(Account, {
            allowNull: true,
            foreignKey: "account_id",
        });

        Admin.hasOne(Validation, { allowNull: true, foreignKey: "admin_id" });
        Validation.belongsTo(Admin, {
            allowNull: true,
            foreignKey: "admin_id",
        });

        Admin.hasOne(Authorization, {
            allowNull: true,
            onDelete: "CASCADE",
            foreignKey: "admin_id",
        });
        Authorization.belongsTo(Admin, {
            allowNull: true,
            foreignKey: "admin_id",
        });

        Account.hasOne(Preference, {
            allowNull: true,
            onDelete: "CASCADE",
            foreignKey: "account_id",
        });
        Preference.belongsTo(Account, {
            allowNull: true,
            foreignKey: "account_id",
        });

        SchoolManagement.hasOne(Keypairs, {
            foreignKey: "school_management_id",
        });

        Keypairs.belongsTo(SchoolManagement, {
            foreignKey: "school_management_id",
        });

        -Account.hasOne(Preference, {
            allowNull: true,
            onDelete: "CASCADE",
            foreignKey: "account_id",
        });
        Preference.belongsTo(Account, {
            allowNull: true,
            foreignKey: "school_management_id",
        });

        //---------/ ONE-TO-MANY - SCHOOL -*- CLASS | TEACHERS | STUDENT | SUBJECT /--------------------

        SchoolManagement.hasMany(Teacher, {
            foreignKey: "school_management_id",
        });
        Teacher.belongsTo(SchoolManagement, {
            foreignKey: "school_management_id",
        });

        Notification.hasMany(Subscription, { foreignKey: "notification_id" });
        Subscription.belongsTo(Notification, { foreignKey: "notification_id" });

        Account.hasMany(Subscription, { foreignKey: "account_id" });
        Subscription.belongsTo(Account, { foreignKey: "account_id" });

        SchoolManagement.hasMany(Student, {
            foreignKey: "school_management_id",
        });
        Student.belongsTo(SchoolManagement, {
            foreignKey: "school_management_id",
        });

        SchoolManagement.hasMany(Subject, {
            foreignKey: "school_management_id",
        });
        Subject.belongsTo(SchoolManagement, {
            foreignKey: "school_management_id",
        });

        SchoolManagement.hasMany(Class, { foreignKey: "school_management_id" });
        Class.belongsTo(SchoolManagement, {
            foreignKey: "school_management_id",
        });

        SchoolManagement.hasMany(Authorization, {
            foreignKey: "school_management_id",
        });
        Authorization.belongsTo(SchoolManagement, {
            foreignKey: "school_management_id",
        });

        Subject.hasMany(Group, { foreignKey: "subject_id" });
        Group.belongsTo(Subject, { foreignKey: "subject_id" });

        Group.hasMany(Lesson, { foreignKey: "group_id" });
        Lesson.belongsTo(Group, { foreignKey: "group_id" });

        //---------/ ONE-TO-MANY - CLASS -*- STUDENTS /--------------------

        Class.hasMany(Student, { foreignKey: "class_id" });
        Student.belongsTo(Class, { foreignKey: "class_id" });

        Class.hasMany(ClassArm, { foreignKey: "class_id" });
        ClassArm.belongsTo(Class, { foreignKey: "class_id" });

        ClassArm.hasMany(Student, { foreignKey: "class_arm_id" });
        Student.belongsTo(ClassArm, { foreignKey: "class_arm_id" });

        Class.hasMany(Lesson, { foreignKey: "class_id" });
        Lesson.belongsTo(Class, { foreignKey: "class_id" });

        Group.belongsTo(Class, { foreignKey: "ref_cid" });

        Textbook.hasMany(Chapter, { foreignKey: "textbook_id", as : "chapters" });
        Chapter.belongsTo(Textbook, { foreignKey: "textbook_id" });

        Textbook.hasMany(Lesson, { foreignKey: "textbook_id" });
        Lesson.belongsTo(Textbook, { foreignKey: "textbook_id" });

        Chapter.hasMany(Lesson, { foreignKey: "chapter_id" , as : "lessons"});
        Lesson.belongsTo(Chapter, { foreignKey: "chapter_id" });

        Lesson.hasMany(LessonSlide, { foreignKey: "lesson_id", as : "lesson_slides"});
        LessonSlide.belongsTo(Lesson, { foreignKey: "lesson_id" });

        Account.hasMany(Billing, { foreignKey: "account_id" });
        Billing.belongsTo(Account, { foreignKey: "account_id" });

        // Account.hasMany(Shelf, { foreignKey: "account_id"});
        Account.belongsToMany(Textbook, { through: 'shelves',foreignKey: 'account_id'});
        Textbook.belongsToMany(Account, { through: 'shelves',foreignKey: 'textbook_id'});

        

        Subject.hasMany(Textbook, { foreignKey: "subject_id" });
        Textbook.belongsTo(Subject, { foreignKey: "subject_id" });

        Subject.hasMany(Topic, { foreignKey: "subject_id" });
        Topic.belongsTo(Subject, { foreignKey: "subject_id" });

        Account.hasMany(CartItem, { foreignKey: "account_id" });
        CartItem.belongsTo(Account, { foreignKey: "account_id" });

        //---------/ MANY-TO-MANY - [SUBJECTS -*- TEACHERS] |   [SUBJECTS -*- TEACHERS] /--------------------

        Coupon.belongsToMany(Account, {
            through: "account_coupons",
            foreignKey: "coupon_id",
        });
        Account.belongsToMany(Coupon, {
            through: "account_coupons",
            foreignKey: "account_d",
        });

        Subject.belongsToMany(Teacher, {
            through: "subject_teachers",
            foreignKey: "subject_id",
        });
        Teacher.belongsToMany(Subject, {
            through: "subject_teachers",
            foreignKey: "teacher_id",
        });

        Class.belongsToMany(Subject, {
            through: "class_subjects",
            foreignKey: "class_id",
        });
        Subject.belongsToMany(Class, {
            through: "class_subjects",
            foreignKey: "subject_id",
        });

        ClassArm.belongsToMany(Subject, {
            through: "classarm_subjects",
            foreignKey: "class_arm_id",
        });
        Subject.belongsToMany(ClassArm, {
            through: "classarm_subjects",
            foreignKey: "subject_id",
        });

        Teacher.belongsToMany(Class, {
            through: "teacher_classes",
            foreignKey: "teacher_id",
        });
        Class.belongsToMany(Teacher, {
            through: "teacher_classes",
            foreignKey: "class_id",
        });

        Teacher.belongsToMany(ClassArm, {
            through: "teacher_classarms",
            foreignKey: "teacher_id",
        });
        ClassArm.belongsToMany(Teacher, {
            through: "teacher_classarms",
            foreignKey: "class_arm_id",
        });

        ClassArm.belongsToMany(Group, {
            through: "classarm_groups",
            foreignKey: "class_arm_id",
        });
        Group.belongsToMany(ClassArm, {
            through: "classarm_groups",
            foreignKey: "group_id",
        });

        Lesson.belongsToMany(ClassArm, {
            through: "classarm_lessons",
            foreignKey: "lesson_id",
        });
        ClassArm.belongsToMany(Lesson, {
            through: "classarm_lessons",
            foreignKey: "class_arm_id",
        });

        Textbook.belongsToMany(Account, {
            through: "account_textbooks",
            foreignKey: "textbook_id",
        });
        Account.belongsToMany(Textbook, {
            through: "account_textbooks",
            foreignKey: "account_id",
        });

        Textbook.belongsToMany(Class, {
            through: "class_textbooks",
            foreignKey: "textbook_id",
        });
        Class.belongsToMany(Textbook, {
            through: "class_textbooks",
            foreignKey: "class_id",
        });

        Lesson.belongsToMany(Textbook, {
            through: "textbook_lessons",
            foreignKey: "lesson_id",
        });
        Textbook.belongsToMany(Lesson, {
            through: "textbook_lessons",
            foreignKey: "textbook_id",
        });

        Topic.belongsToMany(Question, {
            through: "topic_questions",
            foreignKey: "topic_id",
        });

        Question.belongsToMany(Topic, {
            through: "topic_questions",
            foreignKey: "question_id",
        });


        // AccountType.hasMany(OnboardingQuestion, { foreignKey: 'account_type_id'});
        // OnboardingQuestion.belongsTo(AccountType,{ foreignKey: 'account_type_id'});
    }
}
module.exports = Relationships;
