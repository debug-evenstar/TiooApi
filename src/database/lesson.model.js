const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const Lesson = sequelize.define(
    'Lesson',
    {
      chapter_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lesson_title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lesson_content: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      file: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    { timestamps: false }
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
