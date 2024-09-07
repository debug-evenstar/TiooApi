
module.exports = (sequelize, Sequelize) => {
  const LessonProgress = sequelize.define(
    "LessonProgress",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      textbook_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      lesson_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      slide_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      slide_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },{
      tableName: 'lesson_progress',
      timestamps: false
    });

  return LessonProgress;
}