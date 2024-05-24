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
        SchoolManagement.belongsTo(Account, { allowNull: true });

        Account.hasOne(Teacher, { allowNull: true, onDelete: "CASCADE" });
        Teacher.belongsTo(Account, { allowNull: true });

        Account.hasOne(Student, { allowNull: true, onDelete: "CASCADE" });
        Student.belongsTo(Account, { allowNull: true });

        Account.hasOne(Authorization, { allowNull: true, onDelete: "CASCADE" });
        Authorization.belongsTo(Account, { allowNull: true });

        Admin.hasOne(Validation, { allowNull: true });
        Validation.belongsTo(Admin, { allowNull: true });

        Admin.hasOne(Authorization, { allowNull: true, onDelete: "CASCADE" });
        Authorization.belongsTo(Admin, { allowNull: true });

        Account.hasOne(Preference, { allowNull: true, onDelete: "CASCADE" });
        Preference.belongsTo(Account, { allowNull: true });

        SchoolManagement.hasOne(Keypairs);
        Keypairs.belongsTo(SchoolManagement);
        -Account.hasOne(Preference, { allowNull: true, onDelete: "CASCADE" });
        Preference.belongsTo(Account, { allowNull: true });

        //---------/ ONE-TO-MANY - SCHOOL -*- CLASS | TEACHERS | STUDENT | SUBJECT /--------------------

        SchoolManagement.hasMany(Teacher);
        Teacher.belongsTo(SchoolManagement);

        Notification.hasMany(Subscription);
        Subscription.belongsTo(Notification);

        Account.hasMany(Subscription);
        Subscription.belongsTo(Account);

        SchoolManagement.hasMany(Student);
        Student.belongsTo(SchoolManagement);

        SchoolManagement.hasMany(Subject);
        Subject.belongsTo(SchoolManagement);

        SchoolManagement.hasMany(Class);
        Class.belongsTo(SchoolManagement);

        SchoolManagement.hasMany(Authorization);
        Authorization.belongsTo(SchoolManagement);

        Subject.hasMany(Group);
        Group.belongsTo(Subject);

        Group.hasMany(Lesson);
        Lesson.belongsTo(Group);

        //---------/ ONE-TO-MANY - CLASS -*- STUDENTS /--------------------

        Class.hasMany(Student);
        Student.belongsTo(Class);

        Class.hasMany(ClassArm);
        ClassArm.belongsTo(Class);

        ClassArm.hasMany(Student);
        Student.belongsTo(ClassArm);

        Class.hasMany(Lesson);
        Lesson.belongsTo(Class);

        Group.belongsTo(Class, { foreignKey: "ref_cid" });

        Subject.hasMany(Chapter);
        Chapter.belongsTo(Subject);

        Chapter.hasMany(Lesson);
        Lesson.belongsTo(Chapter);

        Lesson.hasMany(LessonSlide);
        LessonSlide.belongsTo(Lesson);

        Account.hasMany(Billing);
        Billing.belongsTo(Account);

        Subject.hasMany(Textbook);
        Textbook.belongsTo(Subject);

        Account.hasMany(CartItem);
        CartItem.belongsTo(Account);

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

        Lesson.belongsToMany(ClassArm, { through: "clasarm_lessons" });
        ClassArm.belongsToMany(Lesson, { through: "classarm_lessons" });

        Textbook.belongsToMany(Account, { through: "account_textbooks" });
        Account.belongsToMany(Textbook, { through: "account_textbooks" });

        Textbook.belongsToMany(Class, { through: "class_textbooks" });

        Lesson.belongsToMany(Textbook, { through: "textbook_lessons" });
        Textbook.belongsToMany(Lesson, { through: "textbook_lessons" });
    }
}
module.exports = Relationships;
