const enviromentalConfig = require('../../config/db.config');
const Relationships = require('./relationships');

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
const ClassArm = db.classarms = require("../classarms.model")(sequelize, Sequelize);

const models = [Account, Validation, Subject, Class, SchoolManagement, Student, Teacher, TempValidation, ClassArm]

Relationships.group(...models);

module.exports = {db, ...models};
