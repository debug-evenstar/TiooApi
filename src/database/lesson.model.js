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
      file: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  Lesson.beforeCreate(async (invite, options) => {

  });

  Lesson.sync().then(() => {
    //'Tables dropped and created successfully.'
  })
    .catch((error) => {
      // 'Error occurred while dropping and creating tables:'
    });

  return Lesson;
};
