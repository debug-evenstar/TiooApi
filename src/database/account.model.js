const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define(
    'Account',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING,
      },
      account_type: {
        type: Sequelize.STRING,
        defaultValue: 'school',
      },
      verification_status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      flag: {
        type: Sequelize.ENUM('active', 'banned', 'inactive', 'invited'),
        defaultValue: 'active',
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      defaultScope: {
        attributes: {
          exclude: ['updatedAt']
        },
      },
    }
  );


  Account.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  Account.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  Account.prototype.hashPassword = async function (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  };

  Account.beforeBulkCreate(async (users, options) => {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }

  });

  Account.sync();

  return Account;
};
