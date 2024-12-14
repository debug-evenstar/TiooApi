module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "ExamTextbook",{
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'exams',
          key: 'id',
          onDelete: 'CASCADE'
        }
      },
      textbook_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'textbooks',
          key: 'id',
          onDelete: 'CASCADE'
        }
      }
    },
    {
      tableName: 'exam_textbook',
      timestamps: false,
    }
  )
}