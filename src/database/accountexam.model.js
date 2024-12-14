module.exports = (sequelize, Sequelize) => {
  const AccountExam = sequelize.define(
    "AccountExam",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // { id: number, name: string }[]
      subjects: {
        type: Sequelize.JSON,
        allowNull: true,
      }
    },{
      tableName: 'account_exam',
      timestamps: false
    }
  )

  return AccountExam;
}