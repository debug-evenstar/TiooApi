
class Relationships {

    static group(Account, Validation, Subject, Class, SchoolManagement, Student, Teacher, TempValidation, ClassArm, Lesson, Chapter, Authorization, Admin, Coupon, Library, Group, LessonSlide, Preference, Billing, Notification, Subscription, Keypairs, Textbook, CartItem) {


        //------------------/ ONE-TO-ONE - ACCOUNT -*- VALIDATION | SHCOOL | TEACHER | STUDENT  /--------------------

        Account.hasOne(Validation, { foreignKey: 'accountId', as: 'validation' });
        Validation.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

        Account.hasOne(SchoolManagement, { allowNull: true, onDelete: 'CASCADE'});
        SchoolManagement.belongsTo(Account, { allowNull: true });

        Account.hasOne(Teacher, { allowNull: true, onDelete: 'CASCADE'});
        Teacher.belongsTo(Account, { allowNull: true });

        Account.hasOne(Student, { allowNull: true, onDelete: 'CASCADE'});
        Student.belongsTo(Account, { allowNull: true });

        Account.hasOne(Authorization, { allowNull: true, onDelete: 'CASCADE'});
        Authorization.belongsTo(Account, { allowNull: true });

        Admin.hasOne(Validation, { allowNull: true });
        Validation.belongsTo(Admin, { allowNull: true });

        Admin.hasOne(Authorization, { allowNull: true, onDelete: 'CASCADE'});
        Authorization.belongsTo(Admin, { allowNull: true });

        Account.hasOne(Preference, { allowNull: true, onDelete: 'CASCADE'});
        Preference.belongsTo(Account, { allowNull: true });

        SchoolManagement.hasOne(Keypairs);
        Keypairs.belongsTo(SchoolManagement); -

        Account.hasOne(Preference, { allowNull: true, onDelete: 'CASCADE'});
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

        Subject.hasMany(Lesson);  // Might be commented
        Lesson.belongsTo(Subject); // might be commented

        Class.hasMany(Lesson);
        Lesson.belongsTo(Class);

        Group.belongsTo(Class, {foreignKey : "ref_cid"});

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

        Coupon.belongsToMany(Account, { through: 'CouponAccount' });
        Account.belongsToMany(Coupon, { through: 'CouponAccount' });

        Subject.belongsToMany(Teacher, { through: 'SubjectTeachers' });
        Teacher.belongsToMany(Subject, { through: 'SubjectTeachers' });

        Class.belongsToMany(Subject, { through: 'ClassSubjects' });
        Subject.belongsToMany(Class, { through: 'ClassSubjects' });

        ClassArm.belongsToMany(Subject, { through: 'ClassArmSubjects' });
        Subject.belongsToMany(ClassArm, { through: 'ClassArmSubjects' });

        Teacher.belongsToMany(Class, { through: 'TeacherClasses' });
        Class.belongsToMany(Teacher, { through: 'TeacherClasses' });

        Teacher.belongsToMany(ClassArm, { through: 'TeacherClassArms' });
        ClassArm.belongsToMany(Teacher, { through: 'TeacherClassArms' });

        ClassArm.belongsToMany(Group, { through: 'ClassArmGroups' });
        Group.belongsToMany(ClassArm, { through: 'ClassArmGroups' });

        Lesson.belongsToMany(ClassArm, { through: 'ClassArmLessons' });
        ClassArm.belongsToMany(Lesson, { through: 'ClassArmLessons' });

        Textbook.belongsToMany(Account, { through: 'AccountTextbook' });
        Account.belongsToMany(Textbook, { through: 'AccountTextbook' });

        Textbook.belongsToMany(Class, { through: 'ClassTextbooks' });
    }

}
module.exports = Relationships;
