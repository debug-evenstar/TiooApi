
class Relationships {

    static group(Account, Validation, Subject, Class, SchoolManagement, Student, Teacher, TempValidation, ClassArm, Lesson, Chapter, Authorization, Admin, Coupon, Library, Group, LessonSlide) {

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

        Library.hasOne(Class, { allowNull: true });
        Class.belongsTo(Library, { allowNull: true });


        //---------/ ONE-TO-MANY - SCHOOL -*- CLASS | TEACHERS | STUDENT | SUBJECT /--------------------

        Class.hasMany(Library, {allowNull: true});
        Library.belongsTo(Class,  {allowNull: true});

        SchoolManagement.hasMany(Teacher);
        Teacher.belongsTo(SchoolManagement); -

        SchoolManagement.hasMany(Student);
        Student.belongsTo(SchoolManagement);

        SchoolManagement.hasMany(Subject);
        Subject.belongsTo(SchoolManagement);

        SchoolManagement.hasMany(Class);
        Class.belongsTo(SchoolManagement);

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

        Subject.hasMany(Chapter);
        Chapter.belongsTo(Subject);

        Chapter.hasMany(Lesson);
        Lesson.belongsTo(Chapter);

        Lesson.hasMany(LessonSlide);
        LessonSlide.belongsTo(Lesson);

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
    }

}
module.exports = Relationships;
