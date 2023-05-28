const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define(
    'Account',
    {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        autoIncrement: false,
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
      school_types: {
        type: Sequelize.TEXT, 
        defaultValue: JSON.stringify(['Primary', 'Secondary']),
        get() {
          // Parse the JSON string to retrieve the array
          const value = this.getDataValue('school_types');
          return value ? JSON.parse(value) : [];
        },
      },
      naming_types: {
        type: Sequelize.TEXT,
        defaultValue: JSON.stringify(['Primary 1-6 & JSS1 - SSS3']),
        get() {
          // Parse the JSON string to retrieve the array
          const value = this.getDataValue('naming_types');
          return value ? JSON.parse(value) : [];
        },
      },
      verification_status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      flag: {
        type: Sequelize.ENUM('active', 'banned', 'inactive'),
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
          exclude: ['createdAt', 'updatedAt']
        },
      },
    }
  );


  Account.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  Account.prototype.comparePassword = async function (password) {
    console.log(password);
    return bcrypt.compare(password, this.password);
  };

  Account.prototype.hashPassword = async function (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  };

  Account.sync();

  return Account;
};
