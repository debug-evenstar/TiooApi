module.exports = (sequelize, Sequelize) => {
  return sequelize.define(
    "ExamSubject",{
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
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'subjects',
          key: 'id',
          onDelete: 'CASCADE'
        }
      }
    },
    {
      tableName: 'exam_subject',
      timestamps: false,
    }
  )
}