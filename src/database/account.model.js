const bcrypt = require("bcrypt");
const { generateCode } = require("../utils/string");

module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define(
    "Account",
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

      
      phone: {
        type: Sequelize.STRING,
      },
      account_type: {
        type: Sequelize.STRING,
        defaultValue: "school",
      },
      display_image: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "",
      },
      verification_status: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM(
          "active",
          "banned",
          "inactive",
          "invited",
          "pending",
        ),
        defaultValue: "pending",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      referral_code: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
    },
    {
      indexes: [{ unique: true, fields: ["email"] }],
      timestamps: true,
      paranoid: true,
      defaultScope: {
        attributes: {
          exclude: ["updatedAt"],
        },
      },
    }
  );

  Account.beforeCreate(async (user, options) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;

    let referralCode;

    // Attempt to generate a unique referral code
    while (!referralCode) {
      const code = generateCode();
      const existingCode = await Account.findOne({ where: { referral_code: code } });

      if (!existingCode) {
        referralCode = code;
      }
    }

    user.referral_code = referralCode;
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
