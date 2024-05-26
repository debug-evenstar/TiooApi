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
        Billing,
        Notification,
        Subscription,
        Keypairs,
        Textbook,
        CartItem
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

        ClassArm.hasMany(Student, { foreignKey: "class_aram_id" });
        Student.belongsTo(ClassArm, { foreignKey: "class_aram_id" });

        Class.hasMany(Lesson, { foreignKey: "class_id" });
        Lesson.belongsTo(Class, { foreignKey: "class_id" });

        Group.belongsTo(Class, { foreignKey: "ref_cid" });

        Subject.hasMany(Chapter, { foreignKey: "subject_id" });
        Chapter.belongsTo(Subject, { foreignKey: "subject_id" });

        Chapter.hasMany(Lesson, { foreignKey: "chapter_id" });
        Lesson.belongsTo(Chapter, { foreignKey: "chapter_id" });

        Lesson.hasMany(LessonSlide, { foreignKey: "lesson_id" });
        LessonSlide.belongsTo(Lesson, { foreignKey: "lesson_id" });

        Account.hasMany(Billing, { foreignKey: "account_id" });
        Billing.belongsTo(Account, { foreignKey: "account_id" });

        Subject.hasMany(Textbook, { foreignKey: "subject_id" });
        Textbook.belongsTo(Subject, { foreignKey: "subject_id" });

        Account.hasMany(CartItem, { foreignKey: "account_id" });
        CartItem.belongsTo(Account, { foreignKey: "account_id" });

        //---------/ MANY-TO-MANY - [SUBJECTS -*- TEACHERS] |   [SUBJECTS -*- TEACHERS] /--------------------

        Coupon.belongsToMany(Account, { through: "account_coupons" });
        Account.belongsToMany(Coupon, { through: "account_coupons" });

        Subject.belongsToMany(Teacher, { through: "subject_teachers" });
        Teacher.belongsToMany(Subject, { through: "subject_teachers" });

        Class.belongsToMany(Subject, { through: "class_subjects" });
        Subject.belongsToMany(Class, { through: "class_subjects" });

        ClassArm.belongsToMany(Subject, { through: "classarm_subjects" });
        Subject.belongsToMany(ClassArm, { through: "classarm_subjects" });

        Teacher.belongsToMany(Class, { through: "teacher_classes" });
        Class.belongsToMany(Teacher, { through: "teacher_classes" });

        Teacher.belongsToMany(ClassArm, { through: "teacher_classarms" });
        ClassArm.belongsToMany(Teacher, { through: "teacher_classarms" });

        ClassArm.belongsToMany(Group, { through: "classarm_groups" });
        Group.belongsToMany(ClassArm, { through: "classarm_groups" });

        Lesson.belongsToMany(ClassArm, { through: "classarm_lessons" });
        ClassArm.belongsToMany(Lesson, { through: "classarm_lessons" });

        Textbook.belongsToMany(Account, { through: "account_textbooks" });
        Account.belongsToMany(Textbook, { through: "account_textbooks" });

        Textbook.belongsToMany(Class, { through: "class_textbooks" });

        Lesson.belongsToMany(Textbook, { through: "textbook_lessons" });
        Textbook.belongsToMany(Lesson, { through: "textbook_lessons" });
    }
}
module.exports = Relationships;
