
class Relationships {

    static group(Account, Validation, Subject, Class, SchoolManagement, Student, Teacher, TempValidation, ClassArm, Lesson) {

        //------------------/ ONE-TO-ONE - ACCOUNT -*- VALIDATION | SHCOOL | TEACHER | STUDENT  /--------------------

        Account.hasOne(Validation, { foreignKey: 'accountId', as: 'validation' });
        Validation.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

        Account.hasOne(SchoolManagement, { allowNull: true });
        SchoolManagement.belongsTo(Account, { allowNull: true });

        Account.hasOne(Teacher, { allowNull: true });
        Teacher.belongsTo(Account, { allowNull: true });

        Account.hasOne(Student, { allowNull: true });
        Student.belongsTo(Account, { allowNull: true });

        //---------/ ONE-TO-MANY - SCHOOL -*- CLASS | TEACHERS | STUDENT | SUBJECT /--------------------

        SchoolManagement.hasMany(Teacher);
        Teacher.belongsTo(SchoolManagement); -

        SchoolManagement.hasMany(Student);
        Student.belongsTo(SchoolManagement);

        SchoolManagement.hasMany(Subject);
        Subject.belongsTo(SchoolManagement);

        SchoolManagement.hasMany(Class);
        Class.belongsTo(SchoolManagement);

        //---------/ ONE-TO-MANY - CLASS -*- STUDENTS /--------------------

        Class.hasMany(Student);
        Student.belongsTo(Class);

        Class.hasMany(ClassArm);
        ClassArm.belongsTo(Class);

        ClassArm.hasMany(Student);
        Student.belongsTo(ClassArm);

        Subject.hasMany(Lesson);
        Lesson.belongsTo(Subject);

        Class.hasMany(Lesson);
        Lesson.belongsTo(Class);

        ClassArm.hasMany(Lesson);
        Lesson.belongsTo(ClassArm);

        //---------/ MANY-TO-MANY - [SUBJECTS -*- TEACHERS] |   [SUBJECTS -*- TEACHERS] /--------------------

        Subject.belongsToMany(Teacher, { through: 'SubjectTeachers' });
        Teacher.belongsToMany(Subject, { through: 'SubjectTeachers' });

        Class.belongsToMany(Subject, { through: 'ClassSubjects' });
        Subject.belongsToMany(Class, { through: 'ClassSubjects' });

        Teacher.belongsToMany(Class, { through: 'TeacherClasses' });
        Class.belongsToMany(Teacher, { through: 'TeacherClasses' });


        // Define the associations

        // Subject.hasMany(Lesson);
        // Lesson.belongsTo(Subject);
    }

}
module.exports = Relationships;
