const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const Invite = sequelize.define(
    'Invite',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      account_type: {
        type: Sequelize.STRING,
        defaultValue: 'teacher',
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      classes: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      subjects: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      schoolId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  Invite.beforeCreate(async (invite, options) => {

  });

  Invite.sync();

  return Invite;
};
