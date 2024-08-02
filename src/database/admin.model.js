const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const Admin = sequelize.define(
    "Admins",
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
      },
      verification_status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      status: {
        type: Sequelize.ENUM("active", "banned", "inactive", "invited"),
        defaultValue: "active",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      indexes: [{ unique: true, fields: ["email"] }],
      timestamps: true,
      tableName: "admins",
      paranoid: true,
      defaultScope: {
        attributes: {
          exclude: ["updatedAt"],
        },
      },
    }
  );

  Admin.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });

  Admin.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  Admin.prototype.hashPassword = async function (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  };

  Admin.beforeBulkCreate(async (users, options) => {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      user.password = hashedPassword;
    }
  });

  // Admin.sync();

  return Admin;
};
