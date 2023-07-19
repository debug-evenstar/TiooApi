
class Relationships {

    static group(Account, Validation, Subject, Class, SchoolManagement, Student, Teacher, TempValidation, ClassArm, Lesson, Chapter) {

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

        Subject.hasMany(Lesson);  // Might be commented
        Lesson.belongsTo(Subject); // might be commented

        Class.hasMany(Lesson);
        Lesson.belongsTo(Class);

        ClassArm.hasMany(Lesson);
        Lesson.belongsTo(ClassArm);

        Subject.hasMany(Chapter);
        Chapter.belongsTo(Subject);

        Chapter.hasMany(Lesson);
        Lesson.belongsTo(Chapter); 

        //---------/ MANY-TO-MANY - [SUBJECTS -*- TEACHERS] |   [SUBJECTS -*- TEACHERS] /--------------------

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
        
        // Define the associations

        // Subject.hasMany(Lesson);
        // Lesson.belongsTo(Subject);
    }

}
module.exports = Relationships;
