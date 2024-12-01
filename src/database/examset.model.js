module.exports = (sequelize, Sequelize) => {
  const ExamSet = sequelize.define('ExamSet',{
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull: false,
    },
    exam_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'exams',
        key: 'id',
      }
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    data: {
      type: Sequelize.JSON,
      allowNull: false,
    },
  },{
    timestamps: false,
  })

  return ExamSet
}