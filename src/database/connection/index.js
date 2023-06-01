const enviromentalConfig = require('../../config/db.config');
const dbConfig = enviromentalConfig.development;

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const Account = db.accounts = require("../account.model")(sequelize, Sequelize);
const Validation = db.validations = require("../validation.model")(sequelize, Sequelize);
const Subject = db.subjects = require("../subject.model")(sequelize, Sequelize);
const Class = db.classes = require("../class.model")(sequelize, Sequelize);
const SchoolManagement = db.schools = require("../profile.model/school.model")(sequelize, Sequelize);
const Student = db.students = require("../profile.model/student.model")(sequelize, Sequelize);
const Teacher = db.teachers = require("../profile.model/teacher.model")(sequelize, Sequelize);
const TempValidation = db.tempvalidations = require("../temp.validation.model")(sequelize, Sequelize);
const ClassArm = db.classarms  = require("../classarms.model")(sequelize, Sequelize);

//------------------/ ONE-TO-ONE - ACCOUNT -*- VALIDATION | SHCOOL | TEACHER | STUDENT  /--------------------

Account.hasOne(Validation, { foreignKey: 'accountId', as: 'validation' });
Validation.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

Account.hasOne(SchoolManagement, {allowNull: true});
SchoolManagement.belongsTo(Account, {allowNull: true});

Account.hasOne(Teacher, {allowNull: true});
Teacher.belongsTo(Account, {allowNull: true});

Account.hasOne(Student, {allowNull: true});
Student.belongsTo(Account, {allowNull: true});

//---------/ ONE-TO-MANY - SCHOOL -*- CLASS | TEACHERS | STUDENT | SUBJECT /--------------------

SchoolManagement.hasMany(Teacher);
Teacher.belongsTo(SchoolManagement);-

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



//---------/ MANY-TO-MANY - [SUBJECTS -*- TEACHERS] |   [SUBJECTS -*- TEACHERS] /--------------------

Subject.belongsToMany(Teacher, { through: 'SubjectTeachers' });
Teacher.belongsToMany(Subject, { through: 'SubjectTeachers' });

Class.belongsToMany(Subject, { through: 'ClassSubjects' });
Subject.belongsToMany(Class, { through: 'ClassSubjects' });

Teacher.belongsToMany(Class, { through: 'TeacherClasses' });
Class.belongsToMany(Teacher, { through: 'TeacherClasses' });

// SchoolManagement.belongsToMany(Class, { through: 'SchoolClass' });
// Class.belongsToMany(SchoolManagement, { through: 'SchoolClass' });


module.exports = {
  db,
  Account,
  Validation,
  TempValidation,
  SchoolManagement,
  Student,
  Teacher,
  Class,
  ClassArm,
  Subject
};



/*
 N:B #R- pull student class to get their subject

 */