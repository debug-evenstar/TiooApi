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
      teacher_type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'subject',
    },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      classes: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      classarms: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      subjects: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      school_id: {
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
