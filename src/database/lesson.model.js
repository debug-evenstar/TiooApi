const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const Lesson = sequelize.define(
    'Lesson',
    {

      topic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '15 Minutes',
      },
      curriculum: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'none',
      },
      objective: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      additional_instruction: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      week: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Week 1',
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Locked',
      },
      admin_status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'Locked',
      },
      published: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      term: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      files: {
        type: Sequelize.JSON,
        defaultValue: [],
      },
    },
    { timestamps: true }
  );

  return Lesson;
};
