module.exports = (sequelize, Sequelize) => {
  const ExamSet = sequelize.define('ExamSet',{
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true, 
      allowNull: false,
    },
    status: {
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