
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
      },
      is_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      // created_at: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      // },

      // updated_at: {
      //   allowNull: false,
      //   type: Sequelize.DATE,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      //   onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      // }
    }, {
    tableName: 'lesson_progress',
    timestamps: true,
    underscored: true,
  });

  return LessonProgress;
}