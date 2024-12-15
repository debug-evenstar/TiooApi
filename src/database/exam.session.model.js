
module.exports = (sequelize, Sequelize) => {
  const ExamSession = sequelize.define(
    "ExamSession",
    {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },

      exam_set_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'exam_sets',
          key: 'id',
          onDelete: 'cascade',
        }
      },

      account_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'accounts',
          key: 'id',
          onDelete: 'cascade',
        }
      },

      slides: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      answers: {
        type: Sequelize.JSON,
        allowNull: true,
      },

      score: {
        type: Sequelize.DECIMAL,
        defaultValue: 0,
      },

    },
    {
      timestamps: true,
    }
  )

  return ExamSession;
}