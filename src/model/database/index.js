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


//================== ONE-TO-ONE - ACCOUNT -*- VALIDATION =======================//

Account.hasOne(Validation, { foreignKey: 'accountId', as: 'validation' });
Validation.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });


module.exports = {
  db,
  Account,
  Validation
};
