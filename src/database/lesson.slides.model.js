const bcrypt = require('bcrypt');

module.exports = (sequelize, Sequelize) => {
  const LessonSlides = sequelize.define(
    'LessonSlides',
    {
      slide_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      slide_data: {
        type: Sequelize.JSON,
        allowNull: false,
      }
    },
    { timestamps: true }
  );

  return LessonSlides;
};
